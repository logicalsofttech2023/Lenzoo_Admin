import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { FiPlus, FiUpload, FiX } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";

const AddProduct = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    description: "",
    originalPrice: "",
    sellingPrice: "",
    productType: "Eyeglasses",
    frameType: "Full Rim",
    frameShape: "Round",
    frameSize: "Medium",
    suitableFor: [],
    frameWidth: "",
    frameDimensions: "",
    frameColor: [],
    weight: "",
    material: "",
    pupillaryDistance: "",
    faceShape: "",
  });

  // Error state
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [colorInput, setColorInput] = useState("#000000");

  // Product types and options
  const productTypes = [
    "Eyeglasses",
    "Sunglasses",
    "Computer Glasses",
    "Reading Glasses",
    "Contact Lenses",
  ];
  const frameTypes = ["Full Rim", "Half Rim", "Rimless"];
  const frameShapes = [
    "Round",
    "Rectangle",
    "Square",
    "Aviator",
    "Cat Eye",
    "Hexagonal",
    "Wayfarer",
  ];
  const frameSizes = ["Extra Narrow", "Narrow", "Medium", "Wide", "Extra Wide"];
  const suitableForOptions = ["Men", "Women", "Kids"];

  // Handle input change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: null,
      });
    }
  };

  // Handle checkbox change for suitableFor
  const handleCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let updatedSuitableFor = [...formData.suitableFor];

    if (checked) {
      updatedSuitableFor.push(value);
    } else {
      updatedSuitableFor = updatedSuitableFor.filter((item) => item !== value);
    }

    setFormData({
      ...formData,
      suitableFor: updatedSuitableFor,
    });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (files.length + imageFiles.length > 5) {
      Swal.fire({
        icon: "error",
        title: "Too many images",
        text: "You can upload a maximum of 5 images",
      });
      return;
    }

    const newImageFiles = [...imageFiles, ...files];
    setImageFiles(newImageFiles);

    // Create previews
    const newImagePreviews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews([...imagePreviews, ...newImagePreviews]);
  };

  // Remove image
  const removeImage = (index) => {
    const newImageFiles = [...imageFiles];
    newImageFiles.splice(index, 1);
    setImageFiles(newImageFiles);

    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);
    setImagePreviews(newImagePreviews);
  };

  // Validate form
  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) newErrors.name = "Product name is required";
    if (!formData.title.trim()) newErrors.title = "Product title is required";
    if (!formData.originalPrice)
      newErrors.originalPrice = "Original price is required";
    if (!formData.sellingPrice)
      newErrors.sellingPrice = "Selling price is required";
    if (
      parseFloat(formData.sellingPrice) > parseFloat(formData.originalPrice)
    ) {
      newErrors.sellingPrice = "Selling price must be less than original price";
    }
    if (formData.suitableFor.length === 0)
      newErrors.suitableFor = "Please select at least one option";
    if (imageFiles.length === 0)
      newErrors.images = "Please upload at least one image";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    try {
      const formDataToSend = new FormData();

      Object.keys(formData).forEach((key) => {
        if (key === "suitableFor") {
          formData.suitableFor.forEach((item) =>
            formDataToSend.append("suitableFor", item)
          );
        } else if (key === "frameColor") {
          // ✅ Fix: Send frameColor as individual items
          formData.frameColor.forEach((color) =>
            formDataToSend.append("frameColor", color)
          );
        } else {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Append images
      imageFiles.forEach((file) => {
        formDataToSend.append("images", file);
      });

      const response = await axios.post(
        `${base_url}addProduct`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 201) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Product added successfully",
          timer: 2000,
          showConfirmButton: false,
        }).then(() => {
          navigate("/productList");
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      let errorMessage = "Failed to add product";

      if (error.response) {
        if (error.response.data && error.response.data.message) {
          errorMessage = error.response.data.message;
        } else if (error.response.status === 400) {
          errorMessage = "Validation error. Please check your inputs.";
        }
      }

      Swal.fire({
        icon: "error",
        title: "Error",
        text: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleColorInputChange = (e) => {
    setColorInput(e.target.value);
  };

  const addColor = () => {
    if (colorInput && !formData.frameColor.includes(colorInput)) {
      setFormData({
        ...formData,
        frameColor: [...formData.frameColor, colorInput],
      });
    }
  };

  const removeColor = (color) => {
    const updatedColors = formData.frameColor.filter((c) => c !== color);
    setFormData({
      ...formData,
      frameColor: updatedColors,
    });
  };

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Add Product</h4>
              <h6>Manage your Products</h6>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              <div className="row">
                {/* Product Basic Info */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Product Name <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.name ? "is-invalid" : ""
                      }`}
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Classic Black Eyewear"
                    />
                    {errors.name && (
                      <div className="invalid-feedback">{errors.name}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      Product Title <span className="text-danger">*</span>
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        errors.title ? "is-invalid" : ""
                      }`}
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Stylish Full Rim Round Eyeglasses"
                    />
                    {errors.title && (
                      <div className="invalid-feedback">{errors.title}</div>
                    )}
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Description</label>
                    <textarea
                      className="form-control"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      placeholder="Lightweight and durable eyeglasses perfect for everyday wear."
                      rows="3"
                    ></textarea>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Original Price (₹){" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${
                            errors.originalPrice ? "is-invalid" : ""
                          }`}
                          name="originalPrice"
                          value={formData.originalPrice}
                          onChange={handleChange}
                          placeholder="2999"
                          min="0"
                        />
                        {errors.originalPrice && (
                          <div className="invalid-feedback">
                            {errors.originalPrice}
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Selling Price (₹){" "}
                          <span className="text-danger">*</span>
                        </label>
                        <input
                          type="number"
                          className={`form-control ${
                            errors.sellingPrice ? "is-invalid" : ""
                          }`}
                          name="sellingPrice"
                          value={formData.sellingPrice}
                          onChange={handleChange}
                          placeholder="1499"
                          min="0"
                        />
                        {errors.sellingPrice && (
                          <div className="invalid-feedback">
                            {errors.sellingPrice}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Images */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Product Images <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`image-upload-container ${
                        errors.images ? "is-invalid" : ""
                      }`}
                    >
                      <label
                        htmlFor="product-images"
                        className="image-upload-label"
                      >
                        <FiUpload className="me-2" />
                        Upload Images (Max 5)
                        <input
                          type="file"
                          id="product-images"
                          className="d-none"
                          multiple
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                      </label>
                      {errors.images && (
                        <div className="invalid-feedback d-block">
                          {errors.images}
                        </div>
                      )}

                      <div className="image-preview-container mt-3">
                        {imagePreviews.map((preview, index) => (
                          <div key={index} className="image-preview-item">
                            <img src={preview} alt={`Preview ${index}`} />
                            <button
                              type="button"
                              className="btn btn-danger btn-sm remove-btn"
                              onClick={() => removeImage(index)}
                            >
                              <FiX />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      Product Type <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="productType"
                      value={formData.productType}
                      onChange={handleChange}
                    >
                      {productTypes.map((type, index) => (
                        <option key={index} value={type}>
                          {type}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Frame Type <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="frameType"
                          value={formData.frameType}
                          onChange={handleChange}
                        >
                          {frameTypes.map((type, index) => (
                            <option key={index} value={type}>
                              {type}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">
                          Frame Shape <span className="text-danger">*</span>
                        </label>
                        <select
                          className="form-select"
                          name="frameShape"
                          value={formData.frameShape}
                          onChange={handleChange}
                        >
                          {frameShapes.map((shape, index) => (
                            <option key={index} value={shape}>
                              {shape}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Specifications */}
                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">
                      Frame Size <span className="text-danger">*</span>
                    </label>
                    <select
                      className="form-select"
                      name="frameSize"
                      value={formData.frameSize}
                      onChange={handleChange}
                    >
                      {frameSizes.map((size, index) => (
                        <option key={index} value={size}>
                          {size}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">
                      Suitable For <span className="text-danger">*</span>
                    </label>
                    <div
                      className={`${errors.suitableFor ? "is-invalid" : ""}`}
                    >
                      <div className="d-flex flex-wrap gap-3">
                        {suitableForOptions.map((option, index) => (
                          <div key={index} className="form-check">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              id={`suitableFor-${option}`}
                              value={option}
                              checked={formData.suitableFor.includes(option)}
                              onChange={handleCheckboxChange}
                            />
                            <label
                              className="form-check-label"
                              htmlFor={`suitableFor-${option}`}
                            >
                              {option}
                            </label>
                          </div>
                        ))}
                      </div>
                      {errors.suitableFor && (
                        <div className="invalid-feedback d-block">
                          {errors.suitableFor}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Frame Width</label>
                    <input
                      type="text"
                      className="form-control"
                      name="frameWidth"
                      value={formData.frameWidth}
                      onChange={handleChange}
                      placeholder="140 mm"
                    />
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group mb-3">
                    <label className="form-label">Frame Dimensions</label>
                    <input
                      type="text"
                      className="form-control"
                      name="frameDimensions"
                      value={formData.frameDimensions}
                      onChange={handleChange}
                      placeholder="52-18-140"
                    />
                  </div>

                  <div className="form-group mb-3">
                    <label className="form-label">Frame Colors</label>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <input
                        type="color"
                        className="form-control-color"
                        value={colorInput}
                        onChange={handleColorInputChange}
                        style={{ width: "40px", height: "40px" }}
                      />
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={addColor}
                      >
                        Add Color
                      </button>
                    </div>

                    {formData.frameColor.length > 0 && (
                      <div className="colors-container mt-2">
                        <div className="d-flex flex-wrap gap-2">
                          {formData.frameColor.map((color, index) => (
                            <div key={index} className="color-chip">
                              <div
                                className="color-preview"
                                style={{ backgroundColor: color }}
                              />
                              <span className="color-value">{color}</span>
                              <button
                                type="button"
                                className="btn-close btn-close-red"
                                onClick={() => removeColor(color)}
                                aria-label="Remove color"
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Weight</label>
                        <input
                          type="text"
                          className="form-control"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          placeholder="22g"
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group mb-3">
                        <label className="form-label">Material</label>
                        <input
                          type="text"
                          className="form-control"
                          name="material"
                          value={formData.material}
                          onChange={handleChange}
                          placeholder="TR90"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <label className="form-label">Pupillary Distance</label>
                      <input
                        type="text"
                        className="form-control"
                        name="pupillaryDistance"
                        value={formData.pupillaryDistance}
                        onChange={handleChange}
                        placeholder="55 mm"
                      />
                    </div>

                    <div className="col-md-6">
                      <label className="form-label">Face Shape</label>
                      <input
                        type="text"
                        className="form-control"
                        name="faceShape"
                        value={formData.faceShape}
                        onChange={handleChange}
                        placeholder="Round, Oval, Square"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => navigate("/productList")}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <ColorRing
                        visible={true}
                        height="20"
                        width="20"
                        ariaLabel="color-ring-loading"
                        wrapperStyle={{}}
                        wrapperClass="color-ring-wrapper me-2"
                        colors={["#fff", "#fff", "#fff", "#fff", "#fff"]}
                      />
                      Adding...
                    </>
                  ) : (
                    <>
                      <FiPlus className="me-2" />
                      Add Product
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        .image-upload-container {
          border: 2px dashed #ddd;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
          transition: all 0.3s;
        }

        .image-upload-container:hover {
          border-color: #0d6efd;
        }

        .image-upload-label {
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: #0d6efd;
          font-weight: 500;
        }

        .image-preview-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 15px;
        }

        .image-preview-item {
          position: relative;
          width: 80px;
          height: 80px;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }

        .image-preview-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-btn {
          position: absolute;
          top: 5px;
          right: 5px;
          width: 20px;
          height: 20px;
          padding: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 10px;
        }

        .color-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          background-color: #f8f9fa;
          border-radius: 20px;
          padding: 4px 8px 4px 4px;
          border: 1px solid #dee2e6;
        }

        .color-preview {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1px solid #dee2e6;
        }

        .color-value {
          font-size: 0.8rem;
          color: #495057;
        }

        .btn-close {
          font-size: 0.6rem;
          padding: 0.25rem;
        }

        .form-control-color {
          padding: 0;
          border: none;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
};

export default AddProduct;
