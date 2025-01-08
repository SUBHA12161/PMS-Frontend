import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AnalyticsDashboard = () => {
    const [analytics, setAnalytics] = useState(null);

    useEffect(() => {
        const fetchAnalytics = async () => {
            const response = await fetch('/api/courses/analytics');
            const data = await response.json();
            setAnalytics(data);
        };

        fetchAnalytics();
    }, []);

    if (!analytics) return <div>Loading...</div>;

    const avgTimeSpent = analytics.engagementMetrics.avgTimeSpent || 0;
    const totalViews = analytics.engagementMetrics.totalViews || 0;

    const chartData = {
        labels: ['Total Students', 'Completed Students', 'Total Views', 'Average Time Spent (s)'],
        datasets: [
            {
                label: 'Overall Course Analytics',
                data: [
                    analytics.totalStudents,
                    analytics.completedStudents,
                    totalViews, 
                    avgTimeSpent,
                ],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(153, 102, 255, 0.6)',
                    'rgba(255, 159, 64, 0.6)',
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    const options = {
        scales: {
            y: {
                ticks: {
                    stepSize: 1, 
                    callback: function (value) {
                        return Math.round(value); 
                    },
                },
            },
        },
        responsive: true,
        maintainAspectRatio: false, 
    };

    return (
        <div style={{ width: '80%', height: '400px', margin: 'auto' }}>
            <h2>Overall Course Analytics</h2>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default AnalyticsDashboard;
