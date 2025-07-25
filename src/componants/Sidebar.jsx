import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import feather from "feather-icons";
import SimpleBar from "simplebar-react";
import "simplebar-react/dist/simplebar.min.css";

const Sidebar = ({ isSidebarActive, setIsSidebarActive }) => {
  const location = useLocation();
  const [openSubmenu, setOpenSubmenu] = useState(null);

  const toggleSubmenu = (menuName) => {
    setOpenSubmenu((prev) => (prev === menuName ? "" : menuName));
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
          <Link to="/" className="logo logo-normal">
            <h1 className="h2 logo logo-normal fw-bold">
              Lenzoo<span className="text-danger">+</span>
            </h1>
          </Link>
          <Link to="/" className="logo logo-white">
            <img src="assets/img/logo.png" alt="Img" />
          </Link>
          <Link to="/" className="logo-small">
            {/* <img src="assets/img/logo.png" alt="Img" /> */}
          </Link>
          <a
            id="toggle_btn"
            href="#"
            onClick={(e) => {
              e.preventDefault();
              setIsSidebarActive((prev) => !prev);
            }}
            className={isSidebarActive ? "active" : ""}
          >
            <i data-feather="chevrons-left" className="feather-16" />
          </a>
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
                <Link className="nav-link active border-0" to="#">
                  Menu
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link border-0" to="/chat">
                  Chats
                </Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link border-0" to="/email">
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
              <Link to="/" className="btn btn-sm btn-icon bg-light">
                <i className="ti ti-layout-grid-remove" />
              </Link>
            </div>
            <div>
              <Link to="/chat" className="btn btn-sm btn-icon bg-light">
                <i className="ti ti-brand-hipchat" />
              </Link>
            </div>
            <div>
              <Link
                to="/email"
                className="btn btn-sm btn-icon bg-light position-relative"
              >
                <i className="ti ti-message" />
              </Link>
            </div>
            <div className="notification-item">
              <Link
                to="/activities"
                className="btn btn-sm btn-icon bg-light position-relative"
              >
                <i className="ti ti-bell" />
                <span className="notification-status-dot" />
              </Link>
            </div>
            <div className="me-0">
              <Link
                to="/general-settings"
                className="btn btn-sm btn-icon bg-light"
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
                  <h6 className="submenu-hdr">Main</h6>
                  <ul>
                    <li className={isActive("/") ? "active" : ""}>
                      <Link to="/">
                        <i className="ti ti-layout-grid fs-16 me-2" />
                        <span>Dashboard</span>
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="submenu-open">
                  <h6 className="submenu-hdr">User Mangement </h6>
                  <ul>
                    <li className={isActive("/userlist") ? "active" : ""}>
                      <Link to="/userlist">
                        <i data-feather="box" />
                        <span>Userlist</span>
                      </Link>
                    </li>

                    <li className={isActive("/prescription") ? "active" : ""}>
                      <Link to="/prescription">
                        <i data-feather="box" />
                        <span>Prescription</span>
                      </Link>
                    </li>
                    

                    {/* <li className={isActive("/subscribers") ? "active" : ""}>
                      <Link to="/subscribers">
                        <i data-feather="box" />
                        <span>Subscribers</span>
                      </Link>
                    </li>

                    <li
                      className={isActive("/contactRequests") ? "active" : ""}
                    >
                      <Link to="/contactRequests">
                        <i data-feather="box" />
                        <span>Contact Requests</span>
                      </Link>
                    </li> */}
                  </ul>
                </li>

                <li className="submenu-open">
                  <h6 className="submenu-hdr">Product Management</h6>
                  <ul>
                    <li
                      className={
                        isActive("/productList") ? "active" : ""
                      }
                    >
                      <Link to="/productList">
                        <i data-feather="box" />
                        <span>Product List</span>
                      </Link>
                    </li>

                    
                  </ul>
                </li>

                <li className="submenu-open">
                  <h6 className="submenu-hdr">Order Management</h6>
                  <ul>
                    <li
                      className={
                        isActive("/ordersList") ? "active" : ""
                      }
                    >
                      <Link to="/ordersList">
                        <i data-feather="box" />
                        <span>Orders List</span>
                      </Link>
                    </li>

                    
                  </ul>
                </li>

                

                <li className="submenu-open">
                  <h6 className="submenu-hdr">Membership Management</h6>
                  <ul>
                    <li className={isActive("/membership") ? "active" : ""}>
                      <Link to="/membership">
                        <i data-feather="box" />
                        <span>Membership</span>
                      </Link>
                    </li>
                    
                  </ul>
                </li>

                <li className="submenu-open">
                  <h6 className="submenu-hdr">All Transaction</h6>
                  <ul>
                    <li className={isActive("/transactions") ? "active" : ""}>
                      <Link to="/transactions">
                        <i data-feather="box" />
                        <span>Transactions</span>
                      </Link>
                    </li>
                    
                  </ul>
                </li>

                <li className="submenu-open">
                  <h6 className="submenu-hdr">Settings</h6>
                  <ul>
                    
                    <li className={isActive("/aboutUs") ? "active" : ""}>
                      <Link to="/aboutUs">
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>About Us</span>
                      </Link>
                    </li>
                    <li className={isActive("/privacyPolicy") ? "active" : ""}>
                      <Link to="/privacyPolicy">
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>Privacy Policy</span>
                      </Link>
                    </li>

                    <li
                      className={
                        isActive("/termsAndConditions") ? "active" : ""
                      }
                    >
                      <Link to="/termsAndConditions">
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>Terms and Conditions</span>
                      </Link>
                    </li>

                    <li className={isActive("/faq") ? "active" : ""}>
                      <Link to="/faq">
                        <i className="ti ti-settings fs-16 me-2" />
                        <span>Faq</span>
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
