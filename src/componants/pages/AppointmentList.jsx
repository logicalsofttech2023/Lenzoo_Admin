import React, { use, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";
import socket from "./socket";
import { useTranslation } from "react-i18next";

const AppointmentList = () => {
  const { t } = useTranslation();
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

    const handleNewAppointment = (newAppointment) => {
      console.log("📦 New appointment received:", newAppointment);
      setData((prev) => [newAppointment, ...prev.slice(0, itemsPerPage - 1)]);
    };

    socket.on("newAppointment", handleNewAppointment);

    if (!socket.connected) {
      socket.connect();
    }

    return () => {
      socket.off("newAppointment", handleNewAppointment);
    };
  }, [currentPage, itemsPerPage, searchTerm]);

  const handleView = (appointment) => {
    console.log(appointment);
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
              <h4 className="fw-bold">{t("appointments")}</h4>
              <h6>{t("manage_appointments")}</h6>
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
                  placeholder={t("search_appointment_placeholder")}
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
                    <th>{t("user_name")}</th>
                    <th>{t("user_mobile")}</th>
                    <th>{t("appointment_date")}</th>
                    <th>{t("appointment_time")}</th>
                    <th>{t("status")}</th>
                    <th className="text-center">{t("action")}</th>
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
                          {appointment.userId?.firstName}{" "}
                          {appointment.userId?.lastName}
                        </td>
                        <td>{appointment.userId?.phone}</td>
                        <td>
                          {new Date(appointment.date).toLocaleDateString()}
                        </td>
                        <td>{appointment.time}</td>
                        <td>
                          <span
                            className={`badge ${getStatusBadgeClass(
                              appointment.status
                            )}`}
                          >
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
                              {t("view")}
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-warning"
                              onClick={() => handleStatusChange(appointment)}
                            >
                              <FiEdit style={{ marginRight: "5px" }} />
                              {t("status")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        {t("no_appointments_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container p-3 d-flex justify-content-between align-items-center">
              <div className="showing-count">
                {t("showing_entries", {
                  start: (currentPage - 1) * itemsPerPage + 1,
                  end: Math.min(currentPage * itemsPerPage, totalData),
                  total: totalData,
                })}
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
                      {t("previous")}
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
                      {t("next")}
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
        contentLabel={t("appointment_details")}
      >
        <div className="modal-header">
          <h5 className="modal-title">{t("appointment_details")}</h5>
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
                  <p>
                    <strong>{t("date")}:</strong>{" "}
                    {new Date(currentData.date).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>{t("time")}:</strong> {currentData.time}
                  </p>
                  <p>
                    <strong>{t("status")}:</strong>
                    <span
                      className={`badge ms-2 ${getStatusBadgeClass(
                        currentData.status
                      )}`}
                    >
                      {getStatusDisplayText(currentData.status)}
                    </span>
                  </p>
                  <p>
                    <strong>{t("created_at")}:</strong>{" "}
                    {new Date(currentData.createdAt).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h6>{t("user_information")}</h6>
                  <hr className="my-2" />
                  <p>
                    <strong>{t("name")}:</strong>{" "}
                    {currentData.userId?.firstName}{" "}
                    {currentData.userId?.lastName}
                  </p>
                  <p>
                    <strong>{t("email")}:</strong>{" "}
                    {currentData.userId?.userEmail}
                  </p>
                  <p>
                    <strong>{t("phone")}:</strong> {currentData.userId?.phone}
                  </p>
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
            {t("close")}
          </button>
        </div>
      </Modal>

      {/* Status Update Modal */}
      <Modal
        isOpen={statusModalIsOpen}
        onRequestClose={() => setStatusModalIsOpen(false)}
        style={viewModalStyles}
        contentLabel={t("update_appointment_status")}
      >
        <div className="modal-header">
          <h5 className="modal-title">{t("update_appointment_status")}</h5>
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
                <label className="form-label">{t("current_status")}:</label>
                <span
                  className={`badge ms-2 ${getStatusBadgeClass(
                    currentData.status
                  )}`}
                >
                  {getStatusDisplayText(currentData.status)}
                </span>
              </div>
              <div className="mb-3">
                <label className="form-label">{t("select_new_status")}:</label>
                <select
                  className="form-select"
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                >
                  <option value="booked">{t("booked")}</option>
                  <option value="completed">{t("completed")}</option>
                  <option value="cancelled_by_admin">
                    {t("cancelled_by_admin")}
                  </option>
                  <option value="rescheduled">{t("rescheduled")}</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setStatusModalIsOpen(false)}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="btn btn-primary"
            onClick={updateAppointmentStatus}
            style={{ marginLeft: "10px" }}
          >
            {t("update_status")}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default AppointmentList;
