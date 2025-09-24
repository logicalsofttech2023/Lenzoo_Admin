import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye, FiEdit, FiTrash2, FiPlus } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Modal from "react-modal";
import { useTranslation } from "react-i18next";

const ProductList = () => {
  const { t } = useTranslation();
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
  const [deleteModalIsOpen, setDeleteModalIsOpen] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllProductsInAdmin`, {
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
        setError(response.data.message || t("failed_fetch_products"));
      }
    } catch (error) {
      console.error(t("error_fetching_products"), error);
      setError(t("error_fetching_products_message"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  const handleEdit = (id) => {
    navigate(`/editProduct`, { state: { id } });
  };
  const handleView = (id) => {
    navigate(`/productDetail`, { state: { id } });
  };

  const handleDelete = (product) => {
    setCurrentProduct(product);
    setDeleteModalIsOpen(true);
  };

  const confirmDelete = async () => {
    setIsSubmitting(true);
    try {
      const response = await axios.post(
        `${base_url}deleteProduct?id=${currentProduct._id}`,
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
          title: t("success"),
          text: response.data.message || t("product_deleted_success"),
          timer: 2000,
          showConfirmButton: false,
        });
        setDeleteModalIsOpen(false);
        // Refresh data
        const updatedData = data.filter(
          (item) => item._id !== currentProduct._id
        );
        setData(updatedData);
        setTotalData(totalData - 1);
      } else {
        Swal.fire({
          icon: "error",
          title: t("error"),
          text: response.data.message || t("failed_delete_product"),
        });
      }
    } catch (error) {
      console.error(t("error_deleting_product"), error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("error_deleting_product_message"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAdd = () => {
    navigate("/addProduct");
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
              <h4 className="fw-bold">{t("products")}</h4>
              <h6>{t("manage_products")}</h6>
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
                  placeholder={t("search_product_placeholder")}
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
              {t("add_product")}
            </button>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#</th>
                    <th>{t("image")}</th>
                    <th>{t("name")}</th>
                    <th>{t("title")}</th>
                    <th>{t("product_id")}</th>
                    <th>{t("type")}</th>
                    <th>{t("frame_type")}</th>
                    <th>{t("frame_shape")}</th>
                    <th>{t("original_price")}</th>
                    <th>{t("selling_price")}</th>
                    <th>{t("quantity")}</th>
                    <th>{t("color")}</th>
                    <th>{t("actions")}</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="12" className="py-5">
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
                    data.map((product, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>
                        <td>
                          {product.images && product.images.length > 0 ? (
                            <img
                              src={`${file_url}${product.images[0]}`}
                              alt={product.name}
                              style={{
                                width: "50px",
                                height: "50px",
                                objectFit: "cover",
                              }}
                            />
                          ) : (
                            <span>{t("no_image")}</span>
                          )}
                        </td>
                        <td>{product.name}</td>
                        <td>{product.title}</td>
                        <td>{product.productId}</td>
                        <td>{product.productType}</td>
                        <td>{product.frameType}</td>
                        <td>{product.frameShape}</td>
                        <td>€{product.originalPrice}</td>
                        <td>€{product.sellingPrice}</td>
                        <td>{product.quantityAvailable}</td>
                        <td>
                          <div
                            className="d-flex flex-wrap gap-1"
                            style={{ maxWidth: "150px" }}
                          >
                            {product.frameColor &&
                            product.frameColor.length > 0 ? (
                              product.frameColor.map((color, colorIndex) => (
                                <div
                                  key={colorIndex}
                                  title={color}
                                  style={{
                                    width: "20px",
                                    height: "20px",
                                    backgroundColor: color,
                                    borderRadius: "50%",
                                    border: "1px solid #ddd",
                                    cursor: "pointer",
                                  }}
                                />
                              ))
                            ) : (
                              <span>{t("no_color")}</span>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="edit-delete-action d-flex align-items-center">
                            <button
                              className="me-2 p-2 d-flex align-items-center border rounded"
                              onClick={() => handleEdit(product._id)}
                            >
                              <FiEdit style={{ marginRight: "5px" }} />
                              {t("edit")}
                            </button>
                            <button
                              className="p-2 d-flex align-items-center border rounded text-danger"
                              onClick={() => handleDelete(product)}
                            >
                              <FiTrash2 style={{ marginRight: "5px" }} />
                              {t("delete")}
                            </button>

                            <button
                              className="ms-2 p-2 d-flex align-items-center border rounded"
                              onClick={() => handleView(product._id)}
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
                      <td colSpan="12" className="text-center py-4">
                        {t("no_products_found")}
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
                  total: totalData
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

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalIsOpen}
        onRequestClose={() => setDeleteModalIsOpen(false)}
        style={customStyles}
        contentLabel={t("confirm_delete")}
      >
        <div className="modal-header">
          <h5 className="modal-title">{t("confirm_delete")}</h5>
          <button
            type="button"
            className="btn-close"
            onClick={() => setDeleteModalIsOpen(false)}
          ></button>
        </div>
        <div className="modal-body">
          <p>
            {t("confirm_delete_message")} <strong>{currentProduct?.name}</strong>?{" "}
            {t("action_cannot_undone")}
          </p>
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => setDeleteModalIsOpen(false)}
            disabled={isSubmitting}
          >
            {t("cancel")}
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
                {t("deleting")}
              </>
            ) : (
              t("delete")
            )}
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default ProductList;
