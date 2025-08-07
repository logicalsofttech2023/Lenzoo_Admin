import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import { ColorRing } from "react-loader-spinner";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";

const OrderDetail = () => {
  const {t} = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const orderId = location.state.orderId;
  const [loading, setLoading] = useState(true);
  const [orderData, setOrderData] = useState(null);
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;
  const [isUpdate, setIsUpdate] = useState(false);

  const fetchOrderDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${base_url}getOrderById?orderId=${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      console.log(response.data);

      if (!response.data?.data) {
        throw new Error("No order data found");
      }

      setOrderData(response.data.data);
    } catch (error) {
      console.error("Error fetching order details:", error);
      toast.error(error.message || "Failed to fetch order details");
      //   navigate("/orders");
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (newStatus) => {
    try {
      setIsUpdate(true);
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

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Order status updated successfully",
          showConfirmButton: true,
        }).then(() => {
          fetchOrderDetails();
          setIsUpdate(false);
        });
      } else {
        throw new Error(
          response.data.message || "Failed to update order status"
        );
      }
    } catch (error) {
      console.error("Error updating order status:", error);
      setIsUpdate(false);
    }
  };

  useEffect(() => {
    if (!orderId) {
      toast.error("No order ID provided");
      //   navigate("/ordersList");
      return;
    }
    fetchOrderDetails();
  }, [orderId]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return isNaN(date.getTime())
      ? "Invalid Date"
      : date.toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        });
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

  if (!orderData) {
    return (
      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "100vh" }}
      >
        <div className="fs-5 text-danger">No order data found</div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex justify-content-between align-items-center w-100">
            <div className="page-title">
              <h4 className="fw-bold">{t("order_details")}</h4>
              <h6 className="text-muted">{t("view_and_manage")}</h6>
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
            {/* Order Summary */}
            <div className="row mb-4">
              <div className="col-md-7">
                <div className="card border-0 shadow-sm mb-3">
                  <div className="card-header bg-transparent border-0">
                    <h5 className="fw-bold mb-0">{t("order_information")}</h5>
                  </div>
                  <div className="card-body">
                    <div className="row">
                      <div className="col-6">
                        <p className="text-muted small mb-1">{t("order_id")}</p>
                        <p className="fw-bold">{orderData.orderId}</p>
                      </div>
                      <div className="col-6 text-end">
                        <p className="text-muted small mb-1">{t("order_date")}</p>
                        <p className="fw-bold">
                          {formatDate(orderData.createdAt)}
                        </p>
                      </div>
                      <div className="col-6">
                        <p className="text-muted small mb-1">{t("order_status")}</p>
                        <div className="d-flex align-items-center gap-2">
                          {getOrderStatusBadge(orderData.orderStatus)}

                          <select
                            className="form-select form-select-sm w-auto"
                            value={orderData.orderStatus}
                            onChange={(e) => updateOrderStatus(e.target.value)}
                            disabled={isUpdate} // disable while updating
                          >
                            <option value="placed">Placed</option>
                            <option value="processing">Processing</option>
                            <option value="shipped">Shipped</option>
                            <option value="delivered">Delivered</option>
                            <option value="cancelled">Cancelled</option>
                          </select>

                          {isUpdate && (
                            <div
                              className="spinner-border spinner-border-sm text-primary"
                              role="status"
                            >
                              <span className="visually-hidden">
                                {t("updating")}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="col-6 text-end">
                        <p className="text-muted small mb-1">{t("payment_status")}</p>
                        <p>{getPaymentStatusBadge(orderData.paymentStatus)}</p>
                      </div>
                      <div className="col-12">
                        <p className="text-muted small mb-1">{t("total_amount")}</p>
                        <h4 className="fw-bold text-primary">
                          {formatPrice(orderData.totalAmount)}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="col-md-5">
                <div className="card border-0 shadow-sm">
                  <div className="card-header bg-transparent border-0">
                    <h5 className="fw-bold mb-0">{t("shipping_information")}</h5>
                  </div>
                  <div className="card-body">
                    <div className="mb-2">
                      <p className="fw-bold mb-0">
                        {orderData.shippingAddress?.name}
                      </p>
                      <p className="text-muted small mb-1">
                        {orderData.shippingAddress?.addressType}
                      </p>
                    </div>

                    <p className="mb-1">{orderData.shippingAddress?.address}</p>
                    <p className="mb-1">{orderData.shippingAddress?.pincode}</p>
                    <div className="d-flex gap-3 mt-2">
                      <div>
                        <p className="text-muted small mb-1">{t("phone")}</p>
                        <p className="mb-0">
                          {orderData.shippingAddress?.phone}
                        </p>
                      </div>
                      <div>
                        <p className="text-muted small mb-1">{t("email")}</p>
                        <p className="mb-0">
                          {orderData.shippingAddress?.email}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-header bg-transparent border-0">
                <h5 className="fw-bold mb-0">{t("order_items")}</h5>
              </div>
              <div className="card-body">
                <div className="table-responsive">
                  <table className="table">
                    <thead>
                      <tr>
                        <th>{t("product")}</th>
                        <th>{t("price")}</th>
                        <th>{t("quantity")}</th>
                        <th>{t("subtotal")}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orderData.items.map((item) => (
                        <tr key={item._id}>
                          <td>
                            <div className="d-flex align-items-center gap-3">
                              <div
                                className="flex-shrink-0"
                                style={{ width: "60px", height: "60px" }}
                              >
                                <img
                                  src={`${file_url}${item.productId.images[0]}`}
                                  alt={item.productId.name}
                                  className="img-fluid rounded h-100 w-100"
                                  style={{ objectFit: "cover" }}
                                  onError={(e) =>
                                    (e.target.src =
                                      "/images/product-placeholder.png")
                                  }
                                />
                              </div>
                              <div>
                                <h6 className="mb-1 fw-bold">
                                  {item.productId.name}
                                </h6>
                                <div className="d-flex gap-2 flex-wrap">
                                  <span className="badge bg-light text-dark small">
                                    {item.productId.productType}
                                  </span>
                                  <span className="badge bg-light text-dark small">
                                    {item.productId.frameType}
                                  </span>
                                  <span className="badge bg-light text-dark small">
                                    {item.productId.frameShape}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td>{formatPrice(item.price)}</td>
                          <td>{item.quantity}</td>
                          <td className="fw-bold">
                            {formatPrice(item.price * item.quantity)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan="3" className="text-end fw-bold">
                          {t("total_amount")}
                        </td>
                        <td className="fw-bold text-primary">
                          {formatPrice(orderData.totalAmount)}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
            </div>

            {/* Product Details */}
            {orderData.items.map((item) => (
              <div key={item._id} className="card border-0 shadow-sm mb-4">
                <div className="card-header bg-transparent border-0">
                  <h5 className="fw-bold mb-0">Product Details</h5>
                </div>
                <div className="card-body">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="mb-3">
                        <img
                          src={`${file_url}${item.productId.images[0]}`}
                          alt={item.productId.name}
                          className="img-fluid rounded"
                          onError={(e) =>
                            (e.target.src = "/images/product-placeholder.png")
                          }
                        />
                      </div>
                    </div>
                    <div className="col-md-8">
                      <h4 className="fw-bold mb-3">{item.productId.name}</h4>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">
                              {t("original_price")}
                            </p>
                            <p className="text-decoration-line-through">
                              {formatPrice(item.productId.originalPrice)}
                            </p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">
                              {t("selling_price")}
                            </p>
                            <h5 className="text-danger">
                              {formatPrice(item.productId.sellingPrice)}
                            </h5>
                          </div>
                        </div>
                      </div>
                      <div className="row">
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">{t("frame_type")}</p>
                            <p>{item.productId.frameType}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">{t("frame_shape")}</p>
                            <p>{item.productId.frameShape}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">{t("frame_size")}</p>
                            <p>{item.productId.frameSize}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">
                              {t("suitable_for")}
                            </p>
                            <p>{item.productId.suitableFor.join(", ")}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">
                              {t("pupillary_distance")}
                            </p>
                            <p>{item.productId.pupillaryDistance}</p>
                          </div>
                        </div>
                        <div className="col-md-6">
                          <div className="mb-3">
                            <p className="text-muted small mb-1">{t("face_shape")}</p>
                            <p>{item.productId.faceShape}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;
