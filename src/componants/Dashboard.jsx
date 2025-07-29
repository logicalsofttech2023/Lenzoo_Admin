import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("1y");
  const [chartData, setChartData] = useState([]);
  const [subscriptionData, setSubscriptionData] = useState({});
  const [appointmentData, setAppointmentData] = useState({});
  const [visionTestData, setVisionTestData] = useState({});
    const [orderTrends, setOrderTrends] = useState({});


  // Dummy data for demonstration
  const dummyData = {
    stats: {
      totalProducts: 1234,
      totalOrders: 5678,
      totalSubscriptions: 1245,
      activeSubscriptions: 892,
      scheduledExams: 156,
      visionTestsCompleted: 783,
      basicPlanRevenue: 125000,
      plusPlanRevenue: 245000,
      premiumPlanRevenue: 380000,
      measurementAccuracy: 92
    },
    subscriptionData: {
      planDistribution: [420, 350, 475] // Basic, Plus, Premium
    },
     orderTrends: {
      months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
      orders: [85, 92, 78, 105, 120, 135, 142, 130, 118, 125, 140, 160],
      revenue: [297500, 322000, 273000, 367500, 420000, 472500, 497000, 455000, 413000, 437500, 490000, 560000]
    },
    appointmentData: {
      scheduled: [25, 30, 42, 38, 45, 50, 60, 55, 48, 52, 40, 35],
      completed: [20, 25, 38, 32, 40, 45, 55, 50, 42, 48, 35, 30]
    },
    visionTestData: {
      myopia: [120, 85, 45, 20],    // Normal, Mild, Moderate, Severe
      hyperopia: [150, 60, 30, 10],
      astigmatism: [180, 75, 40, 15]
    }
  };

  // Fetch all dashboard data
  const fetchDashboardData = async () => {
    try {
      // In a real app, you would use the axios calls here
      // For demo purposes, we'll use the dummy data
      setStats(dummyData.stats);
      setSubscriptionData(dummyData.subscriptionData);
      setAppointmentData(dummyData.appointmentData);
      setVisionTestData(dummyData.visionTestData);
      setOrderTrends(dummyData.orderTrends);
      
      // Actual API calls would look like this:
      /*
      const [statsRes, subscriptionRes, appointmentRes, testRes] = await Promise.all([
        axios.get(`${import.meta.env.VITE_API_BASE_URL}getDashboardStats`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}subscriptionMetrics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}appointmentMetrics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        }),
        axios.get(`${import.meta.env.VITE_API_BASE_URL}visionTestMetrics`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
        })
      ]);

      if (statsRes.status === 200) setStats(statsRes.data);
      if (subscriptionRes.status === 200) setSubscriptionData(subscriptionRes.data);
      if (appointmentRes.status === 200) setAppointmentData(appointmentRes.data);
      if (testRes.status === 200) setVisionTestData(testRes.data);
      */
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedFilter]);

  // Chart configurations
  const subscriptionChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: ['Basic', 'Plus', 'Premium'],
    colors: ['#FFA500', '#800080', '#4CAF50'],
    legend: {
      position: 'bottom'
    },
    responsive: [{
      breakpoint: 480,
      options: {
        chart: {
          width: 200
        },
        legend: {
          position: 'bottom'
        }
      }
    }]
  };

  const appointmentChartOptions = {
    chart: {
      type: 'bar',
      stacked: true,
    },
    plotOptions: {
      bar: {
        horizontal: false,
      },
    },
    colors: ['#FFA500', '#800080'],
    xaxis: {
      categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    },
    legend: {
      position: 'bottom'
    }
  };

  const visionTestChartOptions = {
    chart: {
      type: 'line',
    },
    colors: ['#FFA500', '#800080', '#4CAF50'],
    stroke: {
      curve: 'smooth'
    },
    xaxis: {
      categories: ['Normal', 'Mild', 'Moderate', 'Severe'],
    },
    markers: {
      size: 5
    }
  };


  const orderTrendOptions = {
    chart: { type: 'line' },
    colors: ['#FFA500', '#800080'],
    stroke: { curve: 'smooth', width: 3 },
    xaxis: { categories: orderTrends.months },
    yaxis: [
      { title: { text: "Orders" } },
      { opposite: true, title: { text: "Revenue (₹)" } }
    ],
    tooltip: {
      shared: true,
      intersect: false
    }
  };

  return (
    <div className="content">
      {/* Main Stats Cards */}
      <div className="row">
  {/* Total Products */}
  <div className="col-xl-3 col-sm-6 col-12 d-flex">
    <div className="card bg-primary sale-widget flex-fill">
      <div className="card-body d-flex align-items-center">
        <span className="sale-icon bg-white text-primary">
          <i className="ti ti-box fs-24" />
        </span>
        <div className="ms-2">
          <p className="text-white mb-1">Total Products</p>
          <h4 className="text-white">{stats?.totalProducts ?? 0}</h4>
        </div>
      </div>
    </div>
  </div>

  {/* Total Orders */}
  <div className="col-xl-3 col-sm-6 col-12 d-flex">
    <div className="card bg-warning sale-widget flex-fill">
      <div className="card-body d-flex align-items-center">
        <span className="sale-icon bg-white text-warning">
          <i className="ti ti-shopping-cart fs-24" />
        </span>
        <div className="ms-2">
          <p className="text-white mb-1">Total Orders</p>
          <h4 className="text-white">{stats?.totalOrders ?? 0}</h4>
        </div>
      </div>
    </div>
  </div>

  {/* Total Subscriptions */}
  <div className="col-xl-3 col-sm-6 col-12 d-flex">
    <div className="card bg-success sale-widget flex-fill">
      <div className="card-body d-flex align-items-center">
        <span className="sale-icon bg-white text-success">
          <i className="ti ti-user-check fs-24" />
        </span>
        <div className="ms-2">
          <p className="text-white mb-1">Total Subscriptions</p>
          <h4 className="text-white">{stats?.totalSubscriptions ?? 0}</h4>
        </div>
      </div>
    </div>
  </div>

  {/* Active Subscriptions */}
  <div className="col-xl-3 col-sm-6 col-12 d-flex">
    <div className="card bg-dark sale-widget flex-fill">
      <div className="card-body d-flex align-items-center">
        <span className="sale-icon bg-white text-dark">
          <i className="ti ti-activity fs-24" />
        </span>
        <div className="ms-2">
          <p className="text-white mb-1">Active Subscriptions</p>
          <h4 className="text-white">{stats?.activeSubscriptions ?? 0}</h4>
        </div>
      </div>
    </div>
  </div>

  {/* Scheduled Exams */}
  <div className="col-xl-3 col-sm-6 col-12 d-flex">
    <div className="card bg-purple sale-widget flex-fill">
      <div className="card-body d-flex align-items-center">
        <span className="sale-icon bg-white text-purple">
          <i className="ti ti-calendar fs-24" />
        </span>
        <div className="ms-2">
          <p className="text-white mb-1">Scheduled Exams</p>
          <h4 className="text-white">{stats?.scheduledExams ?? 0}</h4>
        </div>
      </div>
    </div>
  </div>

  {/* Vision Tests Completed */}
  <div className="col-xl-3 col-sm-6 col-12 d-flex">
    <div className="card bg-info sale-widget flex-fill">
      <div className="card-body d-flex align-items-center">
        <span className="sale-icon bg-white text-info">
          <i className="ti ti-eye fs-24" />
        </span>
        <div className="ms-2">
          <p className="text-white mb-1">Vision Tests Completed</p>
          <h4 className="text-white">{stats?.visionTestsCompleted ?? 0}</h4>
        </div>
      </div>
    </div>
  </div>
</div>


      

      {/* Revenue Cards */}
      <div className="row mt-3">
        <div className="col-xl-4 col-sm-6 col-12 d-flex">
          <div className="card revenue-widget flex-fill">
            <div className="card-body">
              <div className="d-flex align-items-center justify-content-between mb-3 pb-3 border-bottom">
                <div>
                  <h4 className="mb-1">
                    ₹{stats?.basicPlanRevenue?.toLocaleString() ?? 0}
                  </h4>
                  <p>Basic Plan Revenue</p>
                </div>
                <span className="revenue-icon bg-orange-transparent text-orange">
                  <i className="ti ti-coin fs-16" />
                </span>
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
                    ₹{stats?.plusPlanRevenue?.toLocaleString() ?? 0}
                  </h4>
                  <p>Plus Plan Revenue</p>
                </div>
                <span className="revenue-icon bg-purple-transparent text-purple">
                  <i className="ti ti-coin fs-16" />
                </span>
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
                    ₹{stats?.premiumPlanRevenue?.toLocaleString() ?? 0}
                  </h4>
                  <p>Premium Plan Revenue</p>
                </div>
                <span className="revenue-icon bg-green-transparent text-green">
                  <i className="ti ti-coin fs-16" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3" >
{/* Order Status Overview */}
      <div className="row mt-3">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Order Status Overview</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">Pending</h6>
                    <h4 className="text-warning">45</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">Processing</h6>
                    <h4 className="text-info">28</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">Shipped</h6>
                    <h4 className="text-primary">62</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">Delivered</h6>
                    <h4 className="text-success">876</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">Returned</h6>
                    <h4 className="text-danger">34</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">Cancelled</h6>
                    <h4 className="text-secondary">18</h4>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      </div>

      <div className="row mt-3">
        <div className="col-xl-6 col-lg-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Monthly Order Trends</h5>
            </div>
            <div className="card-body">
              <Chart
                options={orderTrendOptions}
                series={[
                  { name: 'Orders', data: orderTrends.orders || [] },
                  { name: 'Revenue', data: orderTrends.revenue || [] }
                ]}
                type="line"
                height={350}
              />
            </div>
          </div>
        </div>
      </div>



      {/* Charts Section */}
      <div className="row mt-3">
        {/* Subscription Distribution */}
        <div className="col-xl-4 col-md-6 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Subscription Plans Distribution</h5>
            </div>
            <div className="card-body">
              <Chart
                options={subscriptionChartOptions}
                series={subscriptionData.planDistribution || [0, 0, 0]}
                type="donut"
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Optical Measurement Accuracy */}
        <div className="col-xl-6 col-md-6 col-12 mt-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Optical Measurement Accuracy</h5>
            </div>
            <div className="card-body">
              <Chart
                options={{
                  chart: { type: 'radialBar' },
                  colors: ['#FFA500'],
                  plotOptions: {
                    radialBar: {
                      startAngle: -135,
                      endAngle: 135,
                      dataLabels: {
                        name: { fontSize: '12px' },
                        value: { fontSize: '12px' }
                      }
                    }
                  },
                  labels: ['Measurement Accuracy']
                }}
                series={[stats?.measurementAccuracy || 0]}
                type="radialBar"
                height={300}
              />
            </div>
          </div>
        </div>

        {/* Monthly Appointments */}
        <div className="col-xl-12 col-md-12 col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Monthly Appointments</h5>
            </div>
            <div className="card-body">
              <Chart
                options={appointmentChartOptions}
                series={[
                  {
                    name: 'Scheduled',
                    data: appointmentData.scheduled || Array(12).fill(0)
                  },
                  {
                    name: 'Completed',
                    data: appointmentData.completed || Array(12).fill(0)
                  }
                ]}
                type="bar"
                height={300}
              />
            </div>
          </div>
        </div>

        

        {/* Vision Test Results */}
        <div className="col-xl-12 col-md-12 col-12 mt-3">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">Vision Test Results</h5>
            </div>
            <div className="card-body">
              <Chart
                options={visionTestChartOptions}
                series={[
                  {
                    name: 'Myopia',
                    data: visionTestData.myopia || [0, 0, 0, 0]
                  },
                  {
                    name: 'Hyperopia',
                    data: visionTestData.hyperopia || [0, 0, 0, 0]
                  },
                  {
                    name: 'Astigmatism',
                    data: visionTestData.astigmatism || [0, 0, 0, 0]
                  }
                ]}
                type="line"
                height={300}
              />
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default Dashboard;