import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const Membership = () => {
  const { t } = useTranslation();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentMembership, setCurrentMembership] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [benefits, setBenefits] = useState([""]);

  // Form state
  const [formData, setFormData] = useState({
    title: "Basic",
    description: "",
    planType: "monthly",
    price: "",
    status: "active",
    isRecurring: true,
    durationInDays: 30,
    benefits: [""]
  });

  const fetchMemberships = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllMembership`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.status) {
        setMemberships(response.data.membership);
        setTotalCount(response.data.membership.length);
      } else {
        setError(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error fetching memberships:", error);
      setError(t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const fetchMembershipById = async (id) => {
    try {
      const response = await axios.get(`${base_url}getMembershipById`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        return response.data.membership;
      }
      return null;
    } catch (error) {
      console.error("Error fetching membership:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchMemberships();
  }, [page, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...benefits];
    newBenefits[index] = value;
    setBenefits(newBenefits);
    setFormData(prev => ({
      ...prev,
      benefits: newBenefits.filter(b => b.trim() !== "")
    }));
  };

  const addBenefitField = () => {
    setBenefits([...benefits, ""]);
  };

  const removeBenefitField = (index) => {
    const newBenefits = benefits.filter((_, i) => i !== index);
    setBenefits(newBenefits);
    setFormData(prev => ({
      ...prev,
      benefits: newBenefits.filter(b => b.trim() !== "")
    }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        `${base_url}addUpdateMembership`,
        {
          ...formData,
          benefits: formData.benefits.filter(b => b.trim() !== "")
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: t("success"),
          text: t("membershipAdded"),
          showConfirmButton: true,
        });
        resetForm();
        fetchMemberships();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error adding membership:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text:
          error.response?.data?.message ||
          t("errorOccurred"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentMembership) return;

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        membershipId: currentMembership._id,
        benefits: formData.benefits.filter(b => b.trim() !== "")
      };

      const response = await axios.post(
        `${base_url}addUpdateMembership`,
        payload,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: t("success"),
          text: t("membershipUpdated"),
          showConfirmButton: true,
        });
        resetForm();
        fetchMemberships();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text:
          error.response?.data?.message ||
          t("errorOccurred"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMembership = async (id) => {
    try {
      const result = await Swal.fire({
        title: t("deleteConfirmationTitle"),
        text: t("deleteConfirmationText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("deleteConfirmationConfirm"),
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${base_url}deleteMembership`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          Swal.fire(t("deletedSuccess"), t("membershipDeleted"), "success");
          fetchMemberships();
        }
      }
    } catch (error) {
      console.error("Error deleting membership:", error);
      Swal.fire(t("error"), t("failedToDelete"), "error");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "Basic",
      description: "",
      planType: "monthly",
      price: "",
      status: "active",
      isRecurring: true,
      durationInDays: 30,
      benefits: [""]
    });
    setBenefits([""]);
    setCurrentMembership(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const editMembership = async (membership) => {
    try {
      const membershipDetails = await fetchMembershipById(membership._id);
      if (membershipDetails) {
        setCurrentMembership(membershipDetails);
        const membershipBenefits = membershipDetails.benefits || [""];
        setFormData({
          title: membershipDetails.title,
          description: membershipDetails.description,
          planType: membershipDetails.planType,
          price: membershipDetails.price,
          status: membershipDetails.status,
          isRecurring: membershipDetails.isRecurring || true,
          durationInDays: membershipDetails.durationInDays || 
            (membershipDetails.planType === "monthly" ? 30 : 
             membershipDetails.planType === "6months" ? 180 : 365),
          benefits: membershipBenefits
        });
        setBenefits(membershipBenefits.length > 0 ? membershipBenefits : [""]);
        setIsEditing(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error loading membership details:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("failedToLoad"),
      });
    }
  };

  const updateDurationDays = (planType) => {
    let days;
    switch (planType) {
      case "monthly":
        days = 30;
        break;
      case "6months":
        days = 180;
        break;
      case "1year":
        days = 365;
        break;
      default:
        days = 30;
    }
    setFormData(prev => ({
      ...prev,
      durationInDays: days
    }));
  };

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">{t("membershipPlans")}</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FiPlus className="me-2" />
            {t("addNewMembership")}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={isEditing ? handleUpdate : handleCreate}
            className="mb-4"
          >
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("title")}</label>
                <select
                  className="form-select"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  required
                >
                  <option value="Basic">Basic</option>
                  <option value="Plus">Plus</option>
                  <option value="Premium">Premium</option>
                </select>
              </div>
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("description")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("description")}
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">{t("planType")}</label>
                <select
                  className="form-select"
                  name="planType"
                  value={formData.planType}
                  onChange={(e) => {
                    handleInputChange(e);
                    updateDurationDays(e.target.value);
                  }}
                  required
                >
                  <option value="monthly">{t("monthly")}</option>
                  <option value="6months">{t("6months")}</option>
                  <option value="1year">{t("1year")}</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">{t("price")}</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={t("price")}
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">{t("durationDays")}</label>
                <input
                  type="number"
                  className="form-control"
                  name="durationInDays"
                  value={formData.durationInDays}
                  onChange={handleInputChange}
                  required
                  disabled
                />
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{t("status")}</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">{t("active")}</option>
                  <option value="expired">{t("expired")}</option>
                </select>
              </div>

              <div className="col-md-6 mb-3 d-flex align-items-center">
                <div className="form-check">
                  <input
                    className="form-check-input"
                    type="checkbox"
                    name="isRecurring"
                    checked={formData.isRecurring}
                    onChange={handleCheckboxChange}
                    id="isRecurringCheck"
                  />
                  <label className="form-check-label" htmlFor="isRecurringCheck">
                    {t("recurringPayment")}
                  </label>
                </div>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">{t("benefits")}</label>
                {benefits.map((benefit, index) => (
                  <div key={index} className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder={`${t("benefits")} ${index + 1}`}
                    />
                    <button
                      type="button"
                      className="btn btn-outline-danger"
                      onClick={() => removeBenefitField(index)}
                    >
                      <FiX />
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-secondary"
                  onClick={addBenefitField}
                >
                  <FiPlus /> {t("addBenefit")}
                </button>
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditing
                    ? t("updating")
                    : t("creating")
                  : isEditing
                  ? t("updateMembership")
                  : t("createMembership")}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        )}

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={t("searchByTitle")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t("title")}</th>
                <th>{t("description")}</th>
                <th>{t("planType")}</th>
                <th>{t("price")}</th>
                <th>{t("duration")}</th>
                <th>{t("recurring")}</th>
                <th>{t("status")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" className="text-center py-5">
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
                  </td>
                </tr>
              ) : memberships.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4">
                    {t("noMembershipsFound")}
                  </td>
                </tr>
              ) : (
                memberships.map((membership) => (
                  <tr key={membership._id}>
                    <td>{membership.title}</td>
                    <td>{membership.description}</td>
                    <td>{t(membership.planType)}</td>
                    <td>€{membership.price}</td>
                    <td>{membership.durationInDays} {t("days")}</td>
                    <td>
                      {membership.isRecurring ? (
                        <span className="badge bg-success">{t("yes")}</span>
                      ) : (
                        <span className="badge bg-secondary">{t("no")}</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${membership.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                        {t(membership.status)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editMembership(membership)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteMembership(membership._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalCount > limit && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <p className="mb-0">
              {t("showing")} {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, totalCount)} {t("of")} {totalCount}
            </p>

            <div className="btn-group">
              <button
                className="btn btn-outline-primary"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                {t("previous")}
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={page * limit >= totalCount}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;