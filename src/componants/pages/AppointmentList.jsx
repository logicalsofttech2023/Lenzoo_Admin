import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";

const AppointmentList = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalData, setTotalData] = useState(0);
  const [itemsPerPage] = useState(10);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [statusModalIsOpen, setStatusModalIsOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllAppointments`, {
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
        setTotalData(response.data.totalAppointments);
      } else {
        setError(response.data.message || "Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
      setError("Error fetching appointments. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  const handleView = (appointment) => {
    setCurrentData(appointment);
    setViewModalIsOpen(true);
  };

  const handleStatusChange = (appointment) => {
    setCurrentData(appointment);
    setSelectedStatus(appointment.status);
    setStatusModalIsOpen(true);
  };

  const updateAppointmentStatus = async () => {
    try {
      const response = await axios.post(
        `${base_url}updateAppointmentStatus`,
        {
          id: currentData._id,
          status: selectedStatus,
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
          title: "Success!",
          text: "Appointment status updated successfully",
        });
        fetchData();
        setStatusModalIsOpen(false);
      } else {
        Swal.fire({
          icon: "error",
          title: "Error!",
          text: response.data.message || "Failed to update appointment status",
        });
      }
    } catch (error) {
      console.error("Error updating appointment status:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Error updating appointment status. Please try again later.",
      });
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case "booked":
        return "bg-primary";
      case "completed":
        return "bg-success";
      case "cancelled_by_user":
      case "cancelled_by_admin":
        return "bg-danger";
      case "rescheduled":
        return "bg-warning";
      default:
        return "bg-secondary";
    }
  };

  const getStatusDisplayText = (status) => {
    return status
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
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

  const viewModalStyles = {
    content: {
      top: "50%",
      left: "60%",
      right: "auto",
      bottom: "auto",
      marginRight: "-50%",
      transform: "translate(-50%, -50%)",
      maxWidth: "700px",
      width: "90%",
      borderRadius: "10px",
      zIndex: "9999",
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
              <h4 className="fw-bold">Appointments</h4>
              <h6>Manage all user appointments</h6>
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
                  placeholder="Search by name, email or phone..."
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
                    <th>User Name</th>
                    <th>User Mobile</th>
                    <th>User Address</th>
                    <th>Appointment Date</th>
                    <th>Appointment Time</th>
                    <th>Status</th>
                    <th className="text-center" >Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="py-5">
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
                    data.map((appointment, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          {appointment.userId?.firstName} {appointment.userId?.lastName}
                        </td>
                        <td>{appointment.userId?.phone}</td>
                        <td>{appointment.userId?.address}</td>
                        <td>{new Date(appointment.date).toLocaleDateString()}</td>
                        <td>{appointment.time}</td>
                        <td>
                          <span className={`badge ${getStatusBadgeClass(appointment.status)}`}>
                            {getStatusDisplayText(appointment.status)}
                          </span>
                        </td>
                        <td className="d-flex">
                          <div className="edit-delete-action d-flex align-items-center gap-2">
                            <button
                              className="p-2 d-flex align-items-center border rounded text-primary"
                              onClick={() => handleView(appointment)}
                            >
                              <FiEye style={{ marginRight: "5px" }} />
                              View
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-warning"
                              onClick={() => handleStatusChange(appointment)}
                            >
                              <FiEdit style={{ marginRight: "5px" }} />
                              Status
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No appointments found.
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
        style={viewModalStyles}
        contentLabel="View Appointment Details"
      >
        <div className="modal-header">
          <h5 className="modal-title">Appointment Details</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setViewModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {currentData && (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  
                  <hr className="my-2" />
                  <p><strong>Date:</strong> {new Date(currentData.date).toLocaleDateString()}</p>
                  <p><strong>Time:</strong> {currentData.time}</p>
                  <p><strong>Status:</strong> 
                    <span className={`badge ms-2 ${getStatusBadgeClass(currentData.status)}`}>
                      {getStatusDisplayText(currentData.status)}
                    </span>
                  </p>
                  <p><strong>Created At:</strong> {new Date(currentData.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h6>User Information</h6>
                  <hr className="my-2" />
                  <p><strong>Name:</strong> {currentData.userId?.firstName} {currentData.userId?.lastName}</p>
                  <p><strong>Email:</strong> {currentData.userId?.userEmail}</p>
                  <p><strong>Phone:</strong> {currentData.userId?.phone}</p>
                  <p><strong>Address:</strong> {currentData.userId?.address}</p>
                </div>
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

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalIsOpen}
        onRequestClose={() => setStatusModalIsOpen(false)}
        style={viewModalStyles}
        contentLabel="Update Appointment Status"
      >
        <div className="modal-header">
          <h5 className="modal-title">Update Appointment Status</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setStatusModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {currentData && (
            <div>
              <div className="mb-3">
                <label className="form-label">Current Status:</label>
                <span className={`badge ms-2 ${getStatusBadgeClass(currentData.status)}`}>
                  {getStatusDisplayText(currentData.status)}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">Select New Status:</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="booked">Booked</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled_by_admin">Cancelled by Admin</option>
                  <option value="rescheduled">Rescheduled</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer ">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStatusModalIsOpen(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={updateAppointmentStatus}
            style={{ marginLeft: "10px" }}
          >
            Update Status
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentList;