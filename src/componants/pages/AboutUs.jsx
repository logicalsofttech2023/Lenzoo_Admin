import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { FiDownload, FiEdit, FiEye } from "react-icons/fi";
import DOMPurify from "dompurify";
import {
  EditorState,
  ContentState,
  convertToRaw,
  convertFromHTML,
} from "draft-js";
import draftToHtml from "draftjs-to-html";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const AboutUs = () => {
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;

  const [policyData, setPolicyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );
  const [previewMode, setPreviewMode] = useState(false);

  const fetchPolicyData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${base_url}getPolicy?type=about`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.status === 200) {
        const data = response.data.policy;
        setPolicyData(data);
        setFileName(data.image || "");

        const blocksFromHTML = convertFromHTML(data.content || "");
        const contentState = ContentState.createFromBlockArray(
          blocksFromHTML.contentBlocks,
          blocksFromHTML.entityMap
        );
        setEditorState(EditorState.createWithContent(contentState));
      } else {
        setError("No About Us content found");
      }
    } catch (error) {
      console.error("Error fetching About Us content:", error);
      setError("Error fetching content");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPolicyData();
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const contentHTML = draftToHtml(
      convertToRaw(editorState.getCurrentContent())
    );
    const formData = new FormData();
    formData.append("type", "about");
    formData.append("content", contentHTML);
    if (file) {
      formData.append("image", file);
    }

    try {
      const response = await axios.post(`${base_url}policyUpdate`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.status) {
        Swal.fire({
          icon: "success",
          title: "Updated",
          text: "About Us updated successfully",
          timer: 2000,
          showConfirmButton: false,
        });
        fetchPolicyData();
      } else {
        throw new Error(response.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Submit error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error.message || "Something went wrong",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    if (policyData) {
      const blocksFromHTML = convertFromHTML(policyData.content || "");
      const contentState = ContentState.createFromBlockArray(
        blocksFromHTML.contentBlocks,
        blocksFromHTML.entityMap
      );
      setEditorState(EditorState.createWithContent(contentState));
      setFileName(policyData.image || "");
    }
    setFile(null);
  };

  const togglePreview = () => {
    setPreviewMode(!previewMode);
  };

  const handleDownload = () => {
    if (policyData?.image) {
      window.open(`${file_url}${policyData.image}`, "_blank");
    }
  };

  const getSanitizedHTML = () => {
    const rawHTML = draftToHtml(convertToRaw(editorState.getCurrentContent()));
    return DOMPurify.sanitize(rawHTML);
  };

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

  if (!policyData) {
    return (
      <div className="alert alert-info mt-3">No About Us content found</div>
    );
  }

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="mb-0">About Us</h2>
          <button 
            className="btn btn-outline-primary d-flex align-items-center gap-2"
            onClick={togglePreview}
          >
            {previewMode ? (
              <>
                <FiEdit /> Edit Mode
              </>
            ) : (
              <>
                <FiEye /> Preview Mode
              </>
            )}
          </button>
        </div>

        {previewMode ? (
          <div className="policy-preview">
            <div className="card mb-4">
              {policyData.image && (
                <div className="card-body text-center">
                  <img
                    src={`${file_url}${policyData.image}`}
                    alt="About Us"
                    className="img-fluid rounded"
                    style={{ 
                      maxHeight: "400px", 
                      maxWidth: "100%",
                      objectFit: "contain",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
                    }}
                  />
                  <div className="mt-3">
                    <button
                      className="btn btn-outline-primary d-flex align-items-center gap-2 mx-auto"
                      onClick={handleDownload}
                    >
                      <FiDownload />
                      Download Image
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="card">
              <div className="card-body">
                <h4 className="card-title mb-4">About Us Content</h4>
                <div
                  className="content-preview"
                  style={{
                    lineHeight: "1.6",
                    fontSize: "1rem",
                  }}
                  dangerouslySetInnerHTML={{ __html: getSanitizedHTML() }}
                />
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="form-label fw-bold">Description</label>
              <div className="border rounded overflow-hidden">
                <Editor
                  editorState={editorState}
                  toolbarClassName="border-bottom"
                  wrapperClassName="p-0"
                  editorClassName="px-3 py-2"
                  onEditorStateChange={setEditorState}
                  placeholder="Write About Us content here..."
                  toolbar={{
                    options: ['inline', 'blockType', 'fontSize', 'list', 'textAlign', 'link', 'emoji', 'image', 'remove', 'history'],
                  }}
                />
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label fw-bold">Upload Image</label>
              <div className="card border">
                <div className="card-body">
                  <input
                    type="file"
                    className="form-control"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {fileName && (
                    <div className="mt-2 text-muted">
                      <small>Selected file: {fileName}</small>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="d-flex gap-2 mt-4">
              <button
                className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                    Updating...
                  </>
                ) : (
                  "Update About Us"
                )}
              </button>
              <button
                className="btn btn-outline-secondary px-4 py-2"
                type="button"
                onClick={resetForm}
                disabled={isSubmitting}
              >
                Reset
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default AboutUs;