import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import axios from 'axios';

const Login = () => {
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_BASE_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Get form values
    const email = e.target[0].value;
    const password = e.target[1].value;

    try {
      // Show loading indicator
      Swal.fire({
        title: 'Logging in...',
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
        title: 'Success!',
        text: data.message,
        timer: 1500,
        showConfirmButton: false
      });

      console.log(response);
      

      // Save admin data to localStorage
      localStorage.setItem('token', data.token);

      // Redirect to home page
      window.location.href = '/';

    } catch (error) {
      console.error('Login error:', error);
      
      // Determine error message
      let errorMessage = 'An error occurred during login. Please try again.';
      if (error.response) {
        // The request was made and the server responded with a status code
        errorMessage = error.response.data.message || 'Invalid email or password';
      } else if (error.request) {
        // The request was made but no response was received
        errorMessage = 'No response from server. Please try again.';
      }

      Swal.fire({
        icon: 'error',
        title: error.response ? 'Login Failed' : 'Error',
        text: errorMessage,
      });
    }
  };

  return (
    <>
      {/* <div id="global-loader">
        <div className="whirly-loader"></div>
      </div> */}

      {/* Main Wrapper */}
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
                          <h3>Sign In</h3>
                          
                        </div>
                        <div className="mb-3">
                          <label className="form-label">
                            Email <span className="text-danger"> *</span>
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
                            Password <span className="text-danger"> *</span>
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
                                <a
                                  className="text-orange fs-16 fw-medium"
                                  href="forgot-password.html"
                                >
                                  Forgot Password?
                                </a>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="form-login">
                          <button type="submit" className="btn btn-primary w-100">
                            Sign In
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
    </>
  );
};

export default Login;