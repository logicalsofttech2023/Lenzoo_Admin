import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";

const Transactions = () => {
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
  const [currentTransaction, setCurrentTransaction] = useState(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllTransaction`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params: {
          page: currentPage,
          limit: itemsPerPage,
          search: searchTerm,
        },
      });

      if (response.data.status) {
        setData(response.data.data);
        setTotalPages(response.data.totalPages);
        setTotalData(response.data.totalTransactions);
      } else {
        setError(response.data.message || t("failedToFetchTransactions"));
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setError(t("errorFetchingTransactions"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  const handleView = (transaction) => {
    setCurrentTransaction(transaction);
    setViewModalIsOpen(true);
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
              <h4 className="fw-bold">{t("transactions")}</h4>
              <h6>{t("manageAllUserTransactions")}</h6>
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
                  placeholder={t("searchPlaceholder")}
                  aria-label={t("search")}
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
                    <th>{t("id")}</th>
                    <th>{t("user")}</th>
                    <th>{t("email")}</th>
                    <th>{t("amount")}</th>
                    <th>{t("type")}</th>
                    <th>{t("status")}</th>
                    <th>{t("transactionId")}</th>
                    <th>{t("date")}</th>
                    <th>{t("action")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="9" className="py-5">
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
                    data.map((transaction, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          {transaction.userId?.firstName} {transaction.userId?.lastName}
                        </td>
                        <td>{transaction.userId?.userEmail}</td>
                        <td>₹{transaction.amount?.toLocaleString()}</td>
                        <td>{t(transaction.type)}</td>
                        <td>
                          <span className={`badge ${
                            transaction.status === "success" ? "bg-success" : 
                            transaction.status === "pending" ? "bg-warning" : "bg-danger"
                          }`}>
                            {t(transaction.status)}
                          </span>
                        </td>
                        <td>{transaction.transactionId}</td>
                        <td>{new Date(transaction.createdAt).toLocaleDateString()}</td>
                        <td className="d-flex">
                          <div className="edit-delete-action d-flex align-items-center gap-2">
                            <button
                              className="p-2 d-flex align-items-center border rounded text-primary"
                              onClick={() => handleView(transaction)}
                            >
                              <FiEye style={{ marginRight: "5px" }} />
                              {t("view")}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center py-4">
                        {t("noTransactionsFound")}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container p-3 d-flex justify-content-between align-items-center">
              <div className="showing-count">
                {t("showing")} {(currentPage - 1) * itemsPerPage + 1} {t("to")}{" "}
                {Math.min(currentPage * itemsPerPage, totalData)} {t("of")} {totalData}{" "}
                {t("entries")}
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
        contentLabel={t("viewTransactionDetails")}
      >
        <div className="modal-header">
          <h5 className="modal-title">{t("transactionDetails")}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setViewModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          {currentTransaction && (
            <div className="row">
              <div className="col-md-6">
                <div className="mb-3">
                  <h6>{t("transactionInformation")}</h6>
                  <hr className="my-2" />
                  <p><strong>{t("transactionId")}:</strong> {currentTransaction.transactionId}</p>
                  <p><strong>{t("amount")}:</strong> ₹{currentTransaction.amount?.toLocaleString()}</p>
                  <p><strong>{t("type")}:</strong> {t(currentTransaction.type)}</p>
                  <p><strong>{t("status")}:</strong> 
                    <span className={`badge ms-2 ${
                      currentTransaction.status === "success" ? "bg-success" : 
                      currentTransaction.status === "pending" ? "bg-warning" : "bg-danger"
                    }`}>
                      {t(currentTransaction.status)}
                    </span>
                  </p>
                  <p><strong>{t("date")}:</strong> {new Date(currentTransaction.createdAt).toLocaleString()}</p>
                  <p><strong>{t("description")}:</strong> {currentTransaction.description}</p>
                </div>
              </div>
              <div className="col-md-6">
                <div className="mb-3">
                  <h6>{t("userInformation")}</h6>
                  <hr className="my-2" />
                  <p><strong>{t("name")}:</strong> {currentTransaction.userId?.firstName} {currentTransaction.userId?.middleName} {currentTransaction.userId?.lastName}</p>
                  <p><strong>{t("email")}:</strong> {currentTransaction.userId?.userEmail}</p>
                  <p><strong>{t("phone")}:</strong> {currentTransaction.userId?.phone}</p>
                  <p><strong>{t("address")}:</strong> {currentTransaction.userId?.address}</p>
                  <p><strong>{t("userStatus")}:</strong> 
                    <span className={`badge ms-2 ${
                      currentTransaction.userId?.adminVerified === "approved" ? "bg-success" : 
                      currentTransaction.userId?.adminVerified === "pending" ? "bg-warning" : "bg-danger"
                    }`}>
                      {t(currentTransaction.userId?.adminVerified)}
                    </span>
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
    </div>
  );
};

export default Transactions;