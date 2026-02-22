"use client";

import { useState, useRef, useEffect } from "react";
import { queryDocumentsStream } from "../lib/api";
import ReactMarkdown from "react-markdown";
import styles from "./DashboardView.module.css";

export default function QueryPage({ onBack, initialPrompt = "" }) {
  const [queryPrompt, setQueryPrompt] = useState(initialPrompt);
  const [querying, setQuerying] = useState(false);
  const [answer, setAnswer] = useState(null);
  const [error, setError] = useState("");
  const [strictMode, setStrictMode] = useState(false);
  const queryInputRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) setQueryPrompt(initialPrompt);
  }, [initialPrompt]);

  const handleQuery = async () => {
    const trimmed = queryPrompt.trim();
    if (!trimmed) {
      setError("Enter a question.");
      return;
    }
    setQuerying(true);
    setAnswer("");
    setError("");
    await queryDocumentsStream(trimmed, strictMode ? "strict" : undefined, {
      onChunk: (text) => setAnswer((prev) => (prev ?? "") + text),
      onDone: () => setQuerying(false),
      onError: (err) => {
        const msg =
          err?.response?.data?.message ??
          err?.response?.data?.error ??
          err?.message ??
          "Query failed";
        setError(typeof msg === "string" ? msg : "Query failed");
        setAnswer(null);
        setQuerying(false);
      },
    });
  };

  return (
    <div className={styles.subPage}>
      <button type="button" onClick={onBack} className={styles.backBtn}>
        ← Back
      </button>
      <div className={styles.card}>
        <h2 className={styles.cardTitle}>Ask questions</h2>
        <p className={styles.cardSub}>
          Search your documents and get an AI answer. Toggle strict mode to answer only from your
          knowledge base.
        </p>
        <div className={styles.queryModeRow}>
          <label className={styles.queryModeLabel}>
            <input
              type="checkbox"
              checked={strictMode}
              onChange={(e) => setStrictMode(e.target.checked)}
              className={styles.queryModeCheckbox}
            />
            Strict mode (answer only from your documents)
          </label>
        </div>
        <div className={styles.uploadRow}>
          <input
            ref={queryInputRef}
            type="text"
            value={queryPrompt}
            onChange={(e) => {
              setQueryPrompt(e.target.value);
              setError("");
            }}
            onKeyDown={(e) => e.key === "Enter" && handleQuery()}
            placeholder="Enter your question…"
            className={styles.queryInput}
            disabled={querying}
          />
          <button
            type="button"
            onClick={handleQuery}
            disabled={querying || !queryPrompt.trim()}
            className={styles.primaryBtn}
          >
            {querying ? "Asking…" : "Ask"}
          </button>
        </div>
        {error && <p className={styles.msgError}>{error}</p>}
        {answer !== null && answer !== "" && (
          <div className={styles.results}>
            <h3 className={styles.resultsTitle}>Answer</h3>
            <div className={styles.answerBlock}>
              <ReactMarkdown>{answer}</ReactMarkdown>
            </div>
          </div>
        )}
        {answer !== null && answer === "" && !error && !querying && (
          <div className={styles.results}>
            <p className={styles.answerEmpty}>No answer returned.</p>
          </div>
        )}
      </div>
    </div>
  );
}
