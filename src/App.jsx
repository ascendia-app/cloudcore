import React, { useState } from 'react';

export default function App() {
  const [file, setFile] = useState(null);

  function handleUpload(e) {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  }

  return (
    <div style={{ padding: '2rem', fontFamily: 'sans-serif' }}>
      <h1>🌩 CloudCore</h1>

      <input type="file" onChange={handleUpload} />

      {file && (
        <div style={{ marginTop: '1rem' }}>
          <strong>Uploaded File:</strong> {file.name}
        </div>
      )}
    </div>
  );
}
