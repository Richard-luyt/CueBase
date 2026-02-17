import styles from './DashboardView.module.css';

export default function UserPage({ user, onGoToUpload, onGoToQuery }) {
  const displayName = user?.Username ?? user?.email ?? 'User';
  const email = user?.email ?? '';
  const role = user?.role ?? 'normal';

  return (
    <div className={styles.userPage}>
      <div className={styles.userCard}>
        <div className={styles.avatar}>
          {(displayName[0] ?? 'U').toUpperCase()}
        </div>
        <h1 className={styles.userName}>{displayName}</h1>
        {email && <p className={styles.userEmail}>{email}</p>}
        {role && (
          <span className={styles.userRole}>{role}</span>
        )}
      </div>

      <div className={styles.actionGrid}>
        <button
          type="button"
          onClick={onGoToUpload}
          className={styles.actionCard}
          aria-label="Go to upload documents"
        >
          <span className={styles.actionIcon} aria-hidden>↑</span>
          <span className={styles.actionTitle}>Upload documents</span>
          <span className={styles.actionDesc}>Add PDFs to your library for search</span>
        </button>
        <button
          type="button"
          onClick={onGoToQuery}
          className={styles.actionCard}
          aria-label="Go to ask questions"
        >
          <span className={styles.actionIcon} aria-hidden>◇</span>
          <span className={styles.actionTitle}>Ask questions</span>
          <span className={styles.actionDesc}>Search your documents by meaning</span>
        </button>
      </div>
    </div>
  );
}
