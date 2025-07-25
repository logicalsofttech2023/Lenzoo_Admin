import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import feather from "feather-icons";
import axios from "axios";
import Swal from "sweetalert2";
import { FiEye } from "react-icons/fi";
import { ColorRing } from "react-loader-spinner";

const Userlist = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [itemsPerPage] = useState(10);

  useEffect(() => {
    feather.replace();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${base_url}getAllUsers`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            params: {
              page: currentPage,
              limit: itemsPerPage,
              search: searchTerm,
            },
          }
        );

        if (response.status === 200) {
          setUsers(response.data.data);
          setTotalPages(response.data.totalPages);
          setTotalUsers(response.data.totalUsers);
        } else {
          setError(response.data.message || "Failed to fetch users");
        }
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Error fetching users. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Add debounce to search to avoid too many API calls
    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 500);

    return () => clearTimeout(debounceTimer);
  }, [base_url, currentPage, itemsPerPage, searchTerm]);

  

  const handleViewUser = (userId) => {
    navigate("/userDetails", { state: { userId } });
  };

  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  if (error) {
    return (
      <div className="main-wrapper">
        <div className="content">
          <div className="alert alert-danger mt-3">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="main-wrapper">
      <div className="content">
        <div className="page-header">
          <div className="add-item d-flex">
            <div className="page-title">
              <h4 className="fw-bold">Users</h4>
              <h6>Manage your Users</h6>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
            <div className="search-set">
              <form className="input-group w-auto">
                <style>
                  {`
                  .btn-dark-orange {
                    background-color:rgba(235, 104, 17, 0.85);
                    color: white;
                  }
                  .btn-dark-orange:hover {
                    background-color:rgb(203, 89, 13);
                    color: white;
                  }
                `}
                </style>

                <input
                  type="text"
                  className="form-control rounded-start-pill"
                  placeholder="Search by name, email, phone..."
                  aria-label="Search"
                  value={searchTerm}
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setCurrentPage(1); // Reset to first page when searching
                  }}
                />
                <button
                  className="btn btn-dark-orange rounded-end-pill"
                  type="button"
                >
                  <i className="ti ti-search"></i>
                </button>
              </form>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table datatable">
                <thead className="thead-light">
                  <tr>
                    <th>#Id</th>
                    <th>Users</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Location</th>
                    
                    <th className="text-center" >Action</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan="8" className="py-5">
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            height: "100%",
                            minHeight: "150px",
                          }}
                        >
                          <ColorRing
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={[
                              "#e15b64",
                              "#f47e60",
                              "#f8b26a",
                              "#abbd81",
                              "#849b87",
                            ]}
                          />
                        </div>
                      </td>
                    </tr>
                  ) : users.length > 0 ? (
                    users.map((user, index) => (
                      <tr key={index}>
                        <td>{(currentPage - 1) * itemsPerPage + index + 1}</td>

                        <td>
                          <div className="d-flex align-items-center">
                            <Link to={"/userDetails"} state={{ userId: user._id }} className="avatar avatar-md me-2">
                              {user.profileImage ? (
                                <img
                                  src={`${file_url}${user.profileImage}`}
                                  alt="user"
                                  className="rounded-circle"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                  }}
                                  onError={(e) => {
                                    e.target.onerror = null;
                                    e.target.src = `https://media.istockphoto.com/id/530297753/vector/male-adult-avatar-profile-picture-vector.jpg?s=612x612&w=0&k=20&c=99qPabNtnHrfWjZ5wJqpnVnm7GdSVUWzy-YpW1NTc_Y=`;
                                  }}
                                />
                              ) : (
                                <div
                                  className="rounded-circle d-flex align-items-center justify-content-center"
                                  style={{
                                    width: "40px",
                                    height: "40px",
                                    backgroundColor: "#e9ecef",
                                    color: "#495057",
                                    fontWeight: "bold",
                                    fontSize: "16px",
                                  }}
                                  

                                >
                                  {user.firstName
                                    ? user.firstName.charAt(0).toUpperCase()
                                    : "U"}
                                </div>
                              )}
                            </Link>
                            <div>
                              <Link to={"/userDetails"} state={{ userId: user._id }} className="fw-bold">
                                {user.firstName} 
                                {user.lastName}
                              </Link>
                              <div className="text-muted small">
                                {user.gender || "N/A"}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <a href={`mailto:${user.userEmail}`}>
                            {user.userEmail}
                          </a>
                        </td>
                        <td>{user.phone || "N/A"}</td>
                        <td>{user.address || "N/A"}</td>
                        
                       
                        <td className="d-flex">
                          <div className="edit-delete-action d-flex align-items-center">
                            
                            <button
                              className="me-2 p-2 d-flex align-items-center border rounded"
                              onClick={() => handleViewUser(user._id)}
                            >
                              <FiEye style={{ marginRight: "5px" }} />
                              View
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="8" className="text-center py-4">
                        No premium users found.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="pagination-container p-3 d-flex justify-content-between align-items-center">
              <div className="showing-count">
                Showing {(currentPage - 1) * itemsPerPage + 1} to{" "}
                {Math.min(currentPage * itemsPerPage, totalUsers)} of{" "}
                {totalUsers} entries
              </div>
              <nav aria-label="Page navigation">
                <ul className="pagination mb-0">
                  <li
                    className={`page-item ${
                      currentPage === 1 ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }

                    return (
                      <li
                        key={pageNum}
                        className={`page-item ${
                          currentPage === pageNum ? "active" : ""
                        }`}
                      >
                        <button
                          className="page-link"
                          onClick={() => handlePageChange(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}

                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => handlePageChange(currentPage + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Userlist;