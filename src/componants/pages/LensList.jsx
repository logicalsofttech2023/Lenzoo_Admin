import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiEye, FiUpload, FiImage } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";
import { useTranslation } from "react-i18next";

const LensList = () => {
  const { t } = useTranslation();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;
  const [lenses, setLenses] = useState([]);
  const [powerTypes, setPowerTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentLens, setCurrentLens] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  
  // Form state
  const [formData, setFormData] = useState({
    powerType: "",
    warranty: "",
    title: "",
    price: "",
    type: "",
    benefits: [""],
    features: [{ text: "", image: null, preview: "" }]
  });
  
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [existingFeatures, setExistingFeatures] = useState([]);

  const fetchLenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllLenses`, {
        params: { page, limit, search },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setLenses(response.data.lens);
        setTotalCount(response.data.totalItems);
      } else {
        setError(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error fetching lenses:", error);
      setError(t("errorOccurred"));
    } finally {
      setLoading(false);
    }
  };

  const fetchPowerTypes = async () => {
    try {
      const response = await axios.get(`${base_url}getPowerTypeDropdown`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.status) {
        setPowerTypes(response.data.powerTypes);
      }
    } catch (error) {
      console.error("Error fetching power types:", error);
    }
  };

  const fetchLensById = async (id) => {
    try {
      const response = await axios.get(`${base_url}getLensById`, {
        params: { id },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200 && response.data.success) {
        return response.data.lens;
      }
      return null;
    } catch (error) {
      console.error("Error fetching lens:", error);
      return null;
    }
  };

  const deleteLensMedia = async (type, index, id) => {
    try {
      const response = await axios.post(`${base_url}deleteLensMedia`, 
        { type, index, id },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.data.success) {
        return true;
      }
      return false;
    } catch (error) {
      console.error("Error deleting media:", error);
      return false;
    }
  };

  useEffect(() => {
    fetchLenses();
    fetchPowerTypes();
  }, [page, search]);

  // Get type options based on selected power type
  const getTypeOptions = () => {
    if (!formData.powerType) return [];
    
    const selectedPowerType = powerTypes.find(pt => pt._id === formData.powerType);
    
    if (selectedPowerType) {
      if (selectedPowerType.title === "With Power") {
        return ["Bestseller", "Work Friendly", "High Power", "Driving", "Colored"];
      } else if (selectedPowerType.title === "Progressive/Bifocals") {
        return ["Progressive", "Bifocals"];
      }
    }
    
    return [];
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // If powerType is changing, reset the type field
    if (name === "powerType") {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
        type: "" // Reset type when powerType changes
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleBenefitChange = (index, value) => {
    const newBenefits = [...formData.benefits];
    newBenefits[index] = value;
    setFormData((prev) => ({
      ...prev,
      benefits: newBenefits,
    }));
  };

  const addBenefit = () => {
    setFormData((prev) => ({
      ...prev,
      benefits: [...prev.benefits, ""],
    }));
  };

  const removeBenefit = (index) => {
    const newBenefits = [...formData.benefits];
    newBenefits.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      benefits: newBenefits,
    }));
  };

  const handleFeatureTextChange = (index, value) => {
    const newFeatures = [...formData.features];
    newFeatures[index].text = value;
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleFeatureImageChange = (index, e) => {
    const file = e.target.files[0];
    if (file) {
      const newFeatures = [...formData.features];
      newFeatures[index].image = file;
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        newFeatures[index].preview = reader.result;
        setFormData((prev) => ({
          ...prev,
          features: newFeatures,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const addFeature = () => {
    setFormData((prev) => ({
      ...prev,
      features: [...prev.features, { text: "", image: null, preview: "" }],
    }));
  };

  const removeFeature = (index) => {
    const newFeatures = [...formData.features];
    newFeatures.splice(index, 1);
    setFormData((prev) => ({
      ...prev,
      features: newFeatures,
    }));
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnailFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImagesChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageFiles(files);
      
      // Create previews
      const previews = [];
      files.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          previews.push(reader.result);
          if (previews.length === files.length) {
            setImagePreviews(previews);
          }
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const handleRemoveExistingImage = async (index) => {
    try {
      const result = await Swal.fire({
        title: t("deleteConfirmationTitle"),
        text: t("deleteImageConfirmationText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("deleteConfirmationConfirm"),
      });

      if (result.isConfirmed) {
        const success = await deleteLensMedia("image", index, currentLens._id);
        if (success) {
          // Update UI
          const updatedImages = [...existingImages];
          updatedImages.splice(index, 1);
          setExistingImages(updatedImages);
          
          Swal.fire(t("deletedSuccess"), t("imageDeleted"), "success");
        } else {
          Swal.fire(t("error"), t("failedToDelete"), "error");
        }
      }
    } catch (error) {
      console.error("Error removing image:", error);
      Swal.fire(t("error"), t("failedToDelete"), "error");
    }
  };

  const handleRemoveExistingFeatureImage = async (index) => {
    try {
      const result = await Swal.fire({
        title: t("deleteConfirmationTitle"),
        text: t("deleteImageConfirmationText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("deleteConfirmationConfirm"),
      });

      if (result.isConfirmed) {
        const success = await deleteLensMedia("featureImage", index, currentLens._id);
        if (success) {
          // Update UI
          const updatedFeatures = [...existingFeatures];
          updatedFeatures[index].image = "";
          setExistingFeatures(updatedFeatures);
          
          Swal.fire(t("deletedSuccess"), t("imageDeleted"), "success");
        } else {
          Swal.fire(t("error"), t("failedToDelete"), "error");
        }
      }
    } catch (error) {
      console.error("Error removing feature image:", error);
      Swal.fire(t("error"), t("failedToDelete"), "error");
    }
  };

  const handleRemoveThumbnail = async () => {
    try {
      const result = await Swal.fire({
        title: t("deleteConfirmationTitle"),
        text: t("deleteImageConfirmationText"),
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: t("deleteConfirmationConfirm"),
      });

      if (result.isConfirmed) {
        const success = await deleteLensMedia("thumbnail", null, currentLens._id);
        if (success) {
          // Update UI
          setThumbnailPreview("");
          
          Swal.fire(t("deletedSuccess"), t("imageDeleted"), "success");
        } else {
          Swal.fire(t("error"), t("failedToDelete"), "error");
        }
      }
    } catch (error) {
      console.error("Error removing thumbnail:", error);
      Swal.fire(t("error"), t("failedToDelete"), "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("powerType", formData.powerType);
      formDataToSend.append("warranty", formData.warranty);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("price", formData.price);
      
      // Only add type if powerType is "With Power" or "Progressive/Bifocals"
      const selectedPowerType = powerTypes.find(pt => pt._id === formData.powerType);
      if (selectedPowerType && 
          (selectedPowerType.title === "With Power" || selectedPowerType.title === "Progressive/Bifocals")) {
        formDataToSend.append("type", formData.type);
      }
      
      formDataToSend.append("benefits", JSON.stringify(formData.benefits));
      formDataToSend.append("features", JSON.stringify(formData.features.map(f => ({ text: f.text }))));
      
      if (thumbnailFile) {
        formDataToSend.append("thumbnail", thumbnailFile);
      }
      
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataToSend.append("images", file);
        });
      }
      
      formData.features.forEach((feature, index) => {
        if (feature.image) {
          formDataToSend.append("featuresImages", feature.image);
        }
      });

      const response = await axios.post(
        `${base_url}addLens`,
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
          text: t("lensAdded"),
          showConfirmButton: true,
        });
        resetForm();
        fetchLenses();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error adding lens:", error);
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
    if (!currentLens) return;

    setIsSubmitting(true);

    try {
      const formDataToSend = new FormData();
      formDataToSend.append("powerType", formData.powerType);
      formDataToSend.append("warranty", formData.warranty);
      formDataToSend.append("title", formData.title);
      formDataToSend.append("price", formData.price);
      
      // Only add type if powerType is "With Power" or "Progressive/Bifocals"
      const selectedPowerType = powerTypes.find(pt => pt._id === formData.powerType);
      if (selectedPowerType && 
          (selectedPowerType.title === "With Power" || selectedPowerType.title === "Progressive/Bifocals")) {
        formDataToSend.append("type", formData.type);
      }
      
      formDataToSend.append("benefits", JSON.stringify(formData.benefits));
      
      // Prepare features data
      const featuresData = formData.features.map((feature, index) => {
        // For existing features, check if we have an image from the existingFeatures array
        if (index < existingFeatures.length && existingFeatures[index].image) {
          return {
            text: feature.text,
            image: existingFeatures[index].image
          };
        }
        return {
          text: feature.text,
          image: feature.image || ""
        };
      });
      
      formDataToSend.append("features", JSON.stringify(featuresData));
      formDataToSend.append("id", currentLens._id);
      
      if (thumbnailFile) {
        formDataToSend.append("thumbnail", thumbnailFile);
      }
      
      if (imageFiles.length > 0) {
        imageFiles.forEach((file) => {
          formDataToSend.append("images", file);
        });
      }
      
      formData.features.forEach((feature, index) => {
        if (feature.image && typeof feature.image !== 'string') {
          formDataToSend.append("featuresImages", feature.image);
        }
      });

      const response = await axios.post(
        `${base_url}updateLens`,
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
          text: t("lensUpdated"),
          showConfirmButton: true,
        });
        resetForm();
        fetchLenses();
        setShowForm(false);
      } else {
        throw new Error(response.data.message || t("operationFailed"));
      }
    } catch (error) {
      console.error("Error updating lens:", error);
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

  const handleDeleteLens = async (id) => {
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
        const response = await axios.get(`${base_url}deleteLens`, {
          params: { id },
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          Swal.fire(t("deletedSuccess"), t("lensDeleted"), "success");
          fetchLenses();
        }
      }
    } catch (error) {
      console.error("Error deleting lens:", error);
      Swal.fire(t("error"), t("failedToDelete"), "error");
    }
  };

  const resetForm = () => {
    setFormData({
      powerType: "",
      warranty: "",
      title: "",
      price: "",
      type: "",
      benefits: [""],
      features: [{ text: "", image: null, preview: "" }]
    });
    setThumbnailFile(null);
    setThumbnailPreview("");
    setImageFiles([]);
    setImagePreviews([]);
    setExistingImages([]);
    setExistingFeatures([]);
    setCurrentLens(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const editLens = async (lens) => {
    try {
      const lensDetails = await fetchLensById(lens._id);
      if (lensDetails) {
        setCurrentLens(lensDetails);
        setFormData({
          powerType: lensDetails.powerType?._id || "",
          warranty: lensDetails.warranty || "",
          title: lensDetails.title || "",
          price: lensDetails.price || "",
          type: lensDetails.type || "",
          benefits: lensDetails.benefits && lensDetails.benefits.length > 0 
            ? lensDetails.benefits 
            : [""],
          features: lensDetails.features && lensDetails.features.length > 0
            ? lensDetails.features.map(f => ({ 
                text: f.text || "", 
                image: f.image || null, 
                preview: f.image ? `${file_url}${f.image}` : "" 
              }))
            : [{ text: "", image: null, preview: "" }]
        });
        
        // Store existing images and features for media deletion
        setExistingImages(lensDetails.images || []);
        setExistingFeatures(lensDetails.features || []);
        
        if (lensDetails.thumbnail) {
          setThumbnailPreview(`${file_url}${lensDetails.thumbnail}`);
        }
        
        if (lensDetails.images && lensDetails.images.length > 0) {
          setImagePreviews(lensDetails.images.map(img => `${file_url}${img}`));
        }
        
        setIsEditing(true);
        setShowForm(true);
      }
    } catch (error) {
      console.error("Error loading lens details:", error);
      Swal.fire({
        icon: "error",
        title: t("error"),
        text: t("failedToLoad"),
      });
    }
  };

  // Check if type field should be shown
  const shouldShowTypeField = () => {
    if (!formData.powerType) return false;
    
    const selectedPowerType = powerTypes.find(pt => pt._id === formData.powerType);
    return selectedPowerType && 
           (selectedPowerType.title === "With Power" || selectedPowerType.title === "Progressive/Bifocals");
  };

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">{t("lenses")}</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FiPlus className="me-2" />
            {t("addNewLens")}
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
                <label className="form-label">{t("powerType")}</label>
                <select
                  className="form-control"
                  name="powerType"
                  value={formData.powerType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">{t("selectPowerType")}</option>
                  {powerTypes.map((type) => (
                    <option key={type._id} value={type._id}>
                      {type.title}
                    </option>
                  ))}
                </select>
              </div>
              
              <div className="col-md-6 mb-3">
                <label className="form-label">{t("warranty")}</label>
                <input
                  type="text"
                  className="form-control"
                  name="warranty"
                  value={formData.warranty}
                  onChange={handleInputChange}
                  placeholder={t("warranty")}
                />
              </div>

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
                <label className="form-label">{t("price")}</label>
                <input
                  type="number"
                  className="form-control"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder={t("price")}
                  required
                />
              </div>

              {shouldShowTypeField() && (
                <div className="col-md-6 mb-3">
                  <label className="form-label">{t("type")}</label>
                  <select
                    className="form-control"
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                  >
                    <option value="">{t("selectType")}</option>
                    {getTypeOptions().map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="col-12 mb-3">
                <label className="form-label">{t("benefits")}</label>
                {formData.benefits.map((benefit, index) => (
                  <div key={index} className="input-group mb-2">
                    <input
                      type="text"
                      className="form-control"
                      value={benefit}
                      onChange={(e) => handleBenefitChange(index, e.target.value)}
                      placeholder={t("benefit")}
                    />
                    {formData.benefits.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-outline-danger"
                        onClick={() => removeBenefit(index)}
                      >
                        <FiX />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary mt-2"
                  onClick={addBenefit}
                >
                  <FiPlus className="me-1" /> {t("addBenefit")}
                </button>
              </div>

              <div className="col-12 mb-3">
                <label className="form-label">{t("features")}</label>
                {formData.features.map((feature, index) => (
                  <div key={index} className="card mb-3 p-3">
                    <div className="row">
                      <div className="col-md-6 mb-2">
                        <label className="form-label">{t("featureText")}</label>
                        <textarea
                          className="form-control"
                          value={feature.text}
                          onChange={(e) => handleFeatureTextChange(index, e.target.value)}
                          placeholder={t("featureText")}
                          rows="3"
                        />
                      </div>
                      <div className="col-md-6 mb-2">
                        <label className="form-label">{t("featureImage")}</label>
                        
                        {/* Show existing feature image if available */}
                        {isEditing && existingFeatures[index]?.image && (
                          <div className="mb-2">
                            <div className="d-flex align-items-center">
                              <img 
                                src={`${file_url}${existingFeatures[index].image}`} 
                                alt="Existing feature" 
                                className="img-thumbnail me-2" 
                                style={{ maxHeight: '60px' }}
                              />
                              <button
                                type="button"
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => handleRemoveExistingFeatureImage(index)}
                              >
                                <FiTrash2 />
                              </button>
                            </div>
                            <small className="text-muted">Existing image</small>
                          </div>
                        )}
                        
                        <input
                          type="file"
                          className="form-control"
                          onChange={(e) => handleFeatureImageChange(index, e)}
                          accept="image/*"
                        />
                        {feature.preview && (
                          <div className="mt-2">
                            <img 
                              src={feature.preview} 
                              alt="Feature preview" 
                              className="img-thumbnail" 
                              style={{ maxHeight: '100px' }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                    {formData.features.length > 1 && (
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger align-self-end"
                        onClick={() => removeFeature(index)}
                      >
                        <FiTrash2 /> {t("removeFeature")}
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  className="btn btn-sm btn-outline-primary"
                  onClick={addFeature}
                >
                  <FiPlus className="me-1" /> {t("addFeature")}
                </button>
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{t("thumbnail")}</label>
                
                {/* Show existing thumbnail if available */}
                {isEditing && thumbnailPreview && (
                  <div className="mb-2">
                    <div className="d-flex align-items-center">
                      <img 
                        src={thumbnailPreview} 
                        alt="Existing thumbnail" 
                        className="img-thumbnail me-2" 
                        style={{ maxHeight: '60px' }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={handleRemoveThumbnail}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                    <small className="text-muted">Existing thumbnail</small>
                  </div>
                )}
                
                <input
                  type="file"
                  className="form-control"
                  onChange={handleThumbnailChange}
                  accept="image/*"
                />
                {thumbnailPreview && !isEditing && (
                  <div className="mt-2">
                    <img 
                      src={thumbnailPreview} 
                      alt="Thumbnail preview" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '200px' }}
                    />
                  </div>
                )}
              </div>

              <div className="col-md-6 mb-3">
                <label className="form-label">{t("images")}</label>
                
                {/* Show existing images if available */}
                {isEditing && existingImages.length > 0 && (
                  <div className="mb-2">
                    <label className="form-label small">{t("existingImages")}</label>
                    <div className="d-flex flex-wrap gap-4 mb-2">
                      {existingImages.map((img, index) => (
                        <div key={index} className="position-relative">
                          <img 
                            src={`${file_url}${img}`} 
                            alt={`Existing ${index}`} 
                            className="img-thumbnail" 
                            style={{ height: '80px' }}
                          />
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger position-absolute top-0 end-0"
                            style={{ transform: 'translate(50%, -50%)' }}
                            onClick={() => handleRemoveExistingImage(index)}
                          >
                            <FiX />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                <input
                  type="file"
                  className="form-control"
                  onChange={handleImagesChange}
                  accept="image/*"
                  multiple
                />
                {imagePreviews.length > 0 && (
                  <div className="mt-2 d-flex flex-wrap gap-2">
                    {imagePreviews.map((preview, index) => (
                      <img 
                        key={index}
                        src={preview} 
                        alt={`Preview ${index}`} 
                        className="img-thumbnail" 
                        style={{ maxHeight: '100px', width: '100px', objectFit: 'cover' }}
                      />
                    ))}
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
                  ? t("updateLens")
                  : t("createLens")}
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
                <th>{t("powerType")}</th>
                <th>{t("price")}</th>
                <th>{t("warranty")}</th>
                <th>{t("type")}</th>
                <th>{t("thumbnail")}</th>
                <th>{t("actions")}</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="text-center py-5">
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
              ) : lenses.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-center py-4">
                    {t("noLensesFound")}
                  </td>
                </tr>
              ) : (
                lenses.map((lens) => (
                  <tr key={lens._id}>
                    <td>{lens.title}</td>
                    <td>{lens.powerType?.title}</td>
                    <td>{lens.price}</td>
                    <td>{lens.warranty}</td>
                    <td>{lens.type}</td>
                    <td>
                      {lens.thumbnail && (
                        <img 
                          src={`${file_url}${lens.thumbnail}`} 
                          alt={lens.title}
                          className="img-thumbnail"
                          style={{ maxHeight: '50px' }}
                        />
                      )}
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => editLens(lens)}
                        >
                          <FiEdit2 />
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDeleteLens(lens._id)}
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

export default LensList;