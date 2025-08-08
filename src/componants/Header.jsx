import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import user from "./user.jpg";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [openLanguage, setOpenLanguage] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [adminData, setAdminData] = useState();
  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };
  const { i18n } = useTranslation();

  const changeLanguage = (lng) => {
    i18n.changeLanguage(lng);
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

  const { t } = useTranslation();

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
              className="nav-item dropdown nav-item-box d-none d-md-block"
              ref={dropdownRef}
            >
              <div className="top-nav-search">
                <div>
                  <select
                    value={i18n.language}
                    onChange={(e) => changeLanguage(e.target.value)}
                    style={{
                      padding: "8px 12px",
                      borderRadius: "4px",
                      color: "#333",
                      fontSize: "14px",
                      cursor: "pointer",
                      outline: "none",
                      transition: "all 0.3s ease",
                      appearance: "none",
                      paddingRight: "20px",
                      backgroundImage:
                        "url(\"data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e\")",
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "right 8px center",
                      backgroundSize: "16px",
                      border: "transparent",
                    }}
                    onMouseOver={(e) =>
                      (e.target.style.borderColor = "#007bff")
                    }
                    onMouseOut={(e) => (e.target.style.borderColor = "#ccc")}
                    onFocus={(e) => (e.target.style.borderColor = "#007bff")}
                    onBlur={(e) => (e.target.style.borderColor = "#ccc")}
                  >
                    <option
                      value="en"
                      style={{ backgroundColor: "#fff", color: "#333" }}
                    >
                      English
                    </option>
                    <option
                      value="pt"
                      style={{ backgroundColor: "#fff", color: "#333" }}
                    >
                      Português
                    </option>
                  </select>
                </div>
              </div>
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
                    src={user}
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
                      {adminData?.name || t("default_admin_name")}
                    </h6>
                    <span className="text-muted">
                      {adminData?.email || t("default_admin_email")}
                    </span>
                  </div>
                  <Link
                    to="/profile"
                    className="dropdown-item"
                    onClick={() => setProfileDropdownOpen(false)}
                  >
                    <i className="ti ti-user me-2"></i> {t("view_profile")}
                  </Link>
                  <div className="dropdown-divider"></div>
                  <button className="dropdown-item" onClick={handleLogout}>
                    <i className="ti ti-logout me-2"></i> {t("logout")}
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
                    src={user}
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
                    <i className="ti ti-user me-2"></i>{t("View Profile")}
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
                    <i className="ti ti-logout me-2"></i>{t("logout")}
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
            width: 160px;
            right: -15px;
            bottom: -83%;
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
