"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import styles from "./FeaturesContent.module.css";

const FEATURES = [
  {
    id: "knowledge",
    icon: "📚",
    title: "Personal Knowledge Base",
    desc: "Upload your PDF documents and build a private, searchable library. CueBase processes your files into semantic chunks and stores them securely with encryption at rest.",
  },
  {
    id: "chat",
    icon: "💬",
    title: "AI Chat with Your Data",
    desc: "Chat with an AI assistant that answers using only your uploaded knowledge. Choose strict mode for document-only answers, or search mode to supplement when needed.",
  },
  {
    id: "secure",
    icon: "🔒",
    title: "Secure & Private",
    desc: "Your documents are encrypted. Passwords are hashed with bcrypt. We use industry-standard practices to protect your data and privacy.",
  },
];

export default function FeaturesContent() {
  const [cardsVisible, setCardsVisible] = useState(false);
  const [modesVisible, setModesVisible] = useState(false);
  const cardsRef = useRef(null);
  const modesRef = useRef(null);

  useEffect(() => {
    const opts = { threshold: 0.15, rootMargin: "0px 0px -50px 0px" };
    const cardsOb = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setCardsVisible(true);
    }, opts);
    const modesOb = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) setModesVisible(true);
    }, opts);
    if (cardsRef.current) cardsOb.observe(cardsRef.current);
    if (modesRef.current) modesOb.observe(modesRef.current);
    return () => {
      cardsOb.disconnect();
      modesOb.disconnect();
    };
  }, []);

  return (
    <div id="features" className={styles.featuresWrap}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Your knowledge, <span className={styles.accent}>right on cue</span>
        </h1>
        <p className={styles.heroSub}>
          CueBase turns your documents into an intelligent, searchable knowledge base powered by AI.
        </p>
        <a href="#auth" className={styles.cta}>
          Get started
        </a>
      </div>

      <div className={styles.container}>
        <section ref={cardsRef} className={styles.featuresSection}>
          <div className={styles.features}>
            {FEATURES.map((f, i) => (
              <article
                key={f.id}
                className={`${styles.card} ${cardsVisible ? styles.cardVisible : ""}`}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <span className={styles.icon}>{f.icon}</span>
                <h2 className={styles.cardTitle}>{f.title}</h2>
                <p className={styles.cardDesc}>{f.desc}</p>
              </article>
            ))}
          </div>
        </section>

        <section ref={modesRef} className={`${styles.modesSection} ${modesVisible ? styles.modesVisible : ""}`}>
          <h2 className={styles.modesTitle}>Strict & Search Modes</h2>
          <p className={styles.modesIntro}>
            Switch between two answer modes in chat to control how the AI uses your knowledge base.
          </p>
          <div className={styles.modesGrid}>
            <div className={styles.modesImageCol}>
              <Image
                src="/content/strictModePic.png"
                alt="Chat interface with strict / search mode toggle"
                width={720}
                height={480}
                className={styles.modesImage}
                unoptimized
              />
            </div>
            <div className={styles.modesCardsCol}>
              <div className={styles.modeBlock}>
                <h3 className={styles.modeLabel}>Strict</h3>
                <p className={styles.modeDesc}>
                  Answers exclusively from your documents. If nothing relevant is found in your knowledge base, it will tell you so instead of guessing.
                </p>
              </div>
              <div className={styles.modeBlock}>
                <h3 className={styles.modeLabel}>Search</h3>
                <p className={styles.modeDesc}>
                  Prioritizes your knowledge base but can supplement with the AI's general knowledge when the context is insufficient.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
