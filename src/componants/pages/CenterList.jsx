import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";

const CenterList = () => {
  const { t } = useTranslation();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewModalIsOpen, setViewModalIsOpen] = useState(false);
  const [currentData, setCurrentData] = useState(null);
  const [bookedSlotsByDate, setBookedSlotsByDate] = useState({});

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getCenter`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const { center, bookedSlotsByDate } = response.data.data;
        setData([center]); // assuming it's a single center
        setBookedSlotsByDate(bookedSlotsByDate || {});
      } else {
        setError(response.data.message || "Failed to fetch centers");
      }
    } catch (error) {
      console.error("Error fetching centers:", error);
      setError("Error fetching centers. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url]);

  const handleView = (center) => {
    setCurrentData(center);
    setViewModalIsOpen(true);
  };

  const handleEdit = (id) => {
    navigate(`/editCenter`, { state: { id } });
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

  const modalStyles = {
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
              <h4 className="fw-bold">{t("center")}</h4>
              <h6>{t("manage_centers")}</h6>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>{t("name")}</th>
                    <th>{t("location")}</th>
                    <th>{t("city")}</th>
                    <th>{t("state")}</th>
                    <th>{t("status")}</th>
                    <th className="text-center">{t("action")}</th>
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
                    data.map((center, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td>{center?.name}</td>
                        <td>{center?.location}</td>
                        <td>{center?.city}</td>
                        <td>{center?.state}</td>
                        <td>
                          <span
                            className={`badge ${
                              center?.isActive ? "bg-success" : "bg-danger"
                            }`}
                          >
                            {center?.isActive ? t("active") : t("inactive")}
                          </span>
                        </td>
                        <td className="d-flex justify-content-center">
                          <div className="edit-delete-action d-flex align-items-center gap-2">
                            <button
                              className="p-2 d-flex align-items-center border rounded text-primary"
                              onClick={() => handleView(center)}
                            >
                              <FiEye style={{ marginRight: "5px" }} />
                              {t("view")}
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-warning"
                              onClick={() => handleEdit(center._id)}
                            >
                              <FiEdit style={{ marginRight: "5px" }} />
                              {t("edit")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        {t("no_centers_found")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* View Modal */}
      <Modal
        isOpen={viewModalIsOpen}
        onRequestClose={() => setViewModalIsOpen(false)}
        style={modalStyles}
        contentLabel={t("center_details")}
      >
        <div className="modal-header">
          <h5 className="modal-title">{t("center_details")}</h5>
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
                  <h6>{t("basic_information")}</h6>
                  <hr className="my-2" />
                  <p>
                    <strong>{t("name")}:</strong> {currentData.name}
                  </p>
                  <p>
                    <strong>{t("doctor")}:</strong> {currentData.doctor}
                  </p>
                  <p>
                    <strong>{t("location")}:</strong> {currentData.location}
                  </p>
                  <p>
                    <strong>{t("city")}:</strong> {currentData.city}
                  </p>
                  <p>
                    <strong>{t("state")}:</strong> {currentData.state}
                  </p>
                  <p>
                    <strong>{t("pin_code")}:</strong> {currentData.pinCode}
                  </p>
                  <p>
                    <strong>{t("contact_number")}:</strong>{" "}
                    {currentData.contactNumber}
                  </p>
                  <p>
                    <strong>{t("status")}:</strong>
                    <span
                      className={`badge ms-2 ${
                        currentData.isActive ? "bg-success" : "bg-danger"
                      }`}
                    >
                      {currentData.isActive ? t("active") : t("inactive")}
                    </span>
                  </p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h6>{t("booked_slots")}</h6>
                  <hr className="my-2" />
                  <div
                    className="booked-slots-container"
                    style={{ maxHeight: "300px", overflowY: "auto" }}
                  >
                    {Object.keys(bookedSlotsByDate).length > 0 ? (
                      Object.entries(bookedSlotsByDate).map(
                        ([date, slots], idx) => (
                          <div
                            key={idx}
                            className="booked-slot-date-item mb-3 p-2 border rounded"
                          >
                            <p className="mb-2">
                              <strong>{t("date")}:</strong> {date}
                            </p>
                            <ul className="mb-0">
                              {slots.map((slotTime, i) => (
                                <li key={i}>
                                  <span className="badge bg-danger">
                                    {slotTime}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )
                      )
                    ) : (
                      <p>{t("no_booked_slots")}</p>
                    )}
                  </div>
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
    </div>
  );
};

export default CenterList;
