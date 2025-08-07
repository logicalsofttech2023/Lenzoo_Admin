import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";

const CouponList = () => {
  const { t } = useTranslation();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentCoupon, setCurrentCoupon] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [currentViewCoupon, setCurrentViewCoupon] = useState(null);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllCoupons`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });

      if (response.data.success) {
        setCoupons(response.data.coupons);
        setTotalPages(response.data.totalPages);
        setTotalItems(response.data.totalItems);
      } else {
        setError(response.data.message || t("failed_fetch_coupons"));
      }
    } catch (error) {
      console.error(t("error_fetching_coupons"), error);
      setError(t("error_fetching_coupons_message"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleEdit = (id) => {
    navigate(`/editCoupon`, { state: { id } });
  };

  const handleView = (coupon) => {
    setCurrentViewCoupon(coupon);
    setViewModalIsOpen(true);
  };

  const handleDelete = (coupon) => {
    setCurrentCoupon(coupon);
    setDeleteModalIsOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.get(
        `${base_url}deleteCoupon?id=${currentCoupon._id}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: t("success"),
          text: response.data.message || t("coupon_deleted_success"),
          timer: 2000,
          showConfirmButton: false,
        });
        setDeleteModalIsOpen(false);
        // Refresh data
        const updatedCoupons = coupons.filter(
          (item) => item._id !== currentCoupon._id
        );
        setCoupons(updatedCoupons);
        setTotalItems(totalItems - 1);
      } else {
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: response.data.message || t("failed_delete_coupon"),
        });
      }
    } catch (error) {
      console.error(t("error_deleting_coupon"), error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("error_deleting_coupon_message"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = () => {
    navigate("/addCoupon");
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "short", day: "numeric" };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (error) {
    return (
      <div className="main-wrapper">
        <div className="content">
          <div className="alert alert-danger mt-3">{error}</div>
        </div>
      </div>
    );
  }

  // Modal styles
  const customStyles = {
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "500px",
      width: "90%",
      borderRadius: "10px",
    },
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
  };

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">{t("coupons")}</h4>
              <h6>{t("manage_coupons")}</h6>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <form className="input-group w-auto">
                <style>
                  {`
                  .btn-dark-orange {
                    background-color:rgba(235, 104, 17, 0.85);
                    color: white;
                  }
                  .btn-dark-orange:hover {
                    background-color:rgb(203, 89, 13);
                    color: white;
                  }
                `}
                </style>

                <input
                  type="text"
                  className="form-control rounded-start-pill"
                  placeholder={t("search_coupon_placeholder")}
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </form>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={handleAdd}
            >
              <FiPlus style={{ marginRight: "5px" }} />
              {t("add_coupon")}
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>{t("code")}</th>
                    <th>{t("discount_type")}</th>
                    <th>{t("discount_value")}</th>
                    <th>{t("expiry_date")}</th>
                    <th>{t("visibility")}</th>
                    <th>{t("assigned_users")}</th>
                    <th>{t("max_usage")}</th>
                    <th>{t("usage_count")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="10" className="py-5">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            minHeight: "150px",
                          }}
                        >
                          <ColorRing
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={[
                              "#e15b64",
                              "#f47e60",
                              "#f8b26a",
                              "#abbd81",
                              "#849b87",
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : coupons.length > 0 ? (
                    coupons.map((coupon, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          <strong>{coupon.code}</strong>
                        </td>
                        <td>{coupon.discountType}</td>
                        <td>
                          {coupon.discountType === "percentage"
                            ? `${coupon.discountValue}%`
                            : `₹${coupon.discountValue}`}
                        </td>
                        <td>{formatDate(coupon.expiryDate)}</td>
                        <td>
                          <span
                            className={`badge ${
                              coupon.isPublic ? "bg-success" : "bg-info"
                            }`}
                          >
                            {coupon.isPublic ? t("public") : t("private")}
                          </span>
                        </td>
                        <td>
                          {coupon.isPublic
                            ? t("all_users")
                            : coupon.assignedUsers?.length || 0}
                        </td>
                        <td>{coupon.maxUsage}</td>
                        <td>{coupon.usageCount || 0}</td>
                        <td>
                          <div className="edit-delete-action d-flex align-items-center">
                            <button
                              className="me-2 p-2 d-flex align-items-center border rounded"
                              onClick={() => handleEdit(coupon._id)}
                            >
                              <FiEdit style={{ marginRight: "5px" }} />
                              {t("edit")}
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-danger"
                              onClick={() => handleDelete(coupon)}
                            >
                              <FiTrash2 style={{ marginRight: "5px" }} />
                              {t("delete")}
                            </button>
                            <button
                              className="ms-2 p-2 d-flex align-items-center border rounded"
                              onClick={() => handleView(coupon)}
                            >
                              <FiEye style={{ marginRight: "5px" }} />
                              {t("view")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="10" className="text-center py-4">
                        {t("no_coupons_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container p-3 d-flex justify-content-between align-items-center">
              <div className="showing-count">
                {t("showing_entries", {
                  start: (currentPage - 1) * itemsPerPage + 1,
                  end: Math.min(currentPage * itemsPerPage, totalItems),
                  total: totalItems,
                })}
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      {t("previous")}
                    </button>
                  </li>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      {t("next")}
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        style={customStyles}
        contentLabel={t("confirm_delete")}
      >
        <div className="modal-header">
          <h5 className="modal-title">{t("confirm_delete")}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setDeleteModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            {t("confirm_delete_message")} <strong>{currentCoupon?.code}</strong>
            ? {t("action_cannot_undone")}
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteModalIsOpen(false)}
            disabled={isSubmitting}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={confirmDelete}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Loading...</span>
                {t("deleting")}
              </>
            ) : (
              t("delete")
            )}
          </button>
        </div>
      </Modal>
      
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={() => setViewModalIsOpen(false)}
        style={customStyles}
        contentLabel={t("coupon_details")}
      >
        <div className="modal-header">
          <h5 className="modal-title">{t("coupon_details")}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setViewModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {currentViewCoupon && (
            <div className="row">
              <div className="col-md-6">
                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("code")}</h6>
                  <p>{currentViewCoupon.code}</p>
                </div>

                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("discount_type")}</h6>
                  <p>{currentViewCoupon.discountType}</p>
                </div>

                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("discount_value")}</h6>
                  <p>
                    {currentViewCoupon.discountType === "percentage"
                      ? `${currentViewCoupon.discountValue}%`
                      : `₹${currentViewCoupon.discountValue}`}
                  </p>
                </div>

                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("expiry_date")}</h6>
                  <p>{formatDate(currentViewCoupon.expiryDate)}</p>
                </div>
              </div>

              <div className="col-md-6">
                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("visibility")}</h6>
                  <p>
                    <span
                      className={`badge ${
                        currentViewCoupon.isPublic ? "bg-success" : "bg-info"
                      }`}
                    >
                      {currentViewCoupon.isPublic ? t("public") : t("private")}
                    </span>
                  </p>
                </div>

                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("max_usage")}</h6>
                  <p>{currentViewCoupon.maxUsage}</p>
                </div>

                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("usage_count")}</h6>
                  <p>{currentViewCoupon.usageCount || 0}</p>
                </div>

                <div className="detail-item mb-3">
                  <h6 className="text-muted">{t("created_at")}</h6>
                  <p>{formatDate(currentViewCoupon.createdAt)}</p>
                </div>
              </div>

              {currentViewCoupon.usedBy?.length > 0 && (
                <div className="col-12 mt-3">
                  <h6 className="text-muted">{t("used_by")}</h6>
                  <div className="table-responsive">
                    <table className="table table-sm">
                      <thead>
                        <tr>
                          <th>{t("name")}</th>
                          <th>{t("phone")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentViewCoupon.usedBy.map((user, index) => (
                          <tr key={index}>
                            <td>
                              {user.firstName} {user.lastName}
                            </td>
                            <td>{user.phone}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {!currentViewCoupon.isPublic &&
                currentViewCoupon.assignedUsers?.length > 0 && (
                  <div className="col-12 mt-3">
                    <h6 className="text-muted">{t("assigned_users")}</h6>
                    <div className="table-responsive">
                      <table className="table table-sm">
                        <thead>
                          <tr>
                            <th>{t("name")}</th>
                            <th>{t("phone")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {currentViewCoupon.assignedUsers.map(
                            (user, index) => (
                              <tr key={index}>
                                <td>
                                  {user.firstName} {user.lastName}
                                </td>
                                <td>{user.phone}</td>
                              </tr>
                            )
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setViewModalIsOpen(false)}
          >
            {t("close")}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default CouponList;
