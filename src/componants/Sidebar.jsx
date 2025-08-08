import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import feather from "feather-icons";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";
import { useTranslation } from "react-i18next";

const Sidebar = ({ isSidebarActive, setIsSidebarActive }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const { t } = useTranslation();

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? "" : menuName));
  };

  const handleMenuItemClick = () => {
  // Close sidebar in mobile view
  if (window.innerWidth <= 992) {
    setIsSidebarActive(false);
    
    document.documentElement.classList.remove(
      'menu-opened'
    );
    document.querySelectorAll('.main-wrapper').forEach(wrapper => {
      wrapper.classList.remove('slide-nav', 'mobile-menu-visible');
    });

    document.querySelectorAll('.sidebar-overlay').forEach(overlay => {
      overlay.classList.remove('opened');
    });
  }
};

  useEffect(() => {
    if (
      location.pathname === "/pandingCompany" ||
      location.pathname === "/approveCompany" ||
      location.pathname === "/companyType"
    ) {
      setOpenSubmenu("sales-main");
    } else if (
      location.pathname === "/jobCategory" ||
      location.pathname === "/jobsubCategory"
    ) {
      setOpenSubmenu("Category");
    } else if (
      location.pathname === "/allcountry" ||
      location.pathname === "/stateCategory" ||
      location.pathname === "/cityCategory"
    ) {
      setOpenSubmenu("location");
    } else if (
      location.pathname === "/skills" ||
      location.pathname === "/additionalperks" ||
      location.pathname === "/englishlevel" ||
      location.pathname === "/additionalrequirement" ||
      location.pathname === "/experience"
    ) {
      setOpenSubmenu("jobrequirement");
    } else {
      setOpenSubmenu("");
    }
  }, [location]);

  const isGeneralSettingsActive = () =>
    [
      "/general-settings",
      "/security-settings",
      "/notification",
      "/connected-apps",
    ].includes(location.pathname);

  useEffect(() => {
    feather.replace();
  }, [location]);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <div className="sidebar" id="sidebar">
        <div className={`sidebar-logo`}>
          <Link to="/" className="logo logo-normal" onClick={handleMenuItemClick}>
            <h1 className="h2 logo logo-normal fw-bold">
              Lenzoo<span className="text-danger">+</span>
            </h1>
          </Link>
          <Link to="/" className="logo logo-white" onClick={handleMenuItemClick}>
            <img src="assets/img/logo.png" alt="Img" />
          </Link>
          <Link to="/" className="logo-small" onClick={handleMenuItemClick}>
            {/* <img src="assets/img/logo.png" alt="Img" /> */}
          </Link>
          
        </div>
        {/* /Logo */}
        <div className="modern-profile p-3 pb-0">
          <div className="text-center rounded bg-light p-3 mb-4 user-profile">
            <div className="avatar avatar-lg online mb-3">
              <img
                src="assets/img/customer/customer15.jpg"
                alt="Img"
                className="img-fluid rounded-circle"
              />
            </div>
            <h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
            <p className="fs-12 mb-0">System Admin</p>
          </div>
          <div className="sidebar-nav mb-3">
            <ul
              className="nav nav-tabs nav-tabs-solid nav-tabs-rounded nav-justified bg-transparent"
              role="tablist"
            >
              <li className="nav-item">
                <Link className="nav-link active border-0" to="#" onClick={handleMenuItemClick}>
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link border-0" to="/chat" onClick={handleMenuItemClick}>
                  Chats
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link border-0" to="/email" onClick={handleMenuItemClick}>
                  Inbox
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="sidebar-header p-3 pb-0 pt-2">
          <div className="text-center rounded bg-light p-2 mb-4 sidebar-profile d-flex align-items-center">
            <div className="avatar avatar-md onlin">
              <img
                src="assets/img/customer/customer15.jpg"
                alt="Img"
                className="img-fluid rounded-circle"
              />
            </div>
            <div className="text-start sidebar-profile-info ms-2">
              <h6 className="fs-14 fw-bold mb-1">Adrian Herman</h6>
              <p className="fs-12">System Admin</p>
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between menu-item mb-3">
            <div>
              <Link to="/" className="btn btn-sm btn-icon bg-light" onClick={handleMenuItemClick}>
                <i className="ti ti-layout-grid-remove" />
              </Link>
            </div>
            <div>
              <Link to="/chat" className="btn btn-sm btn-icon bg-light" onClick={handleMenuItemClick}>
                <i className="ti ti-brand-hipchat" />
              </Link>
            </div>
            <div>
              <Link
                to="/email"
                className="btn btn-sm btn-icon bg-light position-relative"
                onClick={handleMenuItemClick}
              >
                <i className="ti ti-message" />
              </Link>
            </div>
            <div className="notification-item">
              <Link
                to="/activities"
                className="btn btn-sm btn-icon bg-light position-relative"
                onClick={handleMenuItemClick}
              >
                <i className="ti ti-bell" />
                <span className="notification-status-dot" />
              </Link>
            </div>
            <div className="me-0">
              <Link
                to="/general-settings"
                className="btn btn-sm btn-icon bg-light"
                onClick={handleMenuItemClick}
              >
                <i className="ti ti-settings" />
              </Link>
            </div>
          </div>
        </div>

        <SimpleBar style={{ maxHeight: "80vh" }}>
          <div className="sidebar-inner">
            <div id="sidebar-menu" className="sidebar-menu">
              <ul>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("main")}</h6>
                  <ul>
                    <li className={isActive("/") ? "active" : ""}>
                      <Link to="/" onClick={handleMenuItemClick}>
                        <i className="ti ti-layout-grid fs-16 me-2" />
                        <span>{t("dashboard")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("user_management")}</h6>
                  <ul>
                    <li className={isActive("/userlist") ? "active" : ""}>
                      <Link to="/userlist" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("userlist")}</span>
                      </Link>
                    </li>
                    <li className={isActive("/prescription") ? "active" : ""}>
                      <Link to="/prescription" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("prescription")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("center_management")}</h6>
                  <ul>
                    <li className={isActive("/centerList") ? "active" : ""}>
                      <Link to="/centerList" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("center")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("appointment_management")}</h6>
                  <ul>
                    <li
                      className={isActive("/appointmentList") ? "active" : ""}
                    >
                      <Link to="/appointmentList" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("appointments_list")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("coupon_management")}</h6>
                  <ul>
                    <li className={isActive("/couponList") ? "active" : ""}>
                      <Link to="/couponList" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("coupons_list")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("product_management")}</h6>
                  <ul>
                    <li className={isActive("/productList") ? "active" : ""}>
                      <Link to="/productList" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("product_list")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>

                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("order_management")}</h6>
                  <ul>
                    <li className={isActive("/ordersList") ? "active" : ""}>
                      <Link to="/ordersList" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("orders_list")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("membership_management")}</h6>
                  <ul>
                    <li className={isActive("/membership") ? "active" : ""}>
                      <Link to="/membership" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("membership")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("all_transaction")}</h6>
                  <ul>
                    <li className={isActive("/transactions") ? "active" : ""}>
                      <Link to="/transactions" onClick={handleMenuItemClick}>
                        <i data-feather="box" />
                        <span>{t("transactions")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">{t("settings")}</h6>
                  <ul>
                    <li className={isActive("/aboutUs") ? "active" : ""}>
                      <Link to="/aboutUs" onClick={handleMenuItemClick}>
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>{t("about_us")}</span>
                      </Link>
                    </li>
                    <li className={isActive("/privacyPolicy") ? "active" : ""}>
                      <Link to="/privacyPolicy" onClick={handleMenuItemClick}>
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>{t("privacy_policy")}</span>
                      </Link>
                    </li>
                    <li
                      className={
                        isActive("/termsAndConditions") ? "active" : ""
                      }
                    >
                      <Link to="/termsAndConditions" onClick={handleMenuItemClick}>
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>{t("terms_and_conditions")}</span>
                      </Link>
                    </li>
                    <li className={isActive("/faq") ? "active" : ""}>
                      <Link to="/faq" onClick={handleMenuItemClick}>
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>{t("faq")}</span>
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </SimpleBar>
      </div>
    </>
  );
};

export default Sidebar;