import React, { useEffect } from 'react'
import feather from "feather-icons";

const CategoryList = () => {
  useEffect(() => {
    // Replace feather icons on component mount
    feather.replace();
  }, []);


  return (
    <>
      <div class="main-wrapper">
        <div className="content">
          <div className="page-header">
            <div className="add-item d-flex">
              <div className="page-title">
                <h4 className="fw-bold">Category</h4>
                <h6>Manage your categories</h6>
              </div>
            </div>
            <ul className="table-top-head">
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" title="Pdf"><img src="assets/img/icons/pdf.svg" alt="img" /></a>
              </li>
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" title="Excel"><img src="assets/img/icons/excel.svg" alt="img" /></a>
              </li>
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" title="Refresh"><i className="ti ti-refresh" /></a>
              </li>
              <li>
                <a data-bs-toggle="tooltip" data-bs-placement="top" title="Collapse" id="collapse-header"><i className="ti ti-chevron-up" /></a>
              </li>
            </ul>
            <div className="page-btn">
              <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-category"><i className="ti ti-circle-plus me-1" />Add Category</a>
            </div>
          </div>
          {/* /product list */}
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <div className="search-set">
                <div className="search-input">
                  <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
                </div>
              </div>
              <div className="d-flex table-dropdown my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="dropdown">
                  <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                    Status
                  </a>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item rounded-1">Active</a>
                    </li>
                    <li>
                      <a href="javascript:void(0);" className="dropdown-item rounded-1">Inactive</a>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table datatable">
                  <thead className="thead-light">
                    <tr>
                      <th className="no-sort">
                        <label className="checkboxs">
                          <input type="checkbox" id="select-all" />
                          <span className="checkmarks" />
                        </label>
                      </th>
                      <th>Category</th>
                      <th>Category slug</th>
                      <th>Created On</th>
                      <th>Status</th>
                      <th className="no-sort" />
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Computers</span></td>
                      <td>computers</td>
                      <td>24 Dec 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Electronics</span></td>
                      <td>electronics</td>
                      <td>10 Dec 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Shoe</span></td>
                      <td>shoe</td>
                      <td>27 Nov 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Cosmetics</span></td>
                      <td>cosmetics</td>
                      <td>18 Nov 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Groceries</span></td>
                      <td>groceries</td>
                      <td>06 Nov 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Furniture</span></td>
                      <td>furniture</td>
                      <td>25 Oct 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Bags</span></td>
                      <td>bags</td>
                      <td>14 Oct 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Phone</span></td>
                      <td>phone</td>
                      <td>03 Oct 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Appliances</span></td>
                      <td>appliances</td>
                      <td>20 Sep 2024</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                    <tr>
                      <td>
                        <label className="checkboxs">
                          <input type="checkbox" />
                          <span className="checkmarks" />
                        </label>
                      </td>
                      <td><span className="text-gray-9">Clothing</span></td>
                      <td>clothing</td>
                      <td>10 Sep 20244</td>
                      <td><span className="badge bg-success fw-medium fs-10">Active</span></td>
                      <td className="action-table-data">
                        <div className="edit-delete-action">
                          <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-category">
                            <i data-feather="edit" className="feather-edit" />
                          </a>
                          <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2" href="javascript:void(0);">
                            <i data-feather="trash-2" className="feather-trash-2" />
                          </a>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {/* /product list */}
        </div>

      </div>

      <div>
        {/* Add Category */}
        <div className="modal fade" id="add-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Add Category</h4>
                </div>
                <button type="button" className="close bg-danger text-white fs-16" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action="https://dreamspos.dreamstechnologies.com/html/template/category-list.html">
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Category<span className="text-danger ms-1">*</span></label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category Slug<span className="text-danger ms-1">*</span></label>
                    <input type="text" className="form-control" />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status<span className="text-danger ms-1">*</span></span>
                      <input type="checkbox" id="user2" className="check" defaultChecked />
                      <label htmlFor="user2" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Add Category</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* /Add Category */}
        {/* Edit Category */}
        <div className="modal fade" id="edit-category">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <div className="page-title">
                  <h4>Edit Category</h4>
                </div>
                <button type="button" className="close bg-danger text-white fs-16" data-bs-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">×</span>
                </button>
              </div>
              <form action="https://dreamspos.dreamstechnologies.com/html/template/category-list.html">
                <div className="modal-body">
                  <div className="mb-3">
                    <label className="form-label">Category<span className="text-danger ms-1">*</span></label>
                    <input type="text" className="form-control" defaultValue="Computers" />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Category Slug<span className="text-danger ms-1">*</span></label>
                    <input type="text" className="form-control" defaultValue="computers" />
                  </div>
                  <div className="mb-0">
                    <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                      <span className="status-label">Status<span className="text-danger ms-1">*</span></span>
                      <input type="checkbox" id="user3" className="check" defaultChecked />
                      <label htmlFor="user3" className="checktoggle" />
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        </div>
        {/* delete modal */}
        <div className="modal fade" id="delete-modal">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="page-wrapper-new p-0">
                <div className="content p-5 px-3 text-center">
                  <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2"><i className="ti ti-trash fs-24 text-danger" /></span>
                  <h4 className="fs-20 fw-bold mb-2 mt-1">Delete Category</h4>
                  <p className="mb-0 fs-16">Are you sure you want to delete category?</p>
                  <div className="modal-footer-btn mt-3 d-flex justify-content-center">
                    <button type="button" className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none" data-bs-dismiss="modal">Cancel</button>
                    <button type="submit" className="btn btn-primary fs-13 fw-medium p-2 px-3">Yes Delete</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>

  )
}

export default CategoryList