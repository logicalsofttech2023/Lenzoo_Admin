import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminData , setAdminData] = useState();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/Login";
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
        setOpenLanguage(false);
        setSearchOpen(false);
        setIsOpen(false);
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = () => {
    axios
      .get(`${import.meta.env.VITE_API_BASE_URL}getAdminDetail`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((result) => {
        let res = result?.data?.data;
        setAdminData(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <div className="header">
        <div className="main-header">
          {/* Logo */}
          <div className="header-left active">
            <div className="logo logo-normal">
              <h1 className="display-3 logo logo-normal fw-bold">
                Lenzoo<span className="text-danger">+</span>
              </h1>
            </div>

            <a href="index.html" className="logo-small">
              <h1 className="display-3 logo logo-normal fw-bold">
                Lenzoo<span className="text-danger">+</span>
              </h1>
            </a>
          </div>
          {/* /Logo */}
          <a
            id="mobile_btn"
            className="mobile_btn"
            href="#sidebar"
            onClick={(e) => {
              e.preventDefault();
              toggleMobileMenu();
            }}
          >
            <span className="bar-icon">
              <span />
              <span />
              <span />
            </span>
          </a>

          {/* Header Menu - Show on larger screens */}
          <ul
            className={`nav user-menu ${
              mobileMenuOpen ? "mobile-menu-visible" : ""
            }`}
          >
            {/* Search - Hidden on mobile */}
            <li
              className="nav-item nav-searchinputs d-none d-md-block"
              ref={dropdownRef}
            >
              <div className="top-nav-search">
                <button
                  className="responsive-search btn"
                  onClick={() => setSearchOpen(!searchOpen)}
                >
                  <i className="fa fa-search" />
                </button>
                <div className="dropdown">
                  <div
                    className="searchinputs input-group"
                    onClick={() => setSearchOpen(!searchOpen)}
                    role="button"
                  >
                    <input type="text" placeholder="Search" />
                    <div className="search-addon">
                      <span>
                        <i className="ti ti-search" />
                      </span>
                    </div>
                    <span className="input-group-text">
                      <kbd className="d-flex align-items-center">
                        <img
                          src="assets/img/icons/command.svg"
                          alt="cmd"
                          className="me-1"
                        />
                      </kbd>
                    </span>
                  </div>
                </div>
              </div>
            </li>

            {/* Notifications - Hidden on mobile */}
            <li
              className="nav-item dropdown nav-item-box d-none d-md-block"
              ref={dropdownRef}
            >
              <a
                type="button"
                className="dropdown-toggle nav-link "
                onClick={() => setOpen(!open)}
              >
                <i className="ti ti-bell"></i>
              </a>

              {open && (
                <div
                  className="dropdown-menu notifications show"
                  style={{ minWidth: "350px", top: " -220%", right: "-15px" }}
                >
                  <div className="topnav-dropdown-header">
                    <h5 className="notification-title">Notifications</h5>
                    <button className="clear-noti btn btn-link p-0">
                      Mark all as read
                    </button>
                  </div>
                  <div className="noti-content">
                    <ul className="notification-list">
                      <li className="notification-message">
                        <Link to="/activities">
                          <div className="media d-flex">
                            <span className="avatar flex-shrink-0">
                              <img
                                alt="Img"
                                src="assets/img/profiles/avatar-13.jpg"
                              />
                            </span>
                            <div className="flex-grow-1">
                              <p className="noti-details">
                                <span className="noti-title">James Kirwin</span>{" "}
                                confirmed his order. Order No: #78901. Estimated
                                delivery: 2 days
                              </p>
                              <p className="noti-time">4 mins ago</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className="notification-message">
                        <Link to="/activities">
                          <div className="media d-flex">
                            <span className="avatar flex-shrink-0">
                              <img
                                alt="Img"
                                src="assets/img/profiles/avatar-03.jpg"
                              />
                            </span>
                            <div className="flex-grow-1">
                              <p className="noti-details">
                                <span className="noti-title">Leo Kelly</span>{" "}
                                cancelled his order scheduled for 17 Jan 2025
                              </p>
                              <p className="noti-time">10 mins ago</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className="notification-message">
                        <Link to="/activities" className="recent-msg">
                          <div className="media d-flex">
                            <span className="avatar flex-shrink-0">
                              <img
                                alt="Img"
                                src="assets/img/profiles/avatar-17.jpg"
                              />
                            </span>
                            <div className="flex-grow-1">
                              <p className="noti-details">
                                Payment of $50 received for Order #67890 from{" "}
                                <span className="noti-title">
                                  Antonio Engle
                                </span>
                              </p>
                              <p className="noti-time">05 mins ago</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                      <li className="notification-message">
                        <Link to="/activities" className="recent-msg">
                          <div className="media d-flex">
                            <span className="avatar flex-shrink-0">
                              <img
                                alt="Img"
                                src="assets/img/profiles/avatar-02.jpg"
                              />
                            </span>
                            <div className="flex-grow-1">
                              <p className="noti-details">
                                <span className="noti-title">Andrea</span>{" "}
                                confirmed his order. Order No: #73401. Estimated
                                delivery: 3 days
                              </p>
                              <p className="noti-time">4 mins ago</p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    </ul>
                  </div>
                  <div className="topnav-dropdown-footer d-flex align-items-center gap-3">
                    <button
                      className="btn btn-secondary btn-md w-100"
                      onClick={() => setOpen(false)}
                    >
                      Cancel
                    </button>
                    <Link
                      to="/activities"
                      className="btn btn-primary btn-md w-100"
                    >
                      View all
                    </Link>
                  </div>
                </div>
              )}
            </li>

            {/* Profile Dropdown - Desktop - Hidden on mobile */}
            <li
              className="nav-item dropdown nav-item-box d-none d-md-block"
              ref={dropdownRef}
            >
              <a
                type="button"
                className="dropdown-toggle nav-link"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span className="user-img">
                  <img
                    src={
                      "assets/img/profiles/avatar-01.jpg"
                    }
                    alt="User"
                    width="36"
                    height="36"
                    className="rounded-circle"
                  />
                </span>
              </a>

              {profileDropdownOpen && (
                <div
                  className="dropdown-menu profile-dropdown show"
                  style={{ position: "absolute", top: "-80px", right: "-15px" }}
                >
                  <div className="dropdown-header">
                    <h6 className="text-overflow m-0">
                      {adminData?.name || "Admin User"}
                    </h6>
                    <span className="text-muted">
                      {adminData?.email || "admin@example.com"}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <i className="ti ti-user me-2"></i> View Profile
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="ti ti-logout me-2"></i> Logout
                  </button>
                </div>
              )}
            </li>

            {/* Mobile Menu Profile - Only shows on small screens */}
            <li className="nav-item dropdown nav-item-box d-md-none">
              <a
                type="button"
                className="dropdown-toggle nav-link"
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
              >
                <span className="user-img">
                  <img
                    src={
                      
                      "assets/img/profiles/avatar-01.jpg"
                    }
                    alt="User"
                    width="36"
                    height="36"
                    className="rounded-circle"
                  />
                </span>
              </a>

              {profileDropdownOpen && (
                <div
                  className="dropdown-menu profile-dropdown show"
                  style={{
                    minWidth: "280px",
                    position: "absolute",
                    right: "10px",
                    top: "100%",
                    zIndex: 1000,
                    border: "1px solid rgba(0,0,0,.15)",
                    borderRadius: "0.25rem",
                    backgroundColor: "#fff",
                    boxShadow: "0 0.5rem 1rem rgba(0,0,0,.175)",
                  }}
                >
                  <div className="dropdown-header">
                    <h6 className="text-overflow m-0">
                      {adminData?.name || "Admin User"}
                    </h6>
                    <span className="text-muted">
                      {adminData?.email || "admin@example.com"}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                    style={{
                      padding: "0.25rem 1.5rem",
                      clear: "both",
                      fontWeight: 400,
                      color: "#212529",
                      textAlign: "inherit",
                      whiteSpace: "nowrap",
                      backgroundColor: "transparent",
                      border: 0,
                      display: "block",
                      width: "100%",
                      textDecoration: "none",
                    }}
                  >
                    <i className="ti ti-user me-2"></i> View Profile
                  </Link>
                  <div
                    className="dropdown-divider"
                    style={{
                      height: "0",
                      margin: "0.5rem 0",
                      overflow: "hidden",
                      borderTop: "1px solid #e9ecef",
                    }}
                  ></div>
                  <button
                    className="dropdown-item"
                    onClick={handleLogout}
                    style={{
                      padding: "0.25rem 1.5rem",
                      clear: "both",
                      fontWeight: 400,
                      color: "#212529",
                      textAlign: "inherit",
                      whiteSpace: "nowrap",
                      backgroundColor: "transparent",
                      border: 0,
                      display: "block",
                      width: "100%",
                      cursor: "pointer",
                    }}
                  >
                    <i className="ti ti-logout me-2"></i> Logout
                  </button>
                </div>
              )}
            </li>
          </ul>
        </div>
      </div>

      {/* Mobile responsive CSS */}
      <style jsx>{`
        @media (max-width: 991px) {
          .nav.user-menu {
            display: flex;
            align-items: center;
            justify-content: flex-end;
          }
          .nav.user-menu .nav-searchinputs,
          .nav.user-menu .nav-item-box:not(.d-md-none) {
            display: none !important;
          }
          .nav.user-menu .dropdown-menu {
            width: 280px;
            right: 10px;
            left: auto;
          }
          .nav.user-menu .user-img img {
            border: 2px solid #fff;
          }
        }
        @media (min-width: 992px) {
          .nav.user-menu .d-md-none {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Header;
