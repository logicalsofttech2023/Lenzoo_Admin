import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiPlus, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const PowerType = () => {
  const { t } = useTranslation();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;
  const [powerTypes, setPowerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentPowerType, setCurrentPowerType] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  // Form state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image: ""
  });

  const fetchPowerTypes = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllPowerTypes`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setPowerTypes(response.data.powerTypes);
        setTotalCount(response.data.totalItems);
      } else {
        setError(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error fetching power types:", error);
      setError(t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const fetchPowerTypeById = async (id) => {
    try {
      const response = await axios.get(`${base_url}getPowerTypeById`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        return response.data.powerType;
      }
      return null;
    } catch (error) {
      console.error("Error fetching power type:", error);
      return null;
    }
  };

  useEffect(() => {
    fetchPowerTypes();
  }, [page, search]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await axios.post(
        `${base_url}addPowerType`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: t("success"),
          text: t("powerTypeAdded"),
          showConfirmButton: true,
        });
        resetForm();
        fetchPowerTypes();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error adding power type:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text:
          error.response?.data?.message ||
          t("errorOccurred"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentPowerType) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("title", formData.title);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("id", currentPowerType._id);
      
      if (imageFile) {
        formDataToSend.append("image", imageFile);
      }

      const response = await axios.post(
        `${base_url}updatePowerType`,
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: t("success"),
          text: t("powerTypeUpdated"),
          showConfirmButton: true,
        });
        resetForm();
        fetchPowerTypes();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error updating power type:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text:
          error.response?.data?.message ||
          t("errorOccurred"),
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeletePowerType = async (id) => {
    try {
      const result = await Swal.fire({
        title: t("deleteConfirmationTitle"),
        text: t("deleteConfirmationText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("deleteConfirmationConfirm"),
      });

      if (result.isConfirmed) {
        const response = await axios.get(`${base_url}deletePowerType`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          Swal.fire(t("deletedSuccess"), t("powerTypeDeleted"), "success");
          fetchPowerTypes();
        }
      }
    } catch (error) {
      console.error("Error deleting power type:", error);
      Swal.fire(t("error"), t("failedToDelete"), "error");
    }
  };

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      image: ""
    });
    setImageFile(null);
    setImagePreview("");
    setCurrentPowerType(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const editPowerType = async (powerType) => {
    try {
      const powerTypeDetails = await fetchPowerTypeById(powerType._id);
      if (powerTypeDetails) {
        setCurrentPowerType(powerTypeDetails);
        setFormData({
          title: powerTypeDetails.title,
          description: powerTypeDetails.description,
          image: powerTypeDetails.image
        });
        
        if (powerTypeDetails.image) {
          setImagePreview(`${file_url}${powerTypeDetails.image}`);
        }
        setIsEditing(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error loading power type details:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("failedToLoad"),
      });
    }
  };

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">{t("powerTypes")}</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FiPlus className="me-2" />
            {t("addNewPowerType")}
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={isEditing ? handleUpdate : handleCreate}
            className="mb-4"
            encType="multipart/form-data"
          >
            <div className="row">
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("title")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder={t("title")}
                  required
                />
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("description")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder={t("description")}
                  required
                />
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">{t("image")}</label>
                <input
                  type="file"
                  className="form-control"
                  name="image"
                  onChange={handleImageChange}
                  accept="image/*"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Preview" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>
            </div>

            <div className="d-flex gap-2">
              <button
                className="btn btn-primary"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting
                  ? isEditing
                    ? t("updating")
                    : t("creating")
                  : isEditing
                  ? t("updatePowerType")
                  : t("createPowerType")}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                {t("cancel")}
              </button>
            </div>
          </form>
        )}

        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder={t("searchByTitle")}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
        </div>

        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>{t("title")}</th>
                <th>{t("description")}</th>
                <th>{t("image")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="text-center py-5">
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
                  </td>
                </tr>
              ) : powerTypes.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center py-4">
                    {t("noPowerTypesFound")}
                  </td>
                </tr>
              ) : (
                powerTypes.map((powerType) => (
                  <tr key={powerType._id}>
                    <td>{powerType.title}</td>
                    <td>{powerType.description}</td>
                    <td>
                      {powerType.image && (
                        <img 
                          src={`${file_url}${powerType.image}`} 
                          alt={powerType.title}
                          className="img-thumbnail"
                          style={{ maxHeight: '50px' }}
                        />
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editPowerType(powerType)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeletePowerType(powerType._id)}
                        >
                          <FiTrash2 />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {!loading && totalCount > limit && (
          <div className="d-flex justify-content-between align-items-center mt-3">
            <p className="mb-0">
              {t("showing")} {(page - 1) * limit + 1} -{" "}
              {Math.min(page * limit, totalCount)} {t("of")} {totalCount}
            </p>

            <div className="btn-group">
              <button
                className="btn btn-outline-primary"
                disabled={page === 1}
                onClick={() => setPage((prev) => prev - 1)}
              >
                {t("previous")}
              </button>
              <button
                className="btn btn-outline-primary"
                disabled={page * limit >= totalCount}
                onClick={() => setPage((prev) => prev + 1)}
              >
                {t("next")}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PowerType;