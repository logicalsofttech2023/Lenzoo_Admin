import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";

const FaqItem = React.memo(({ faq, onEdit, onToggle, onDelete, t }) => {
  const itemStyle = {
    border: "1px solid #e0e0e0",
    borderRadius: "8px",
    marginBottom: "12px",
    overflow: "hidden",
    boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
  };

  const headerStyle = {
    backgroundColor: "#f8f9fa",
    padding: "16px",
    cursor: "pointer",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center"
  };

  const buttonStyle = {
    backgroundColor: "transparent",
    border: "none",
    textAlign: "left",
    width: "100%",
    fontSize: "16px",
    fontWeight: "500",
    color: faq.isActive ? "#212529" : "#6c757d",
    outline: "none"
  };

  const bodyStyle = {
    padding: "16px",
    borderTop: "1px solid #e0e0e0"
  };

  const actionButtonsStyle = {
    display: "flex",
    justifyContent: "flex-end",
    gap: "8px",
    marginTop: "12px"
  };

  const baseButton = {
    padding: "6px 12px",
    borderRadius: "4px",
    fontSize: "14px",
    cursor: "pointer",
    border: "1px solid"
  };

  return (
    <div style={itemStyle}>
      <div style={headerStyle}>
        <button style={buttonStyle}>
          {faq.question}
        </button>
      </div>
      <div style={bodyStyle}>
        <p style={{ margin: "0 0 12px 0" }}>{faq.answer}</p>
        <div style={actionButtonsStyle}>
          <button 
            className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
            onClick={() => onEdit(faq._id)}
          >
            {t("edit")}
          </button>
          <button
            style={{ ...baseButton, borderColor: "#dc3545", color: "#dc3545" }}
            onClick={() => onDelete(faq._id)}
          >
            {t("delete")}
          </button>
        </div>
      </div>
    </div>
  );
});

const Faqs = () => {
  const { t } = useTranslation();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    question: "",
    answer: "",
    id: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const containerStyle = {
    maxWidth: "800px",
    margin: "24px",
  };

  const cardStyle = {
    backgroundColor: "#fff",
    borderRadius: "8px",
    padding: "24px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)"
  };

  const headerStyle = {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  };

  const titleStyle = {
    margin: "0",
    fontSize: "24px",
    fontWeight: "600"
  };

  const buttonStyle = {
    backgroundColor: "#0d6efd",
    color: "white",
    border: "none",
    padding: "8px 16px",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "500"
  };

  const formCardStyle = {
    backgroundColor: "#f8f9fa",
    borderRadius: "8px",
    padding: "16px",
    marginBottom: "24px"
  };

  const formTitleStyle = {
    margin: "0 0 16px 0",
    fontSize: "18px"
  };

  const formGroupStyle = {
    marginBottom: "16px"
  };

  const labelStyle = {
    display: "block",
    marginBottom: "8px",
    fontWeight: "500"
  };

  const inputStyle = {
    width: "100%",
    padding: "8px 12px",
    border: "1px solid #ced4da",
    borderRadius: "4px",
    fontSize: "16px"
  };

  const textareaStyle = {
    ...inputStyle,
    minHeight: "100px",
    resize: "vertical"
  };

  const submitButtonStyle = {
    ...buttonStyle,
    padding: "8px 20px"
  };

  const infoMessageStyle = {
    backgroundColor: "#e7f5ff",
    color: "#1864ab",
    padding: "12px 16px",
    borderRadius: "4px",
    margin: "16px 0"
  };

  const loadingStyle = {
    textAlign: "center",
    margin: "24px 0",
    fontSize: "16px"
  };

  const errorStyle = {
    backgroundColor: "#fff3bf",
    color: "#e67700",
    padding: "12px 16px",
    borderRadius: "4px",
    margin: "16px 0"
  };

  // Fetch all FAQs
  const fetchFaqs = async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}getAllFAQs`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setFaqs(response.data.faqs);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFaqs();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`${import.meta.env.VITE_API_BASE_URL}updateFAQ`, {
          question: formData.question,
          answer: formData.answer,
          id: formData.id,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      } else {
        await axios.post(`${import.meta.env.VITE_API_BASE_URL}addFAQ`, {
          question: formData.question,
          answer: formData.answer,
        }, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
      }
      setFormData({ question: "", answer: "", id: "" });
      setIsEditing(false);
      setShowForm(false);
      fetchFaqs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = async (id) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}getFAQById?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const { question, answer, _id } = response.data.faq;
      setFormData({ question, answer, id: _id });
      setIsEditing(true);
      setShowForm(true);
    } catch (err) {
      setError(err.message);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}updateFAQ`, {
        id,
        isActive: !currentStatus,
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchFaqs();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}deleteFAQ?id=${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchFaqs();
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <div style={loadingStyle}>{t("loading")}</div>;
  if (error) return <div style={errorStyle}>{t("error")}: {error}</div>;

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>{t("faqs")}</h2>
          <button
            className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2"
            onClick={() => {
              setShowForm(!showForm);
              setIsEditing(false);
              setFormData({ question: "", answer: "", id: "" });
            }}
          >
            {showForm ? t("cancel") : t("addNewFaq")}
          </button>
        </div>

        {showForm && (
          <div style={formCardStyle}>
            <h4 style={formTitleStyle}>{isEditing ? t("editFaq") : t("addNewFaq")}</h4>
            <form onSubmit={handleSubmit}>
              <div style={formGroupStyle}>
                <label htmlFor="question" style={labelStyle}>
                  {t("question")}
                </label>
                <input
                  type="text"
                  style={inputStyle}
                  id="question"
                  name="question"
                  value={formData.question}
                  onChange={handleChange}
                  required
                />
              </div>
              <div style={formGroupStyle}>
                <label htmlFor="answer" style={labelStyle}>
                  {t("answer")}
                </label>
                <textarea
                  style={textareaStyle}
                  id="answer"
                  name="answer"
                  rows="3"
                  value={formData.answer}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button className="btn btn-primary px-4 py-2 d-flex align-items-center gap-2" type="submit" style={submitButtonStyle}>
                {isEditing ? t("updateFaq") : t("addFaq")}
              </button>
            </form>
          </div>
        )}

        <div>
          {faqs.length === 0 ? (
            <div style={infoMessageStyle}>{t("noFaqsFound")}</div>
          ) : (
            faqs.map((faq) => (
              <FaqItem
                key={faq._id}
                faq={faq}
                onEdit={handleEdit}
                onToggle={toggleStatus}
                onDelete={handleDelete}
                t={t}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Faqs;