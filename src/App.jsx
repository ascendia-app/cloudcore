import React, { useState } from 'react';
import './style.css';

function App() {
  const [files, setFiles] = useState([]);

  const handleFileUpload = (event) => {
    const uploaded = Array.from(event.target.files);
    setFiles((prev) => [...prev, ...uploaded]);
  };

  return (
    <div className="container">
      <header className="navbar">
        <h1>☁️ CloudCore</h1>
        <p className="tagline">Your soft, smart storage for SAT resources</p>
      </header>

      <main>
        <section className="upload-box">
          <label className="upload-label">
            📤 Upload Resources
            <input type="file" onChange={handleFileUpload} multiple />
          </label>
        </section>

        <section className="file-list">
          <h2>📁 Uploaded Files</h2>
          {files.length === 0 ? (
            <p className="empty">No files uploaded yet.</p>
          ) : (
            <ul>
              {files.map((file, index) => (
                <li key={index}>
                  <span className="file-icon">📄</span>
                  {file.name}
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;
