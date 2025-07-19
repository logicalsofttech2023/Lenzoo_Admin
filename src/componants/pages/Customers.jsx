import React, { useEffect } from 'react'

import feather from "feather-icons";
import { Link } from 'react-router-dom';

const Customers = () => {
    useEffect(() => {
        // Replace feather icons on component mount
        feather.replace();
    }, []);


    return (
        <>

            <div className="content">
                <div className="page-header">
                    <div className="add-item d-flex">
                        <div className="page-title">
                            <h4 className="fw-bold">User List</h4>
                            <h6>Manage your products</h6>
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
                        <Link to="/addproduct" className="btn btn-primary"><i className="ti ti-circle-plus me-1" />Add Product</Link>
                    </div>
                    <div className="page-btn import">
                        <a href="#" className="btn btn-secondary color" data-bs-toggle="modal" data-bs-target="#view-notes"><i data-feather="download" className="me-1" />Import Product</a>
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
                            <div className="dropdown me-2">
                                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                    Category
                                </a>
                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Computers</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Electronics</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Shoe</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Electronics</a>
                                    </li>
                                </ul>
                            </div>
                            <div className="dropdown">
                                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white btn-md d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                    Brand
                                </a>
                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Lenovo</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Beats</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Nike</a>
                                    </li>
                                    <li>
                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Apple</a>
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
                                        <th>Id# </th>
                                        <th>User Name</th>
                                        <th>Category</th>
                                        <th>Brand</th>
                                        <th>Price</th>
                                        <th>Unit</th>
                                        <th>Qty</th>
                                        <th>Created By</th>
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
                                        <td>PT001 </td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/stock-img-01.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Lenovo IdeaPad 3 </a>
                                            </div>
                                        </td>
                                        <td>Computers</td>
                                        <td>Lenovo</td>
                                        <td>$600</td>
                                        <td>Pc</td>
                                        <td>100</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-30.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">James Kirwin</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon  p-2" href="product-details.html">
                                                    <i data-feather="eye" className="feather-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT002</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/stock-img-06.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Beats Pro</a>
                                            </div>
                                        </td>
                                        <td>Electronics</td>
                                        <td>Beats</td>
                                        <td>$160</td>
                                        <td>Pc</td>
                                        <td>140</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-13.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Francis Chang</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT003</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/stock-img-02.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Nike Jordan</a>
                                            </div>
                                        </td>
                                        <td>Shoe</td>
                                        <td>Nike</td>
                                        <td>$110</td>
                                        <td>Pc</td>
                                        <td>300</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-11.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Antonio Engle</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT004</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/stock-img-03.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Apple Series 5 Watch</a>
                                            </div>
                                        </td>
                                        <td>Electronics</td>
                                        <td>Apple</td>
                                        <td>$120</td>
                                        <td>Pc</td>
                                        <td>450</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-32.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Leo Kelly</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT005</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/stock-img-04.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Amazon Echo Dot</a>
                                            </div>
                                        </td>
                                        <td>Electronics</td>
                                        <td>Amazon</td>
                                        <td>$80</td>
                                        <td>Pc</td>
                                        <td>320</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-02.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Annette Walker</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT006</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/stock-img-05.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Sanford Chair Sofa</a>
                                            </div>
                                        </td>
                                        <td>Furnitures</td>
                                        <td>Modern Wave</td>
                                        <td>$320</td>
                                        <td>Pc</td>
                                        <td>650</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-05.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">John Weaver</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT007</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/expire-product-01.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Red Premium Satchel</a>
                                            </div>
                                        </td>
                                        <td>Bags</td>
                                        <td>Dior</td>
                                        <td>$60</td>
                                        <td>Pc</td>
                                        <td>700</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-08.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Gary Hennessy</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT008</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/expire-product-02.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Iphone 14 Pro</a>
                                            </div>
                                        </td>
                                        <td>Phone</td>
                                        <td>Apple</td>
                                        <td>$540</td>
                                        <td>Pc</td>
                                        <td>630</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-04.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Eleanor Panek</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT009</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/expire-product-03.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Gaming Chair</a>
                                            </div>
                                        </td>
                                        <td>Furniture</td>
                                        <td>Arlime</td>
                                        <td>$200</td>
                                        <td>Pc</td>
                                        <td>410</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-09.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">William Levy</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT010</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/expire-product-04.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Borealis Backpack</a>
                                            </div>
                                        </td>
                                        <td>Bags</td>
                                        <td>The North Face</td>
                                        <td>$45</td>
                                        <td>Pc</td>
                                        <td>550</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-sm me-2">
                                                    <img src="assets/img/users/user-10.jpg" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Charlotte Klotz</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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
                                        <td>PT010</td>
                                        <td>
                                            <div className="d-flex align-items-center">
                                                <a href="javascript:void(0);" className="avatar avatar-md me-2">
                                                    <img src="assets/img/products/expire-product-04.png" alt="product" />
                                                </a>
                                                <a href="javascript:void(0);">Borealis Backpack</a>
                                            </div>
                                        </td>
                                        <td>Bags</td>
                                        <td>The North Face</td>
                                        <td>$45</td>
                                        <td>Pc</td>
                                        <td>550</td>
                                        <td>
                                            <div className="userimgname">
                                                <span className="avatar avatar-sm">
                                                    <a href="javascript:void(0);">
                                                        <img src="assets/img/users/user-10.jpg" alt="product" />
                                                    </a>
                                                </span>
                                                <a href="javascript:void(0);">Charlotte Klotz</a>
                                            </div>
                                        </td>
                                        <td className="action-table-data">
                                            <div className="edit-delete-action">
                                                <a className="me-2 edit-icon p-2" href="product-details.html">
                                                    <i data-feather="eye" className="action-eye" />
                                                </a>
                                                <a className="me-2 p-2" href="edit-product.html">
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

            {/* /Main Wrapper */}
            {/* Import Product */}
            <div className="modal fade" id="view-notes">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content">
                                <div className="modal-header">
                                    <div className="page-title">
                                        <h4>Import Product</h4>
                                    </div>
                                    <button type="button" className="close" data-bs-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">×</span>
                                    </button>
                                </div>
                                <div className="modal-body">
                                    <form action="https://dreamspos.dreamstechnologies.com/html/template/product-list.html">
                                        <div className="row">
                                            <div className="col-12">
                                                <div className="mb-3">
                                                    <label>Product<span className="ms-1 text-danger">*</span></label>
                                                    <select className="select">
                                                        <option>Select</option>
                                                        <option>Bold V3.2</option>
                                                        <option>Nike Jordan</option>
                                                        <option>Iphone 14 Pro</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label>Category<span className="ms-1 text-danger">*</span></label>
                                                    <select className="select">
                                                        <option>Select</option>
                                                        <option>Laptop</option>
                                                        <option>Electronics</option>
                                                        <option>Shoe</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label>Sub Category<span className="ms-1 text-danger">*</span></label>
                                                    <select className="select">
                                                        <option>Select</option>
                                                        <option>Lenovo</option>
                                                        <option>Bolt</option>
                                                        <option>Nike</option>
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-sm-6 col-12">
                                                <div className="row">
                                                    <div>
                                                        <div className="modal-footer-btn download-file">
                                                            <a href="javascript:void(0)" className="btn btn-submit">Download Sample File</a>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12">
                                                <div className="mb-3 image-upload-down">
                                                    <label className="form-label">Upload CSV File</label>
                                                    <div className="image-upload download">
                                                        <input type="file" />
                                                        <div className="image-uploads">
                                                            <img src="assets/img/download-img.png" alt="img" />
                                                            <h4>Drag and drop a <span>file to upload</span></h4>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="col-lg-12 col-sm-6 col-12">
                                                <div className="mb-3">
                                                    <label className="form-label">Created by<span className="ms-1 text-danger">*</span></label>
                                                    <input type="text" className="form-control" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="row">
                                            <div className="col-lg-12">
                                                <div className="mb-3 mb-3">
                                                    <label className="form-label">Description</label>
                                                    <textarea className="form-control" defaultValue={""} />
                                                    <p className="mt-1">Maximum 60 Characters</p>
                                                </div>
                                            </div>
                                        </div>
                                    </form>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary fs-13 fw-medium p-2 px-3">Submit</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* /Import Product */}
            {/* delete modal */}
            <div className="modal fade" id="delete-modal">
                <div className="modal-dialog modal-dialog-centered">
                    <div className="modal-content">
                        <div className="page-wrapper-new p-0">
                            <div className="content p-5 px-3 text-center">
                                <span className="rounded-circle d-inline-flex p-2 bg-danger-transparent mb-2"><i className="ti ti-trash fs-24 text-danger" /></span>
                                <h4 className="fs-20 text-gray-9 fw-bold mb-2 mt-1">Delete Product</h4>
                                <p className="text-gray-6 mb-0 fs-16">Are you sure you want to delete product?</p>
                                <div className="modal-footer-btn mt-3 d-flex justify-content-center">
                                    <button type="button" className="btn me-2 btn-secondary fs-13 fw-medium p-2 px-3 shadow-none" data-bs-dismiss="modal">Cancel</button>
                                    <button type="submit" className="btn btn-primary fs-13 fw-medium p-2 px-3">Yes Delete</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
}

export default Customers


