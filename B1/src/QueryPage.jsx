import { useState, useRef } from 'react';
import { queryDocuments } from './api';
import styles from './DashboardView.module.css';

export default function QueryPage({ onBack }) {
  const [queryPrompt, setQueryPrompt] = useState('');
  const [querying, setQuerying] = useState(false);
  const [results, setResults] = useState(null);
  const [error, setError] = useState('');
  const queryInputRef = useRef(null);

  const handleQuery = async () => {
    const trimmed = queryPrompt.trim();
    if (!trimmed) {
      setError('Enter a search prompt.');
      return;
    }
    setQuerying(true);
    setResults(null);
    setError('');
    try {
      const data = await queryDocuments(trimmed);
      const list = data?.data ?? data?.results ?? (Array.isArray(data) ? data : null);
      setResults(Array.isArray(list) ? list : []);
    } catch (err) {
      const msg = err.response?.data?.message ?? err.response?.data?.error ?? err.message ?? 'Query failed';
      setError(typeof msg === 'string' ? msg : 'Query failed');
      setResults(null);
    } finally {
      setQuerying(false);
    }
  };

  return (
    <div className={styles.subPage}>
      <button type="button" onClick={onBack} className={styles.backBtn}>
        ← Back
      </button>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Ask questions</h2>
        <p className={styles.cardSub}>Search your uploaded documents by meaning (e.g. a question or topic).</p>
        <div className={styles.uploadRow}>
          <input
            ref={queryInputRef}
            type="text"
            value={queryPrompt}
            onChange={(e) => { setQueryPrompt(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleQuery()}
            placeholder="Enter your question or topic…"
            className={styles.queryInput}
            disabled={querying}
          />
          <button
            type="button"
            onClick={handleQuery}
            disabled={querying || !queryPrompt.trim()}
            className={styles.primaryBtn}
          >
            {querying ? 'Searching…' : 'Search'}
          </button>
        </div>
        {error && <p className={styles.msgError}>{error}</p>}
        {results !== null && (
          <div className={styles.results}>
            <h3 className={styles.resultsTitle}>
              {results.length === 0 ? 'No results' : `Results (${results.length})`}
            </h3>
            {results.length > 0 && (
              <ul className={styles.resultList}>
                {results.map((item, i) => (
                  <li key={i} className={styles.resultItem}>
                    {item.Content ?? item.content ?? JSON.stringify(item)}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
