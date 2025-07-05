import React, { useState, useEffect } from "react";
import "./styles.css";

function App() {
  const [files, setFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const savedFiles = localStorage.getItem("cloudcore-files");
    if (savedFiles) {
      setFiles(JSON.parse(savedFiles));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cloudcore-files", JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    document.body.className = darkMode ? "dark" : "";
  }, [darkMode]);

  const handleUpload = (e) => {
    const tag = prompt("Enter a tag or subject for this file:");
    const uploadedFiles = Array.from(e.target.files).map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      tag: tag || "untagged",
    }));
    setFiles((prev) => [...prev, ...uploadedFiles]);
  };

  const handleDelete = (index) => {
    const updated = [...files];
    updated.splice(index, 1);
    setFiles(updated);
  };

  const handleEdit = (index) => {
    const newName = prompt("New file name:", files[index].name);
    const newTag = prompt("New tag:", files[index].tag);
    const updated = [...files];
    if (newName) updated[index].name = newName;
    if (newTag) updated[index].tag = newTag;
    setFiles(updated);
  };

  const handleShare = (file, type) => {
    // Dummy links for now
    const base = "https://cloudcore.app/file";
    const link = `${base}/${encodeURIComponent(file.name)}?mode=${type}`;
    navigator.clipboard.writeText(link);
    alert(`${type === "edit" ? "Edit" : "View"} link copied to clipboard!`);
  };

  const filtered = files.filter(
    (file) =>
      file.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      file.tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      <header>
        <h1>🌩️ CloudCore</h1>
        <div className="controls">
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <input type="file" onChange={handleUpload} multiple />
          <button onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <div className="grid">
        {filtered.map((file, index) => (
          <div className="card" key={index}>
            <h3>{file.name}</h3>
            <p>Tag: {file.tag}</p>
            <div className="buttons">
              <a href={file.url} target="_blank" rel="noopener noreferrer">View</a>
              <a href={file.url} download>Download</a>
              <button onClick={() => handleEdit(index)}>Edit</button>
              <button onClick={() => handleDelete(index)}>Delete</button>
              <button onClick={() => handleShare(file, "view")}>Share View</button>
              <button onClick={() => handleShare(file, "edit")}>Share Edit</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
