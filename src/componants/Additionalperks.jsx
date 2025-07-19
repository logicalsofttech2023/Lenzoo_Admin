import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebarr from './Sidebar';
import axios from "axios";
import Pagination from "react-js-pagination";
import toast, { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import feather from 'feather-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Swal from 'sweetalert2';

const Additionalperks = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  // Form states
  const [perkName, setPerkName] = useState("");

  // Data states
  const [perksList, setPerksList] = useState([]);
  const [filteredPerksList, setFilteredPerksList] = useState([]);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editPerkId, setEditPerkId] = useState(null);
  const [editPerkName, setEditPerkName] = useState("");

  // Pagination states
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 10;

  const [isLargeScreen, setIsLargeScreen] = useState(window.innerWidth >= 992);
  const token = localStorage.getItem("adminidtoken");

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        feather.replace();
      } catch (e) {
        console.error("Feather icons replacement error:", e);
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [filteredPerksList, activePage, perksList]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch data on mount
  useEffect(() => {
    getAllPerks();
  }, []);

  // Form submission for adding perk
  const handleAddPerk = (e) => {
    e.preventDefault();

    const data = {
      name: perkName
    };

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios
      .post(`${base_url}api/admin/create_additional`, data, options)
      .then((res) => {
        if (res.data.stat) {
          Swal.fire({
            title: "Success!",
            text: res.data.message,
            icon: "success",
            confirmButtonText: "OK"
          });
          getAllPerks();
          setPerkName("");
        }
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Error adding perk");
      });
  };

  // Fetch all perks
  const getAllPerks = () => {
    setLoading(true);
    axios
      .get(`${base_url}api/admin/all_additional`)
      .then((res) => {
        if (res.data.stat && res.data.data) {
          setPerksList(res.data.data);
          setFilteredPerksList(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching perks:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  // Delete perk
  const deletePerk = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this perk!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then((result) => {
      if (result.isConfirmed) {
        const data = { parkId: id };

        axios.post(`${base_url}api/admin/additional_park_deleted`, data)
          .then((res) => {
            if (res.data.stat) {
              Swal.fire(
                "Deleted!",
                res.data.message,
                "success"
              );
              getAllPerks();
            }
          })
          .catch((error) => {
            Swal.fire(
              "Error!",
              "Perk could not be deleted.",
              "error"
            );
          });
      }
    });
  };

  // Open edit modal and fetch perk details
  const handleEditPerk = (id) => {
    setEditPerkId(id);
    setShowEditModal(true);
    
    // Fetch perk details
    axios.post(`${base_url}api/admin/additional_details`, { parkId: id })
      .then(res => {
        if (res.data.stat) {
          setEditPerkName(res.data.data.name);
        }
      })
      .catch(error => {
        console.error("Error fetching perk details:", error);
        toast.error("Failed to load perk details");
      });
  };

  // Handle update perk
  const handleUpdatePerk = (e) => {
    e.preventDefault();
    
    const data = {
      parkId: editPerkId,
      name: editPerkName
    };

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    axios.post(`${base_url}api/admin/additional_park_update`, data, options)
      .then(res => {
        if (res.data.stat) {
          toast.success(res.data.message);
          getAllPerks();
          setShowEditModal(false);
        }
      })
      .catch(error => {
        console.error("Error updating perk:", error);
        toast.error(error.response?.data?.message || "Error updating perk");
      });
  };

  // Filter perks
  const handlePerkFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const result = perksList.filter(item =>
      item.name.toLowerCase().includes(searchTerm)
    );
    setFilteredPerksList(result);
    setActivePage(1);
  };

  // Pagination handler
  const handlePageChange = (pageNumber) => setActivePage(pageNumber);

  return (
    <div>
      <Toaster />
      <div className="container-fluid">
        <div className="row">
          <div className="col-lg-3 col-md-4 d-none d-md-block" style={{ paddingLeft: "0px" }}>
            <Sidebarr />
          </div>

          <div className="col-lg-12 col-md-12" style={{ marginTop: "10px", marginLeft: isLargeScreen ? "0px" : "0px" }}>
            <div className="mt-3 px-3">
              <div className="mb-3">
                <h2 className="h1 mb-0 d-flex gap-2 align-items-center">
                  <img
                    src="https://6valley.6amtech.com/public/assets/back-end/img/brand-setup.png"
                    alt=""
                    width={40}
                  />
                  Additional Perks Management
                </h2>
              </div>

              {/* Add Perk Form */}
              <div className="row">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-body">
                      <form onSubmit={handleAddPerk}>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group mb-3">
                              <label className="title-color">
                                Perk Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                value={perkName}
                                className="form-control"
                                placeholder="Enter perk name"
                                required
                                onChange={(e) => setPerkName(e.target.value)}
                              />
                            </div>
                          </div>
                        </div>

                        <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
                          <button type="submit" className="btn btn-primary">
                            Submit
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>

              {/* Perks Table Section */}
              <div className="row mt-20 mb-5">
                <div className="col-md-12">
                  <div className="card">
                    <div className="px-3 py-4">
                      <div className="row align-items-center">
                        <div className="col-sm-4 col-md-6 col-lg-8 mb-2 mb-sm-0">
                          <h5 className="text-capitalize d-flex gap-2">
                            Additional Perks
                            <span className="badge badge-soft-dark radius-50 fz-12">
                              {filteredPerksList.length}
                            </span>
                          </h5>
                        </div>
                        <div className="col-sm-8 col-md-6 col-lg-4">
                          <div className="input-group input-group-merge input-group-custom">
                            <input
                              type="search"
                              className="form-control"
                              placeholder="Search perks"
                              onChange={handlePerkFilter}
                            />
                            <button type="button" className="btn btn-primary">
                              Search
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      {loading ? (
                        <div className="d-flex justify-content-center align-items-center p-5">
                          <ColorRing
                            visible={true}
                            height="80"
                            width="80"
                            ariaLabel="magnifying-glass-loading"
                            wrapperStyle={{}}
                            wrapperClass="magnifying-glass-wrapper"
                            glassColor="#c0efff"
                            color="#e15b64"
                          />
                        </div>
                      ) : filteredPerksList?.length > 0 ? (
                        <>
                          <table className="table table-hover table-borderless table-thead-bordered table-nowrap table-align-middle card-table w-100">
                            <thead className="thead-light thead-50 text-capitalize">
                              <tr>
                                <th>Sr.No</th>
                                <th>Perk Name</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredPerksList
                                .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
                                .map((perk, index) => (
                                  <tr key={perk.id}>
                                    <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                                    <td>{perk.name}</td>
                                    <td>
                                      <div className="edit-delete-action d-flex align-items-center justify-content-center">
                                        <button
                                          className="me-2 p-2 d-flex align-items-center border rounded bg-transparent"
                                          onClick={() => handleEditPerk(perk.id)}
                                          title="Edit"
                                          style={{
                                            transition: 'all 0.3s ease',
                                            color: '#6c757d'
                                          }}
                                          onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                            e.currentTarget.style.color = '#0d6efd';
                                          }}
                                          onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#6c757d';
                                          }}
                                        >
                                          <i data-feather="edit" className="feather-edit" style={{ width: '16px', height: '16px' }} />
                                        </button>
                                        <button
                                          className="p-2 d-flex align-items-center border rounded bg-transparent"
                                          onClick={() => deletePerk(perk.id)}
                                          title="Delete"
                                          style={{
                                            transition: 'all 0.3s ease',
                                            color: '#6c757d'
                                          }}
                                          onMouseOver={(e) => {
                                            e.currentTarget.style.backgroundColor = '#f8f9fa';
                                            e.currentTarget.style.color = '#dc3545';
                                          }}
                                          onMouseOut={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#6c757d';
                                          }}
                                        >
                                          <i data-feather="trash-2" className="feather-trash-2" style={{ width: '16px', height: '16px' }} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          {filteredPerksList.length > itemsPerPage && (
                            <div className="d-flex justify-content-center mt-4">
                              <Pagination
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={filteredPerksList.length}
                                pageRangeDisplayed={5}
                                onChange={handlePageChange}
                                itemClass="page-item"
                                linkClass="page-link"
                              />
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="text-center p-4">
                          <img
                            className="mb-3 w-160"
                            src="https://6valley.6amtech.com/public/assets/back-end/img/empty-state-icon/default.png"
                            alt="No data found"
                          />
                          <p className="mb-0">No perks found</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Perk Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Perk</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdatePerk}>
            <div className="form-group mb-3">
              <label className="title-color">
                Perk Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={editPerkName}
                className="form-control"
                placeholder="Enter perk name"
                required
                onChange={(e) => setEditPerkName(e.target.value)}
              />
            </div>

            <div className="d-flex flex-wrap gap-2 justify-content-end mt-3">
              <Button variant="secondary" onClick={() => setShowEditModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Update
              </Button>
            </div>
          </form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default Additionalperks;