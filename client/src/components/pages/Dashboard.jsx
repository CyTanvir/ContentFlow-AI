import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query, where, doc, updateDoc, deleteDoc, orderBy } from "firebase/firestore";
import { db } from "../../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import CreateContent from "../CreateContent";
import "../styles/dashboard.css";

export default function Dashboard() {
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [expandedId, setExpandedId] = useState(null);
  const [editingContent, setEditingContent] = useState({ title: "", text: "", status: "Draft"});

  const auth = getAuth();

  useEffect(() => {
    // Listen for auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      if (user) {
        fetchContent(user);
      } else {
        setLoading(false);
        setError("Please sign in to view your content");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const fetchContent = async (user) => {
    if (!user) {
      setError("User not authenticated");
      setLoading(false);
      return;
    }
    try {
      setLoading(true);
      const q = query(collection(db, "content"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const items = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setContent(items);
      setError(null);
    } catch (err) {
      console.error("Error fetching content:", err);
      setError("Failed to load content. Check your Firebase permissions.");
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    const statusMap = {
      draft: "badge-draft",
      planning: "badge-planning",
      review: "badge-review",
      update: "badge-update",
      "ready-to-post": "badge-ready",
    };
    return statusMap[status] || "badge-draft";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (!user && !loading) {
    return (
      <div className="dashboard">
        <div className="error-alert">
          Please sign in to access your content.
        </div>
      </div>
    );
  }

  const getStatusColor = (status) => {
      switch(status) {
          case "draft":
              return "#gray";
          case "planning":
              return "#blue";
          case "review":
              return "#orange";
          case "update":
              return "#yellow";
          case "ready-to-post":
              return "#green";
          default:
              return "#gray";
      }
  };

  const handleExpandCard = (item) => {
        setExpandedId(item.id);
        setEditingContent({
            title: item.title,
            text: item.text,
            status: item.status,
            id: item.id
        });
    };

    const handleCloseExpanded = () => {
        setExpandedId(null);
        setEditingContent({ title: "", text: "", status: "draft" });
    };

    const handleSaveChanges = async () => {
        try {
            const contentRef = doc(db, "content", editingContent.id);
            await updateDoc(contentRef, {
                title: editingContent.title,
                text: editingContent.text,
                status: editingContent.status
            });
            setExpandedId(null);
            fetchContent(user);
        } catch (error) {
            console.error("Error updating content:", error);
            setError("Failed to update content");
        }
    };

    const handleDeleteContent = async (contentId) => {
        if (confirm("Are you sure you want to delete this content?")) {
            try {
                await deleteDoc(doc(db, "content", contentId));
                setExpandedId(null);
                fetchContent(user);
            } catch (error) {
                console.error("Error deleting content:", error);
                setError("Failed to delete content");
            }
        }
    };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h2>My Content</h2>
        <button
          className="btn-create"
          onClick={() => setIsModalOpen(true)}
        >
          + Create Content
        </button>
      </div>

      <CreateContent
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchContent}
      />

      {error && <div className="error-alert">{error}</div>}

      {loading ? (
        <div className="loading">Loading your content...</div>
      ) : content.length === 0 ? (
        <div className="empty-state">
          <p>No content yet. Create your first piece of content!</p>
        </div>
      ) : (
        <div className="content-grid">
          {content.map((item) => (
            <div 
                key={item.id} 
                className={`content-card ${expandedId === item.id ? "expanded" : ""}`}
                onClick={() => !expandedId && handleExpandCard(item)}
            >
              {expandedId === item.id ? (
                // Expanded view
                <div className="expanded-content" onClick={(e) => e.stopPropagation()}>
                    <input
                        type="text"
                        value={editingContent.title}
                        onChange={(e) => setEditingContent({...editingContent, title: e.target.value})}
                        className="edit-input"
                        placeholder="Title"
                    />
                    <textarea
                        value={editingContent.text}
                        onChange={(e) => setEditingContent({...editingContent, text: e.target.value})}
                        className="edit-textarea"
                        placeholder="Content"
                    />
                    <select
                        value={editingContent.status}
                        onChange={(e) => setEditingContent({...editingContent, status: e.target.value})}
                        className="edit-select"
                    >
                        <option value="draft">Draft</option>
                        <option value="planning">Planning</option>
                        <option value="review">Review</option>
                        <option value="update">Update</option>
                        <option value="ready-to-post">Ready to Post</option>
                    </select>
                    <div className="expanded-actions">
                        <button className="btn-save" onClick={handleSaveChanges}>Save</button>
                        <button className="btn-delete" onClick={() => handleDeleteContent(item.id)}>Delete</button>
                        <button className="btn-cancel" onClick={handleCloseExpanded}>Cancel</button>
                    </div>
                </div>
              ) : (
                // Collapsed view
                <>
                    <h3>{item.title || "Untitled"}</h3>
                    <p className="status-badge" style={{
                        backgroundColor: getStatusColor(item.status)
                    }}>
                        {item.status || "unknown"}
                    </p>
                    <p className="content-preview">
                        {(item.text || "").substring(0, 150)}...
                    </p>
                    <small>{new Date(item.createdAt?.toDate?.()).toLocaleDateString()}</small>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

