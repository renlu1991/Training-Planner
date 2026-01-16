"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.step}>Welcome</div>

        <h1 style={styles.h1}>Training Planner</h1>

        <p style={styles.lead}>
          Select your role and competencies, then generate a recommended training programme.
          <br />
          <strong>Selections are saved locally</strong> in your browser (no account required).
        </p>

        <div style={styles.primaryCard}>
          <div style={styles.primaryTitle}>Start planning</div>
          <div style={styles.primaryDesc}>
            Choose a role (Observers / Instrument Technicians) and proceed step by step.
          </div>

          <div style={styles.primaryActions}>
            <button type="button" style={styles.primaryBtn} onClick={() => router.push("/planner")}>
              Start Planning →
            </button>
          </div>
        </div>

        <div style={styles.noteBox}>
          <div style={styles.noteTitle}>Quick notes</div>
          <ul style={styles.noteList}>
            <li style={styles.noteItem}>You can select one or multiple competencies.</li>
            <li style={styles.noteItem}>You can export the final programme as a PDF.</li>
            <li style={styles.noteItem}>
              If you clear browser data, your saved selections may be lost.
            </li>
          </ul>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#fff", color: "#111" },
  container: { width: "min(1100px, 92vw)", margin: "0 auto", padding: "44px 0 72px" },

  step: { fontSize: 20, marginBottom: 14 },
  h1: { fontSize: 64, lineHeight: 1.05, margin: "0 0 18px", fontWeight: 900 },

  lead: { fontSize: 22, lineHeight: 1.8, margin: "0 0 26px", maxWidth: 980 },

  primaryCard: {
    border: "2px solid #111",
    borderRadius: 18,
    padding: "22px 22px",
    background: "#fff",
  },
  primaryTitle: { fontSize: 34, fontWeight: 900, lineHeight: 1.2, marginBottom: 10 },
  primaryDesc: { fontSize: 22, lineHeight: 1.7, opacity: 0.95 },
  primaryActions: { marginTop: 18, display: "flex", justifyContent: "flex-start" },

  primaryBtn: {
    border: "2px solid #111",
    background: "#111",
    color: "#fff",
    padding: "14px 26px",
    borderRadius: 16,
    fontSize: 22,
    fontWeight: 800,
    cursor: "pointer",
  },

  noteBox: {
    marginTop: 22,
    border: "2px solid #111",
    borderRadius: 18,
    padding: "16px 18px",
  },
  noteTitle: { fontSize: 20, fontWeight: 900, marginBottom: 8 },
  noteList: { margin: "0 0 0 20px", padding: 0, fontSize: 18, lineHeight: 1.8 },
  noteItem: { marginBottom: 4 },
};
