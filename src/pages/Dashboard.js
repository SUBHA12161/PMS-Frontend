import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Chart from "react-apexcharts";
import "bootstrap/dist/css/bootstrap.min.css";
import "../assets/css/loader.css";

const Dashboard = () => {
  const [chartData, setChartData] = useState({
    categories: [],
    counts: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const { user, logout, isTokenExpired } = useContext(AuthContext);
  const token = localStorage.getItem("token");

  const fetchData = async () => {
    try {
      if (isTokenExpired(token)) {
        alert("Token has expired. Logging out...");
        logout();
        return;
      }

      const response = await fetch(`${process.env.REACT_APP_API_BASE_URL}/emp/getCount`, {
        method: "GET",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const data = await response.json();

      const categories = data.roleCounts.map((item) => item.role);
      const counts = data.roleCounts.map((item) => item.count);

      setChartData({
        categories,
        counts,
      });
      setIsLoading(false);
    } catch (err) {
      setError("Error fetching data. Please try again later.");
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const chartOptions = {
    series: chartData.counts,
    labels: chartData.categories,
    chart: {
      type: "pie",
      height: 400,
      width: 400,
    },
    dataLabels: {
      enabled: true,
      formatter: function (val, opts) {
        return opts.w.config.series[opts.seriesIndex];
      },
    },
    tooltip: {
      y: {
        formatter: function (val) {
          return `${val}`;
        },
      },
    },
    responsive: [
      {
        breakpoint: 480,
        options: {
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  };


  if (isLoading) {
    return (
      <div className="loader-container">
        <div className="blur-background"></div>
        <div className="loader-text"></div>
      </div>
    );
  }

  return (
    <div className="container-fluid p-5 vh-100">
      {(user.role !== "Executives/Associates") ?
        <>
          <div className="row justify-content-center align-items-center">
            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h5>Employee Distribution</h5>
                </div>
                <div className="card-body d-flex justify-content-center">
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="pie"
                    width="500px"
                    height="400px"
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="card shadow">
                <div className="card-header bg-primary text-white">
                  <h5>Employee Distribution</h5>
                </div>
                <div className="card-body d-flex justify-content-center">
                  <Chart
                    options={chartOptions}
                    series={chartOptions.series}
                    type="pie"
                    width="500px"
                    height="400px"
                  />
                </div>
              </div>
            </div>
          </div>
        </> : null}
    </div>
  );
};

export default Dashboard;
