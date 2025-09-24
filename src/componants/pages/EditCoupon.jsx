import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiSave, FiX } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import { useTranslation } from "react-i18next";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditCoupon = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Form state
  const [formData, setFormData] = useState({
    code: "",
    description: "",
    discountType: "percentage",
    discountValue: 10,
    expiryDate: new Date(new Date().setMonth(new Date().getMonth() + 3)),
    isPublic: false,
    assignedUsers: [],
    maxUsage: 100,
  });

  // Users list
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [loadingCoupon, setLoadingCoupon] = useState(true);

  // Error state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  // Get coupon ID from location state
  const couponId = location.state?.id;

  // Fetch coupon data and users list
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoadingCoupon(true);
        setLoadingUsers(true);

        // Fetch coupon data
        if (couponId) {
          const couponResponse = await axios.get(`${base_url}getCouponById`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: { id: couponId },
          });

          if (couponResponse.data.success) {
            const coupon = couponResponse.data.coupon;
            setFormData({
              code: coupon.code,
              description: coupon.description,
              discountType: coupon.discountType,
              discountValue: coupon.discountValue,
              expiryDate: new Date(coupon.expiryDate),
              isPublic: coupon.isPublic,
              assignedUsers: Array.isArray(coupon.assignedUsers)
                ? coupon.assignedUsers.map((user) =>
                    typeof user === "object" ? user._id : user
                  )
                : [],
              maxUsage: coupon.maxUsage,
            });
          }
        }

        // Fetch users list
        const usersResponse = await axios.get(`${base_url}getAllUsersList`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (usersResponse.data.success) {
          setUsers(usersResponse.data.users);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "Error",
          text: t("error_fetching_data"),
        }).then(() => {
          navigate("/couponList");
        });
      } finally {
        setLoadingCoupon(false);
        setLoadingUsers(false);
      }
    };

    if (couponId) {
      fetchData();
    } else {
      navigate("/couponList");
    }
  }, [base_url, couponId, navigate, t]);

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });

    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle date change
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      expiryDate: date,
    });
  };

  // Handle user selection
  const handleUserSelection = (userId, isChecked) => {
    let updatedUsers = [...formData.assignedUsers];

    if (isChecked) {
      updatedUsers.push(userId);
    } else {
      updatedUsers = updatedUsers.filter((id) => id !== userId);
    }

    setFormData({
      ...formData,
      assignedUsers: updatedUsers,
    });
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.code.trim()) newErrors.code = t("required_field");
    if (!formData.discountValue) newErrors.discountValue = t("required_field");
    if (
      formData.discountType === "percentage" &&
      formData.discountValue > 100
    ) {
      newErrors.discountValue = t("discount_percentage_error");
    }
    if (!formData.expiryDate) newErrors.expiryDate = t("required_field");
    if (new Date(formData.expiryDate) < new Date()) {
      newErrors.expiryDate = t("expiry_date_error");
    }
    if (!formData.isPublic && formData.assignedUsers.length === 0) {
      newErrors.assignedUsers = t("select_at_least_one_user");
    }
    if (!formData.maxUsage) newErrors.maxUsage = t("required_field");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const payload = {
        id: couponId,
        code: formData.code,
        description: formData.description,
        discountType: formData.discountType,
        discountValue: formData.discountValue,
        expiryDate: formData.expiryDate.toISOString(),
        isPublic: formData.isPublic,
        assignedUsers: formData.isPublic ? [] : formData.assignedUsers,
        maxUsage: formData.maxUsage,
      };

      const response = await axios.post(`${base_url}updateCoupon`, payload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: t("coupon_updated_success"),
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/couponList");
        });
      }
    } catch (error) {
      console.error("Error updating coupon:", error);
      let errorMessage = t("update_coupon_error");

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = t("validation_error");
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  if (loadingCoupon) {
    return (
      <div className="main-wrapper">
        <div className="content">
          <div
            className="d-flex justify-content-center align-items-center"
            style={{ height: "80vh" }}
          >
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">{t("edit_coupon")}</h4>
              <h6>{t("manage_coupons")}</h6>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Coupon Basic Info */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("code")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.code ? "is-invalid" : ""
                      }`}
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      placeholder={t("coupon_code_placeholder")}
                    />
                    {errors.code && (
                      <div className="invalid-feedback">{errors.code}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("description")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.description ? "is-invalid" : ""
                      }`}
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder={t("coupon_description_placeholder")}
                    />
                    {errors.description && (
                      <div className="invalid-feedback">{errors.description}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("discount_type")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="discountType"
                      value={formData.discountType}
                      onChange={handleChange}
                    >
                      <option value="percentage">Percentage</option>
                      <option value="fixed">Fixed Amount</option>
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("discount_value")}{" "}
                      <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <input
                        type="number"
                        className={`form-control ${
                          errors.discountValue ? "is-invalid" : ""
                        }`}
                        name="discountValue"
                        value={formData.discountValue}
                        onChange={handleChange}
                        min="0"
                        step={
                          formData.discountType === "percentage" ? "1" : "0.01"
                        }
                      />
                      <span className="input-group-text">
                        {formData.discountType === "percentage" ? "%" : "€"}
                      </span>
                      {errors.discountValue && (
                        <div className="invalid-feedback">
                          {errors.discountValue}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("expiry_date")} <span className="text-danger">*</span>
                    </label>
                    <DatePicker
                      selected={formData.expiryDate}
                      onChange={handleDateChange}
                      minDate={new Date()}
                      className={`form-control ${
                        errors.expiryDate ? "is-invalid" : ""
                      }`}
                      dateFormat="MMMM d, yyyy"
                    />
                    {errors.expiryDate && (
                      <div className="invalid-feedback">
                        {errors.expiryDate}
                      </div>
                    )}
                  </div>
                </div>

                {/* Coupon Settings */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("max_usage")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="number"
                      className={`form-control ${
                        errors.maxUsage ? "is-invalid" : ""
                      }`}
                      name="maxUsage"
                      value={formData.maxUsage}
                      onChange={handleChange}
                      min="1"
                    />
                    {errors.maxUsage && (
                      <div className="invalid-feedback">{errors.maxUsage}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <div className="form-check form-switch">
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id="isPublic"
                        name="isPublic"
                        checked={formData.isPublic}
                        onChange={handleChange}
                      />
                      <label className="form-check-label" htmlFor="isPublic">
                        {t("public_coupon")}
                      </label>
                    </div>
                    <small className="text-muted">
                      {t("public_coupon_description")}
                    </small>
                  </div>

                  {!formData.isPublic && (
                    <div className="form-group mb-3">
                      <label className="form-label">
                        {t("assign_to_users")}{" "}
                        <span className="text-danger">*</span>
                      </label>
                      <div
                        className={`user-selection-container ${
                          errors.assignedUsers ? "is-invalid" : ""
                        }`}
                        style={{
                          maxHeight: "200px",
                          overflowY: "auto",
                          border: "1px solid #ced4da",
                          borderRadius: "0.375rem",
                          padding: "10px",
                        }}
                      >
                        {loadingUsers ? (
                          <div className="text-center py-3">
                            <ColorRing
                              visible={true}
                              height="40"
                              width="40"
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
                        ) : users.length > 0 ? (
                          users.map((user) => (
                            <div key={user._id} className="form-check">
                              <input
                                className="form-check-input"
                                type="checkbox"
                                id={`user-${user._id}`}
                                checked={formData.assignedUsers.includes(
                                  user._id
                                )}
                                onChange={(e) =>
                                  handleUserSelection(
                                    user._id,
                                    e.target.checked
                                  )
                                }
                              />
                              <label
                                className="form-check-label"
                                htmlFor={`user-${user._id}`}
                              >
                                {user.firstName} {user.lastName}
                              </label>
                            </div>
                          ))
                        ) : (
                          <div className="text-muted">
                            {t("no_users_found")}
                          </div>
                        )}
                      </div>
                      {errors.assignedUsers && (
                        <div className="invalid-feedback d-block">
                          {errors.assignedUsers}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/couponList")}
                  disabled={loading}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ColorRing
                        visible={true}
                        height="20"
                        width="20"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper me-2"
                        colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
                      />
                      {t("updating")}
                    </>
                  ) : (
                    <>
                      <FiSave className="me-2" />
                      {t("update_coupon_button")}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditCoupon;
