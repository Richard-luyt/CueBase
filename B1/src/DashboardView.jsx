import { useState } from 'react';
import { clearAuth } from './api';
import UserPage from './UserPage';
import UploadPage from './UploadPage';
import QueryPage from './QueryPage';
import styles from './DashboardView.module.css';

const VIEW = { USER: 'user', UPLOAD: 'upload', QUERY: 'query' };

export default function DashboardView({ user, onLogout }) {
  const [view, setView] = useState(VIEW.USER);

  const handleLogout = () => {
    clearAuth();
    onLogout();
  };

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <button
          type="button"
          onClick={() => setView(VIEW.USER)}
          className={styles.logoBtn}
          aria-label="Home"
        >
          CueBase
        </button>
        <nav className={styles.nav}>
          <button
            type="button"
            className={view === VIEW.USER ? styles.navBtnActive : styles.navBtn}
            onClick={() => setView(VIEW.USER)}
          >
            Home
          </button>
          <button
            type="button"
            className={view === VIEW.UPLOAD ? styles.navBtnActive : styles.navBtn}
            onClick={() => setView(VIEW.UPLOAD)}
          >
            Upload
          </button>
          <button
            type="button"
            className={view === VIEW.QUERY ? styles.navBtnActive : styles.navBtn}
            onClick={() => setView(VIEW.QUERY)}
          >
            Ask
          </button>
        </nav>
        <button type="button" onClick={handleLogout} className={styles.logout}>
          Sign out
        </button>
      </header>

      <main className={styles.main}>
        {view === VIEW.USER && (
          <UserPage
            user={user}
            onGoToUpload={() => setView(VIEW.UPLOAD)}
            onGoToQuery={() => setView(VIEW.QUERY)}
          />
        )}
        {view === VIEW.UPLOAD && (
          <UploadPage onBack={() => setView(VIEW.USER)} />
        )}
        {view === VIEW.QUERY && (
          <QueryPage onBack={() => setView(VIEW.USER)} />
        )}
      </main>
    </div>
  );
}
