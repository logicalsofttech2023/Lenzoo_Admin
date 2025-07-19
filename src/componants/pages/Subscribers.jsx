import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";

const Subscribers = () => {
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
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [statusModalIsOpen, setStatusModalIsOpen] = useState(false);
  const [currentSubscriber, setCurrentSubscriber] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newStatus, setNewStatus] = useState("Subscribed");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllSubscribers`, {
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
        setData(response.data.subscribers);
        setTotalPages(response.data.totalPages);
        setTotalData(response.data.totalData);
      } else {
        setError(response.data.message || "Failed to fetch subscribers");
      }
    } catch (error) {
      console.error("Error fetching subscribers:", error);
      setError("Error fetching subscribers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  const handleDelete = (subscriber) => {
    setCurrentSubscriber(subscriber);
    setDeleteModalIsOpen(true);
  };

  const handleUpdateStatus = (subscriber) => {
    setCurrentSubscriber(subscriber);
    setNewStatus(subscriber.status === "Subscribed" ? "Unsubscribed" : "Subscribed");
    setStatusModalIsOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}deleteSubscriber?id=${currentSubscriber._id}`,
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
          text: response.data.message || "Subscriber deleted successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setDeleteModalIsOpen(false);
        // Refresh data
        const updatedData = data.filter(
          (item) => item._id !== currentSubscriber._id
        );
        setData(updatedData);
        setTotalData(totalData - 1);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to delete Subscriber",
        });
      }
    } catch (error) {
      console.error("Error deleting Subscriber:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting Subscriber",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmUpdateStatus = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}updateNewsletterStatus`,
        {
          email: currentSubscriber.email,
          status: newStatus
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
          text: response.data.message || "Subscriber status updated successfully",
          showConfirmButton: true,
        });
        setStatusModalIsOpen(false);
        // Refresh data
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to update subscriber status",
        });
      }
    } catch (error) {
      console.error("Error updating subscriber status:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while updating subscriber status",
      });
    } finally {
      setIsSubmitting(false);
    }
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
              <h4 className="fw-bold">Newsletter Subscribers</h4>
              <h6>Manage your newsletter subscribers</h6>
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
                  placeholder="Search by email..."
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
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#Id</th>
                    <th>Email</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="4" className="py-5">
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
                    data.map((subscriber, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{subscriber.email}</td>
                        <td>
                          <span className={`badge ${subscriber.status === "Subscribed" ? "bg-success" : "bg-danger"}`}>
                            {subscriber.status}
                          </span>
                        </td>
                        <td className="d-flex">
                          <div className="edit-delete-action d-flex align-items-center gap-2">
                            <button
                              className="p-2 d-flex align-items-center border rounded"
                              onClick={() => handleUpdateStatus(subscriber)}
                              style={{
                                backgroundColor: subscriber.status === "Subscribed" ? "#dc3545" : "#28a745",
                                color: "white"
                              }}
                            >
                              {subscriber.status === "Subscribed" ? "Unsubscribe" : "Subscribe"}
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-danger"
                              onClick={() => handleDelete(subscriber)}
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
                      <td colSpan="4" className="text-center py-4">
                        No subscribers found.
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

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        style={customStyles}
        contentLabel="Delete Subscriber"
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
            Are you sure you want to delete the subscriber{" "}
            <strong>{currentSubscriber?.email}</strong>? This action cannot be
            undone.
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary m-2"
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

      {/* Update Status Modal */}
      <Modal
        isOpen={statusModalIsOpen}
        onRequestClose={() => setStatusModalIsOpen(false)}
        style={customStyles}
        contentLabel="Update Subscriber Status"
      >
        <div className="modal-header">
          <h5 className="modal-title">Confirm Status Update</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setStatusModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            Are you sure you want to change the status of{" "}
            <strong>{currentSubscriber?.email}</strong> to{" "}
            <strong>{newStatus}</strong>?
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary m-2"
            onClick={() => setStatusModalIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className={`btn ${newStatus === "Subscribed" ? "btn-success" : "btn-danger"}`}
            onClick={confirmUpdateStatus}
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
              `Set to ${newStatus}`
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Subscribers;