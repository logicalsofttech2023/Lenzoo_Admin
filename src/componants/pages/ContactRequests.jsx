import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus, FiMail } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";

const ContactRequests = () => {
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
  const [replyModalIsOpen, setReplyModalIsOpen] = useState(false);
  const [viewReplyModalIsOpen, setViewReplyModalIsOpen] = useState(false);
  const [currentContact, setCurrentContact] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [replyMessage, setReplyMessage] = useState("");
  const adminName = localStorage.getItem("adminName") || "Admin";

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllContacts`, {
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
        setError(response.data.message || "Failed to fetch Contact Requests");
      }
    } catch (error) {
      console.error("Error fetching Contact Requests:", error);
      setError("Error fetching Contact Requests. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  const handleDelete = (contact) => {
    setCurrentContact(contact);
    setDeleteModalIsOpen(true);
  };

  const handleReply = (contact) => {
    setCurrentContact(contact);
    setReplyMessage("");
    setReplyModalIsOpen(true);
  };

  const handleViewReply = (contact) => {
    setCurrentContact(contact);
    setViewReplyModalIsOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}deleteContact?id=${currentContact._id}`,
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
          text: response.data.message || "Contact request deleted successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        setDeleteModalIsOpen(false);
        // Refresh data
        const updatedData = data.filter(
          (item) => item._id !== currentContact._id
        );
        setData(updatedData);
        setTotalData(totalData - 1);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to delete contact request",
        });
      }
    } catch (error) {
      console.error("Error deleting contact request:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while deleting contact request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const confirmReply = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}replyToContact`,
        {
          contactId: currentContact._id,
          reply: replyMessage,
          adminName: adminName,
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
          text: response.data.message || "Reply sent successfully",
          showConfirmButton: true,
        });
        setReplyModalIsOpen(false);
        // Refresh data
        fetchData();
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: response.data.message || "Failed to send reply",
        });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "An error occurred while sending reply",
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
      top: "55%",
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
              <h4 className="fw-bold">Contact Requests</h4>
              <h6>Manage your Contact Requests</h6>
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
                  @media (max-width: 768px) {
                    .action-buttons {
                      flex-direction: column;
                      gap: 5px;
                    }
                    .action-buttons button {
                      width: 100%;
                    }
                    .table-responsive {
                      overflow-x: auto;
                    }
                    .pagination-container {
                      flex-direction: column;
                      gap: 15px;
                    }
                    .modal-body textarea {
                      min-height: 150px;
                    }
                  }
                `}
                </style>

                <input
                  type="text"
                  className="form-control rounded-start-pill"
                  placeholder="Search by name or email..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1);
                  }}
                />
              </form>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#Id</th>
                    <th>Name</th>
                    <th>Phone</th>
                    <th>Email</th>
                    <th className="d-none d-md-table-cell">Message</th>
                    <th>Status</th>
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
                  ) : data?.length > 0 ? (
                    data?.map((contact, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>{contact.firstName}</td>
                        <td>{contact.phone}</td>
                        <td>{contact.email}</td>
                        <td className="d-none d-md-table-cell">
                          <div
                            className="text-truncate"
                            style={{ maxWidth: "200px" }}
                          >
                            {contact.message}
                          </div>
                        </td>
                        <td>
                          <span
                            className={`badge ${
                              contact.replied === "Replied"
                                ? "bg-success"
                                : "bg-warning"
                            }`}
                          >
                            {contact.replied === "Replied"
                              ? "Replied"
                              : "Pending"}
                          </span>
                        </td>

                        <td>
                          <div className="action-buttons d-flex flex-wrap gap-1">
                            {contact.replied === "Replied" ? (
                              <button
                                className="btn btn-sm btn-info d-flex align-items-center"
                                onClick={() => handleViewReply(contact)}
                              >
                                <FiEye className="me-1" />
                                <span className="d-none d-sm-inline">View Reply</span>
                              </button>
                            ) : (
                              <button
                                className="btn btn-sm btn-primary d-flex align-items-center"
                                onClick={() => handleReply(contact)}
                              >
                                <FiMail className="me-1" />
                                <span className="d-none d-sm-inline">Reply</span>
                              </button>
                            )}

                            <button
                              className="btn btn-sm btn-outline-danger d-flex align-items-center"
                              onClick={() => handleDelete(contact)}
                            >
                              <FiTrash2 className="me-1" />
                              <span className="d-none d-sm-inline">Delete</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No Contact Requests found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container p-3 d-flex flex-wrap justify-content-between align-items-center">
              <div className="showing-count mb-2 mb-md-0">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalData)} of {totalData}{" "}
                entries
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0 flex-wrap">
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
        contentLabel="Delete Contact Request"
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
            Are you sure you want to delete the contact request from{" "}
            <strong>{currentContact?.firstName}</strong>? This action cannot be
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

      {/* Reply Modal */}
      <Modal
        isOpen={replyModalIsOpen}
        onRequestClose={() => setReplyModalIsOpen(false)}
        style={customStyles}
        contentLabel="Reply to Contact Request"
        
      >
        <div className="modal-header">
          <h5 className="modal-title">Reply to Contact Request</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setReplyModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">From:</label>
            <input
              type="text"
              className="form-control"
              value={adminName}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">To:</label>
            <input
              type="text"
              className="form-control"
              value={currentContact?.email || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Original Message:</label>
            <textarea
              className="form-control"
              rows="3"
              value={currentContact?.message || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Your Reply:</label>
            <textarea
              className="form-control"
              rows="5"
              value={replyMessage}
              onChange={(e) => setReplyMessage(e.target.value)}
              placeholder="Type your reply here..."
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setReplyModalIsOpen(false)}
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={confirmReply}
            disabled={isSubmitting || !replyMessage.trim()}
          >
            {isSubmitting ? (
              <>
                <span
                  className="spinner-border spinner-border-sm"
                  role="status"
                  aria-hidden="true"
                ></span>
                <span className="visually-hidden">Loading...</span>
                Sending...
              </>
            ) : (
              "Send Reply"
            )}
          </button>
        </div>
      </Modal>

      {/* View Reply Modal */}
      <Modal
        isOpen={viewReplyModalIsOpen}
        onRequestClose={() => setViewReplyModalIsOpen(false)}
        style={customStyles}
        contentLabel="View Reply"

      >
        <div className="modal-header">
          <h5 className="modal-title">View Reply</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setViewReplyModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          <div className="mb-3">
            <label className="form-label">From:</label>
            <input
              type="text"
              className="form-control"
              value={currentContact?.repliedBy || "Admin"}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">To:</label>
            <input
              type="text"
              className="form-control"
              value={currentContact?.email || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Original Message:</label>
            <textarea
              className="form-control"
              rows="3"
              value={currentContact?.message || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Reply Sent:</label>
            <textarea
              className="form-control"
              rows="5"
              value={currentContact?.reply || ""}
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Replied At:</label>
            <input
              type="text"
              className="form-control"
              value={new Date(currentContact?.repliedAt).toLocaleString() || ""}
              readOnly
            />
          </div>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setViewReplyModalIsOpen(false)}
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ContactRequests;