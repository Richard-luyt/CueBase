import { useState, useRef, useEffect } from 'react';
import { uploadDocument, getDocuments, deleteDocument } from './api';
import styles from './DashboardView.module.css';

const ACCEPT_PDF = '.pdf,application/pdf';

function formatDate(date) {
  if (!date) return '';
  const d = new Date(date);
  const y = d.getFullYear();
  const m = d.getMonth() + 1;
  const day = d.getDate();
  return `${y}/${m}/${day}`;
}

export default function UploadPage() {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [deleting, setDeleting] = useState(null);
  const fileInputRef = useRef(null);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const res = await getDocuments();
      const list = res?.data ?? [];
      setFiles(Array.isArray(list) ? list : []);
    } catch {
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, []);

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
      await loadFiles();
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? 'Upload failed';
      setMessage({ text: typeof msg === 'string' ? msg : 'Upload failed', isError: true });
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (file && file.type === 'application/pdf') {
      setUploadFile(file);
      setMessage({ text: '', isError: false });
    } else if (file) {
      setMessage({ text: 'Please use a PDF file.', isError: true });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDelete = async (fileName) => {
    if (deleting) return;
    setDeleting(fileName);
    try {
      await deleteDocument(fileName);
      await loadFiles();
    } catch {
      setMessage({ text: 'Failed to delete file.', isError: true });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className={styles.uploadPage}>
      <div
        className={styles.uploadZone}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPT_PDF}
          onChange={handleFileChange}
          className={styles.fileInputHidden}
          disabled={uploading}
        />
        <span className={styles.uploadZoneIcon}>+</span>
        <span className={styles.uploadZoneText}>upload a new file</span>
      </div>
      {uploadFile && (
        <div className={styles.uploadActions}>
          <span className={styles.fileName}>{uploadFile.name}</span>
          <button
            type="button"
            onClick={handleUpload}
            disabled={uploading}
            className={styles.primaryBtn}
          >
            {uploading ? 'Uploading…' : 'Upload'}
          </button>
        </div>
      )}
      {message.text && (
        <p className={message.isError ? styles.msgError : styles.msgSuccess}>{message.text}</p>
      )}

      <div className={styles.fileListCard}>
        {loading ? (
          <p className={styles.fileListEmpty}>Loading…</p>
        ) : files.length === 0 ? (
          <p className={styles.fileListEmpty}>No files yet. Upload a PDF above.</p>
        ) : (
          <ul className={styles.fileList}>
            {files.map((entry) => (
              <li key={entry.FileName ?? entry.fileName ?? entry} className={styles.fileItem}>
                <span className={styles.fileItemName}>{entry.FileName ?? entry.fileName ?? '—'}</span>
                <span className={styles.fileItemDate}>
                  {formatDate(entry.UploadTime ?? entry.uploadTime)}
                </span>
                <button
                  type="button"
                  className={styles.deleteBtn}
                  onClick={(e) => { e.stopPropagation(); handleDelete(entry.FileName ?? entry.fileName); }}
                  disabled={deleting === (entry.FileName ?? entry.fileName)}
                  aria-label="Delete file"
                >
                  <TrashIcon />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polyline points="3 6 5 6 21 6" />
      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
      <line x1="10" y1="11" x2="10" y2="17" />
      <line x1="14" y1="11" x2="14" y2="17" />
    </svg>
  );
}
