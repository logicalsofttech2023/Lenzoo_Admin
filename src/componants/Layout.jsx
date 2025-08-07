import React, { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import Header from './Header';
import Sidebar from './Sidebar';

const Layout = () => {
  const location = useLocation();
  const [isSidebarActive, setIsSidebarActive] = useState(false);

  // Dynamically update <body> class
  useEffect(() => {
    if (isSidebarActive) {
      document.body.classList.add('expand-menu', 'mini-sidebar');
    } else {
      document.body.classList.remove('expand-menu', 'mini-sidebar');
    }

    // Cleanup when component unmounts
    return () => {
      document.body.classList.remove('expand-menu', 'mini-sidebar');
    };
  }, [isSidebarActive]);

  return (
    <div className="main-wrapper">
      <Header />
      
      <Sidebar
        isSidebarActive={isSidebarActive}
        setIsSidebarActive={setIsSidebarActive}
      />

      <div className="page-wrapper">
        <Outlet />
        <div className="copyright-footer d-flex align-items-center justify-content-between border-top bg-white gap-3 flex-wrap">
          <p className="fs-13 text-gray-9 mb-0">
            © Lenzoo+. All Right Reserved
          </p>
        </div>
      </div>
    </div>
  );
};

export default Layout;