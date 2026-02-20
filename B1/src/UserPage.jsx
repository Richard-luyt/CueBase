import styles from './DashboardView.module.css';

const SUGGESTIONS = [
  'create a quiz on ...',
  'what is backend?',
  'create a team work',
];

export default function UserPage({ user, onGoToUpload, onGoToQuery }) {
  return (
    <div className={styles.welcomePage}>
      <h1 className={styles.welcomeTitle}>Welcome!</h1>
      <p className={styles.welcomeSub}>What do you want to learn today?</p>
      <div className={styles.suggestionRow}>
        {SUGGESTIONS.map((text) => (
          <button
            key={text}
            type="button"
            className={styles.suggestionBtn}
            onClick={() => onGoToQuery && onGoToQuery(text)}
          >
            {text}
          </button>
        ))}
      </div>
    </div>
  );
}
