import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";

const ServiceType = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [itemsPerPage] = useState(10);

  // Modal states
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [editModalIsOpen, setEditModalIsOpen] = useState(false);
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [addModalIsOpen, setAddModalIsOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
  });
  const [addFormData, setAddFormData] = useState({
    name: "",
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllServiceTypes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });

      if (response.status === 200) {
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalData(response.data.totalData);
      } else {
        setError(response.data.message || "Failed to fetch service type");
      }
    } catch (error) {
      console.error("Error fetching service type:", error);
      setError("Error fetching service type. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  

  const handleEdit = (service) => {
    setCurrentService(service);
    setFormData({
      name: service.name,
    });
    setEditModalIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}updateServiceType?id=${currentService._id}`,
        formData,
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
          text: response.data.message || "Service updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setEditModalIsOpen(false);
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to update service",
        });
      }
    } catch (error) {
      console.error("Error updating service:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating service",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (service) => {
    setCurrentService(service);
    setDeleteModalIsOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}deleteServiceType?id=${currentService._id}`,
        {},
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
          text: response.data.message || "Service deleted successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setDeleteModalIsOpen(false);
        // Refresh data
        const updatedData = data.filter(
          (item) => item._id !== currentService._id
        );
        setData(updatedData);
        setTotalData(totalData - 1);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to delete service",
        });
      }
    } catch (error) {
      console.error("Error deleting service:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting service",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = () => {
    setAddFormData({ name: "" });
    setAddModalIsOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}addServiceType`,
        addFormData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log(response);

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Service added successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setAddModalIsOpen(false);
        setCurrentPage(1);
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to add service",
        });
      }
    } catch (error) {
      console.error("Error adding service:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response.data.message ||
          "An error occurred while adding service",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddInputChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
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
              <h4 className="fw-bold">Service Type</h4>
              <h6>Manage your Service Type</h6>
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
                  placeholder="Search by name..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
                <button
                  className="btn btn-dark-orange rounded-end-pill"
                  type="button"
                >
                  <i className="ti ti-search"></i>
                </button>
              </form>
            </div>
            <button
              className="btn btn-primary d-flex align-items-center"
              onClick={handleAdd}
            >
              <FiPlus style={{ marginRight: "5px" }} />
              Add Service Type
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#Id</th>
                    <th>Name</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="3" className="py-5">
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
                  ) : data.length > 0 ? (
                    data.map((service, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{service.name}</td>
                        <td className="d-flex">
                          <div className="edit-delete-action d-flex align-items-center">
                            
                            <button
                              className="me-2 p-2 d-flex align-items-center border rounded"
                              onClick={() => handleEdit(service)}
                            >
                              <FiEdit style={{ marginRight: "5px" }} />
                              Edit
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-danger"
                              onClick={() => handleDelete(service)}
                            >
                              <FiTrash2 style={{ marginRight: "5px" }} />
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center py-4">
                        No service type found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container p-3 d-flex justify-content-between align-items-center">
              <div className="showing-count">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalData)} of {totalData}{" "}
                entries
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
                      Previous
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
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={() => setViewModalIsOpen(false)}
        style={customStyles}
        contentLabel="View Service Type"
      >
        <div className="modal-header">
          <h5 className="modal-title">Service Type Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setViewModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {currentService && (
            <div>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <p className="form-control-static">{currentService.name}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">ID</label>
                <p className="form-control-static">{currentService._id}</p>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setViewModalIsOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalIsOpen}
        onRequestClose={() => setEditModalIsOpen(false)}
        style={customStyles}
        contentLabel="Edit Service Type"
      >
        <div className="modal-header">
          <h5 className="modal-title">Edit Service Type</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setEditModalIsOpen(false)}
          ></button>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="modal-body">
            {currentService && (
              <div>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setEditModalIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
                  Updating...
                </>
              ) : (
                "Update"
              )}
            </button>
          </div>
        </form>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        style={customStyles}
        contentLabel="Delete Service Type"
      >
        <div className="modal-header">
          <h5 className="modal-title">Confirm Delete</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setDeleteModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to delete the service type{" "}
            <strong>{currentService?.name}</strong>? This action cannot be
            undone.
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteModalIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
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
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </Modal>

      {/* Add Modal */}
      <Modal
        isOpen={addModalIsOpen}
        onRequestClose={() => setAddModalIsOpen(false)}
        style={customStyles}
        contentLabel="Add Service Type"
      >
        <div className="modal-header">
          <h5 className="modal-title">Add New Service Type</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setAddModalIsOpen(false)}
          ></button>
        </div>
        <form onSubmit={handleAddSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={addFormData.name}
                onChange={handleAddInputChange}
                required
              />
            </div>
          </div>
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setAddModalIsOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
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
                  Adding...
                </>
              ) : (
                "Add Service Type"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ServiceType;
