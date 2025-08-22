import axios from "axios";
import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState(null);
  const [selectedFilter, setSelectedFilter] = useState("1y");
  const [subscriptionData, setSubscriptionData] = useState({});
  const [appointmentData, setAppointmentData] = useState({});
  const [visionTestData, setVisionTestData] = useState({});
  const [orderTrends, setOrderTrends] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Dummy data as fallback
  const dummyData = {
    stats: {
      total_users: 1000,
      totalPrescriptions: 2000,
      totalProducts: 1234,
      totalOrders: 5678,
      totalSubscriptions: 1245,
      activeSubscriptions: 892,
      total_appointments: 156,
      visionTestsCompleted: 783,
      basicPlanRevenue: 125000,
      plusPlanRevenue: 245000,
      premiumPlanRevenue: 380000,
      measurementAccuracy: 92,
      
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
      myopia: [120, 85, 45, 20], 
      hyperopia: [150, 60, 30, 10],
      astigmatism: [180, 75, 40, 15]
    }
  };

  // Fetch all dashboard data from API
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}getDashboardData`);
      const apiData = response.data;
      console.log(apiData.appointmentStatusCounts);
      
      
      // Transform API data to match our component's state structure
      setStats({
        total_users: apiData.totalUsers,
        totalPrescriptions: apiData.totalPrescriptions, // Not in API
        totalProducts: apiData.totalProducts,
        totalOrders: apiData.totalOrders,
        totalSubscriptions: apiData.totalSubscriptions,
        activeSubscriptions: apiData.activeSubscriptions,
        total_appointments: apiData.totalAppointments,
        visionTestsCompleted: apiData.totalEyeTests,
        basicPlanRevenue: apiData.membershipRevenue.Basic,
        plusPlanRevenue: apiData.membershipRevenue.Plus,
        premiumPlanRevenue: apiData.membershipRevenue.Premium,
        measurementAccuracy: 92,
        appointmentStatusCounts: apiData.appointmentStatusCounts,
        orderStatusCounts: apiData.orderStatusCounts

      });

      setSubscriptionData({
        planDistribution: [
            20,
            40,
            40
        ]
      });

      // For data not available in API, use dummy data
      setOrderTrends(apiData.orderTrends);  
      setAppointmentData(apiData.appointmentTrends);
      setVisionTestData(dummyData.visionTestData);

    } catch (error) {
      console.error(t("error_fetching_dashboard"), error);
      setError(error);
      // Fallback to dummy data if API fails
      setStats(dummyData.stats);
      setSubscriptionData(dummyData.subscriptionData);
      setAppointmentData(dummyData.appointmentData);
      setVisionTestData(dummyData.visionTestData);
      setOrderTrends(dummyData.orderTrends);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [selectedFilter]);

  // Chart configurations with translated labels
  const subscriptionChartOptions = {
    chart: {
      type: 'donut',
    },
    labels: [t("basic"), t("plus"), t("premium")],
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
      categories: orderTrends.months,
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
      categories: [t("normal"), t("mild"), t("moderate"), t("severe")],
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
      { title: { text: t("orders") } },
      { opposite: true, title: { text: t("revenue") } }
    ],
    tooltip: {
      shared: true,
      intersect: false
    }
  };

  if (loading) {
    return (
      <div className="content">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="content">
        <div className="alert alert-danger">
          {t("error_fetching_dashboard")}: {error.message}
        </div>
      </div>
    );
  }

  return (
    <div className="content">

      <Link to={"/faceCapture"} >Face Capture</Link>
      {/* Main Stats Cards */}
      <div className="row">

        {/* Total Users */}
        <div className="col-xl-3 col-sm-6 col-12 d-flex">
          <div className="card bg-info sale-widget flex-fill">
            <div className="card-body d-flex align-items-center">
              <span className="sale-icon bg-white text-info">
                <i className="ti ti-users fs-24" />
              </span>
              <div className="ms-2">
                <p className="text-white mb-1">{t("total_users")}</p>
                <h4 className="text-white">{stats?.total_users ?? 0}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Total Prescriptions */}
        <div className="col-xl-3 col-sm-6 col-12 d-flex">
          <div className="card bg-success sale-widget flex-fill">
            <div className="card-body d-flex align-items-center">
              <span className="sale-icon bg-white text-success">
                <i className="ti ti-stethoscope fs-24" />
              </span>
              <div className="ms-2">
                <p className="text-white mb-1">{t("total_prescriptions")}</p>
                <h4 className="text-white">{stats?.totalPrescriptions ?? 0}</h4>
              </div>
            </div>
          </div>
        </div>

        {/* Total Products */}
        <div className="col-xl-3 col-sm-6 col-12 d-flex">
          <div className="card bg-primary sale-widget flex-fill">
            <div className="card-body d-flex align-items-center">
              <span className="sale-icon bg-white text-primary">
                <i className="ti ti-package fs-24" />
              </span>
              <div className="ms-2">
                <p className="text-white mb-1">{t("total_products")}</p>
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
                <p className="text-white mb-1">{t("total_orders")}</p>
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
                <p className="text-white mb-1">{t("total_subscriptions")}</p>
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
                <p className="text-white mb-1">{t("active_subscriptions")}</p>
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
                <p className="text-white mb-1">{t("total_appointments")}</p>
                <h4 className="text-white">{stats?.total_appointments ?? 0}</h4>
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
                <p className="text-white mb-1">{t("vision_tests_completed")}</p>
                <h4 className="text-white">{stats?.visionTestsCompleted ?? 0}</h4>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        {/* Order Status Overview */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">{t("appointment_status_overview")}</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("booked")}</h6>
                    <h4 className="text-warning">{stats?.appointmentStatusCounts?.booked ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("cancelled_by_user")}</h6>
                    <h4 className="text-info">{stats?.appointmentStatusCounts?.cancelled_by_user ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("cancelled_by_admin")}</h6>
                    <h4 className="text-primary">{stats?.appointmentStatusCounts?.cancelled_by_admin ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("completed")}</h6>
                    <h4 className="text-success">{stats?.appointmentStatusCounts?.completed ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("rescheduled")}</h6>
                    <h4 className="text-danger">{stats?.appointmentStatusCounts?.rescheduled ?? 0}</h4>
                  </div>
                </div>
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
                  <p>{t("basic_plan_revenue")}</p>
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
                  <p>{t("plus_plan_revenue")}</p>
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
                  <p>{t("premium_plan_revenue")}</p>
                </div>
                <span className="revenue-icon bg-green-transparent text-green">
                  <i className="ti ti-coin fs-16" />
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="row mt-3">
        {/* Order Status Overview */}
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h5 className="card-title">{t("order_status_overview")}</h5>
            </div>
            <div className="card-body">
              <div className="row text-center">
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("placed")}</h6>
                    <h4 className="text-warning">{stats?.orderStatusCounts?.placed ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("processing")}</h6>
                    <h4 className="text-info">{stats?.orderStatusCounts?.processing ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("shipped")}</h6>
                    <h4 className="text-primary">{stats?.orderStatusCounts?.shipped ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("delivered")}</h6>
                    <h4 className="text-success">{stats?.orderStatusCounts?.delivered ?? 0}</h4>
                  </div>
                </div>
                <div className="col-xl-2 col-sm-4 col-6">
                  <div className="border p-3 br-8 mb-3">
                    <h6 className="mb-1">{t("cancelled")}</h6>
                    <h4 className="text-danger">{stats?.orderStatusCounts?.cancelled ?? 0}</h4>
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
              <h5 className="card-title">{t("monthly_order_trends")}</h5>
            </div>
            <div className="card-body">
              <Chart
                options={orderTrendOptions}
                series={[
                  { name: t("orders"), data: orderTrends.orders || [] },
                  { name: t("revenue"), data: orderTrends.revenue || [] }
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
              <h5 className="card-title">{t("subscription_plans_distribution")}</h5>
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
              <h5 className="card-title">{t("optical_measurement_accuracy")}</h5>
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
                  labels: [t("measurement_accuracy")]
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
              <h5 className="card-title">{t("monthly_appointments")}</h5>
            </div>
            <div className="card-body">
              <Chart
                options={appointmentChartOptions}
                series={[
                  {
                    name: t("scheduled"),
                    data: appointmentData.booked || Array(12).fill(0)
                  },
                  {
                    name: t("rescheduled"),
                    data: appointmentData.rescheduled || Array(12).fill(0)
                  },
                  {
                    name: t("cancelled_by_user"),
                    data: appointmentData.cancelled_by_user || Array(12).fill(0)
                  },
                  
                  {
                    name: t("completed"),
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
              <h5 className="card-title">{t("vision_test_results")}</h5>
            </div>
            <div className="card-body">
              <Chart
                options={visionTestChartOptions}
                series={[
                  {
                    name: t("myopia"),
                    data: visionTestData.myopia || [0, 0, 0, 0]
                  },
                  {
                    name: t("hyperopia"),
                    data: visionTestData.hyperopia || [0, 0, 0, 0]
                  },
                  {
                    name: t("astigmatism"),
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