import React, { useState } from "react";
import { storage, db } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc, Timestamp } from "firebase/firestore";

export default function UploadForm({ onUpload }) {
  const [file, setFile] = useState(null);
  const [name, setName] = useState("");

  const handleUpload = async () => {
    if (!file || !name) return;

    const fileRef = ref(storage, `files/${file.name}`);
    await uploadBytes(fileRef, file);
    const url = await getDownloadURL(fileRef);

    await addDoc(collection(db, "files"), {
      name,
      url,
      createdAt: Timestamp.now(),
    });

    setFile(null);
    setName("");
    onUpload(); // Call to refresh file list in parent
  };

  return (
    <div className="upload-form">
      <input
        type="text"
        value={name}
        placeholder="File name"
        onChange={(e) => setName(e.target.value)}
      />
      <input type="file" onChange={(e) => setFile(e.target.files[0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
