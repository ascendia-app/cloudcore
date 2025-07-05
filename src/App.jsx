import React, { useState, useEffect } from "react";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
} from "firebase/storage";
import { initializeApp } from "firebase/app";
import "./styles.css";

// 🔥 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyCN-Cv8ZBGAM6YDTbwp1MdSMrgv8dgw_Ys",
  authDomain: "cloudcore-f29e2.firebaseapp.com",
  projectId: "cloudcore-f29e2",
  storageBucket: "cloudcore-f29e2.appspot.com",
  messagingSenderId: "382923348965",
  appId: "1:382923348965:web:14fb1b835b053c94e82d0c",
  measurementId: "G-QZ5NGHQJ5B",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);

export default function App() {
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  // 👤 Auth state
  useEffect(() => {
    onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
  }, []);

  // 🌗 Theme
  useEffect(() => {
    document.documentElement.setAttribute("data-theme", darkMode ? "dark" : "light");
  }, [darkMode]);

  // ☁️ List uploaded files
  useEffect(() => {
    if (user) {
      const userRef = ref(storage, `uploads/${user.uid}`);
      listAll(userRef)
        .then((res) => {
          const promises = res.items.map((item) =>
            getDownloadURL(item).then((url) => ({ name: item.name, url }))
          );
          Promise.all(promises).then(setUploadedFiles);
        })
        .catch(console.error);
    }
  }, [user]);

  // 📤 Upload handler
  const handleUpload = async () => {
    if (!file || !user) return alert("Please select a file and login.");
    const fileRef = ref(storage, `uploads/${user.uid}/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);
    setUploadedFiles((prev) => [...prev, { name: file.name, url }]);
    setFile(null);
  };

  // 🔐 Login/Logout
  const login = () => {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).catch(console.error);
  };
  const logout = () => signOut(auth);

  return (
    <>
      <header>
        Cloudcore Dashboard
        <button onClick={() => setDarkMode(!darkMode)} style={{
          float: "right",
          background: "white",
          color: "black",
          padding: "0.3rem 0.7rem",
          borderRadius: "6px",
          fontWeight: "bold",
        }}>
          {darkMode ? "☀ Light" : "🌙 Dark"}
        </button>
      </header>

      <div className="container">
        {!user ? (
          <div className="card">
            <div className="card-title">Welcome to Cloudcore</div>
            <p>Please sign in to upload and manage files.</p>
            <button onClick={login}>Sign in with Google</button>
          </div>
        ) : (
          <>
            <div className="card">
              <div className="card-title">Upload File</div>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <button onClick={handleUpload}>Upload</button>
              <button onClick={logout} style={{ background: "#ccc", color: "#333" }}>
                Logout
              </button>
            </div>

            <div className="card">
              <div className="card-title">Your Uploaded Files</div>
              {uploadedFiles.length === 0 ? (
                <p>No files yet.</p>
              ) : (
                uploadedFiles.map((file, idx) => (
                  <div key={idx} className="card-actions">
                    <a href={file.url} target="_blank" rel="noopener noreferrer">
                      {file.name}
                    </a>
                  </div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
}
