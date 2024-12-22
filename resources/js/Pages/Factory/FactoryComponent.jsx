import React, { useState, useEffect } from 'react';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto'; // IMPORTANT: needed for Chart.js v4

const ParentComponent = () => {
    const [factoryData, setFactoryData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch data from your API
        const fetchData = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/factory');
                const data = await response.json();
                setFactoryData(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Loading state
    if (loading) {
        return (
            <div style={styles.loaderContainer}>
                <div className="loader" style={styles.loader} />
                <h2 style={{ marginTop: 20 }}>Loading Factory Data...</h2>
            </div>
        );
    }

    // If no data, show something
    if (!factoryData) {
        return <h2 style={{ textAlign: 'center' }}>No factory data available</h2>;
    }

    // Destructure the object
    const { producing, next, counts } = factoryData;

    // Prepare data for the Bar chart
    const chartData = {
        labels: ['Ready', 'Delivered', 'Waiting'],
        datasets: [
            {
                label: 'Total Count',
                data: [counts.ready, counts.delivered, counts.waiting],
                backgroundColor: ['#4caf50', '#ff9800', '#f44336'],
                borderColor: ['#388e3c', '#f57c00', '#d32f2f'],
                borderWidth: 2,
            },
        ],
    };

    // Options for the chart (feel free to customize)
    const chartOptions = {
        responsive: true,
        plugins: {
            legend: {
                display: true,
            },
        },
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>Factory Dashboard</h1>

            {/* Currently Producing Gift */}
            <section style={styles.card}>
                <h2 style={styles.cardTitle}>Currently Producing Gift</h2>
                <p><strong>Child ID:</strong> {producing.Child_ID}</p>
                <p><strong>Name:</strong> {producing.Name}</p>
                <p><strong>Age:</strong> {producing.Age}</p>
                <p><strong>Location:</strong> {producing.Location}, {producing.Country}</p>
                <p><strong>Gift Preference:</strong> {producing.Gift_Preference}</p>
                <p><strong>Good Deed:</strong> {producing.Good_Deed}</p>
                <p><strong>Bad Deed:</strong> {producing.Bad_Deed}</p>
            </section>

            {/* Next Gift in Queue */}
            <section style={styles.card}>
                <h2 style={styles.cardTitle}>Next Gift in Queue</h2>
                <p><strong>Child ID:</strong> {next.Child_ID}</p>
                <p><strong>Name:</strong> {next.Name}</p>
                <p><strong>Age:</strong> {next.Age}</p>
                <p><strong>Location:</strong> {next.Location}, {next.Country}</p>
                <p><strong>Gift Preference:</strong> {next.Gift_Preference}</p>
                <p><strong>Good Deed:</strong> {next.Good_Deed}</p>
                <p><strong>Bad Deed:</strong> {next.Bad_Deed}</p>
            </section>

            {/* Counts Chart */}
            <section style={styles.chartSection}>
                <h2 style={styles.cardTitle}>Overall Stats</h2>
                <div style={styles.chartContainer}>
                    <Bar data={chartData} options={chartOptions} />
                </div>
            </section>
        </div>
    );
};

// Some basic inline styles (you can move them to a separate CSS file)
const styles = {
    container: {
        maxWidth: 900,
        margin: '0 auto',
        fontFamily: 'Arial, sans-serif',
        padding: '1rem',
    },
    title: {
        textAlign: 'center',
        marginBottom: '2rem',
    },
    card: {
        background: '#f5f5f5',
        padding: '1.5rem',
        borderRadius: 8,
        marginBottom: '1.5rem',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    cardTitle: {
        marginBottom: '1rem',
    },
    chartSection: {
        background: '#fff',
        padding: '1.5rem',
        borderRadius: 8,
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
    },
    chartContainer: {
        height: 300,
        width: '100%',
        position: 'relative',
    },
    loaderContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginTop: '2rem',
    },
    loader: {
        border: '8px solid #f3f3f3',
        borderTop: '8px solid #3498db',
        borderRadius: '50%',
        width: 60,
        height: 60,
        animation: 'spin 1s linear infinite',
    },
};

export default ParentComponent;
