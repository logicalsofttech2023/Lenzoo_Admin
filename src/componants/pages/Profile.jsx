import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLock,
  faEnvelope,
  faPhone,
  faMapMarkerAlt,
  faSave,
  faKey,
  faUpload,
  faUserCog,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";

const Profile = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("profile");
  const [userData, setUserData] = useState({});
  const [passwordData, setPasswordData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    FeatchProfile();
  }, []);

  const FeatchProfile = () => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}getAdminDetail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((result) => {
        let res = result?.data?.data;
        setUserData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const data = {
        name: userData.name,
        email: userData.email,
      };

      const response = await axios.post(
        `${import.meta.env.VITE_API_BASE_URL}updateAdminDetail`,
        data,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success(t("profileUpdateSuccess"));
      setIsEditing(false);

      if (response.data?.image) {
        setUserData((prev) => ({ ...prev, image: response.data.image }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || t("profileUpdateError"));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    const data = {
      newPassword: passwordData.newPassword,
      confirmPassword: passwordData.confirmPassword,
    };

    setIsLoading(true);
    axios
      .post(`${import.meta.env.VITE_API_BASE_URL}resetAdminPassword`, data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast.success(t("passwordChangeSuccess"));
        setPasswordData({
          newPassword: "",
          confirmPassword: "",
        });
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || t("passwordChangeError"));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <div className="container-fluid py-4 bg-light">
      <ToastContainer position="top-right" autoClose={3000} />
      <div className="row">
        <div className="col-lg-12">
          <div className="card shadow-sm border-0">
            <div className="card-body p-4">
              <ul
                className="nav nav-tabs nav-tabs-custom mb-4"
                id="profile-tabs"
              >
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "profile" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("profile")}
                  >
                    <FontAwesomeIcon icon={faUser} className="me-2" />
                    {t("profile")}
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={`nav-link ${
                      activeTab === "password" ? "active" : ""
                    }`}
                    onClick={() => setActiveTab("password")}
                  >
                    <FontAwesomeIcon icon={faKey} className="me-2" />
                    {t("password")}
                  </button>
                </li>
              </ul>

              {activeTab === "profile" && (
                <form onSubmit={handleProfileSubmit}>
                  <div className="row mb-3">
                    <div className="col-md-6 mb-3">
                      <label htmlFor="name" className="form-label">
                        {t("name")}
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.name ? "is-invalid" : ""
                        }`}
                        id="name"
                        name="name"
                        value={userData.name}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="col-md-6 mb-3">
                      <label htmlFor="email" className="form-label">
                        {t("email")}
                      </label>
                      <input
                        type="text"
                        className={`form-control ${
                          errors.email ? "is-invalid" : ""
                        }`}
                        id="email"
                        name="email"
                        value={userData.email}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="d-flex justify-content-end gap-2">
                    {!isEditing ? (
                      <button
                        type="button"
                        className="btn btn-primary"
                        onClick={() => setIsEditing(true)}
                      >
                        <FontAwesomeIcon icon={faEdit} className="me-2" />
                        {t("editProfile")}
                      </button>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="btn btn-outline-secondary"
                          onClick={() => {
                            setIsEditing(false);
                          }}
                        >
                          {t("cancel")}
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={isLoading}
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2"></span>
                              {t("saving")}...
                            </>
                          ) : (
                            <>
                              <FontAwesomeIcon icon={faSave} className="me-2" />
                              {t("saveChanges")}
                            </>
                          )}
                        </button>
                      </>
                    )}
                  </div>
                </form>
              )}

              {activeTab === "password" && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3">
                    <label htmlFor="newPassword" className="form-label">
                      {t("newPassword")}
                    </label>
                    <div className="input-group">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        className={`form-control ${
                          errors.newPassword ? "is-invalid" : ""
                        }`}
                        id="newPassword"
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        placeholder={t("enterNewPassword")}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() =>
                          setShowCurrentPassword(!showCurrentPassword)
                        }
                      >
                        <FontAwesomeIcon
                          icon={showCurrentPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="mb-3">
                    <label htmlFor="confirmPassword" className="form-label">
                      {t("confirmPassword")}
                    </label>
                    <div className="input-group">
                      <input
                        type={showNewPassword ? "text" : "password"}
                        className={`form-control ${
                          errors.confirmPassword ? "is-invalid" : ""
                        }`}
                        id="confirmPassword"
                        name="confirmPassword"
                        value={passwordData.confirmPassword}
                        onChange={handlePasswordChange}
                        placeholder={t("enterConfirmPassword")}
                      />
                      <button
                        type="button"
                        className="btn btn-outline-primary"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                      >
                        <FontAwesomeIcon
                          icon={showNewPassword ? faEyeSlash : faEye}
                        />
                      </button>
                    </div>
                  </div>

                  <div className="alert alert-info mb-4">
                    <strong>{t("passwordRequirements")}:</strong>
                    <ul className="mb-0">
                      <li>{t("minCharacters")}</li>
                      <li>{t("oneUppercase")}</li>
                      <li>{t("oneNumber")}</li>
                      <li>{t("oneSpecialChar")}</li>
                    </ul>
                  </div>

                  <div className="d-flex justify-content-end">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        t("updating")
                      ) : (
                        <>
                          <FontAwesomeIcon icon={faKey} className="me-2" />
                          {t("changePassword")}
                        </>
                      )}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;