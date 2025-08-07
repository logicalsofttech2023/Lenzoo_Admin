import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { ColorRing } from "react-loader-spinner";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

const UserDetails = () => {
  const { t } = useTranslation();
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
        throw new Error(t("noUserDataFound"));
      }

      setUserData(response.data.user);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error(error.message || t("fetchUserDetailsError"));
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
        toast.success(t("orderStatusUpdated"));
        fetchUserDetails();
      } else {
        throw new Error(
          response.data.message || t("updateOrderStatusError")
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      toast.error(error.message || t("updateOrderStatusError"));
    }
  };

  useEffect(() => {
    if (!userId) {
      toast.error(t("noUserIdProvided"));
      navigate("/users");
      return;
    }
    fetchUserDetails();
  }, [userId]);

  const formatDate = (dateString) => {
    if (!dateString) return t("notAvailable");
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? t("invalidDate")
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
        return <span className="badge bg-primary">{t("placed")}</span>;
      case "processing":
        return <span className="badge bg-secondary">{t("processing")}</span>;
      case "shipped":
        return <span className="badge bg-info text-dark">{t("shipped")}</span>;
      case "delivered":
        return <span className="badge bg-success">{t("delivered")}</span>;
      case "cancelled":
        return <span className="badge bg-danger">{t("cancelled")}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case "paid":
        return <span className="badge bg-success">{t("paid")}</span>;
      case "pending":
        return <span className="badge bg-warning">{t("pending")}</span>;
      case "failed":
        return <span className="badge bg-danger">{t("failed")}</span>;
      case "refunded":
        return <span className="badge bg-info text-dark">{t("refunded")}</span>;
      default:
        return <span className="badge bg-secondary">{status}</span>;
    }
  };

  const getAppointmentStatusBadge = (status) => {
    switch (status) {
      case "confirmed":
        return <span className="badge bg-success">{t("confirmed")}</span>;
      case "pending":
        return <span className="badge bg-warning">{t("pending")}</span>;
      case "cancelled_by_user":
        return <span className="badge bg-danger">{t("cancelledByUser")}</span>;
      case "cancelled_by_center":
        return <span className="badge bg-danger">{t("cancelledByCenter")}</span>;
      case "completed":
        return <span className="badge bg-info text-dark">{t("completed")}</span>;
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
        <div className="fs-5 text-danger">{t("noUserDataFound")}</div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex justify-content-between align-items-center w-100">
            <div className="page-title">
              <h4 className="fw-bold">{t("userDetails")}</h4>
              <h6 className="text-muted">{t("manageUserInfo")}</h6>
            </div>
            <button
              onClick={() => navigate(-1)}
              className="btn btn-outline-secondary btn-sm"
            >
              <i className="ti ti-arrow-left me-1"></i> {t("back")}
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
                    alt={t("userProfile")}
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
                    <span>{userData.phone || t("notAvailable")}</span>
                  </div>
                </div>

                <div className="d-flex flex-wrap gap-3">
                  <div className="d-flex align-items-center text-muted">
                    <i className="ti ti-calendar me-2"></i>
                    <span>{t("joined")} {formatDate(userData.createdAt)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-12">
                {/* Appointments Section */}
                {userData.appointments?.length > 0 && (
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                          <i className="ti ti-calendar-event me-2 text-primary"></i>
                          {t("appointments")}
                        </h5>
                        <span className="badge bg-primary">
                          {userData.appointments.length}{" "}
                          {userData.appointments.length === 1
                            ? t("appointment")
                            : t("appointments")}
                        </span>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>{t("date")}</th>
                              <th>{t("timeSlot")}</th>
                              <th>{t("center")}</th>
                              <th>{t("status")}</th>
                              <th>{t("bookedOn")}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {userData.appointments.map((appointment) => (
                              <tr key={appointment._id}>
                                <td>{formatDate(appointment.date)}</td>
                                <td>{appointment.time}</td>
                                <td>{appointment.centerId?.name || t("notAvailable")}</td>
                                <td>
                                  {getAppointmentStatusBadge(
                                    appointment.status
                                  )}
                                </td>
                                <td>{formatDate(appointment.createdAt)}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* Orders Section */}
                {userData.orders?.length > 0 && (
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                          <i className="ti ti-shopping-cart me-2 text-primary"></i>
                          {t("orders")}
                        </h5>
                        <span className="badge bg-primary">
                          {userData.orders.length}{" "}
                          {userData.orders.length === 1 ? t("order") : t("orders")}
                        </span>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div className="table-responsive">
                        <table className="table table-hover">
                          <thead>
                            <tr>
                              <th>{t("orderId")}</th>
                              <th>{t("date")}</th>
                              <th>{t("amount")}</th>
                              <th>{t("status")}</th>
                              <th>{t("payment")}</th>
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
                                    <option value="placed">{t("placed")}</option>
                                    <option value="processing">
                                      {t("processing")}
                                    </option>
                                    <option value="shipped">{t("shipped")}</option>
                                    <option value="delivered">{t("delivered")}</option>
                                    <option value="cancelled">{t("cancelled")}</option>
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
                          {t("prescriptions")}
                        </h5>
                        <span className="badge bg-primary">
                          {userData.prescriptions.length}{" "}
                          {userData.prescriptions.length === 1
                            ? t("prescription")
                            : t("prescriptions")}
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
                                  {t("download")}
                                </a>
                              </div>
                              {prescription.notes && (
                                <div className="mb-2">
                                  <p className="small text-muted mb-1">
                                    {t("notes")}:
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
                          {t("favorites")}
                        </h5>
                        <span className="badge bg-primary">
                          {userData.favorites.length}{" "}
                          {userData.favorites.length === 1 ? t("item") : t("items")}
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

                {/* Eye Tests Section */}
                {userData.eyeTests?.length > 0 && (
                  <div className="card mb-4 border-0 shadow-sm">
                    <div className="card-header bg-transparent border-0 py-3">
                      <div className="d-flex justify-content-between align-items-center">
                        <h5 className="card-title mb-0 fw-bold d-flex align-items-center">
                          <i className="ti ti-eye me-2 text-primary"></i>
                          {t("eyeTests")}
                        </h5>
                        <span className="badge bg-primary">
                          {userData.eyeTests.length}{" "}
                          {userData.eyeTests.length === 1 ? t("test") : t("tests")}
                        </span>
                      </div>
                    </div>
                    <div className="card-body pt-0">
                      <div className="row g-3">
                        {userData.eyeTests.map((test) => (
                          <div key={test._id} className="col-md-12">
                            <div className="border rounded p-3">
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div>
                                  <h6 className="mb-1 fw-bold">
                                    {t("testDate")}: {formatDate(test.createdAt)}
                                  </h6>
                                  <div className="d-flex gap-2">
                                    <span
                                      className={`badge ${
                                        test.condition === "normal"
                                          ? "bg-success"
                                          : "bg-warning"
                                      }`}
                                    >
                                      {test.condition === "normal"
                                        ? t("normal")
                                        : t("needsAttention")}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              <div className="mb-3">
                                <h6 className="fw-bold mb-2">
                                  {t("recommendation")}:
                                </h6>
                                <p className="mb-0">{test.recommendation}</p>
                              </div>

                              <div className="row">
                                <div className="col-md-6">
                                  <h6 className="fw-bold text-center mb-3">
                                    {t("leftEye")}
                                  </h6>
                                  <div className="table-responsive">
                                    <table className="table table-bordered">
                                      <thead className="table-light">
                                        <tr>
                                          <th>{t("test")}</th>
                                          <th>{t("score")}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>{t("tumblingE")}</td>
                                          <td>
                                            {(
                                              test.features
                                                .tumbling_e_left_score * 100
                                            ).toFixed(1)}
                                            %
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("visualAcuity")}</td>
                                          <td>
                                            {test.features.visual_acuity_left.toFixed(
                                              1
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("contrast")}</td>
                                          <td>
                                            {test.features.contrast_left}%
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("colorVision")}</td>
                                          <td>
                                            {(
                                              test.features.color_vision_left *
                                              100
                                            ).toFixed(1)}
                                            %
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("astigmatism")}</td>
                                          <td>
                                            {test.features.astigmatism_left
                                              ? t("yes")
                                              : t("no")}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
                                </div>

                                <div className="col-md-6">
                                  <h6 className="fw-bold text-center mb-3">
                                    {t("rightEye")}
                                  </h6>
                                  <div className="table-responsive">
                                    <table className="table table-bordered">
                                      <thead className="table-light">
                                        <tr>
                                          <th>{t("test")}</th>
                                          <th>{t("score")}</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        <tr>
                                          <td>{t("tumblingE")}</td>
                                          <td>
                                            {(
                                              test.features
                                                .tumbling_e_right_score * 100
                                            ).toFixed(1)}
                                            %
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("visualAcuity")}</td>
                                          <td>
                                            {test.features.visual_acuity_right.toFixed(
                                              1
                                            )}
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("contrast")}</td>
                                          <td>
                                            {test.features.contrast_right}%
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("colorVision")}</td>
                                          <td>
                                            {(
                                              test.features.color_vision_right *
                                              100
                                            ).toFixed(1)}
                                            %
                                          </td>
                                        </tr>
                                        <tr>
                                          <td>{t("astigmatism")}</td>
                                          <td>
                                            {test.features.astigmatism_right
                                              ? t("yes")
                                              : t("no")}
                                          </td>
                                        </tr>
                                      </tbody>
                                    </table>
                                  </div>
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