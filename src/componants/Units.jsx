import React, { useEffect } from 'react'
import feather from "feather-icons";

const Units = () => {
    useEffect(() => {
        // Replace feather icons on component mount
        feather.replace();
    }, []);


    return (
    <div class="main-wrapper">
<div className="content">
  <div className="page-header">
    <div className="add-item d-flex">
      <div className="page-title">
        <h4 className="fw-bold">Units</h4>
        <h6>Manage your units</h6>
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
      <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-units"><i className="ti ti-circle-plus me-1" />Add Unit</a>
    </div>
  </div>
  <div className="card">
    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
      <div className="search-set">
        <div className="search-input">
          <span className="btn-searchset"><i className="ti ti-search fs-14 feather-search" /></span>
        </div>
      </div>
      <div className="table-dropdown my-xl-auto right-content">
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
              <th>Unit</th>
              <th>Short name</th>
              <th>No of Products</th>
              <th>Created Date</th>
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
              <td className="text-gray-9">Kilograms</td>
              <td>kg</td>
              <td>25</td>
              <td>24 Dec 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Liters</td>
              <td>L</td>
              <td>18</td>
              <td>10 Dec 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Dozen</td>
              <td>dz</td>
              <td>30</td>
              <td>27 Nov 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Pieces</td>
              <td>pcs</td>
              <td>42</td>
              <td>18 Nov 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Boxes</td>
              <td>bx</td>
              <td>60</td>
              <td>06 Nov 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Tons</td>
              <td>t</td>
              <td>10</td>
              <td>25 Oct 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Grams</td>
              <td>g</td>
              <td>70</td>
              <td>03 Oct 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Meters</td>
              <td>m</td>
              <td>80</td>
              <td>20 Sep 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
              <td className="text-gray-9">Centimeters</td>
              <td>cm</td>
              <td>120</td>
              <td>10 Sep 2024</td>
              <td><span className="badge table-badge bg-success fw-medium fs-10">Active</span></td>
              <td className="action-table-data">
                <div className="edit-delete-action">
                  <a className="me-2 p-2" href="#" data-bs-toggle="modal" data-bs-target="#edit-units">
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
<div>
  {/* Add Unit */}
  <div className="modal fade" id="add-units">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <div className="page-title">
            <h4>Add Unit</h4>
          </div>
          <button type="button" className="close bg-danger text-white fs-16" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <form action="https://dreamspos.dreamstechnologies.com/html/template/units.html">
          <div className="modal-body">
            <div className="mb-3">
              <label className="form-label">Unit<span className="text-danger ms-1">*</span></label>
              <input type="text" className="form-control" />
            </div>
            <div className="mb-3">
              <label className="form-label">Short Name<span className="text-danger ms-1">*</span></label>
              <input type="text" className="form-control" />
            </div>
            <div className="mb-0">
              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                <span className="status-label">Status</span>
                <input type="checkbox" id="user2" className="check" defaultChecked />
                <label htmlFor="user2" className="checktoggle" />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn me-2 btn-secondary" data-bs-dismiss="modal">Cancel</button>
            <button type="submit" className="btn btn-primary">Add Unit</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  {/* /Add Unit */}
  {/* Edit Unit */}
  <div className="modal fade" id="edit-units">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="modal-header">
          <div className="page-title">
            <h4>Edit Unit</h4>
          </div>
          <button type="button" className="close bg-danger text-white fs-16" data-bs-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">×</span>
          </button>
        </div>
        <form action="https://dreamspos.dreamstechnologies.com/html/template/units.html">
          <div className="modal-body">		
            <div className="mb-3">
              <label className="form-label">Unit<span className="text-danger ms-1">*</span></label>
              <input type="text" className="form-control" defaultValue="Kilograms" />
            </div>
            <div className="mb-3">
              <label className="form-label">Short Name<span className="text-danger ms-1">*</span></label>
              <input type="text" className="form-control" defaultValue="kg" />
            </div>
            <div className="mb-0">
              <div className="status-toggle modal-status d-flex justify-content-between align-items-center">
                <span className="status-label">Status</span>
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
  {/* /Edit Unit */}
  {/* delete modal */}
  <div className="modal fade" id="delete-modal">
    <div className="modal-dialog modal-dialog-centered">
      <div className="modal-content">
        <div className="page-wrapper-new p-0">
          <div className="content p-5 px-3 text-center">
            <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2"><i className="ti ti-trash fs-24 text-danger" /></span>
            <h4 className="fs-20 fw-bold mb-2 mt-1">Delete Unit</h4>
            <p className="mb-0 fs-16">Are you sure you want to delete unit?</p>
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

    </div>
  )
}

export default Units