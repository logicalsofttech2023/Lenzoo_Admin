import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import { useTranslation } from "react-i18next";

const ForgotAdminPassword = () => {
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: reset password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [tempOtp, setTempOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { t } = useTranslation();

  const handleEmailSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: t("sending_otp"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(`${base_url}forgotAdminPassword`, {
        email: email,
      });

      setTempOtp(response.data.otp);

      Swal.fire({
        icon: "success",
        title: t("success"),
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      setStep(2); // Move to OTP verification step
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "An error occurred. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: t("error_title"),
        text: errorMessage,
      });
    }
  };

  const handleOtpSubmit = async (e) => {
    e.preventDefault();

    try {
      Swal.fire({
        title: t("verifying_otp"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(`${base_url}verifyAdminOtp`, {
        email: email,
        otp: otp,
      });

      Swal.fire({
        icon: "success",
        title: t("success"),
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      setStep(3); // Move to password reset step
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = "An error occurred. Please try again.";
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: t("error_title"),
        text: errorMessage,
      });
    }
  };

  const handleResetPasswordSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      Swal.fire({
        icon: "error",
        title: t("error_title"),
        text: t("password_mismatch"),
      });
      return;
    }

    try {
      Swal.fire({
        title: t("resetting_password"),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const response = await axios.post(
        `${base_url}resetAdminPasswordAfterOtp`,
        {
          email: email,
          newPassword: newPassword,
          confirmPassword: confirmPassword,
        }
      );

      Swal.fire({
        icon: "success",
        title: t("success"),
        text: response.data.message,
        timer: 1500,
        showConfirmButton: false,
      });

      // Redirect to login after successful password reset
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
      console.error("Error:", error);
      let errorMessage = t("error_default");
      if (error.response) {
        errorMessage = error.response.data.message || errorMessage;
      }

      Swal.fire({
        icon: "error",
        title: t("error_title"),
        text: errorMessage,
      });
    }
  };

  return (
    <>
      <div className="main-wrapper">
        <div className="account-content">
          <div className="login-wrapper login-new">
            <div className="row w-100">
              <div className="col-lg-12 mx-auto">
                <div className="login-content user-login">
                  <div className="text-center mb-4">
                    <h1 className="display-3 fw-bold fs-30">
                      Lenzoo<span className="text-danger">+</span>
                    </h1>
                  </div>

                  {/* Step 1: Email Input */}
                  {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                      <div className="card">
                        <div className="card-body p-5">
                          <div className="login-userheading">
                            <h3>{t("reset_password")}</h3>
                            <p className="text-muted">{t("enter_email")}</p>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              {t("email")}{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="input-group">
                              <input
                                type="email"
                                className="form-control border-end-0"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                              />
                              <span className="input-group-text border-start-0">
                                <i className="ti ti-mail"></i>
                              </span>
                            </div>
                          </div>
                          <div className="form-login">
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              {t("send_otp")}
                            </button>
                          </div>
                          <div className="text-center mt-3">
                            <a href="/login" className="text-orange">
                              {t("back_to_login")}
                            </a>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {/* Step 2: OTP Verification */}
                  {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                      <div className="card">
                        <div className="card-body p-5">
                          <div className="login-userheading">
                            <h3>{t("verify_otp")}</h3>
                            <p className="text-muted">
                              {t("otp_sent_to", { email })}
                            </p>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              {t("otp")}{" "}
                              <span className="text-danger">
                                {tempOtp ? `(${tempOtp})` : ""}
                              </span>
                            </label>
                            <div className="input-group">
                              <input
                                type="text"
                                className="form-control border-end-0"
                                required
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                              />
                              <span className="input-group-text border-start-0">
                                <i className="ti ti-lock"></i>
                              </span>
                            </div>
                          </div>
                          <div className="form-login">
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              {t("verify_otp_button")}
                            </button>
                          </div>
                          <div className="text-center mt-3">
                            <button
                              type="button"
                              className="btn btn-link text-orange"
                              onClick={() => setStep(1)}
                            >
                              {t("change_email")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}

                  {step === 3 && (
                    <form onSubmit={handleResetPasswordSubmit}>
                      <div className="card">
                        <div className="card-body p-5">
                          <div className="login-userheading">
                            <h3>{t("reset_password")}</h3>
                            <p className="text-muted">
                              {t("enter_new_password")}
                            </p>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              {t("new_password")}{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="pass-group">
                              <input
                                type="password"
                                className="pass-input form-control"
                                required
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                              />
                              <span className="ti toggle-password ti-eye-off text-gray-9"></span>
                            </div>
                          </div>
                          <div className="mb-3">
                            <label className="form-label">
                              {t("confirm_password")}{" "}
                              <span className="text-danger"> *</span>
                            </label>
                            <div className="pass-group">
                              <input
                                type="password"
                                className="pass-input form-control"
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                  setConfirmPassword(e.target.value)
                                }
                              />
                              <span className="ti toggle-password ti-eye-off text-gray-9"></span>
                            </div>
                          </div>
                          <div className="form-login">
                            <button
                              type="submit"
                              className="btn btn-primary w-100"
                            >
                              {t("reset_password_button")}
                            </button>
                          </div>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .main-wrapper {
          display: flex;
          flex-direction: column;
          min-height: 100vh;
          background-color: #f5f5f5;
        }

        .account-content {
          display: flex;
          align-items: center;
          justify-content: center;
          flex: 1;
          padding: 20px;
        }

        .login-wrapper {
          width: 100%;
          max-width: 500px;
        }

        .login-userheading {
          text-align: center;
          margin-bottom: 20px;
        }

        .login-userheading h3 {
          margin-bottom: 5px;
        }

        .text-orange {
          color: #fd7e14;
        }

        .text-orange:hover {
          color: #e8590c;
        }

        .pass-group {
          position: relative;
        }

        .toggle-password {
          position: absolute;
          right: 10px;
          top: 50%;
          transform: translateY(-50%);
          cursor: pointer;
        }

        .card {
          border: none;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.1);
        }

        .card-body {
          padding: 30px;
        }

        .btn-primary {
          background-color: #3b7ddd;
          border-color: #3b7ddd;
        }

        .btn-primary:hover {
          background-color: #326abc;
          border-color: #326abc;
        }

        .text-danger {
          color: #dc3545;
        }

        .text-muted {
          color: #6c757d;
        }
      `}</style>
    </>
  );
};

export default ForgotAdminPassword;
