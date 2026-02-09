import React, { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "../firebase";
import "./styles/createContent.css";

const CreateContent = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [status, setStatus] = useState("Draft");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const auth = getAuth();
  const user = auth.currentUser;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    if(!user) {
      setError("You must be logged in to create content.");
      return;
    }

    if (!title.trim() || !text.trim()) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "content"), {
        title: title.trim(),
        text: text.trim(),
        status,
        userId: user.uid,
        createdAt: new Date().toISOString(),
      });

      setTitle("");
      setText("");
      setStatus("draft");
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      console.error("Error adding content:", err);
      setError("Failed to create content. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Create New Content</h2>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="create-content-form">
          <div className="form-group">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter content title"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="text">Content</label>
            <textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Enter your content here"
              rows="8"
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="status">Status</label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              disabled={loading}
            >
              <option value="Draft">Draft</option>
              <option value="Planning">Planning</option>
              <option value="Review">Review</option>
              <option value="Update">Update</option>
              <option value="Ready to Post">Ready to Post</option>
            </select>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="modal-actions">
            <button
              type="button"
              className="btn-cancel"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn-submit"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create Content"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateContent;
