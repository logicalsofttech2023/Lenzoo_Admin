import React, { useEffect, useState, useRef, Suspense  } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { 
  FiEdit, 
  FiArrowLeft,
  FiBox,
  FiDollarSign,
  FiLayers,
  FiTag,
  FiUsers,
  FiInfo,
  FiSquare,
  FiDroplet,
  FiFeather,
  FiHash,
  FiArrowLeftCircle,
  FiEdit2,
  FiEye,
  FiGlobe
} from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaPencilRuler } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// 3D Model Viewer Component
const ModelViewer = ({ glbFile }) => {
  const { scene } = useGLTF(glbFile);
  return <primitive object={scene} scale={20} />;
};

const ProductDetail = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [product, setProduct] = useState(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState("images"); // 'images' or '3d'
  const { t } = useTranslation();

  // Get product ID from navigation state
  const productId = location.state?.id;

  // Fetch product details
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}getProductById`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          params: {
            id: productId,
          },
        });

        if (response.data.success) {
          setProduct(response.data.product);
        } else {
          setError(response.data.message || t("error_fetching"));
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(t("error_fetching"));
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    } else {
      setError("No product ID provided");
      setLoading(false);
    }
  }, [base_url, productId, t]);

  // Image slider settings
  const sliderSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: (current) => setActiveImageIndex(current),
  };

  const handleEdit = () => {
    navigate(`/editProduct`, { state: { id: productId } });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (error) {
    return (
      <div className="admin-container">
        <div className="content">
          <div className="alert alert-danger mt-3">{error}</div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="admin-container">
        <div className="content">
          <div className="d-flex justify-content-center align-items-center" style={{ height: "300px" }}>
            <ColorRing
              visible={true}
              height="80"
              width="80"
              ariaLabel="color-ring-loading"
              wrapperStyle={{}}
              wrapperClass="color-ring-wrapper"
              colors={['#6366f1', '#818cf8', '#a5b4fc', '#c7d2fe', '#e0e7ff']}
            />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="admin-container">
        <div className="content">
          <div className="alert alert-info mt-3">{t("no_product_data")}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-container">
      <div className="content">
        {/* Page Header */}
        <div className="page-header">
          <div className="header-content" style={{ width: "100%" }}>
            <div className="header-title">
              <h2>{t("product_details")}</h2>
              <p className="text-muted">{t("view_manage_product")}</p>
            </div>
            <div className="header-actions">
              <button className="btn btn-outline-secondary me-2" onClick={handleBack}>
                <FiArrowLeftCircle className="me-2" /> {t("back_to_products")}
              </button>
              <button className="btn btn-primary" onClick={handleEdit}>
                <FiEdit2 className="me-2" /> {t("edit_product")}
              </button>
            </div>
          </div>
        </div>

        {/* Product Content */}
        <div className="product-detail-container">
          <div className="row">
            {/* Product Info */}
            <div className="col-lg-12">
              <div className="product-info">
                <h1 className="product-name">{product.name}</h1>
                <h4 className="product-title text-muted">{product.title}</h4>
                <p className="product-description">{product.description}</p>

                <div className="price-container">
                  <div className="current-price">
                    €{product.sellingPrice.toLocaleString()}
                  </div>
                  {product.originalPrice > product.sellingPrice && (
                    <div className="original-price">
                      <span className="text-muted text-decoration-line-through">
                        €{product.originalPrice.toLocaleString()}
                      </span>
                      <span className="discount-badge">
                        {Math.round(
                          ((product.originalPrice - product.sellingPrice) / product.originalPrice) * 100
                        )}% OFF
                      </span>
                    </div>
                  )}
                </div>

                <div className="product-meta">
                  <div className="meta-item">
                    <FiHash className="meta-icon" />
                    <span>{t("product_id")}: {product.productId}</span>
                  </div>
                  <div className="meta-item">
                    <FiBox className="meta-icon" />
                    <span>{t("type")}: {product.productType}</span>
                  </div>
                  <div className="meta-item">
                    <FiLayers className="meta-icon" />
                    <span>{t("frame")}: {product.frameType}</span>
                  </div>
                  <div className="meta-item">
                    <FiTag className="meta-icon" />
                    <span>{t("shape")}: {product.frameShape}</span>
                  </div>
                  <div className="meta-item">
                    <FiUsers className="meta-icon" />
                    <span>{t("quantity")}: {product.quantityAvailable}</span>
                  </div>
                  {product.discount && (
                    <div className="meta-item">
                      <FiDollarSign className="meta-icon" />
                      <span>{t("discount")}: {product.discount}%</span>
                    </div>
                  )}
                </div>

                <div className="specifications">
                  <h5 className="section-title">{t("specifications")}</h5>
                  <div className="specs-grid">
                    <div className="spec-item">
                      <div className="spec-label">
                        <FiSquare className="me-2" />
                        {t("frame_size")}
                      </div>
                      <div className="spec-value">
                        {Array.isArray(product.frameSize) 
                          ? product.frameSize.join(", ") 
                          : product.frameSize}
                      </div>
                    </div>
                    <div className="spec-item">
                      <div className="spec-label">
                        <FiUsers className="me-2" />
                        {t("suitable_for")}
                      </div>
                      <div className="spec-value">
                        {Array.isArray(product.suitableFor) 
                          ? product.suitableFor.join(", ") 
                          : product.suitableFor}
                      </div>
                    </div>
                    <div className="spec-item">
                      <div className="spec-label">
                        <FiSquare className="me-2" />
                        {t("frame_width")}
                      </div>
                      <div className="spec-value">{product.frameWidth}</div>
                    </div>
                    <div className="spec-item">
                      <div className="spec-label">
                        <FiInfo className="me-2" />
                        {t("frame_dimensions")}
                      </div>
                      <div className="spec-value">{product.frameDimensions}</div>
                    </div>
                    <div className="spec-item">
                      <div className="spec-label">
                        <FiDroplet className="me-2" />
                        {t("frame_color")}
                      </div>
                      <div className="spec-value">
                        {Array.isArray(product.frameColor) 
                          ? product.frameColor.join(", ") 
                          : product.frameColor}
                      </div>
                    </div>
                    <div className="spec-item">
                      <div className="spec-label">
                        <FiFeather className="me-2" />
                        {t("weight")}
                      </div>
                      <div className="spec-value">{product.weight}</div>
                    </div>
                    <div className="spec-item">
                      <div className="spec-label">
                        <FiBox className="me-2" />
                        {t("material")}
                      </div>
                      <div className="spec-value">{product.material}</div>
                    </div>
                    {product.pupillaryDistance && (
                      <div className="spec-item">
                        <div className="spec-label">
                          <FaPencilRuler className="me-2" />
                          {t("pupillary_distance")}
                        </div>
                        <div className="spec-value">{product.pupillaryDistance}</div>
                      </div>
                    )}
                    {product.faceShape && (
                      <div className="spec-item">
                        <div className="spec-label">
                          <FiUsers className="me-2" />
                          {t("face_shape")}
                        </div>
                        <div className="spec-value">{product.faceShape}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Images and 3D Viewer */}
            <div className="col-lg-12">
              <div className="product-gallery">
                <div className="view-toggle mb-3">
                  <button 
                    className={`btn ${activeTab === 'images' ? 'btn-primary' : 'btn-outline-primary'} me-2`}
                    onClick={() => setActiveTab('images')}
                  >
                    <FiEye className="me-2" /> {t("images")}
                  </button>
                  {product.glbFile && (
                    <button
                      className={`btn ${activeTab === '3d' ? 'btn-primary' : 'btn-outline-primary'}`}
                      onClick={() => setActiveTab('3d')}
                    >
                      <FiGlobe className="me-2" /> {t("3d_view")}
                    </button>
                  )}
                </div>

                {activeTab === 'images' ? (
                  <>
                    <div className="main-image-slider">
                      <Slider {...sliderSettings}>
                        {product.images.map((image, index) => (
                          <div key={index} className="slider-item">
                            <div className="image-wrapper">
                              <img
                                src={`${file_url}${image}`}
                                alt={`Product ${index + 1}`}
                                className="img-fluid"
                              />
                            </div>
                          </div>
                        ))}
                      </Slider>
                    </div>
                    <div className="thumbnail-gallery">
                      {product.images.map((image, index) => (
                        <div
                          key={index}
                          className={`thumbnail-item ${index === activeImageIndex ? 'active' : ''}`}
                          onClick={() => setActiveImageIndex(index)}
                        >
                          <img
                            src={`${file_url}${image}`}
                            alt={`Thumbnail ${index + 1}`}
                            className="img-fluid"
                          />
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="model-viewer-container">
                    <Canvas camera={{ position: [5, 5, 5], fov: 25 }}>
                      <ambientLight intensity={0.5} />
                      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} />
                      <pointLight position={[-10, -10, -10]} />
                       <Suspense fallback={null}>
                        <ModelViewer glbFile={`${file_url}${product.glbFile}`} />
                       </Suspense>
                      <OrbitControls />
                    </Canvas>
                    <div className="model-instructions mt-2">
                      <small className="text-muted">
                        {t("3d_instructions")}
                      </small>
                    </div>
                  </div>
                )}
                
                <div className="product-footer">
                  <div className="created-date">
                    <small className="text-muted">
                      {t("created")}: {new Date(product.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </small>
                  </div>
                  <div className="updated-date">
                    <small className="text-muted">
                      {t("last_updated")}: {new Date(product.updatedAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .admin-container {
          background-color: #f5f7fb;
          min-height: 100vh;
        }
        
        .content {
          padding: 20px;
        }
        
        /* Page Header */
        .page-header {
          margin-bottom: 30px;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .header-title h2 {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 5px;
        }
        
        .header-title p {
          color: #718096;
          margin-bottom: 0;
        }
        
        /* Product Gallery */
        .product-gallery {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 20px;
          height: 100%;
        }
        
        .main-image-slider {
          margin-bottom: 15px;
        }
        
        .image-wrapper {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 400px;
          background: #f8fafc;
          border-radius: 8px;
          overflow: hidden;
        }
        
        .image-wrapper img {
          max-height: 100%;
          max-width: 100%;
          object-fit: contain;
        }
        
        .thumbnail-gallery {
          display: flex;
          gap: 10px;
          overflow-x: auto;
          padding-bottom: 10px;
        }
        
        .thumbnail-item {
          width: 80px;
          height: 80px;
          border: 2px solid #e2e8f0;
          border-radius: 6px;
          overflow: hidden;
          cursor: pointer;
          flex-shrink: 0;
          transition: all 0.2s;
        }
        
        .thumbnail-item:hover {
          border-color: #c7d2fe;
        }
        
        .thumbnail-item.active {
          border-color: #6366f1;
        }
        
        .thumbnail-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        
        /* 3D Model Viewer */
        .model-viewer-container {
          height: 400px;
          background: #f8fafc;
          border-radius: 8px;
          overflow: hidden;
          position: relative;
        }
        
        /* Product Info */
        .product-info {
          background: white;
          border-radius: 12px;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          padding: 25px;
          height: 100%;
        }
        
        .product-name {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 5px;
        }
        
        .product-title {
          font-weight: 500;
          color: #718096;
          margin-bottom: 20px;
        }
        
        .product-description {
          color: #4a5568;
          margin-bottom: 25px;
          line-height: 1.6;
        }
        
        /* Price Container */
        .price-container {
          margin-bottom: 25px;
        }
        
        .current-price {
          font-size: 28px;
          font-weight: 700;
          color: #6366f1;
        }
        
        .original-price {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 5px;
        }
        
        .discount-badge {
          background-color: #ecfdf5;
          color: #10b981;
          padding: 2px 8px;
          border-radius: 4px;
          font-size: 14px;
          font-weight: 500;
        }
        
        /* Product Meta */
        .product-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 15px;
          margin-bottom: 25px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          background: #f8fafc;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 14px;
          color: #4a5568;
        }
        
        .meta-icon {
          margin-right: 8px;
          color: #6366f1;
        }
        
        /* Specifications */
        .section-title {
          font-weight: 600;
          color: #2d3748;
          margin-bottom: 15px;
          padding-bottom: 8px;
          border-bottom: 1px solid #edf2f7;
        }
        
        .specs-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
          gap: 15px;
        }
        
        .spec-item {
          margin-bottom: 10px;
        }
        
        .spec-label {
          font-size: 14px;
          color: #718096;
          display: flex;
          align-items: center;
        }
        
        .spec-value {
          font-weight: 500;
          color: #2d3748;
          margin-top: 5px;
        }
        
        /* Product Footer */
        .product-footer {
          display: flex;
          justify-content: space-between;
          margin-top: 30px;
          padding-top: 15px;
          border-top: 1px solid #edf2f7;
          font-size: 13px;
        }
        
        /* Responsive */
        @media (max-width: 992px) {
          .image-wrapper {
            height: 350px;
          }
          
          .model-viewer-container {
            height: 350px;
          }
        }
        
        @media (max-width: 768px) {
          .header-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .image-wrapper {
            height: 300px;
          }
          
          .model-viewer-container {
            height: 300px;
          }
          
          .specs-grid {
            grid-template-columns: 1fr 1fr;
          }
        }
        
        @media (max-width: 576px) {
          .image-wrapper {
            height: 250px;
          }
          
          .model-viewer-container {
            height: 250px;
          }
          
          .specs-grid {
            grid-template-columns: 1fr;
          }
          
          .product-footer {
            flex-direction: column;
            gap: 5px;
          }
        }
      `}</style>
    </div>
  );
};

export default ProductDetail;