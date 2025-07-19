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
  const [plans, setPlans] = useState([]);
  const [imageError, setImageError] = useState(false);
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;

  const fetchUserDetails = async () => {
    try {
      setLoading(true);

      const response = await axios.get(
        `${base_url}getUserDetailInAdmin?userId=${userId}`,{
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`
          }
        }
      );

      if (!response.data?.data?.user) {
        throw new Error("No user data found");
      }

      setUserData(response.data.data.user);
      setPlans(response.data.data.plans || []);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error(error.message || "Failed to fetch user details");
      navigate(-1);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userId) {
      toast.error("No user ID provided");
      navigate("/users");
      return;
    }
    fetchUserDetails();
  }, [userId, navigate]);

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

  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
        });
  };

  const getFullName = () => {
    return [userData.firstName, userData.middleName, userData.lastName]
      .filter(Boolean)
      .join(" ");
  };

  const getStatusBadge = (status) => {
    switch (status) {
      
      case "approved":
        return <span className="badge bg-success">Approved</span>;
      case "pending":
        return <span className="badge bg-warning">Pending</span>;
      case "rejected":
        return <span className="badge bg-danger">Rejected</span>;
      default:
        return <span className="badge bg-secondary">Unknown</span>;
    }
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
                  {getStatusBadge(userData.adminVerified)}
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
              {/* Left Column */}
              <div className="col-lg-8">
                {/* Basic Information */}
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0 py-3">
                    <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                      <i className="ti ti-info-circle me-2 text-primary"></i>
                      Basic Information
                    </h5>
                  </div>
                  <div className="card-body pt-0">
                    <div className="row">
                      <div className="col-md-6 mb-3">
                        <label className="form-label small mb-1">
                          Gender
                        </label>
                        <p className="fw-medium text-capitalize">
                          {userData.gender || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label small mb-1">
                          Date of Birth
                        </label>
                        <p className="fw-medium">
                          {userData.dob ? formatDate(userData.dob) : "N/A"}
                        </p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label small mb-1">
                          Aadhar Number
                        </label>
                        <p className="fw-medium">
                          {userData.aadharNumber || "N/A"}
                        </p>
                      </div>
                      <div className="col-md-6 mb-3">
                        <label className="form-label small mb-1">
                          PAN Number
                        </label>
                        <p className="fw-medium">
                          {userData.panNumber || "N/A"}
                        </p>
                      </div>
                      <div className="col-12 mb-3">
                        <label className="form-label small mb-1">
                          Address
                        </label>
                        <p className="fw-medium">{userData.address || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Document Verification */}
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0 py-3">
                    <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                      <i className="ti ti-id me-2 text-primary"></i>
                      Document Verification
                    </h5>
                  </div>
                  <div className="card-body pt-0">
                    <div className="row">
                      <div className="col-md-12 mb-4">
                        <div className="bg-light p-3 rounded">
                          <label className="form-label text-muted small mb-2 d-block">
                            Aadhar Card
                          </label>
                          <div className="d-flex gap-2 mb-3">
                            <div className="flex-grow-1">
                              <div
                                className="document-preview border rounded overflow-hidden"
                                style={{ height: "150px" }}
                              >
                                {userData.aadharFrontImage ? (
                                  <img
                                    src={`${file_url}${userData.aadharFrontImage}`}
                                    alt="Aadhar Front"
                                    className="img-fluid h-100 w-100"
                                    style={{ objectFit: "cover" }}
                                    onError={(e) =>
                                      (e.target.src =
                                        "/images/document-placeholder.png")
                                    }
                                  />
                                ) : (
                                  <div className="h-100 d-flex align-items-center justify-content-center bg-white">
                                    <span className="text-muted">
                                      No image available
                                    </span>
                                  </div>
                                )}
                              </div>
                              <small className="text-center d-block mt-1">
                                Front Side
                              </small>
                            </div>
                            <div className="flex-grow-1">
                              <div
                                className="document-preview border rounded overflow-hidden"
                                style={{ height: "150px" }}
                              >
                                {userData.aadharBackImage ? (
                                  <img
                                    src={`${file_url}${userData.aadharBackImage}`}
                                    alt="Aadhar Back"
                                    className="img-fluid h-100 w-100"
                                    style={{ objectFit: "cover" }}
                                    onError={(e) =>
                                      (e.target.src =
                                        "/images/document-placeholder.png")
                                    }
                                  />
                                ) : (
                                  <div className="h-100 d-flex align-items-center justify-content-center bg-white">
                                    <span className="text-muted">
                                      No image available
                                    </span>
                                  </div>
                                )}
                              </div>
                              <small className="text-center d-block mt-1">
                                Back Side
                              </small>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <a
                              href={`${file_url}${userData.aadharFrontImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary w-100"
                              disabled={!userData.aadharFrontImage}
                            >
                              <i className="ti ti-download me-1"></i> Download
                              Front
                            </a>
                            <a
                              href={`${file_url}${userData.aadharBackImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary w-100"
                              disabled={!userData.aadharBackImage}
                            >
                              <i className="ti ti-download me-1"></i> Download
                              Back
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-12 mb-4">
                        <div className="bg-light p-3 rounded">
                          <label className="form-label text-muted small mb-2 d-block">
                            PAN Card
                          </label>
                          <div className="d-flex gap-2 mb-3">
                            <div className="flex-grow-1">
                              <div
                                className="document-preview border rounded overflow-hidden"
                                style={{ height: "150px" }}
                              >
                                {userData.panFrontImage ? (
                                  <img
                                    src={`${file_url}${userData.panFrontImage}`}
                                    alt="PAN Front"
                                    className="img-fluid h-100 w-100"
                                    style={{ objectFit: "cover" }}
                                    onError={(e) =>
                                      (e.target.src =
                                        "/images/document-placeholder.png")
                                    }
                                  />
                                ) : (
                                  <div className="h-100 d-flex align-items-center justify-content-center bg-white">
                                    <span className="text-muted">
                                      No image available
                                    </span>
                                  </div>
                                )}
                              </div>
                              <small className="text-center d-block mt-1">
                                Front Side
                              </small>
                            </div>
                            <div className="flex-grow-1">
                              <div
                                className="document-preview border rounded overflow-hidden"
                                style={{ height: "150px" }}
                              >
                                {userData.panBackImage ? (
                                  <img
                                    src={`${file_url}${userData.panBackImage}`}
                                    alt="PAN Back"
                                    className="img-fluid h-100 w-100"
                                    style={{ objectFit: "cover" }}
                                    onError={(e) =>
                                      (e.target.src =
                                        "/images/document-placeholder.png")
                                    }
                                  />
                                ) : (
                                  <div className="h-100 d-flex align-items-center justify-content-center bg-white">
                                    <span className="text-muted">
                                      No image available
                                    </span>
                                  </div>
                                )}
                              </div>
                              <small className="text-center d-block mt-1">
                                Back Side
                              </small>
                            </div>
                          </div>
                          <div className="d-flex gap-2">
                            <a
                              href={`${file_url}${userData.panFrontImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary w-100"
                              disabled={!userData.panFrontImage}
                            >
                              <i className="ti ti-download me-1"></i> Download
                              Front
                            </a>
                            <a
                              href={`${file_url}${userData.panBackImage}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-primary w-100"
                              disabled={!userData.panBackImage}
                            >
                              <i className="ti ti-download me-1"></i> Download
                              Back
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Subscription Plans */}
                <div className="card mb-4 border-0 shadow-sm">
  <div className="card-header bg-transparent border-0 py-3">
    <div className="d-flex justify-content-between align-items-center">
      <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
        <i className="ti ti-crown me-2 text-primary"></i>
        Subscription Plans
      </h5>
      <span className="badge bg-primary">
        {plans.length} {plans.length === 1 ? "Plan" : "Plans"}
      </span>
    </div>
  </div>

  <div className="card-body pt-0">
    {plans.length > 0 ? (
      <div className="row g-3">
        {plans.map((plan, index) => (
          <div key={index} className="col-12">
            <div
              className={`p-3 border rounded ${
                plan.serviceChoice === "free" ? "bg-light" : "bg-primary-light"
              }`}
            >
              {/* Header */}
              <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-2 gap-2">
                <div>
                  <h6 className="mb-0 fw-bold">
                    <span
                      className={`badge me-2 ${
                        plan.serviceChoice === "free"
                          ? "bg-info"
                          : "bg-success"
                      }`}
                    >
                      {plan.serviceChoice === "free"
                        ? "Free Plan"
                        : "Premium Plan"}
                    </span>
                    Plan #{index + 1}
                  </h6>
                  <small className="text-muted">
                    {formatDate(plan.startDate)} to {formatDate(plan.endDate)}
                  </small>
                </div>
                <span
                  className={`badge ${
                    plan.status === "active"
                      ? "bg-success"
                      : "bg-secondary"
                  }`}
                >
                  {plan.status}
                </span>
              </div>

              {/* Price & Preferences */}
              <div className="mt-3">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Delivery Preference:</span>
                  <span className="fw-medium text-capitalize">
                    {plan.deliveryPreference}
                  </span>
                </div>
                {plan.serviceChoice !== "free" && (
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Total Price:</span>
                    <span className="fw-bold">
                      {formatPrice(plan.totalPrice)}
                    </span>
                  </div>
                )}
              </div>

              {/* Service Categories */}
              {plan.freeOfferings?.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted small mb-1">Free Offerings:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {plan.freeOfferings.map((service, i) => (
                      <span key={i} className="badge bg-info">
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {plan.individualBusinessServices?.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted small mb-1">
                    Individual Business Services:
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {plan.individualBusinessServices.map((service, i) => (
                      <span key={i} className="badge bg-primary">
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {plan.businessServices?.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted small mb-1">Business Services:</p>
                  <div className="d-flex flex-wrap gap-2">
                    {plan.businessServices.map((service, i) => (
                      <span key={i} className="badge bg-warning text-dark">
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {plan.institutionalServices?.length > 0 && (
                <div className="mt-3">
                  <p className="text-muted small mb-1">
                    Institutional Services:
                  </p>
                  <div className="d-flex flex-wrap gap-2">
                    {plan.institutionalServices.map((service, i) => (
                      <span key={i} className="badge bg-danger">
                        {service.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div className="text-center py-4">
        <i className="ti ti-alert-circle fs-5 text-muted me-2"></i>
        <span className="text-muted">No subscription plans found</span>
      </div>
    )}
  </div>
</div>

              </div>

              {/* Right Column */}
              <div className="col-lg-4">
                {/* Account Details */}
                <div className="card mb-4 border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0 py-3">
                    <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                      <i className="ti ti-user-circle me-2 text-primary"></i>
                      Account Details
                    </h5>
                  </div>
                  <div className="card-body pt-0">
                    <div className="mb-3">
                      <label className="form-label small mb-1">
                        Verification Status
                      </label>
                      <div className="fw-medium">
                        {getStatusBadge(userData.adminVerified)}
                        
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small mb-1">
                        Account Type
                      </label>
                      <p className="fw-medium text-capitalize">
                        {userData.role}
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small mb-1">
                        Member Since
                      </label>
                      <p className="fw-medium">
                        {formatDateTime(userData.createdAt)}
                      </p>
                    </div>
                    <div className="mb-3">
                      <label className="form-label small mb-1">
                        Last Updated
                      </label>
                      <p className="fw-medium">
                        {formatDateTime(userData.updatedAt)}
                      </p>
                    </div>
                    
                  </div>
                </div>

                {/* System Information */}
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0 py-3">
                    <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                      <i className="ti ti-device-desktop me-2 text-primary"></i>
                      System Information
                    </h5>
                  </div>
                  <div className="card-body pt-0">
                    <div className="mb-3">
                      <label className="form-label small mb-1">
                        User ID
                      </label>
                      <p className="fw-medium font-monospace small">
                        {userData._id}
                      </p>
                    </div>
                    
                    <div className="mb-3">
                      <label className="form-label small mb-1">
                        Last Login
                      </label>
                      <p className="fw-medium">
                        {formatDateTime(userData.updatedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
