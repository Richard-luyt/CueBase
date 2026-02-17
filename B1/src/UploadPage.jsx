import { useState, useRef } from 'react';
import { uploadDocument } from './api';
import styles from './DashboardView.module.css';

const ACCEPT_PDF = '.pdf,application/pdf';

export default function UploadPage({ onBack }) {
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    setMessage({ text: '', isError: false });
    if (!file) {
      setUploadFile(null);
      return;
    }
    if (file.type !== 'application/pdf') {
      setMessage({ text: 'Please select a PDF file.', isError: true });
      setUploadFile(null);
      return;
    }
    setUploadFile(file);
  };

  const handleUpload = async () => {
    if (!uploadFile) {
      setMessage({ text: 'Select a PDF first.', isError: true });
      return;
    }
    setUploading(true);
    setMessage({ text: '', isError: false });
    try {
      const data = await uploadDocument(uploadFile);
      const chunksMsg = data.chunksCreated != null ? ` ${data.chunksCreated} chunks created.` : '';
      setMessage({
        text: (data.message && String(data.message)) || `Upload successful.${chunksMsg}`,
        isError: false,
      });
      setUploadFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? 'Upload failed';
      setMessage({ text: typeof msg === 'string' ? msg : 'Upload failed', isError: true });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.subPage}>
      <button type="button" onClick={onBack} className={styles.backBtn}>
        ← Back
      </button>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Upload PDF</h2>
        <p className={styles.cardSub}>Add a document to your library. It will be chunked and indexed for search.</p>
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
            className={styles.primaryBtn}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
        {uploadFile && <p className={styles.fileName}>{uploadFile.name}</p>}
        {message.text && (
          <p className={message.isError ? styles.msgError : styles.msgSuccess}>{message.text}</p>
        )}
      </div>
    </div>
  );
}
