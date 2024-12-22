import { useEffect, useState } from 'react';
import { Line, Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement, PointElement, LineElement } from 'chart.js';
import axios from 'axios';

// Register chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
    PointElement,   // Add PointElement for scatter and line charts
    LineElement     // Add LineElement for line charts
);

const StatisticsCharts = () => {
    const [data, setData] = useState(null);

    useEffect(() => {
        axios.get('http://127.0.0.1:8000/api/santas-statistics')
            .then(response => {
                setData(response.data);
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }, []);

    if (!data) {
        return <div className="text-center p-5">Loading...</div>;
    }

    // Pie chart data for top countries
    const topCountriesData = {
        labels: data.top_countries.map(item => item.Country),
        datasets: [
            {
                label: 'Top Countries by Total Children',
                data: data.top_countries.map(item => item.total),
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#FF9F40', '#4BC0C0'],
                borderColor: '#fff',
                borderWidth: 2,
            },
        ],
    };

    // Bar chart data for good vs bad deeds
    const deedsData = {
        labels: ['Good Deeds', 'Bad Deeds'],
        datasets: [
            {
                label: 'Deeds Count',
                data: [data.good_deeds_count, data.bad_deeds_count],
                backgroundColor: ['#4CAF50', '#FF5722'],
                borderColor: ['#4CAF50', '#FF5722'],
                borderWidth: 1,
            },
        ],
    };

    return (
        <div className="p-8">
            {/* First Row: Pie Chart on Left and Bar Chart & Average School Grades + Age on Right */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Top Countries Pie Chart */}
                <div>
                    <h3 className="text-3xl font-semibold text-center mb-6">Top Countries by Total Children</h3>
                    <Pie data={topCountriesData} options={{
                        responsive: true,
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: function(tooltipItem) {
                                        return `${tooltipItem.label}: ${tooltipItem.raw} children`;
                                    }
                                }
                            }
                        }}} />
                </div>

                {/* Right Column: Good vs Bad Deeds Bar Chart and Average School Grades & Average Age */}
                <div>
                    <div className="mb-12">
                        <h3 className="text-3xl font-semibold text-center mb-6">Good vs Bad Deeds</h3>
                        <Bar data={deedsData} options={{
                            responsive: true,
                            plugins: {
                                tooltip: {
                                    callbacks: {
                                        label: function(tooltipItem) {
                                            return `${tooltipItem.label}: ${tooltipItem.raw} deeds`;
                                        }
                                    }
                                }
                            },
                            scales: {
                                x: {
                                    ticks: {
                                        font: {
                                            size: 18,
                                            weight: 'bold'
                                        }
                                    }
                                },
                                y: {
                                    ticks: {
                                        beginAtZero: true,
                                        font: {
                                            size: 18,
                                            weight: 'bold'
                                        }
                                    },
                                    grid: {
                                        color: '#e3e3e3'
                                    }
                                }
                            }
                        }} />
                    </div>

                    {/* Average School Grades and Average Age */}
                    <div className="flex justify-between">
                        <div className="bg-blue-500 text-white p-6 rounded-lg w-full mr-4 text-center">
                            <h4 className="text-2xl font-semibold">Average School Grades</h4>
                            <p className="text-4xl">{data.average_school_grades}%</p>
                        </div>
                        <div className="bg-orange-500 text-white p-6 rounded-lg w-full text-center">
                            <h4 className="text-2xl font-semibold">Average Age</h4>
                            <p className="text-4xl">{data.average_age} years</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Second Row: Percentage of Children Who Listened to Parents */}
            <div className="flex justify-center items-center mb-12">
  <div className="flex w-full justify-between max-w-4xl">
    {/* First Chart */}
    <div className="w-1/2 px-4 flex flex-col items-center">
      <h3 className="text-3xl font-semibold text-center mb-4">Children Who Listened to Parents</h3>
      <div className="relative pt-1 w-full">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="font-semibold text-2xl">{data.listened_to_parents_percentage}%</span>
          </div>
        </div>
        <div className="flex mb-2 items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full">
            <div
              className="bg-green-500 text-xs font-semibold text-center p-0.5 leading-none rounded-full"
              style={{ width: `${data.listened_to_parents_percentage}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>

    {/* Second Chart */}
    <div className="w-1/2 px-4 flex flex-col items-center">
      <h3 className="text-3xl font-semibold text-center mb-4">Gifts Prepared By The Santas Helpers</h3>
      <div className="relative pt-1 w-full">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <span className="font-semibold text-2xl">{data.gifts_prepared}%</span>
          </div>
        </div>
        <div className="flex mb-2 items-center justify-between">
          <div className="w-full bg-gray-200 rounded-full">
            <div
              className="bg-green-500 text-xs font-semibold text-center p-0.5 leading-none rounded-full"
              style={{ width: `${data.gifts_prepared}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

        </div>
    );
};

export default StatisticsCharts;
