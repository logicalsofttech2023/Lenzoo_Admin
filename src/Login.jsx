import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get form values
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // Show loading indicator
      Swal.fire({
        title: t('loading'),
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Make API call using Axios
      const response = await axios.post(`${base_url}loginAdmin`, {
        email,
        password
      });

      const data = response.data;

      // Login successful
      Swal.fire({
        icon: 'success',
        title: t('success'),
        text: data.message,
        timer: 1500,
        showConfirmButton: false
      });

      // Save admin data to localStorage
      localStorage.setItem('token', data.token);

      // Redirect to home page
      window.location.href = '/';

    } catch (error) {
      console.error('Login error:', error);
      
      // Determine error message
      let errorMessage = t('error_default');
      if (error.response) {
        errorMessage = error.response.data.message || t('error_invalid_credentials');
      } else if (error.request) {
        errorMessage = t('error_no_response');
      }

      Swal.fire({
        icon: 'error',
        title: error.response ? t('error_title') : t('error_generic_title'),
        text: errorMessage,
      });
    }
  };

  return (
    <div className="main-wrapper">
      <div className="account-content">
        <div className="login-wrapper login-new">
          <div className="row w-100">
            <div className="col-lg-5 mx-auto">
              <div className="login-content user-login">
                <div className="text-center mb-4">
                  <h1 className="display-3 fw-bold fs-30">
                    Lenzoo<span className="text-danger">+</span>
                  </h1>
                </div>
                <form onSubmit={handleSubmit}>
                  <div className="card">
                    <div className="card-body p-5">
                      <div className="login-userheading">
                        <h3>{t('sign_in')}</h3>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          {t('email')} <span className="text-danger"> *</span>
                        </label>
                        <div className="input-group">
                          <input
                            type="text"
                            className="form-control border-end-0"
                            required
                          />
                          <span className="input-group-text border-start-0">
                            <i className="ti ti-mail"></i>
                          </span>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label className="form-label">
                          {t('password')} <span className="text-danger"> *</span>
                        </label>
                        <div className="pass-group">
                          <input
                            type="password"
                            className="pass-input form-control"
                            required
                          />
                          <span className="ti toggle-password ti-eye-off text-gray-9"></span>
                        </div>
                      </div>
                      <div className="form-login authentication-check">
                        <div className="row">
                          <div className="col-12 d-flex align-items-center justify-content-between">
                            <div className="text-end">
                              <Link
                                className="text-orange fs-16 fw-medium"
                                to="/forgotAdminPassword"
                              >
                                {t('forgot_password')}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="form-login">
                        <button type="submit" className="btn btn-primary w-100">
                          {t('sign_in_button')}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;