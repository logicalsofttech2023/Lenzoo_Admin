import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-toastify";

const UserDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { userId } = location?.state || {};
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null);
  const [imageError, setImageError] = useState(false);
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_url}getUserDetailsById?id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (!response.data?.user) {
        throw new Error("No user data found");
      }

      setUserData(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error(error.message || "Failed to fetch user details");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await axios.post(
        `${base_url}updateOrderStatus`,
        {
          orderId,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        toast.success("Order status updated successfully");
        fetchUserDetails(); // Refresh the data
      } else {
        throw new Error(
          response.data.message || "Failed to update order status"
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message || "Failed to update order status");
    }
  };

  useEffect(() => {
    if (!userId) {
      toast.error("No user ID provided");
      navigate("/users");
      return;
    }
    fetchUserDetails();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  };

  const getFullName = () => {
    return [userData?.firstName, userData?.middleName, userData?.lastName]
      .filter(Boolean)
      .join(" ");
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("₹", "₹ ");
  };

  const getOrderStatusBadge = (status) => {
    switch (status) {
      case "placed":
        return <span className="badge bg-primary">Placed</span>;
      case "processing":
        return <span className="badge bg-secondary">Processing</span>;
      case "shipped":
        return <span className="badge bg-info text-dark">Shipped</span>;
      case "delivered":
        return <span className="badge bg-success">Delivered</span>;
      case "cancelled":
        return <span className="badge bg-danger">Cancelled</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="badge bg-success">Paid</span>;
      case "pending":
        return <span className="badge bg-warning">Pending</span>;
      case "failed":
        return <span className="badge bg-danger">Failed</span>;
      case "refunded":
        return <span className="badge bg-info text-dark">Refunded</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  if (loading) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <ColorRing
          visible={true}
          height="80"
          width="80"
          ariaLabel="magnifying-glass-loading"
          wrapperStyle={{}}
          wrapperClass="magnifying-glass-wrapper"
          glassColor="#c0efff"
          color="#e15b64"
        />
      </div>
    );
  }

  if (!userData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="fs-5 text-danger">No user data found</div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex justify-content-between align-items-center w-100">
            <div className="page-title">
              <h4 className="fw-bold">User Details</h4>
              <h6 className="text-muted">View and manage user information</h6>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="ti ti-arrow-left me-1"></i> Back
            </button>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-4">
            {/* User Profile Header */}
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center mb-4 gap-4">
              <div className="position-relative">
                <div
                  className="rounded-circle overflow-hidden border border-3 shadow-sm"
                  style={{
                    width: "100px",
                    height: "100px",
                    borderColor: "#f8f9fa",
                  }}
                >
                  <img
                    src={
                      imageError || !userData.profileImage
                        ? "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
                        : `${file_url}${userData.profileImage}`
                    }
                    alt="User Profile"
                    className="img-fluid h-100 w-100"
                    style={{ objectFit: "cover" }}
                    onError={() => setImageError(true)}
                  />
                </div>
              </div>

              <div className="flex-grow-1">
                <div className="d-flex flex-wrap align-items-center gap-2 mb-2">
                  <h2 className="mb-0 fw-bold" style={{ fontSize: "1.75rem" }}>
                    {getFullName()}
                  </h2>
                </div>

                <div className="d-flex flex-wrap gap-3 mb-2">
                  <div className="d-flex align-items-center text-muted">
                    <i className="ti ti-mail me-2"></i>
                    <span>{userData.userEmail}</span>
                  </div>
                  <div className="d-flex align-items-center text-muted">
                    <i className="ti ti-phone me-2"></i>
                    <span>{userData.phone || "N/A"}</span>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <div className="d-flex align-items-center text-muted">
                    <i className="ti ti-calendar me-2"></i>
                    <span>Joined {formatDate(userData.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                {/* Orders Section */}
                {userData.orders?.length > 0 && (
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                          <i className="ti ti-shopping-cart me-2 text-primary"></i>
                          Orders
                        </h5>
                        <span className="badge bg-primary">
                          {userData.orders.length}{" "}
                          {userData.orders.length === 1 ? "Order" : "Orders"}
                        </span>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Amount</th>
                              <th>Status</th>
                              <th>Payment</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userData.orders.map((order) => (
                              <tr key={order._id}>
                                <td className="font-monospace small">
                                  {order.orderId}
                                </td>
                                <td>{formatDate(order.createdAt)}</td>
                                <td>{formatPrice(order.totalAmount)}</td>
                                <td>
                                  <select
                                    className="form-select form-select-sm"
                                    value={order.orderStatus}
                                    onChange={(e) =>
                                      updateOrderStatus(
                                        order._id,
                                        e.target.value
                                      )
                                    }
                                  >
                                    <option value="placed">Placed</option>
                                    <option value="processing">
                                      Processing
                                    </option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                  </select>
                                </td>
                                <td>
                                  {getPaymentStatusBadge(order.paymentStatus)}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Prescriptions Section */}
                {userData.prescriptions?.length > 0 && (
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                          <i className="ti ti-file-prescription me-2 text-primary"></i>
                          Prescriptions
                        </h5>
                        <span className="badge bg-primary">
                          {userData.prescriptions.length}{" "}
                          {userData.prescriptions.length === 1
                            ? "Prescription"
                            : "Prescriptions"}
                        </span>
                      </div>
                    </div>

                    <div className="card-body pt-0">
                      <div className="row g-3">
                        {userData.prescriptions.map((prescription) => (
                          <div key={prescription._id} className="col-md-12">
                            <div className="border rounded p-3 h-100">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <h6 className="mb-0 fw-bold">
                                  {formatDate(prescription.uploadedAt)}
                                </h6>
                                <a
                                  href={`${file_url}${prescription.prescriptionFile}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="btn btn-sm btn-outline-primary"
                                >
                                  <i className="ti ti-download me-1"></i>
                                  Download
                                </a>
                              </div>
                              {prescription.notes && (
                                <div className="mb-2">
                                  <p className="small text-muted mb-1">
                                    Notes:
                                  </p>
                                  <p className="small mb-0">
                                    {prescription.notes}
                                  </p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Favorites Section */}
                {userData.favorites?.length > 0 && (
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                          <i className="ti ti-heart me-2 text-primary"></i>
                          Favorites
                        </h5>
                        <span className="badge bg-primary">
                          {userData.favorites.length}{" "}
                          {userData.favorites.length === 1 ? "Item" : "Items"}
                        </span>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div className="row g-3">
                        {userData.favorites.map((favorite) => (
                          <div key={favorite._id} className="col-md-6">
                            <div className="border rounded p-3 h-100 d-flex gap-3">
                              <div
                                className="flex-shrink-0"
                                style={{ width: "80px", height: "80px" }}
                              >
                                <img
                                  src={`${file_url}${favorite.productId.images[0]}`}
                                  alt={favorite.productId.name}
                                  className="img-fluid rounded h-100 w-100"
                                  style={{ objectFit: "cover" }}
                                  onError={(e) =>
                                    (e.target.src =
                                      "/images/product-placeholder.png")
                                  }
                                />
                              </div>
                              <div className="flex-grow-1">
                                <h6 className="mb-1 fw-bold">
                                  {favorite.productId.name}
                                </h6>
                                <div className="d-flex gap-2 mb-1">
                                  <span className="text-danger fw-bold">
                                    {formatPrice(
                                      favorite.productId.sellingPrice
                                    )}
                                  </span>
                                  {favorite.productId.originalPrice >
                                    favorite.productId.sellingPrice && (
                                    <span className="text-muted text-decoration-line-through small">
                                      {formatPrice(
                                        favorite.productId.originalPrice
                                      )}
                                    </span>
                                  )}
                                </div>
                                <div className="d-flex gap-1 flex-wrap">
                                  <span className="badge bg-light text-dark small">
                                    {favorite.productId.productType}
                                  </span>
                                  <span className="badge bg-light text-dark small">
                                    {favorite.productId.frameType}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
