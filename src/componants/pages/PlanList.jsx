import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import feather from "feather-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";

const PlanList = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [plans, setPlans] = useState([]);
  const [serviceTypes, setServiceTypes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentPlan, setCurrentPlan] = useState(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    amount: "",
    discount: "",
    keyFeatures: "",
    duration: "",
    serviceTypeId: "",
    deliveryPreference: "",
    serviceChoice: ""
  });

  useEffect(() => {
    feather.replace();
    fetchPlans();
    fetchServiceTypes();
  }, []);

  const fetchPlans = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllPlansInAdmin`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setPlans(response.data.data);
      setLoading(false);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to fetch plans");
      setLoading(false);
    }
  };

  const fetchServiceTypes = async () => {
    try {
      const response = await axios.get(`${base_url}getServiceTypesInAdmin`,{
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      setServiceTypes(response.data.data);
    } catch (error) {
      console.error("Failed to fetch service types:", error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddPlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${base_url}addPlan`, formData);
      Swal.fire("Success!", "Plan added successfully", "success");
      setShowAddModal(false);
      fetchPlans();
      resetForm();
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.message || "Failed to add plan", "error");
    }
  };

  const handleEditPlan = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${base_url}updatePlan?id=${currentPlan._id}`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`
        }
      });
      Swal.fire("Success!", "Plan updated successfully", "success");
      setShowEditModal(false);
      fetchPlans();
      resetForm();
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.message || "Failed to update plan", "error");
    }
  };

  const handleDeletePlan = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!"
      });

      if (result.isConfirmed) {
        await axios.delete(`${base_url}deletePlan?id=${id}`);
        Swal.fire("Deleted!", "Plan has been deleted.", "success");
        fetchPlans();
      }
    } catch (error) {
      Swal.fire("Error!", error.response?.data?.message || "Failed to delete plan", "error");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      amount: "",
      discount: "",
      keyFeatures: "",
      duration: "",
      serviceTypeId: "",
      deliveryPreference: "",
      serviceChoice: ""
    });
  };

  const openEditModal = (plan) => {
    setCurrentPlan(plan);
    setFormData({
      title: plan.title,
      description: plan.description,
      amount: plan.amount,
      discount: plan.discount,
      keyFeatures: plan.keyFeatures.join(", "),
      duration: plan.duration,
      serviceTypeId: plan.serviceTypeId,
      deliveryPreference: plan.deliveryPreference,
      serviceChoice: plan.serviceChoice
    });
    setShowEditModal(true);
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

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Plans</h4>
              <h6>Manage your Plans</h6>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="card-title mb-0">
              <h5 className="mb-0">Plans List</h5>
            </div>
            <div className="gap-1 d-flex">
              <button
                className="btn btn-primary"
                onClick={() => setShowAddModal(true)}
              >
                <FiPlus className="feather-plus" /> Add Plan
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            {loading ? (
              <div className="d-flex justify-content-center my-5">
                <ColorRing
                  visible={true}
                  height="80"
                  width="80"
                  ariaLabel="blocks-loading"
                  colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
                />
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-center table-hover datatable">
                  <thead className="thead-light">
                    <tr>
                      <th>Title</th>
                      <th>Service Type</th>
                      <th>Amount</th>
                      <th>Discount</th>
                      <th>Duration</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {plans?.length > 0 ? (
                      plans?.map((plan) => (
                        <tr key={plan._id}>
                          <td>{plan.title}</td>
                          <td>
                            {serviceTypes.find(st => st._id === plan.serviceTypeId)?.name || "N/A"}
                          </td>
                          <td>${plan.amount}</td>
                          <td>{plan.discount}%</td>
                          <td>{plan.duration}</td>
                          <td>
                            <div className="d-flex gap-1">
                              <button
                                className="btn btn-sm btn-secondary"
                                onClick={() => navigate(`/plans/${plan._id}`)}
                              >
                                <FiEye size={14} />
                              </button>
                              <button
                                className="btn btn-sm btn-primary"
                                onClick={() => openEditModal(plan)}
                              >
                                <FiEdit size={14} />
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDeletePlan(plan._id)}
                              >
                                <FiTrash2 size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="6" className="text-center py-4">
                          No plans found
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add Plan Modal */}
      {showAddModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Add New Plan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowAddModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleAddPlan}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Key Features (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="keyFeatures"
                      value={formData.keyFeatures}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Service Type</label>
                    <select
                      className="form-select"
                      name="serviceTypeId"
                      value={formData.serviceTypeId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Service Type</option>
                      {serviceTypes.map((st) => (
                        <option key={st._id} value={st._id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Delivery Preference</label>
                    <input
                      type="text"
                      className="form-control"
                      name="deliveryPreference"
                      value={formData.deliveryPreference}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Service Choice</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceChoice"
                      value={formData.serviceChoice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        setShowAddModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Add Plan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Edit Plan Modal */}
      {showEditModal && (
        <div className="modal fade show" style={{ display: "block", backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Plan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => {
                    setShowEditModal(false);
                    resetForm();
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleEditPlan}>
                  <div className="mb-3">
                    <label className="form-label">Title</label>
                    <input
                      type="text"
                      className="form-control"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                    ></textarea>
                  </div>
                  <div className="row">
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Amount</label>
                      <input
                        type="number"
                        className="form-control"
                        name="amount"
                        value={formData.amount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="col-md-6 mb-3">
                      <label className="form-label">Discount (%)</label>
                      <input
                        type="number"
                        className="form-control"
                        name="discount"
                        value={formData.discount}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Key Features (comma separated)</label>
                    <input
                      type="text"
                      className="form-control"
                      name="keyFeatures"
                      value={formData.keyFeatures}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Duration</label>
                    <input
                      type="text"
                      className="form-control"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Service Type</label>
                    <select
                      className="form-select"
                      name="serviceTypeId"
                      value={formData.serviceTypeId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Service Type</option>
                      {serviceTypes.map((st) => (
                        <option key={st._id} value={st._id}>
                          {st.name}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Delivery Preference</label>
                    <input
                      type="text"
                      className="form-control"
                      name="deliveryPreference"
                      value={formData.deliveryPreference}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Service Choice</label>
                    <input
                      type="text"
                      className="form-control"
                      name="serviceChoice"
                      value={formData.serviceChoice}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="text-end">
                    <button
                      type="button"
                      className="btn btn-secondary me-2"
                      onClick={() => {
                        setShowEditModal(false);
                        resetForm();
                      }}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Update Plan
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanList;