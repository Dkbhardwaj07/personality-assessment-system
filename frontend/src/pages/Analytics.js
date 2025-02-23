import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar } from "react-chartjs-2";
import { Chart, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from "chart.js";

// Register required Chart.js components
Chart.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Analytics = () => {
    const [analyticsData, setAnalyticsData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get("http://127.0.0.1:8000/analytics")
            .then(response => {
                console.log("✅ API Response:", response.data); // Debug log
                setAnalyticsData(response.data);
            })
            .catch(error => {
                console.error("❌ Error fetching analytics:", error);
                setError("Failed to fetch data");
            })
            .finally(() => setLoading(false));
    }, []);

    // Check if data is still loading
    if (loading) return <p>Loading...</p>;
    if (error) return <p style={{ color: "red" }}>{error}</p>;
    if (!analyticsData) return <p>No data available</p>;

    // Ensure data structure is correct
    console.log("📊 Analytics Data:", analyticsData);
    const traitLabels = Object.keys(analyticsData);
    const traitValues = Object.values(analyticsData);

    const chartData = {
        labels: traitLabels,
        datasets: [
            {
                label: "Personality Traits",
                data: traitValues,
                backgroundColor: "rgba(75,192,192,0.6)",
                borderColor: "rgba(75,192,192,1)",
                borderWidth: 1,
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        maintainAspectRatio: false, // Prevents chart from stretching
        scales: {
            y: {
                beginAtZero: true,
                max: Math.max(...traitValues) + 2, // Adjusting max for better readability
            },
        },
    };

    return (
        <div style={{ width: "60%", height: "400px", margin: "auto", padding: "20px" }}>
            <h2>Personality Trends</h2>
            <div style={{ height: "300px" }}> {/* Fixed height for the chart */}
                <Bar data={chartData} options={chartOptions} />
            </div>
        </div>
    );
};

export default Analytics;
