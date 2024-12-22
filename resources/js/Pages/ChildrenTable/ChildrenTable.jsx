import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Pagination,
  Button,
  CardActions,
  TextField,
  Snackbar,
  Alert,
} from '@mui/material';
import axios from 'axios';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import '@fontsource/figtree';

const ChildrenCards = () => {
  const [childrenData, setChildrenData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1); // Start from page 1 (1-indexed)
  const rowsPerPage = 9; // 9 cards per page
  const [totalRows, setTotalRows] = useState(0);

  // Status filter state
  const [statusFilter, setStatusFilter] = useState('all');

  // Search and sort states
  const [searchQuery, setSearchQuery] = useState('');
  const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

  // Snackbar visibility state
  const [showRudolfPop, setShowRudolfPop] = useState(false);

  // Count how many times "Mark as Delivered" is pressed
  const [deliveryCount, setDeliveryCount] = useState(0);

  // NEW: disable button for 10 seconds after pop-up
  const [isDeliverButtonDisabled, setIsDeliverButtonDisabled] = useState(false);

  // Fetch children from server, applying status filter on the backend
  const fetchChildren = async (currentPage = page, filter = statusFilter) => {
    setIsLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/api/getAllData', {
        params: {
          page: currentPage,
          _limit: rowsPerPage,
          status: filter === 'all' ? '' : filter,
        },
      });

      setChildrenData(response.data.data);
      setTotalRows(response.data.pagination.total);
    } catch (error) {
      console.error('Error fetching children data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Refetch data whenever page or statusFilter changes
  useEffect(() => {
    fetchChildren();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, statusFilter]);

  // Handle pagination
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Toggle ascending/descending name sort
  const toggleSortDirection = () => {
    setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Prepare a filtered & sorted list (client-side)
  const filteredAndSortedData = [...childrenData]
    .filter((child) =>
      child.Name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.Name < b.Name) return sortDirection === 'asc' ? -1 : 1;
      if (a.Name > b.Name) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });

  // Example status icons
  const renderStatusIcon = (status) => {
    switch (status) {
      case 'Waiting':
        return <HourglassEmptyIcon sx={{ fontSize: 40, color: 'orange' }} />;
      case 'Preparing':
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/6262/6262900.png"
            alt="Elf"
            style={{ width: '40px', height: '40px' }}
          />
        );
      case 'Ready':
        return (
          <img
            src="https://cdn.icon-icons.com/icons2/3559/PNG/512/gift_box_present_icon_225155.png"
            alt="Present"
            style={{ width: '40px', height: '40px' }}
          />
        );
      default:
        return (
          <img
            src="https://cdn-icons-png.flaticon.com/512/9193/9193646.png"
            alt="Default"
            style={{ width: '40px', height: '40px' }}
          />
        );
    }
  };

  // Mark as Delivered
  const markAsDelivered = async (childId) => {
    try {
      await axios.post('http://127.0.0.1:8000/api/markAsDelivered', { childId });

      // Update the child's status in state
      setChildrenData((prevData) =>
        prevData.map((child) =>
          child.Child_ID === childId ? { ...child, Status: 'Delivered' } : child
        )
      );

      // Increment delivery count
      setDeliveryCount((prev) => {
        const newCount = prev + 1;

        // Show pop-up and disable button only when newCount is a multiple of 5
        if (newCount % 5 === 0) {
          setShowRudolfPop(true);

          // Disable the button for 10 seconds
          setIsDeliverButtonDisabled(true);
          setTimeout(() => {
            setIsDeliverButtonDisabled(false);
          }, 10000);
        }
        return newCount;
      });
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status. Please try again.');
    }
  };

  // Close the snackbar
  const handleCloseRudolfPop = () => {
    setShowRudolfPop(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        p: 2,
        fontFamily: 'Figtree',
      }}
    >
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontFamily: 'Figtree',
          fontWeight: 'bold',
          mb: 4,
        }}
      >
        Children List
      </Typography>

      {/* Filter and Search Toolbar */}
      <Box sx={{ mb: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
        {/* Status filter buttons */}
        <Button
          variant="contained"
          onClick={() => {
            setPage(1);
            setStatusFilter('all');
          }}
        >
          Show All
        </Button>
        <Button
          variant="contained"
          color="secondary"
          onClick={() => {
            setPage(1);
            setStatusFilter('Ready');
          }}
        >
          Show Ready
        </Button>

        {/* Search field */}
        <TextField
          label="Search by name"
          variant="outlined"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          sx={{ minWidth: 200 }}
        />

        {/* Sort button */}
        <Button variant="contained" color="info" onClick={toggleSortDirection}>
          Sort by Name: {sortDirection.toUpperCase()}
        </Button>
      </Box>

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress size={48} />
        </Box>
      ) : (
        <Grid container spacing={3} justifyContent="center">
          {filteredAndSortedData.map((child) => (
            <Grid item xs={12} sm={6} md={4} key={child.Child_ID}>
              <Card
                sx={{
                  minWidth: 350,
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  boxShadow: 3,
                  borderRadius: 2,
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                    boxShadow: 6,
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography
                    gutterBottom
                    sx={{
                      color: 'text.secondary',
                      fontSize: 12,
                      textTransform: 'uppercase',
                      letterSpacing: 1,
                      fontFamily: 'Figtree',
                    }}
                  >
                    {`Child ID: ${child.Child_ID}`}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{
                      fontFamily: 'Figtree',
                      fontWeight: 'bold',
                      mb: 1,
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                    }}
                  >
                    {child.Name}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Figtree',
                      color: 'text.secondary',
                      fontSize: '0.9rem',
                      mb: 2,
                    }}
                  >
                    Age: {child.Age}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{
                      fontFamily: 'Figtree',
                      fontSize: '0.95rem',
                      lineHeight: 1.5,
                      color: 'text.primary',
                    }}
                  >
                    Country: {child.Country}
                    <br />
                    Good Deeds: {child.Good_Deed}
                    <br />
                    Bad Deeds: {child.Bad_Deed}
                  </Typography>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontFamily: 'Figtree',
                    }}
                  >
                    <Typography sx={{ fontFamily: 'Figtree', fontSize: '0.95rem' }}>
                      Gift Preference: {child.Gift_Preference}
                    </Typography>
                  </Box>
                  <Box
                    sx={{
                      mt: 2,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontFamily: 'Figtree',
                    }}
                  >
                    <Typography sx={{ fontFamily: 'Figtree', fontSize: '0.95rem' }}>
                      Status: {child.Status}
                    </Typography>
                    {renderStatusIcon(child.Status)}
                  </Box>
                </CardContent>
                <CardActions sx={{ p: 2, pt: 0 }}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={() => markAsDelivered(child.Child_ID)}
                    disabled={isDeliverButtonDisabled} // <-- disable the button
                    sx={{
                      fontFamily: 'Figtree',
                      borderRadius: '50px',
                      textTransform: 'none',
                      fontWeight: 'bold',
                      boxShadow: 'none',
                      backgroundColor: isDeliverButtonDisabled ? '#9e9e9e' : '#226F54',
                      '&:hover': {
                        boxShadow: 4,
                      },
                    }}
                  >
                    Mark as Delivered
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      <Box sx={{ mt: 4 }}>
        {totalRows > 0 && (
          <Pagination
            count={Math.ceil(totalRows / rowsPerPage)}
            page={page}
            onChange={handlePageChange}
            color="primary"
          />
        )}
      </Box>

      {/* SNACKBAR POPUP (appears every 5th delivered) */}
      <Snackbar
        open={showRudolfPop}
        autoHideDuration={10000} // 10 seconds
        onClose={handleCloseRudolfPop}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseRudolfPop} severity="info" sx={{ width: '100%' }}>
          Rudolf is exhausted, take a rest.
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ChildrenCards;
