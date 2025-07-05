import React, { useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, getDocs } from "firebase/firestore";
import UploadForm from "../components/UploadForm";

export default function Dashboard() {
  const [files, setFiles] = useState([]);
  const [search, setSearch] = useState("");

  const fetchFiles = async () => {
    const fileSnapshot = await getDocs(collection(db, "files"));
    const fileData = fileSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setFiles(fileData);
  };

  useEffect(() => {
    fetchFiles();

    // Optional: enable dark mode
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    if (prefersDark) document.body.classList.add("dark");
  }, []);

  const filteredFiles = files.filter(file =>
    file.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="dashboard">
      <header>🌤️ CloudCore Resource Cloud</header>

      <UploadForm onUpload={fetchFiles} />

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search resources..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      <div className="file-list">
        {filteredFiles.length > 0 ? (
          filteredFiles.map(file => (
            <div key={file.id} className="file-card">
              <h3>{file.name}</h3>
              <div className="buttons">
                <a href={file.url} target="_blank" rel="noopener noreferrer">
                  <button>View</button>
                </a>
                <a href={file.url} download>
                  <button>Download</button>
                </a>
                <button
                  onClick={() => navigator.clipboard.writeText(file.url)}
                >
                  Copy Link
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
}
