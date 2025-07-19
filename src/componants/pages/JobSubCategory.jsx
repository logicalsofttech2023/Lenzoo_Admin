import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../Sidebar";
import axios from "axios";
import Pagination from "react-js-pagination";
import toast, { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import feather from 'feather-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import swal from 'sweetalert';

const JobSubCategory = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [subcategoryLoading, setSubcategoryLoading] = useState(true);

  // Form states
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryName, setSubcategoryName] = useState("");
  const [subcategoryImage, setSubcategoryImage] = useState(null);
  

  // Data states
  const [categorylist, setCategoryList] = useState([]);
  const [subcategorylist, setSubCategoryList] = useState([]);
  const [filteredSubcategoryList, setFilteredSubcategoryList] = useState([]);
  const [cat_image, setsubCategoryImage] = useState(null);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editSubcategoryId, setEditSubcategoryId] = useState(null);
  const [editCategoryId, setEditCategoryId] = useState("");
  const [editSubcategoryName, setEditSubcategoryName] = useState("");
  const [editSubcategoryImage, setEditSubcategoryImage] = useState(null);
  const [editSubcategoryImagePreview, setEditSubcategoryImagePreview] = useState("");

  // Pagination states
  const [count, setCount] = useState(0);
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
  }, [filteredSubcategoryList, activePage, subcategorylist]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Form submission for adding subcategory
  const handleAddSubcategory = (e) => {
 e.preventDefault();

  if (!categoryId || !subcategoryName || !cat_image) {
    toast.error("All fields are required");
    return;
  }

  const formData = new FormData();
  formData.append("cat_id", categoryId);
  formData.append("sub_cat_name", subcategoryName);
  formData.append("sub_cat_image", cat_image);

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(`${base_url}api/admin/add_sub_category`, formData, options)
      .then((res) => {
        toast.success(res?.data?.message || "Subcategory added successfully");
        swal({
          title: "Success!",
          text: "Subcategory added successfully",
          icon: "success",
          buttons: true,
        });
        getSubCategory();
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Error adding subcategory");
      });
  };

  const resetForm = () => {
    setCategoryId("");
    setSubcategoryName("");
    setSubcategoryImage(null);
setsubCategoryImage(null);
  };

  // Fetch data on mount
  useEffect(() => {
    getJobCategories();
    getSubCategory();
  }, []);

  // Fetch job categories
  const getJobCategories = () => {
    axios
      .get(`${base_url}api/admin/job_cate_list`)
      .then((res) => {
        if (res.data.stat && res.data.data) {
          setCategoryList(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  // Fetch subcategories
  const getSubCategory = () => {
    setSubcategoryLoading(true);
    axios
      .get(`${base_url}api/admin/all_job_subcategory`)
      .then((res) => {
        if (res.data.data) {
          setSubCategoryList(res.data.data);
          setFilteredSubcategoryList(res.data.data);
          setCount(res.data.data.length);
        }
      })
      .catch((error) => {
        console.error("Error fetching subcategories:", error);
      })
      .finally(() => {
        setSubcategoryLoading(false);
      });
  };

  // Delete subcategory
  const DeleteSubCategory = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this subcategory!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const data = { SubcategoryID: id };

        const options = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        axios
          .post(`${base_url}api/admin/sub_cat_delete`, data, options)
          .then((res) => {
            getSubCategory();
            swal("Success! Subcategory has been deleted!", { icon: "success" });
          })
          .catch((error) => {
            swal("Error! Subcategory could not be deleted!", { icon: "error" });
          });
      }
    });
  };

  // Open edit modal and fetch subcategory details
  const handleEditSubcategory = (id) => {
    setEditSubcategoryId(id);
    setShowEditModal(true);
    
    // Fetch subcategory details
    axios.post(`${base_url}api/admin/sub_cat_details`, { SubcategoryID: id })
      .then(res => {
        if (res.data.success) {
          const subCatData = res.data.data;
          setEditCategoryId(subCatData.cat_id);
          setEditSubcategoryName(subCatData.sub_cat_name);
          setEditSubcategoryImagePreview(subCatData.sub_cat_image ? 
            `${base_url}uploads/admin/${subCatData.sub_cat_image}` : 
            "https://6valley.6amtech.com/public/assets/back-end/img/900x400/img1.jpg");
        }
      })
      .catch(error => {
        console.error("Error fetching subcategory details:", error);
        toast.error("Failed to load subcategory details");
      });
  };

  // Handle update subcategory
  const handleUpdateSubcategory = (e) => {
  e.preventDefault();
  
  if (!editCategoryId || !editSubcategoryName) {
    toast.error("Category and Subcategory Name are required");
    return;
  }

  const formData = new FormData();
  formData.append("SubcategoryID", editSubcategoryId);
  formData.append("cat_id", editCategoryId);
  formData.append("sub_cat_name", editSubcategoryName);
  if (editSubcategoryImage) {
    formData.append("sub_cat_image", editSubcategoryImage);
  }
    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios.post(`${base_url}api/admin/sub_cat_update`, formData, options)
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message);
          getSubCategory();
          setShowEditModal(false);
        }
      })
      .catch(error => {
        console.error("Error updating subcategory:", error);
        toast.error(error.response?.data?.message || "Error updating subcategory");
      });
  };



  // Handle image change for edit modal
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditSubcategoryImage(file);
      setEditSubcategoryImagePreview(URL.createObjectURL(file));
    }
  };

  // Filter subcategories
  const handleSubcategoryFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const result = subcategorylist.filter(item =>
      item.sub_cat_name.toLowerCase().includes(searchTerm) ||
      (item.category_name && item.category_name.toLowerCase().includes(searchTerm))
    );
    setFilteredSubcategoryList(result);
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
            <Sidebar />
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
                  Job SubCategory Management
                </h2>
              </div>

              {/* Add Subcategory Form */}
              <div className="row">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-body">
                      <form onSubmit={handleAddSubcategory}>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group mb-3">
                              <label className="title-color">
                                Category <span className="text-danger">*</span>
                              </label>
                              <select
                                value={categoryId}
                                className="form-control"
                                required
                                onChange={(e) => setCategoryId(e.target.value)}
                              >
                                <option value="">Select Category</option>
                                {categorylist.map((category) => (
                                  <option key={category.id} value={category.id}>
                                    {category.cat_name}
                                  </option>
                                ))}
                              </select>
                            </div>

                            <div className="form-group mb-3">
                              <label className="title-color">
                                Subcategory Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                value={subcategoryName}
                                className="form-control"
                                placeholder="Enter subcategory name"
                                required
                                onChange={(e) => setSubcategoryName(e.target.value)}
                              />
                            </div>
                          </div>

                          <div className="col-lg-6 col-md-12">
                            <div className="form-group">
                              <center>
                               {cat_image ? (
  <img
    className="upload-img-view img-fluid"
    id="viewer"
    src={URL.createObjectURL(cat_image)}
    alt="category preview"
    style={{ maxHeight: "150px" }}
  />
) : (
  <img
    className="upload-img-view img-fluid"
    id="viewer"
    src="https://6valley.6amtech.com/public/assets/back-end/img/900x400/img1.jpg"
    alt="default preview"
    style={{ maxHeight: "150px" }}
  />
)}
                              </center>
                              <label className="title-color mt-3">
                                Subcategory Image
                              </label>
                              <div className="custom-file">
                                <input
                                  type="file"
                                  className="custom-file-input"
                                  onChange={(e) => setsubCategoryImage(e.target.files[0])}
                                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                />
                                <label className="custom-file-label">
                                  Choose File
                                </label>
                              </div>
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

              {/* Subcategories Table Section */}
              <div className="row mt-20 mb-5">
                <div className="col-md-12">
                  <div className="card">
                    <div className="px-3 py-4">
                      <div className="row align-items-center">
                        <div className="col-sm-4 col-md-6 col-lg-8 mb-2 mb-sm-0">
                          <h5 className="text-capitalize d-flex gap-2">
                            Job Subcategories
                            <span className="badge badge-soft-dark radius-50 fz-12">
                              {filteredSubcategoryList.length}
                            </span>
                          </h5>
                        </div>
                        <div className="col-sm-8 col-md-6 col-lg-4">
                          <div className="input-group input-group-merge input-group-custom">
                            <input
                              type="search"
                              className="form-control"
                              placeholder="Search subcategories"
                              onChange={handleSubcategoryFilter}
                            />
                            <button type="button" className="btn btn-primary">
                              Search
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      {subcategoryLoading ? (
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
                      ) : filteredSubcategoryList?.length > 0 ? (
                        <>
                          <table className="table table-hover table-borderless table-thead-bordered table-nowrap table-align-middle card-table w-100">
                            <thead className="thead-light thead-50 text-capitalize">
                              <tr>
                                <th>Sr.No</th>
                                <th className="text-center">Image</th>
                                <th>Category Name</th>
                                <th>Subcategory Name</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredSubcategoryList
                                .slice((activePage - 1) * itemsPerPage, activePage * itemsPerPage)
                                .map((subcategory, index) => (
                                  <tr key={subcategory.id}>
                                    <td>{(activePage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="text-center">
                                      <img
                                        src={subcategory.sub_cat_image
                                          ? `${base_url}uploads/admin/${subcategory.sub_cat_image}`
                                          : "bussiness-man.png"}
                                        className="avatar rounded-circle"
                                        alt="subcategory"
                                        width={40}
                                      />
                                    </td>
                                    <td>{subcategory.category_name}</td>
                                    <td>{subcategory.sub_cat_name}</td>
                                    <td>
                                      <div className="edit-delete-action d-flex align-items-center justify-content-center">
                                        <button
                                          className="me-2 p-2 d-flex align-items-center border rounded bg-transparent"
                                          onClick={() => handleEditSubcategory(subcategory.id)}
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
                                          className="p-2 d-flex align-items-center border rounded bg-danger"
                                          onClick={() => DeleteSubCategory(subcategory.id)}
                                          title="Delete"
                                          style={{
                                            transition: 'all 0.3s ease',
                                            color: '#fff'
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
                          {filteredSubcategoryList.length > itemsPerPage && (
                            <div className="d-flex justify-content-center mt-4">
                              <Pagination
                                activePage={activePage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={filteredSubcategoryList.length}
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
                          <p className="mb-0">No subcategories found</p>
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

      {/* Edit Subcategory Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Subcategory</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateSubcategory}>
            <div className="row">
              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="title-color">
                    Category <span className="text-danger">*</span>
                  </label>
                  <select
                    value={editCategoryId}
                    className="form-control"
                    required
                    onChange={(e) => setEditCategoryId(e.target.value)}
                  >
                    <option value="">Select Category</option>
                    {categorylist.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.cat_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-group mb-3">
                  <label className="title-color">
                    Subcategory Name <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    value={editSubcategoryName}
                    className="form-control"
                    placeholder="Enter subcategory name"
                    required
                    onChange={(e) => setEditSubcategoryName(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <div className="form-group">
              <center>
                <img
                  className="upload-img-view img-fluid"
                  id="viewer"
                  src={editSubcategoryImagePreview}
                  alt="subcategory preview"
                  style={{ maxHeight: "150px" }}
                />
              </center>
              <label className="title-color mt-3">
                Subcategory Image
              </label>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
               
                    onChange={(e) => setsubCategoryImage(e.target.files[0])}
                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                />
                <label className="custom-file-label">
                  Choose File
                </label>
              </div>
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

export default JobSubCategory;