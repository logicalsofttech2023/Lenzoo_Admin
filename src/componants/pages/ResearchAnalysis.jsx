import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiDownload, FiEdit2, FiTrash2, FiPlus, FiX, FiEye } from "react-icons/fi";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { useNavigate } from "react-router-dom";


const ResearchAnalysis = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;

  const [researchList, setResearchList] = useState([]);
  const [currentResearch, setCurrentResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [files, setFiles] = useState([]);
  const [existingDocuments, setExistingDocuments] = useState([]);
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const fetchResearchAnalysis = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getAllResearchAnalysis`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.data.success) {
        setResearchList(response.data.data);
      } else {
        setError(response.data.message || "Failed to fetch research analysis");
      }
    } catch (error) {
      console.error("Error fetching research analysis:", error);
      setError("Error fetching research analysis. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResearchAnalysis();
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleDeleteDocument = async (filename, researchId) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.post(
          `${base_url}deleteResearchDocument`,
          { filename , documentId: researchId },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        if (response.status === 200) {
          Swal.fire("Deleted!", "Document has been deleted.", "success");
          // Update the UI by removing the deleted document
          if (researchId === currentResearch?._id) {
            setExistingDocuments(existingDocuments.filter(doc => doc !== filename));
          }
          fetchResearchAnalysis(); // Refresh the list
        }
      }
    } catch (error) {
      console.error("Error deleting document:", error);
      Swal.fire("Error!", "Failed to delete document.", "error");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const descriptionHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const formData = new FormData();
    formData.append("serviceChoice", "free");
    formData.append("title", title);
    formData.append("description", descriptionHTML);
    
    // Add all files
    files.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const url = `${base_url}addResearchAnalysis`;
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Research added successfully",
          showConfirmButton: true,
        });
        resetForm();
        fetchResearchAnalysis();
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error adding research:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while processing your request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!currentResearch) return;

    setIsSubmitting(true);

    const descriptionHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    const formData = new FormData();
    formData.append("id", currentResearch._id);
    formData.append("title", title);
    formData.append("description", descriptionHTML);
    formData.append("serviceChoice", "free");
    
    // Add all new files
    files.forEach((file) => {
      formData.append("documents", file);
    });

    try {
      const url = `${base_url}updateResearchAnalysis`;
      const response = await axios.post(url, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: "Research updated successfully",
          showConfirmButton: true,
        });
        resetForm();
        fetchResearchAnalysis();
      } else {
        throw new Error(response.data.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error updating research:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "An error occurred while processing your request",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteResearch = async (id) => {
    try {
      const result = await Swal.fire({
        title: "Are you sure?",
        text: "You won't be able to revert this!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (result.isConfirmed) {
        const response = await axios.get(`${base_url}deleteResearchAnalysis?id=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          Swal.fire("Deleted!", "Research has been deleted.", "success",);
          fetchResearchAnalysis();
        }
      }
    } catch (error) {
      console.error("Error deleting research:", error);
      Swal.fire("Error!", "Failed to delete research.", "error");
    }
  };

  const resetForm = () => {
    setTitle("");
    setFiles([]);
    setExistingDocuments([]);
    setEditorState(EditorState.createEmpty());
    setCurrentResearch(null);
    setIsEditing(false);
    setShowForm(false);
  };

  const editResearch = (research) => {
    setCurrentResearch(research);
    setTitle(research.title);
    setExistingDocuments(research.documents || []);
    const blocksFromHTML = convertFromHTML(research.description || "");
    const contentState = ContentState.createFromBlockArray(
      blocksFromHTML.contentBlocks,
      blocksFromHTML.entityMap
    );
    setEditorState(EditorState.createWithContent(contentState));
    setIsEditing(true);
    setShowForm(true);
  };

  const handleDownload = (documentName) => {
    if (documentName) {
      window.open(`${file_url}${documentName}`, "_blank");
    }
  };

  const viewResearch = (id) => {
    navigate("/researchDetails", { state: { id } });
  }

  if (loading) {
    return (
      <div className="d-flex justify-content-center mt-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger mt-3">{error}</div>;
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Research Analysis</h2>
          <button
            className="btn btn-primary"
            onClick={() => {
              resetForm();
              setShowForm(true);
            }}
          >
            <FiPlus className="me-2" />
            Add New Research
          </button>
        </div>

        {showForm && (
          <form onSubmit={isEditing ? handleUpdate : handleCreate} className="mb-4">
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input
                type="text"
                className="form-control"
                placeholder="Enter title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <Editor
                editorState={editorState}
                wrapperClassName="border rounded"
                editorClassName="px-3"
                onEditorStateChange={setEditorState}
                placeholder="Write your research description here..."
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Upload Documents</label>
              <input
                type="file"
                className="form-control"
                onChange={handleFileChange}
                accept=".pdf,.doc,.docx"
                multiple
              />
              
              {/* Display selected new files */}
              {files.length > 0 && (
                <div className="mt-2">
                  <strong>New Files:</strong>
                  <ul className="list-group mt-2">
                    {files.map((file, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {file.name}
                        <button
                          type="button"
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => removeFile(index)}
                        >
                          <FiX />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Display existing documents for editing */}
              {isEditing && existingDocuments.length > 0 && (
                <div className="mt-3">
                  <strong>Existing Documents:</strong>
                  <ul className="list-group mt-2">
                    {existingDocuments.map((doc, index) => (
                      <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                        {doc.split('/').pop()}
                        <div>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-primary me-2"
                            onClick={() => handleDownload(doc)}
                          >
                            <FiDownload />
                          </button>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDeleteDocument(doc, currentResearch._id)}
                          >
                            <FiTrash2 />
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="d-flex gap-2">
              <button className="btn btn-primary" type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? isEditing
                    ? "Updating..."
                    : "Creating..."
                  : isEditing
                  ? "Update Research"
                  : "Create Research"}
              </button>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
  <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#fff' }}>
    <thead>
      <tr style={{ backgroundColor: '#f8f9fa', borderBottom: '2px solid #e9ecef' }}>
        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Title</th>
        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Description</th>
        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Documents</th>
        <th style={{ padding: '16px', textAlign: 'left', fontWeight: 600 }}>Actions</th>
      </tr>
    </thead>
    <tbody>
      {researchList?.length === 0 ? (
        <tr>
          <td colSpan="4" style={{ padding: '40px', textAlign: 'center', color: '#6c757d' }}>No research analysis found</td>
        </tr>
      ) : (
        researchList.map((research) => (
          <tr key={research._id} style={{ borderBottom: '1px solid #e9ecef', transition: 'background-color 0.2s' }}>
            <td style={{ padding: '16px', verticalAlign: 'top', fontWeight: 500 }}>{research.title}</td>
            <td style={{ padding: '16px', verticalAlign: 'top', maxWidth: '300px' }}>
              <div 
                style={{
                  maxHeight: '100px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical',
                  lineHeight: '1.4',
                  color: '#495057'
                }}
                dangerouslySetInnerHTML={{ __html: research.description }}
              />
              {research.description.length > 150 && (
                <button 
                  onClick={() => expandDescription(research._id)} 
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#0d6efd',
                    cursor: 'pointer',
                    padding: '4px 0',
                    fontSize: '0.85rem'
                  }}
                >
                  Read more
                </button>
              )}
            </td>
            <td style={{ padding: '16px', verticalAlign: 'top' }}>
              {research.documents?.length > 0 ? (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {research.documents.map((doc, index) => (
                    <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <button
                        style={{
                          padding: '6px 12px',
                          fontSize: '0.8rem',
                          backgroundColor: 'transparent',
                          border: '1px solid #0d6efd',
                          borderRadius: '4px',
                          color: '#0d6efd',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                        onClick={() => handleDownload(doc)}
                      >
                        <FiDownload style={{ marginRight: '4px' }} />
                        Doc {index + 1}
                      </button>
                      <button
                        style={{
                          padding: '6px',
                          fontSize: '0.8rem',
                          backgroundColor: 'transparent',
                          border: '1px solid #dc3545',
                          borderRadius: '4px',
                          color: '#dc3545',
                          cursor: 'pointer'
                        }}
                        onClick={() => handleDeleteDocument(doc, research._id)}
                      >
                        <FiTrash2 />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <span style={{ color: '#6c757d' }}>No documents</span>
              )}
            </td>
            <td style={{ padding: '16px', verticalAlign: 'top' }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={{
                    padding: '6px 10px',
                    backgroundColor: 'transparent',
                    border: '1px solid #0d6efd',
                    borderRadius: '4px',
                    color: '#0d6efd',
                    cursor: 'pointer'
                  }}
                  onClick={() => editResearch(research)}
                >
                  <FiEdit2 />
                </button>
                <button
                  style={{
                    padding: '6px 10px',
                    backgroundColor: 'transparent',
                    border: '1px solid #dc3545',
                    borderRadius: '4px',
                    color: '#dc3545',
                    cursor: 'pointer'
                  }}
                  onClick={() => handleDeleteResearch(research._id)}
                >
                  <FiTrash2 />
                </button>
                <button
                  style={{
                    padding: '6px 10px',
                    backgroundColor: 'transparent',
                    border: '1px solid #0dcaf0',
                    borderRadius: '4px',
                    color: '#0dcaf0',
                    cursor: 'pointer'
                  }}
                  onClick={() => viewResearch(research._id)}
                >
                  <FiEye />
                </button>
              </div>
            </td>
          </tr>
        ))
      )}
    </tbody>
  </table>
</div>
      </div>
    </div>
  );
};

export default ResearchAnalysis;