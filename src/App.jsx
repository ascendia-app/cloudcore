import React, { useState, useEffect } from "react";
import { getStorage, ref, uploadBytes, listAll, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import "./styles.css";

// Firebase config (replace with your actual config)
const firebaseConfig = {
  apiKey: "AIzaSyCN-Cv8ZBGAM6YDTbwp1MdSMrgv8dgw_Ys",
  authDomain: "cloudcore-f29e2.firebaseapp.com",
  projectId: "cloudcore-f29e2",
  storageBucket: "cloudcore-f29e2.appspot.com",
  messagingSenderId: "382923348965",
  appId: "1:382923348965:web:14fb1b835b053c94e82d0c",
  measurementId: "G-QZ5NGHQJ5B"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export default function App() {
  const [file, setFile] = useState(null);
  const [folder, setFolder] = useState("General");
  const [links, setLinks] = useState({});
  const [theme, setTheme] = useState("light");

  const handleUpload = async () => {
    if (!file) return alert("No file selected.");
    const path = `${folder}/${file.name}`;
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    setLinks(prev => ({
      ...prev,
      [folder]: [...(prev[folder] || []), { name: file.name, url }]
    }));
    setFile(null);
  };

  const fetchFiles = async () => {
    const folders = ["General", "Designs", "Templates", "Notes"];
    const newLinks = {};
    for (const fld of folders) {
      const folderRef = ref(storage, fld);
      const res = await listAll(folderRef);
      newLinks[fld] = await Promise.all(
        res.items.map(async item => {
          const url = await getDownloadURL(item);
          return { name: item.name, url };
        })
      );
    }
    setLinks(newLinks);
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  return (
    <div className={`app ${theme}`}>
      <header>
        <h1>📂 Cloudcore Drive</h1>
        <button className="theme-btn" onClick={() => setTheme(theme === "light" ? "dark" : "light")}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <section className="upload-box">
        <select value={folder} onChange={(e) => setFolder(e.target.value)}>
          <option value="General">General</option>
          <option value="Designs">Designs</option>
          <option value="Templates">Templates</option>
          <option value="Notes">Notes</option>
        </select>

        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleUpload}>Upload</button>
      </section>

      <section className="file-grid">
        {Object.entries(links).map(([folderName, files]) => (
          <div key={folderName} className="folder">
            <h2>{folderName}</h2>
            <div className="files">
              {files.map((f, i) => (
                <div key={i} className="card">
                  <p>{f.name}</p>
                  <a href={f.url} target="_blank" rel="noreferrer">🔗 View</a>
                  <button onClick={() => navigator.clipboard.writeText(f.url)}>📋 Copy</button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}
