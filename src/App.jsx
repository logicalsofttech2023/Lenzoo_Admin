import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Layout from "./componants/Layout";
import Dashboard from "./componants/Dashboard";
import Userlist from "./componants/pages/Userlist";
import Login from "./Login";
import UserDetails from "./componants/pages/UserDetails";
import ServiceType from "./componants/pages/ServiceType";
import Subscribers from "./componants/pages/Subscribers";
import ResearchAnalysis from "./componants/pages/ResearchAnalysis";
import ContactRequests from "./componants/pages/ContactRequests";
import AboutUs from "./componants/pages/AboutUs";
import PrivacyPolicy from "./componants/pages/PrivacyPolicy";
import TermsAndConditions from "./componants/pages/TermsAndConditions";
import Faqs from "./componants/pages/Faqs";
import PlanList from "./componants/pages/PlanList";
import ProductList from "./componants/pages/ProductList";
import ProductDetail from "./componants/pages/ProductDetail";
import EditProduct from "./componants/pages/EditProduct";
import AddProduct from "./componants/pages/AddProduct";
import ResearchDetails from "./componants/pages/ResearchDetails";
import Testimonials from "./componants/pages/Testimonials";
import Membership from "./componants/pages/Membership";
import Transactions from "./componants/pages/Transactions";
import Prescription from "./componants/pages/Prescription";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token")
  );
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className={`main-wrapper ${sidebarOpen ? "slide-nav" : ""}`}>
      <Routes>
        <Route
          path="/login"
          element={
            isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} />
            )
          }
        />

        {isAuthenticated ? (
          <Route
            path="/"
            element={<Layout setIsAuthenticated={setIsAuthenticated} />}
          >
            <Route index element={<Dashboard />} />
            <Route path="userlist" element={<Userlist />} />
            <Route path="userDetails" element={<UserDetails />} />
            <Route path="serviceType" element={<ServiceType />} />
            <Route path="subscribers" element={<Subscribers />} />
            <Route path="researchAnalysis" element={<ResearchAnalysis />} />
            <Route path="contactRequests" element={<ContactRequests />} />
            <Route path="aboutUs" element={<AboutUs />} />
            <Route path="privacyPolicy" element={<PrivacyPolicy />} />
            <Route path="termsAndConditions" element={<TermsAndConditions />} />
            <Route path="faq" element={<Faqs />} />
            <Route path="planList" element={<PlanList />} />
            <Route path="productList" element={<ProductList />} />

            <Route path="addProduct" element={<AddProduct />} />

            <Route path="productDetail" element={<ProductDetail />} />
            <Route path="editProduct" element={<EditProduct />} />

            <Route path="researchDetails" element={<ResearchDetails />} />

            <Route path="testimonials" element={<Testimonials />} />

            <Route path="membership" element={<Membership />} />

            <Route path="transactions" element={<Transactions />} />

            <Route path="prescription" element={<Prescription />} />
          </Route>
        ) : (
          <Route path="/*" element={<Navigate to="/login" replace />} />
        )}
      </Routes>
    </div>
  );
};

export default App;
