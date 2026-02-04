import React, { useEffect, useState } from "react";
import "./App.css";

function PostIdeas() {
    const [value, setValue] = useState("");
    const [ideas, setIdeas] = useState(() => {
        try {
            const raw = localStorage.getItem("postIdeas");
            return raw ? JSON.parse(raw) : [];
        } catch (err) {
            return [];
        }   
});

const [editingId, setEditingId] = useState(null);
const [editingText, setEditingText] = useState(""); 

useEffect(() => {
    try {
        localStorage.setItem("postIdeas", JSON.stringify(ideas));   
    } catch (err) {
        // ignore 
    }
}, [ideas]);

const addIdea = (e) => {
    if (e) e.preventDefault();
    const text = value.trim();
    if (!text) return;
    const newItem = { id: Date.now(), text };
    setIdeas((s) => [newItem, ...s]);
    setValue("");
};
const removeIdea = (id) => setIdeas((s) => s.filter((it) => it.id !== id));

const startEdit = (id, text) => {
    setEditingId(id);
    setEditingText(text);
};

const saveEdit = (id) => {
    const trimmed = editingText.trim();
    if (!trimmed) {
        removeIdea(id);
    } else {
        setIdeas((s) => s.map((it) => (it.id === id ? { ...it, text: trimmed } : it)));
    }
    setEditingId(null);
    setEditingText("");
};  

return (
    <section className="panel" style={{ marginTop: 5 }} aria-labelledby="postideas-heading">
      <h2 id="postideas-heading" style={{ margin: 0, marginBottom: 8 }}>Brainstorm: Post Ideas</h2>
        <form onSubmit={addIdea} style={{ display: "flex", gap: 8, marginBottom: 12 }}>
        <label style={{ display: 'none' }} htmlFor="idea-input">New idea</label>
        <input
            id="idea-input"
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Enter a new post idea"
            style={{ flex: 1, padding: 8, fontSize: 16 }}
        />
        <button type="submit" style={{ padding: "8px 16px", fontSize: 16 }}>Add</button>
      </form>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {ideas.map((idea) => (
            <li key={idea.id} style={{ marginBottom: 8, border: "1px solid #ccc", padding: 8 }}>
            {editingId === idea.id ? (  
                <>
                <input
                    type="text"
                    value={editingText} 
                    onChange={(e) => setEditingText(e.target.value)}
                    style={{ flex: 1, padding: 8, fontSize: 16, marginRight: 8 }}
                />
                <button onClick={() => saveEdit(idea.id)} style={{ marginRight: 8, padding: "6px 12px" }}>Save</button>
                <button onClick={() => setEditingId(null)} style={{ padding: "6px 12px" }}>Cancel</button>
                </>
            ) : (
                <>
                <span style={{ flex: 1, fontSize: 16 }}>{idea.text}</span>  
                <button onClick={() => startEdit(idea.id, idea.text)} style={{ marginRight: 8, padding: "6px 12px" }}>Edit</button>
                <button onClick={() => removeIdea(idea.id)} style={{ padding: "6px 12px" }}>Delete</button>
                </>
            )}  
            </li>
        ))}
        {ideas.length === 0 && <li style={{ color: "#666" }}>No ideas yet. Start by adding one above!</li>}
      </ul>
        </section>
    );
}

export default PostIdeas;