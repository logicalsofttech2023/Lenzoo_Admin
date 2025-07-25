import axios from "axios";
import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("1y"); // default selected
  const [chartData, setChartData] = useState([]);
  const [maxValue, setMaxValue] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [usersCount, setUsersCount] = useState({});

  const fetchGraphStats = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}getGraphStats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (res.status === 200) {
        const stats = res.data.stats;
        const formattedData = Object.entries(stats).map(([key, val]) => ({
          name: key.toUpperCase(),
          value: val.totalAmount,
          count: val.count,
        }));

        setChartData(formattedData);
        setTotalAmount(stats[selectedFilter]?.totalAmount || 0);
        const max = Math.max(...formattedData.map((d) => d.value));
        setMaxValue(max);
      }
    } catch (err) {
      console.error("Error fetching graph stats:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}getDashboardCount`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  const fetchUsersCounts = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}getUsersCounts`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      if (response.status === 200) {
        console.log(response.data.data);

        setUsersCount(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchGraphStats();
    fetchUsersCounts();
  }, [selectedFilter]);

  return (
    <>
      <div className="content">
        {/* Welcome Section */}

        {/* Main Stats Cards */}
        <div className="row">
          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-primary sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-white text-primary">
                  <i className="ti ti-file-text fs-24" />
                </span>
                <div className="ms-2">
                  <p className="text-white mb-1">Total Users</p>
                  <h4 className="text-white">{usersCount?.totalUsers ?? 0}</h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-secondary sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-white text-secondary">
                  <i className="ti ti-repeat fs-24" />
                </span>
                <div className="ms-2">
                  <p className="text-white mb-1">Total Free Offerings</p>
                  <h4 className="text-white">
                    {usersCount?.freeOfferings ?? 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-secondary sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-white text-secondary">
                  <i className="ti ti-repeat fs-24" />
                </span>
                <div className="ms-2">
                  <p className="text-white mb-1">Total Business Services</p>
                  <h4 className="text-white">
                    {usersCount?.businessServices ?? 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-teal sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-white text-teal">
                  <i className="ti ti-gift fs-24" />
                </span>
                <div className="ms-2">
                  <p className="text-white mb-1">
                    Individual Families Services
                  </p>
                  <h4 className="text-white">
                    {usersCount?.individualBusinessServices ?? 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-3 col-sm-6 col-12 d-flex">
            <div className="card bg-info sale-widget flex-fill">
              <div className="card-body d-flex align-items-center">
                <span className="sale-icon bg-white text-info">
                  <i className="ti ti-brand-pocket fs-24" />
                </span>
                <div className="ms-2">
                  <p className="text-white mb-1">Institutional Services</p>
                  <h4 className="text-white">
                    {usersCount?.institutionalServices ?? 0}
                  </h4>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Revenue Cards */}
        <div className="row">
          <div className="col-xl-4 col-sm-6 col-12 d-flex">
            <div className="card revenue-widget flex-fill">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <div>
                    <h4 className="mb-1">
                      ₹
                      {stats?.individualBusinessServicesAmount?.toLocaleString() ??
                        0}
                    </h4>
                    <p>Individual Business Revenue</p>
                  </div>
                  <span className="revenue-icon bg-cyan-transparent text-cyan">
                    <i className="fa-solid fa-layer-group fs-16" />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="mb-0">Revenue Source</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 col-12 d-flex">
            <div className="card revenue-widget flex-fill">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <div>
                    <h4 className="mb-1">
                      ₹{stats?.businessServicesAmount?.toLocaleString() ?? 0}
                    </h4>
                    <p>Business Services Revenue</p>
                  </div>
                  <span className="revenue-icon bg-orange-transparent text-orange">
                    <i className="ti ti-lifebuoy fs-16" />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="mb-0">Revenue Source</p>
                </div>
              </div>
            </div>
          </div>

          <div className="col-xl-4 col-sm-6 col-12 d-flex">
            <div className="card revenue-widget flex-fill">
              <div className="card-body">
                <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                  <div>
                    <h4 className="mb-1">
                      ₹
                      {stats?.institutionalServicesAmount?.toLocaleString() ??
                        0}
                    </h4>
                    <p>Institutional Services Revenue</p>
                  </div>
                  <span className="revenue-icon bg-indigo-transparent text-indigo">
                    <i className="ti ti-hash fs-16" />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between">
                  <p className="mb-0">Revenue Source</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts and Info Section */}
        {/* <div className="row">
          <div className="col-xxl-8 col-xl-7 col-sm-12 col-12 d-flex">
            <div className="card flex-fill">
              <div className="card-header d-flex justify-content-between align-items-center">
                <div className="d-inline-flex align-items-center">
                  <span className="title-icon bg-soft-primary fs-16 me-2">
                    <i className="ti ti-shopping-cart" />
                  </span>
                  <h5 className="card-title mb-0">Sales & Purchase</h5>
                </div>
                <ul className="nav btn-group custom-btn-group">
                  {["1D", "1W", "1M", "3M", "6M", "1Y"].map((label) => (
                    <a
                      key={label}
                      className={`btn btn-outline-light ${
                        selectedFilter === label.toLowerCase() ? "active" : ""
                      }`}
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        setSelectedFilter(label.toLowerCase());
                      }}
                    >
                      {label}
                    </a>
                  ))}
                </ul>
              </div>

              <div className="card-body pb-0">
                <div className="d-flex align-items-center gap-2 mb-3">
                  <div className="border p-2 br-8">
                    <p className="d-inline-flex align-items-center mb-1">
                      <i className="ti ti-circle-filled fs-8 text-primary-300 me-1" />
                      Total Amount ({selectedFilter.toUpperCase()})
                    </p>
                    <h4>₹{totalAmount.toLocaleString()}</h4>
                  </div>
                </div>

                <div style={{ width: "100%", height: 300 }}>
                  <ResponsiveContainer>
                    <LineChart
                      data={chartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, maxValue]} />
                      <Tooltip />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="value"
                        stroke="#fe9f43"
                        activeDot={{ r: 8 }}
                        name="Total Amount"
                      />
                      <Line
                        type="monotone"
                        dataKey="count"
                        stroke="#8884d8"
                        name="Transaction Count"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>
          </div>
        </div> */}

        {/* Top Customers, Categories, Order Statistics */}
      </div>
    </>
  );
};

export default Dashboard;
