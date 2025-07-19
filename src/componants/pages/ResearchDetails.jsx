import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { FiDownload, FiArrowLeft, FiClock, FiCalendar } from "react-icons/fi";
import { FaFilePdf } from "react-icons/fa";
import DOMPurify from "dompurify";

const ResearchDetails = () => {
  const location = useLocation();
  const id = location.state.id;
  const navigate = useNavigate();
  const base_url = import.meta.env.VITE_API_BASE_URL;
  const file_url = import.meta.env.VITE_API_FILE_URL;

  const [research, setResearch] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchResearchDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${base_url}getResearchAnalysisById?id=${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (response.data.success) {
          setResearch(response.data.data);
        } else {
          setError(response.data.message || "Failed to fetch research details");
        }
      } catch (error) {
        console.error("Error fetching research details:", error);
        setError("Error fetching research details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchResearchDetails();
  }, [id]);

  const handleDownload = (documentName) => {
    if (documentName) {
      window.open(`${file_url}${documentName}`, "_blank");
    }
  };

  const getSanitizedHTML = (html) => {
    return DOMPurify.sanitize(html);
  };

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '80vh'
      }}>
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mt-5">
        <div className="alert alert-danger" style={{
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          {error}
        </div>
      </div>
    );
  }

  if (!research) {
    return (
      <div className="container mt-5">
        <div className="alert alert-info" style={{
          borderRadius: '8px',
          padding: '20px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}>
          No research found
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{
      maxWidth: '1200px',
      margin: '40px auto',
      padding: '0 20px'
    }}>
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '12px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
        padding: '32px',
        position: 'relative'
      }}>
        <button 
          onClick={() => navigate(-1)}
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'none',
            border: '1px solid #e0e0e0',
            borderRadius: '6px',
            padding: '8px 16px',
            color: '#555',
            cursor: 'pointer',
            marginBottom: '24px',
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f5f5f5'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <FiArrowLeft style={{ marginRight: '8px' }} />
          Back to List
        </button>

        <div style={{ marginBottom: '8px' }}>
          <span style={{
            display: 'inline-block',
            backgroundColor: research.serviceChoice === 'free' ? '#e3f2fd' : '#e8f5e9',
            color: research.serviceChoice === 'free' ? '#1976d2' : '#2e7d32',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '0.85rem',
            fontWeight: '500'
          }}>
            {research.serviceChoice === 'free' ? 'Free Service' : 'Premium Service'}
          </span>
        </div>

        <h1 style={{
          fontSize: '2rem',
          fontWeight: '700',
          margin: '16px 0 24px',
          color: '#333'
        }}>{research.title}</h1>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '20px',
          marginBottom: '32px',
          color: '#666'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiCalendar size={16} />
            <span>Created: {new Date(research.createdAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <FiClock size={16} />
            <span>Updated: {new Date(research.updatedAt).toLocaleDateString('en-US', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}</span>
          </div>
        </div>

        <div style={{ marginBottom: '40px' }}>
          <h3 style={{
            fontSize: '1.25rem',
            fontWeight: '600',
            marginBottom: '16px',
            color: '#444',
            borderBottom: '1px solid #eee',
            paddingBottom: '8px'
          }}>Research Description</h3>
          <div
            style={{
              border: '1px solid #eee',
              borderRadius: '8px',
              padding: '24px',
              backgroundColor: '#fafafa',
              lineHeight: '1.6',
              color: '#333'
            }}
            dangerouslySetInnerHTML={{ __html: getSanitizedHTML(research.description) }}
          />
        </div>

        {research.documents?.length > 0 && (
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '1.25rem',
              fontWeight: '600',
              marginBottom: '16px',
              color: '#444',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px'
            }}>Research Documents</h3>
            <div style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              {research.documents.map((doc, index) => (
                <div 
                  key={index}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    border: '1px solid #e0e0e0',
                    borderRadius: '8px',
                    padding: '12px 16px',
                    width: '100%',
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    ':hover': {
                      borderColor: '#1976d2',
                      backgroundColor: '#f5f9ff'
                    }
                  }}
                  onClick={() => handleDownload(doc)}
                >
                  <FaFilePdf size={24} color="#e53935" />
                  <div style={{ flex: 1 }}>
                    <div style={{
                      fontWeight: '500',
                      color: '#333',
                      marginBottom: '4px'
                    }}>
                      Document {index + 1}
                    </div>
                    <div style={{
                      fontSize: '0.8rem',
                      color: '#666',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis'
                    }}>
                      {doc}
                    </div>
                  </div>
                  <FiDownload size={18} color="#1976d2" />
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResearchDetails;