import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit, FiPlus, FiUpload, FiX } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const EditCenter = () => {
  const { t } = useTranslation();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const centerId = location.state?.id;

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    city: "",
    state: "",
    pinCode: "",
    contactNumber: "",
    timeSlots: [],
    isActive: true,
    doctor: "",
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [newTimeSlot, setNewTimeSlot] = useState("");
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch center details
  const fetchCenterDetails = async (centerId) => {
    try {
      const response = await axios.get(`${base_url}getCenterById`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          id: centerId,
        },
      });
      if (response.status === 200) {
        setFormData(response.data.data);
      }
    } catch (error) {
      console.error(t("error_fetching_center_details"), error);
    }
  };

  useEffect(() => {
    fetchCenterDetails(centerId);
  }, []);

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle time slot input change
  const handleTimeSlotChange = (e) => {
    setNewTimeSlot(e.target.value);
  };

  // Add new time slot
  const addTimeSlot = () => {
    if (newTimeSlot.trim() === "") return;

    const timeSlotExists = formData.timeSlots.some(
      (slot) => slot.time === newTimeSlot
    );

    if (timeSlotExists) {
      Swal.fire({
        icon: "error",
        title: t("time_slot_exists"),
        text: t("time_slot_exists_text"),
      });
      return;
    }

    const newSlot = {
      time: newTimeSlot,
      status: "available",
    };

    setFormData({
      ...formData,
      timeSlots: [...formData.timeSlots, newSlot],
    });

    setNewTimeSlot("");
  };

  // Remove time slot
  const removeTimeSlot = (index) => {
    const updatedTimeSlots = [...formData.timeSlots];
    updatedTimeSlots.splice(index, 1);
    setFormData({
      ...formData,
      timeSlots: updatedTimeSlots,
    });
  };

  // Update time slot status
  const updateTimeSlotStatus = async (timeSlotId, newStatus) => {
    setStatusUpdateLoading(true);
    try {
      const response = await axios.post(
        `${base_url}updateTimeSlotStatus`,
        {
          centerId: centerId,
          time: formData.timeSlots.find((slot) => slot._id === timeSlotId).time,
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        // Update local state to reflect the change
        const updatedTimeSlots = formData.timeSlots.map((slot) => {
          if (slot._id === timeSlotId) {
            return { ...slot, status: newStatus };
          }
          return slot;
        });

        setFormData({
          ...formData,
          timeSlots: updatedTimeSlots,
        });

        Swal.fire({
          icon: "success",
          title: t("success"),
          text: t("time_slot_status_updated"),
          timer: 1500,
          showConfirmButton: false,
        });
      }
    } catch (error) {
      console.error(t("error_updating_time_slot"), error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("failed_update_time_slot"),
      });
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = t("center_name_required");
    if (!formData.location.trim()) newErrors.location = t("location_required");
    if (!formData.city.trim()) newErrors.city = t("city_required");
    if (!formData.state.trim()) newErrors.state = t("state_required");
    if (!formData.pinCode.trim()) newErrors.pinCode = t("pin_code_required");
    if (!formData.contactNumber.trim())
      newErrors.contactNumber = t("contact_number_required");
    if (formData.timeSlots.length === 0)
      newErrors.timeSlots = t("time_slots_required");
    if (!formData.doctor.trim()) newErrors.doctor = t("doctor_required");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const response = await axios.post(`${base_url}addCenter`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "application/json",
        },
        params: {
          id: centerId,
        },
      });

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: t("success"),
          text: t("center_updated_success"),
          showConfirmButton: true,
        }).then(() => {
          navigate("/centerList");
        });
      }
    } catch (error) {
      console.error(t("error_updating_center"), error);
      let errorMessage = t("failed_update_center");

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = t("validation_error");
        }
      }

      Swal.fire({
        icon: "error",
        title: t("error"),
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">{t("update_center")}</h4>
              <h6>{t("manage_your_centers")}</h6>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Center Basic Info */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("center_name")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={t("center_name_placeholder")}
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("doctor_name")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.doctor ? "is-invalid" : ""
                      }`}
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleChange}
                      placeholder={t("doctor_name_placeholder")}
                    />
                    {errors.doctor && (
                      <div className="invalid-feedback">{errors.doctor}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("location")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.location ? "is-invalid" : ""
                      }`}
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder={t("location_placeholder")}
                    />
                    {errors.location && (
                      <div className="invalid-feedback">{errors.location}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("city")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.city ? "is-invalid" : ""
                      }`}
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      placeholder={t("city_placeholder")}
                    />
                    {errors.city && (
                      <div className="invalid-feedback">{errors.city}</div>
                    )}
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("state")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.state ? "is-invalid" : ""
                      }`}
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      placeholder={t("state_placeholder")}
                    />
                    {errors.state && (
                      <div className="invalid-feedback">{errors.state}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("pin_code")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.pinCode ? "is-invalid" : ""
                      }`}
                      name="pinCode"
                      value={formData.pinCode}
                      onChange={handleChange}
                      placeholder={t("pin_code_placeholder")}
                    />
                    {errors.pinCode && (
                      <div className="invalid-feedback">{errors.pinCode}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("contact_number")} <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.contactNumber ? "is-invalid" : ""
                      }`}
                      name="contactNumber"
                      value={formData.contactNumber}
                      onChange={handleChange}
                      placeholder={t("contact_number_placeholder")}
                    />
                    {errors.contactNumber && (
                      <div className="invalid-feedback">
                        {errors.contactNumber}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Time Slots Section */}
              <div className="row mt-3">
                <div className="col-12">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      {t("time_slots")} <span className="text-danger">*</span>
                    </label>
                    {errors.timeSlots && (
                      <div className="text-danger mb-2">{errors.timeSlots}</div>
                    )}

                    <div className="d-flex gap-2 mb-3">
                      <input
                        type="text"
                        className="form-control"
                        value={newTimeSlot}
                        onChange={handleTimeSlotChange}
                        placeholder={t("time_slot_placeholder")}
                      />
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={addTimeSlot}
                      >
                        <FiPlus /> {t("add_slot")}
                      </button>
                    </div>

                    {formData.timeSlots?.length > 0 && (
                      <div className="time-slots-container">
                        <div className="table-responsive">
                          <table className="table table-bordered">
                            <thead>
                              <tr>
                                <th>{t("time_slot")}</th>
                                <th>{t("status")}</th>
                                <th>{t("actions")}</th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.timeSlots.map((slot, index) => (
                                <tr key={index}>
                                  <td>{slot.time}</td>
                                  <td>
                                    <select
                                      className={`form-select form-select-sm ${
                                        statusUpdateLoading ? "disabled" : ""
                                      }`}
                                      value={slot.status}
                                      onChange={(e) =>
                                        updateTimeSlotStatus(
                                          slot._id,
                                          e.target.value
                                        )
                                      }
                                      disabled={statusUpdateLoading}
                                    >
                                      <option value="available">
                                        {t("available")}
                                      </option>
                                      <option value="not_available">
                                        {t("unavailable")}
                                      </option>
                                    </select>
                                  </td>
                                  <td>
                                    <button
                                      type="button"
                                      className="btn btn-danger btn-sm"
                                      onClick={() => removeTimeSlot(index)}
                                      disabled={statusUpdateLoading}
                                    >
                                      <FiX />
                                    </button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/centerList")}
                  disabled={loading || statusUpdateLoading}
                >
                  {t("cancel")}
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading || statusUpdateLoading}
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
                    <>{t("updated")}</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .time-slots-container {
          border: 1px solid #dee2e6;
          border-radius: 8px;
          padding: 15px;
        }

        .badge {
          font-size: 0.8rem;
          padding: 0.35em 0.65em;
        }

        .form-select.disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
      `}</style>
    </div>
  );
};

export default EditCenter;