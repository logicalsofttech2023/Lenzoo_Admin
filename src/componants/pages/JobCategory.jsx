import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebarr from "../Sidebar";
import axios from "axios";
import Pagination from "react-js-pagination";
import toast, { Toaster } from "react-hot-toast";
import { ColorRing } from "react-loader-spinner";
import feather from 'feather-icons';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

const JobCategory = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [categoryLoading, setCategoryLoading] = useState(true);

  // Form states
  const [cat_name, setCategoryName] = useState("");
  const [cat_image, setCategoryImage] = useState(null);

  // Data states
  const [categorylist, setCategoryList] = useState([]);
  const [filteredCategoryList, setFilteredCategoryList] = useState([]);

  // Modal states
  const [showEditModal, setShowEditModal] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [editCatImage, setEditCatImage] = useState(null);
  const [editCatImagePreview, setEditCatImagePreview] = useState("");

  // Pagination states
  const [count, setCount] = useState(0);
  const [activePage, setActivePage] = useState(1);
  const [activeCategoryPage, setActiveCategoryPage] = useState(1);
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
  }, [filteredCategoryList, activeCategoryPage, categorylist]);

  // Handle screen resize
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 992);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Form submission for adding category
  const handleAddCategory = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("cat_name", cat_name);
    if (cat_image) {
      formData.append("cat_image", cat_image);
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios
      .post(`${base_url}api/admin/add_category`, formData, options)
      .then((res) => {
        toast.success(res?.data?.msg || "Category added successfully");
        swal({
          title: "Success!",
          text: "Category added successfully",
          icon: "success",
          buttons: true,
        });
        getJobCategoryList();
        resetForm();
      })
      .catch((error) => {
        console.error(error);
        toast.error(error.response?.data?.message || "Error adding category");
      });
  };

  const resetForm = () => {
    setCategoryName("");
    setCategoryImage(null);
  };

  // Fetch data on mount
  useEffect(() => {
    getJobCategoryList();
  }, []);

  // Fetch job categories
  const getJobCategoryList = () => {
    setCategoryLoading(true);
    axios
      .get(`${base_url}api/admin/job_cate_list`)
      .then((res) => {
        if (res.data.stat && res.data.data) {
          setCategoryList(res.data.data);
          setFilteredCategoryList(res.data.data);
        }
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      })
      .finally(() => {
        setCategoryLoading(false);
      });
  };

  // Delete category
  const DeleteCategory = (id) => {
    swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this category!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        const data = { categoryID: id };

        axios
          .post(`${base_url}api/admin/category_delete`, data)
          .then((res) => {
            getJobCategoryList();
            swal("Success! Category has been deleted!", { icon: "success" });
          })
          .catch((error) => {
            swal("Error! Category could not be deleted!", { icon: "error" });
          });
      }
    });
  };

  // Open edit modal and fetch category details
  const handleEditCategory = (id) => {
    setEditCategoryId(id);
    setShowEditModal(true);
    
    // Fetch category details
    axios.post(`${base_url}api/admin/category_details`, { categoryID: id })
      .then(res => {
        if (res.data.success) {
          setEditCatName(res.data.data.cat_name);
          setEditCatImagePreview(res.data.data.cat_image ? 
            `${base_url}uploads/admin/${res.data.data.cat_image}` : 
            "https://6valley.6amtech.com/public/assets/back-end/img/900x400/img1.jpg");
        }
      })
      .catch(error => {
        console.error("Error fetching category details:", error);
        toast.error("Failed to load category details");
      });
  };

  // Handle update category
  const handleUpdateCategory = (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append("categoryID", editCategoryId);
    formData.append("cat_name", editCatName);
    if (editCatImage) {
      formData.append("cat_image", editCatImage);
    }

    const options = {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    };

    axios.post(`${base_url}api/admin/update_category`, formData, options)
      .then(res => {
        if (res.data.success) {
          toast.success(res.data.message);
          getJobCategoryList();
          setShowEditModal(false);
        }
      })
      .catch(error => {
        console.error("Error updating category:", error);
        toast.error(error.response?.data?.message || "Error updating category");
      });
  };

  // Handle image change for edit modal
  const handleEditImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setEditCatImage(file);
      setEditCatImagePreview(URL.createObjectURL(file));
    }
  };

  // Filter categories
  const handleCategoryFilter = (event) => {
    const searchTerm = event.target.value.toLowerCase();
    const result = categorylist.filter(item =>
      item.cat_name.toLowerCase().includes(searchTerm)
    );
    setFilteredCategoryList(result);
    setActiveCategoryPage(1);
  };

  // Pagination handlers
  const handlePageChange = (pageNumber) => setActivePage(pageNumber);
  const handleCategoryPageChange = (pageNumber) => setActiveCategoryPage(pageNumber);

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
                  Job Category Management
                </h2>
              </div>

              {/* Add Category Form */}
              <div className="row">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-body">
                      <form onSubmit={handleAddCategory}>
                        <div className="row">
                          <div className="col-lg-6 col-md-12">
                            <div className="form-group mb-3">
                              <label className="title-color">
                                Category Name <span className="text-danger">*</span>
                              </label>
                              <input
                                type="text"
                                value={cat_name}
                                className="form-control"
                                placeholder="Enter category name"
                                required
                                onChange={(e) => setCategoryName(e.target.value)}
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
                                Category Image
                                <span className="text-danger">*</span>
                              </label>
                              <div className="custom-file">
                                <input
                                  type="file"
                                  className="custom-file-input"
                                  onChange={(e) => setCategoryImage(e.target.files[0])}
                                  accept=".jpg, .png, .jpeg, .gif, .bmp, .tif, .tiff|image/*"
                                  required
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

              {/* Job Categories Table Section */}
              <div className="row mt-20 mb-5">
                <div className="col-md-12">
                  <div className="card">
                    <div className="px-3 py-4">
                      <div className="row align-items-center">
                        <div className="col-sm-4 col-md-6 col-lg-8 mb-2 mb-sm-0">
                          <h5 className="text-capitalize d-flex gap-2">
                            Job Categories
                            <span className="badge badge-soft-dark radius-50 fz-12">
                              {filteredCategoryList.length}
                            </span>
                          </h5>
                        </div>
                        <div className="col-sm-8 col-md-6 col-lg-4">
                          <div className="input-group input-group-merge input-group-custom">
                            <input
                              type="search"
                              className="form-control"
                              placeholder="Search categories"
                              onChange={handleCategoryFilter}
                            />
                            <button type="button" className="btn btn-primary">
                              Search
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="table-responsive">
                      {categoryLoading ? (
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
                      ) : filteredCategoryList?.length > 0 ? (
                        <>
                          <table className="table table-hover table-borderless table-thead-bordered table-nowrap table-align-middle card-table w-100">
                            <thead className="thead-light thead-50 text-capitalize">
                              <tr>
                                <th>Sr.No</th>
                                <th className="text-center">Image</th>
                                <th>Category Name</th>
                                <th className="text-center">Action</th>
                              </tr>
                            </thead>
                            <tbody>
                              {filteredCategoryList
                                .slice((activeCategoryPage - 1) * itemsPerPage, activeCategoryPage * itemsPerPage)
                                .map((category, index) => (
                                  <tr key={category.id}>
                                    <td>{(activeCategoryPage - 1) * itemsPerPage + index + 1}</td>
                                    <td className="text-center">
                                      <img
                                        src={category.cat_image
                                          ? `${base_url}uploads/admin/${category.cat_image}`
                                          : "bussiness-man.png"}
                                        className="avatar rounded-circle "
                                        alt="category"
                                        width={40}
                                      />
                                    </td>
                                    <td>{category.cat_name}</td>
                                    <td>
                                      <div className="edit-delete-action d-flex align-items-center justify-content-center">
                                        <button
                                          className="me-2 p-2 d-flex align-items-center border rounded bg-transparent"
                                          onClick={() => handleEditCategory(category.id)}
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
                                          className="p-2 d-flex align-items-center border rounded "
                                          onClick={() => DeleteCategory(category.id)}
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
                                          <i data-feather="trash-2" className="feather-trash-2 " style={{ width: '16px', height: '16px' }} />
                                        </button>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                          {filteredCategoryList.length > itemsPerPage && (
                            <div className="d-flex justify-content-center mt-4">
                              <Pagination
                                activePage={activeCategoryPage}
                                itemsCountPerPage={itemsPerPage}
                                totalItemsCount={filteredCategoryList.length}
                                pageRangeDisplayed={5}
                                onChange={handleCategoryPageChange}
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
                          <p className="mb-0">No categories found</p>
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

      {/* Edit Category Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleUpdateCategory}>
            <div className="form-group mb-3">
              <label className="title-color">
                Category Name <span className="text-danger">*</span>
              </label>
              <input
                type="text"
                value={editCatName}
                className="form-control"
                placeholder="Enter category name"
                required
                onChange={(e) => setEditCatName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <center>
                <img
                  className="upload-img-view img-fluid"
                  id="viewer"
                  src={editCatImagePreview}
                  alt="category preview"
                  style={{ maxHeight: "150px" }}
                />
              </center>
              <label className="title-color mt-3">
                Category Image
              </label>
              <div className="custom-file">
                <input
                  type="file"
                  className="custom-file-input"
                  onChange={handleEditImageChange}
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

export default JobCategory;