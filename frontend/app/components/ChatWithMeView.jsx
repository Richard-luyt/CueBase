"use client";

import { useState, useRef, useEffect } from "react";
import { queryDocumentsStream } from "../lib/api";
import ReactMarkdown from "react-markdown";
import styles from "./ChatWithMeView.module.css";

const MODE_STRICT = "strict";
const MODE_SEARCH = "search";

export default function ChatWithMeView({ user, initialPrompt = "", onBack }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState(initialPrompt);
  const [mode, setMode] = useState(MODE_SEARCH);
  const [streaming, setStreaming] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (initialPrompt) inputRef.current?.focus();
  }, [initialPrompt]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = async () => {
    const trimmed = input.trim();
    if (!trimmed || streaming) return;

    const userMessage = { role: "user", content: trimmed };
    setMessages((prev) => [...prev, userMessage, { role: "model", content: "" }]);
    setInput("");
    setStreaming(true);

    await queryDocumentsStream(
      trimmed,
      mode === MODE_STRICT ? "strict" : undefined,
      {
        onChunk: (text) => {
          setMessages((prev) => {
            const next = [...prev];
            const last = next.length - 1;
            if (last >= 0 && next[last].role === "model") {
              next[last] = {
                ...next[last],
                content: (next[last].content || "") + text,
              };
            }
            return next;
          });
        },
        onDone: () => setStreaming(false),
        onError: (err) => {
          const msg =
            err?.message ?? err?.response?.data?.message ?? "Something went wrong.";
          setMessages((prev) => {
            const next = [...prev];
            const last = next.length - 1;
            if (last >= 0 && next[last].role === "model") {
              next[last] = {
                ...next[last],
                content: next[last].content || `Error: ${msg}`,
              };
            }
            return next;
          });
          setStreaming(false);
        },
      }
    );
  };

  const userInitial = (user?.Username?.[0] ?? user?.email?.[0] ?? "U").toUpperCase();

  return (
    <div className={styles.page} data-mode={mode}>
      <header className={styles.header}>
        <button type="button" onClick={onBack} className={styles.backBtn}>
          &lt; back
        </button>
      </header>

      <div className={styles.conversationWrap}>
        <div className={styles.conversation}>
          {messages.map((msg, i) =>
            msg.role === "model" ? (
              <div key={i} className={styles.rowModel}>
                <div className={styles.avatarModel} aria-hidden />
                <div className={styles.bubbleModel}>
                  <ReactMarkdown>{msg.content || "…"}</ReactMarkdown>
                </div>
              </div>
            ) : (
              <div key={i} className={styles.rowUser}>
                <div className={styles.bubbleUser}>{msg.content}</div>
                <div className={styles.avatarUser}>{userInitial}</div>
              </div>
            )
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className={styles.inputBar}>
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit()}
          placeholder="> start conversation _"
          className={styles.input}
          disabled={streaming}
        />
        <button
          type="button"
          className={styles.modeBtn}
          onClick={() =>
            setMode((m) => (m === MODE_STRICT ? MODE_SEARCH : MODE_STRICT))
          }
          aria-pressed={mode === MODE_STRICT}
        >
          {mode === MODE_STRICT ? "strict" : "search"}
        </button>
      </div>
    </div>
  );
}
