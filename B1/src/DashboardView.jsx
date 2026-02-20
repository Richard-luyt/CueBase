import { useState } from 'react';
import { clearAuth } from './api';
import UserPage from './UserPage';
import UploadPage from './UploadPage';
import QueryPage from './QueryPage';
import styles from './DashboardView.module.css';
import logoUrl from '../images/new_logo.png';

const VIEW = {
  HOME: 'home',
  FILES: 'files',
  CHAT: 'chat',
  TEAMS: 'teams',
  PURCHASES: 'purchases',
  SETTINGS: 'settings',
};

const NAV = [
  { id: VIEW.HOME, label: 'Home' },
  { id: VIEW.FILES, label: 'Files' },
  { id: VIEW.CHAT, label: 'Start Chat' },
  { id: VIEW.TEAMS, label: 'My Teams' },
  { id: VIEW.PURCHASES, label: 'My purchases' },
];

export default function DashboardView({ user, onLogout }) {
  const [view, setView] = useState(VIEW.HOME);
  const [initialQueryPrompt, setInitialQueryPrompt] = useState('');

  const handleLogout = () => {
    clearAuth();
    onLogout();
  };

  return (
    <div className={styles.app}>
      <aside className={styles.sidebar}>
        <button
          type="button"
          onClick={() => setView(VIEW.HOME)}
          className={styles.logoBtn}
          aria-label="Home"
        >
          <img src={logoUrl} alt="CueBase" className={styles.logoImg} />
        </button>
        <div className={styles.sidebarBox}>
          <div className={styles.userBlock}>
            <div className={styles.avatar}>
              {(user?.Username?.[0] ?? user?.email?.[0] ?? 'U').toUpperCase()}
            </div>
            <p className={styles.userEmail}>{user?.email ?? ''}</p>
          </div>
          <nav className={styles.nav}>
            {NAV.map(({ id, label }) => (
              <button
                key={id}
                type="button"
                className={view === id ? styles.navBtnActive : styles.navBtn}
                onClick={() => setView(id)}
              >
                {label}
              </button>
            ))}
          </nav>
          <button
            type="button"
            className={styles.accountSettings}
            onClick={() => setView(VIEW.SETTINGS)}
          >
            Account Settings
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {view === VIEW.HOME && (
          <UserPage
            user={user}
            onGoToUpload={() => setView(VIEW.FILES)}
            onGoToQuery={(prompt) => {
              setInitialQueryPrompt(prompt ?? '');
              setView(VIEW.CHAT);
            }}
          />
        )}
        {view === VIEW.FILES && <UploadPage />}
        {view === VIEW.CHAT && (
          <QueryPage
            onBack={() => { setView(VIEW.HOME); setInitialQueryPrompt(''); }}
            initialPrompt={initialQueryPrompt}
          />
        )}
        {(view === VIEW.TEAMS || view === VIEW.PURCHASES) && (
          <div className={styles.placeholder}>
            <p>{view === VIEW.TEAMS ? 'My Teams' : 'My purchases'}</p>
            <p className={styles.placeholderSub}>Coming soon.</p>
          </div>
        )}
        {view === VIEW.SETTINGS && (
          <div className={styles.placeholder}>
            <p>Account Settings</p>
            <button type="button" onClick={handleLogout} className={styles.logoutBtn}>
              Sign out
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
