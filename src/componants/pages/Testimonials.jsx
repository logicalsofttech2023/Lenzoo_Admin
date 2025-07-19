import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiPlus,
  FiArrowUp,
  FiArrowDown,
} from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";

const Testimonials = () => {
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
  const [currentTestimonial, setCurrentTestimonial] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [addImagePreview, setAddImagePreview] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    role: "",
    message: "",
    index: 0,
    image: null,
  });

  const [addFormData, setAddFormData] = useState({
    name: "",
    role: "",
    message: "",
    index: 0,
    image: null,
  });

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllTestimonials`, {
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
        setError(response.data.message || "Failed to fetch testimonials");
      }
    } catch (error) {
      console.error("Error fetching testimonials:", error);
      setError("Error fetching testimonials. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  const handleEdit = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setFormData({
      name: testimonial.name,
      role: testimonial.role,
      message: testimonial.message,
      index: testimonial.index,
      image: null,
    });
    setImagePreview(
      testimonial.image ? `${file_url}${testimonial.image}` : null
    );
    setEditModalIsOpen(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("role", formData.role);
      formDataToSend.append("message", formData.message);
      formDataToSend.append("index", formData.index);
      if (formData.image) {
        formDataToSend.append("image", formData.image);
      }

      const response = await axios.post(
        `${base_url}updateTestimonial?id=${currentTestimonial._id}`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Testimonial updated successfully",
          showConfirmButton: true,
        });
        setEditModalIsOpen(false);
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to update testimonial",
        });
      }
    } catch (error) {
      console.error("Error updating testimonial:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while updating testimonial",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (testimonial) => {
    setCurrentTestimonial(testimonial);
    setDeleteModalIsOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.get(
        `${base_url}deleteTestimonial?id=${currentTestimonial._id}`,
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
          text: response.data.message || "Testimonial deleted successfully",
          showConfirmButton: true,
        });
        setDeleteModalIsOpen(false);
        // Refresh data
        const updatedData = data.filter(
          (item) => item._id !== currentTestimonial._id
        );
        setData(updatedData);
        setTotalData(totalData - 1);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to delete testimonial",
        });
      }
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting testimonial",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = () => {
    setAddFormData({
      name: "",
      role: "",
      message: "",
      index: 0,
      image: null,
    });
    setAddImagePreview(null);
    setAddModalIsOpen(true);
  };

  const handleAddSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("name", addFormData.name);
      formDataToSend.append("role", addFormData.role);
      formDataToSend.append("message", addFormData.message);
      formDataToSend.append("index", addFormData.index);
      if (addFormData.image) {
        formDataToSend.append("image", addFormData.image);
      }

      const response = await axios.post(
        `${base_url}addTestimonial`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: response.data.message || "Testimonial added successfully",
          showConfirmButton: true,
        });
        setAddModalIsOpen(false);
        setCurrentPage(1);
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to add testimonial",
        });
      }
    } catch (error) {
      console.error("Error adding testimonial:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          error.response?.data?.message ||
          "An error occurred while adding testimonial",
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

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, image: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleAddImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAddFormData((prev) => ({ ...prev, image: file }));
      setAddImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  // Add these new functions to your component
  const handleIndexChange = (e, id) => {
    const newIndex = parseInt(e.target.value);
    if (!isNaN(newIndex)) {
      // Update local state immediately for responsive UI
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, index: newIndex } : item
        )
      );
    }
  };

  const validateIndex = async (e, id, oldIndex) => {
    const newIndex = parseInt(e.target.value);

    if (isNaN(newIndex) || newIndex < 0) {
      // Reset to old value if invalid
      setData((prevData) =>
        prevData.map((item) =>
          item._id === id ? { ...item, index: oldIndex } : item
        )
      );
      return;
    }

    // Only call API if the value actually changed
    if (newIndex !== oldIndex) {
      try {
        await updateTestimonialIndex(id, newIndex);
        // Show success feedback
        Swal.fire({
          icon: "success",
          title: "Order updated",
          text: "Testimonial order has been updated successfully",
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        // Revert if API call fails
        setData((prevData) =>
          prevData.map((item) =>
            item._id === id ? { ...item, index: oldIndex } : item
          )
        );
        Swal.fire({
          icon: "error",
          title: "Error",
          text: "Failed to update testimonial order",
        });
      }
    }
  };

  // Updated updateTestimonialIndex function
  const updateTestimonialIndex = async (id, newIndex) => {
    try {
      const response = await axios.post(
        `${base_url}updateTestimonialIndex`,
        { id, index: newIndex },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status !== 200) {
        throw new Error(response.data.message || "Failed to update order");
      }

      // Refresh data to ensure consistency
      fetchData();
    } catch (error) {
      console.error("Error updating testimonial index:", error);
      throw error; // Re-throw for the validateIndex function
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
      top: "55%",
      left: "55%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "600px",
      width: "90%",
      borderRadius: "10px",
      height: "70vh",
      overflow: "auto",
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
              <h4 className="fw-bold">Testimonials</h4>
              <h6>Manage your testimonials</h6>
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
                  placeholder="Search by name or role..."
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
              Add Testimonial
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Role</th>
                    <th>Message</th>
                    <th>Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="7" className="py-5">
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
                    data.map((testimonial, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          {testimonial.image && (
                            <img
                              src={`${file_url}${testimonial.image}`}
                              alt={testimonial.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                                borderRadius: "50%",
                              }}
                            />
                          )}
                        </td>
                        <td>{testimonial.name}</td>
                        <td>{testimonial.role}</td>
                        <td
                          style={{
                            maxWidth: "200px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {testimonial.message}
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <input
                              type="number"
                              className="form-control form-control-sm text-center"
                              style={{ width: "60px" }}
                              value={testimonial.index}
                              min="0"
                              onChange={(e) =>
                                handleIndexChange(e, testimonial._id)
                              }
                              onBlur={(e) =>
                                validateIndex(
                                  e,
                                  testimonial._id,
                                  testimonial.index
                                )
                              }
                            />
                          </div>
                        </td>
                        <td className="d-flex">
                          <div className="edit-delete-action d-flex align-items-center">
                            <button
                              className="me-2 p-2 d-flex align-items-center border rounded"
                              onClick={() => handleEdit(testimonial)}
                            >
                              <FiEdit style={{ marginRight: "5px" }} />
                              Edit
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-danger"
                              onClick={() => handleDelete(testimonial)}
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
                      <td colSpan="7" className="text-center py-4">
                        No testimonials found.
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
        contentLabel="View Testimonial"
      >
        <div className="modal-header">
          <h5 className="modal-title">Testimonial Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setViewModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {currentTestimonial && (
            <div>
              <div className="mb-3 text-center">
                {currentTestimonial.image && (
                  <img
                    src={`${file_url}${currentTestimonial.image}`}
                    alt={currentTestimonial.name}
                    style={{
                      maxWidth: "100%",
                      maxHeight: "200px",
                      borderRadius: "5px",
                    }}
                  />
                )}
              </div>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <p className="form-control-static">{currentTestimonial.name}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Role</label>
                <p className="form-control-static">{currentTestimonial.role}</p>
              </div>
              <div className="mb-3">
                <label className="form-label">Message</label>
                <p className="form-control-static">
                  {currentTestimonial.message}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label">Display Order</label>
                <p className="form-control-static">
                  {currentTestimonial.index}
                </p>
              </div>
              <div className="mb-3">
                <label className="form-label">ID</label>
                <p className="form-control-static">{currentTestimonial._id}</p>
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
        contentLabel="Edit Testimonial"
      >
        <div className="modal-header">
          <h5 className="modal-title">Edit Testimonial</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setEditModalIsOpen(false)}
          ></button>
        </div>
        <form onSubmit={handleUpdate}>
          <div className="modal-body">
            {currentTestimonial && (
              <div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={handleImageChange}
                  />
                  {imagePreview && (
                    <div className="mt-2">
                      <img
                        src={imagePreview}
                        alt="Preview"
                        style={{ maxWidth: "100%", maxHeight: "150px" }}
                      />
                    </div>
                  )}
                </div>
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
                <div className="mb-3">
                  <label className="form-label">Role</label>
                  <input
                    type="text"
                    className="form-control"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Message</label>
                  <textarea
                    className="form-control"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="4"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Display Order</label>
                  <input
                    type="number"
                    className="form-control"
                    name="index"
                    value={formData.index}
                    onChange={handleInputChange}
                    required
                    min="0"
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
        contentLabel="Delete Testimonial"
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
            Are you sure you want to delete the testimonial{" "}
            <strong>{currentTestimonial?.name}</strong>? This action cannot be
            undone.
          </p>
          {currentTestimonial?.image && (
            <div className="text-center mt-3">
              <img
                src={`${file_url}${currentTestimonial.image}`}
                alt={currentTestimonial.name}
                style={{ maxWidth: "100%", maxHeight: "150px" }}
              />
            </div>
          )}
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
        contentLabel="Add Testimonial"
      >
        <div className="modal-header">
          <h5 className="modal-title">Add New Testimonial</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setAddModalIsOpen(false)}
          ></button>
        </div>
        <form onSubmit={handleAddSubmit}>
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={handleAddImageChange}
                required
              />
              {addImagePreview && (
                <div className="mt-2">
                  <img
                    src={addImagePreview}
                    alt="Preview"
                    style={{ maxWidth: "100%", maxHeight: "150px" }}
                  />
                </div>
              )}
            </div>
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
            <div className="mb-3">
              <label className="form-label">Role</label>
              <input
                type="text"
                className="form-control"
                name="role"
                value={addFormData.role}
                onChange={handleAddInputChange}
                required
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Message</label>
              <textarea
                className="form-control"
                name="message"
                value={addFormData.message}
                onChange={handleAddInputChange}
                required
                rows="4"
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Display Order</label>
              <input
                type="number"
                className="form-control"
                name="index"
                value={addFormData.index}
                onChange={handleAddInputChange}
                required
                min="0"
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
                "Add Testimonial"
              )}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Testimonials;
