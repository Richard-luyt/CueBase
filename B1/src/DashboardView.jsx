import { useState, useRef } from 'react';
import { clearAuth, uploadDocument } from './api';
import styles from './DashboardView.module.css';

const ACCEPT_PDF = '.pdf,application/pdf';

export default function DashboardView({ user, onLogout }) {
  const displayName = user?.Username ?? user?.email ?? 'User';
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadMessage, setUploadMessage] = useState({ text: '', isError: false });
  const fileInputRef = useRef(null);

  const handleLogout = () => {
    clearAuth();
    onLogout();
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setUploadMessage({ text: '', isError: false });
    if (!file) {
      setUploadFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setUploadMessage({ text: 'Please select a PDF file.', isError: true });
      setUploadFile(null);
      return;
    }
    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setUploadMessage({ text: 'Select a PDF first.', isError: true });
      return;
    }
    setUploading(true);
    setUploadMessage({ text: '', isError: false });
    try {
      const data = await uploadDocument(uploadFile);
      const chunksMsg = data.chunksCreated != null ? ` ${data.chunksCreated} chunks created.` : '';
      setUploadMessage({
        text: (data.message && String(data.message)) || `Upload successful.${chunksMsg}`,
        isError: false,
      });
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? 'Upload failed';
      setUploadMessage({ text: typeof msg === 'string' ? msg : 'Upload failed', isError: true });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1 className={styles.logo}>CueBase</h1>
        <button type="button" onClick={handleLogout} className={styles.logout}>
          Sign out
        </button>
      </header>
      <main className={styles.main}>
        <p className={styles.welcome}>
          Welcome, <strong>{displayName}</strong>.
        </p>
        <p className={styles.sub}>You are signed in. Upload a PDF below or sign out above.</p>

        <section className={styles.uploadSection}>
          <h2 className={styles.uploadTitle}>Upload PDF</h2>
          <div className={styles.uploadRow}>
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPT_PDF}
              onChange={handleFileChange}
              className={styles.fileInput}
              disabled={uploading}
            />
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading || !uploadFile}
              className={styles.uploadBtn}
            >
              {uploading ? 'Uploading…' : 'Upload'}
            </button>
          </div>
          {uploadFile && (
            <p className={styles.fileName}>{uploadFile.name}</p>
          )}
          {uploadMessage.text && (
            <p className={uploadMessage.isError ? styles.uploadError : styles.uploadSuccess}>
              {uploadMessage.text}
            </p>
          )}
        </section>
      </main>
    </div>
  );
}
