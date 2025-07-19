import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";

const Membership = () => {
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
        setError(response.data.message || "Failed to fetch memberships");
      }
    } catch (error) {
      console.error("Error fetching memberships:", error);
      setError("Error fetching memberships. Please try again later.");
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
          title: "Success",
          text: "Membership added successfully",
          showConfirmButton: true,
        });
        resetForm();
        fetchMemberships();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error adding membership:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while processing your request",
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
          title: "Success",
          text: "Membership updated successfully",
          showConfirmButton: true,
        });
        resetForm();
        fetchMemberships();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error updating membership:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while processing your request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteMembership = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.delete(`${base_url}deleteMembership`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.status === 200) {
          Swal.fire("Deleted!", "Membership has been deleted.", "success");
          fetchMemberships();
        }
      }
    } catch (error) {
      console.error("Error deleting membership:", error);
      Swal.fire("Error!", "Failed to delete membership.", "error");
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
        title: "Error",
        text: "Failed to load membership details. Please try again.",
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
          <h2 className="mb-0">Membership Plans</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FiPlus className="me-2" />
            Add New Membership
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={isEditing ? handleUpdate : handleCreate}
            className="mb-4"
          >
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">Title</label>
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
                <label className="form-label">Description</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Plan Type</label>
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
                  <option value="monthly">Monthly</option>
                  <option value="6months">6 Months</option>
                  <option value="1year">1 Year</option>
                </select>
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Price</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="Enter price"
                  min="0"
                  step="0.01"
                  required
                />
              </div>

              <div className="col-md-4 mb-3">
                <label className="form-label">Duration (Days)</label>
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
                <label className="form-label">Status</label>
                <select
                  className="form-select"
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="expired">Expired</option>
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
                    Recurring Payment
                  </label>
                </div>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">Benefits</label>
                {benefits.map((benefit, index) => (
                  <div key={index} className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder={`Benefit ${index + 1}`}
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
                  <FiPlus /> Add Benefit
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
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Membership"
                  : "Create Membership"}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search by title"
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
                <th>Title</th>
                <th>Description</th>
                <th>Plan Type</th>
                <th>Price</th>
                <th>Duration</th>
                <th>Recurring</th>
                <th>Status</th>
                <th>Actions</th>
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
                    No memberships found
                  </td>
                </tr>
              ) : (
                memberships.map((membership) => (
                  <tr key={membership._id}>
                    <td>{membership.title}</td>
                    <td>{membership.description}</td>
                    <td>{membership.planType}</td>
                    <td>₹{membership.price}</td>
                    <td>{membership.durationInDays} days</td>
                    <td>
                      {membership.isRecurring ? (
                        <span className="badge bg-success">Yes</span>
                      ) : (
                        <span className="badge bg-secondary">No</span>
                      )}
                    </td>
                    <td>
                      <span className={`badge ${membership.status === 'active' ? 'bg-success' : 'bg-warning'}`}>
                        {membership.status}
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
              Showing {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, totalCount)} of {totalCount}
            </p>

            <div className="btn-group">
              <button
                className="btn btn-outline-primary"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                Previous
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={page * limit >= totalCount}
                onClick={() => setPage((prev) => prev + 1)}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Membership;