
import React, { useEffect, useState } from 'react'
import feather from "feather-icons";


const User = () => {
    useEffect(() => {
        // Replace feather icons on component mount
        feather.replace();
    }, []);

    return (
        <div className="main-wrapper">
            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4 className="fw-bold">Users</h4>
                            <h6>Manage your users</h6>
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
                        <a href="#" className="btn btn-primary" data-bs-toggle="modal" data-bs-target="#add-user"><i className="ti ti-circle-plus me-1" />Add User</a>
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
                                        <th>User Name</th>
                                        <th>Phone</th>
                                        <th>Email</th>
                                        <th>Role</th>
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-47.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Henry Bryant</a>
                                            </div>
                                        </td>
                                        <td>+12498345785</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="87efe2e9f5fec7e2ffe6eaf7ebe2a9e4e8ea">[email&nbsp;protected]</a></td>
                                        <td>Admin</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-02.jpg" alt="product" />
                                                </a>
                                                <div>
                                                    <a href="javascript:void(0);">Jenny Ellis</a>
                                                </div>
                                            </div>
                                        </td>
                                        <td>+13178964582</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="c4aea1aaaabd84a1bca5a9b4a8a1eaa7aba9">[email&nbsp;protected]</a></td>
                                        <td>Manager</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-43.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Leon Baxter</a>
                                            </div>
                                        </td>
                                        <td>+12796183487</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="8be7eee4e5cbeef3eae6fbe7eea5e8e4e6">[email&nbsp;protected]</a></td>
                                        <td>Salesman</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-35.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Karen Flores</a>
                                            </div>
                                        </td>
                                        <td>+17538647943</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="bcd7ddced9d2fcd9c4ddd1ccd0d992dfd3d1">[email&nbsp;protected]</a></td>
                                        <td>Supervisor</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-44.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Michael Dawson</a>
                                            </div>
                                        </td>
                                        <td>+13798132475 </td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="026f6b616a63676e42677a636f726e672c616d6f">[email&nbsp;protected]</a></td>
                                        <td>Store Keeper</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-37.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Karen Galvan</a>
                                            </div>
                                        </td>
                                        <td>+17596341894</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="2e454f5c4b406e4b564f435e424b004d4143">[email&nbsp;protected]</a></td>
                                        <td>Purchase</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-48.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Thomas Ward</a>
                                            </div>
                                        </td>
                                        <td>+12973548678</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="0d796562606c7e4d68756c607d6168236e6260">[email&nbsp;protected]</a></td>
                                        <td>Delivery Biker</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-38.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Aliza Duncan</a>
                                            </div>
                                        </td>
                                        <td>+13147858357</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="593835302338193c21383429353c773a3634">[email&nbsp;protected]</a></td>
                                        <td>Maintenance</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-45.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">James Higham</a>
                                            </div>
                                        </td>
                                        <td>+11978348626</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="f09a919d9583b09588919d809c95de939f9d">[email&nbsp;protected]</a></td>
                                        <td>Quality Analyst</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/users/user-40.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Jada Robinson</a>
                                            </div>
                                        </td>
                                        <td>+12678934561</td>
                                        <td><a href="https://dreamspos.dreamstechnologies.com/cdn-cgi/l/email-protection" className="__cf_email__" data-cfemail="80f2efe2e9eef3efeec0e5f8e1edf0ece5aee3efed">[email&nbsp;protected]</a></td>
                                        <td>Accountant</td>
                                        <td><span className="d-inline-flex align-items-center p-1 pe-2 rounded-1 text-white bg-success fs-10"><i className="ti ti-point-filled me-1 fs-11" />Active</span></td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 p-2 mb-0" href="javascript:void(0);">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2 mb-0" data-bs-toggle="modal" data-bs-target="#edit-user">
                                                    <i data-feather="edit" className="feather-edit" />
                                                </a>
                                                <a data-bs-toggle="modal" data-bs-target="#delete-modal" className="p-2 mb-0" href="javascript:void(0);">
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
    )
}

export default User