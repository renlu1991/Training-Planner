"use client";

import React from "react";
import { useRouter } from "next/navigation";

export default function PlannerRoleSelectPage() {
  const router = useRouter();

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.step}>Step 1 · Select role</div>

        <h1 style={styles.h1}>Training Planner</h1>

        <p style={styles.lead}>Please choose your role to proceed.</p>

        <p style={styles.savedLine}>
          <strong>Selections are saved locally</strong> in your browser.
        </p>

        <div style={styles.cardsWrap}>
          {/* Card 1: Observers */}
          <button
            type="button"
            style={styles.roleCard}
            onClick={() => router.push("/planner/observers")}
            aria-label="Meteorological Technicians (Observers)"
          >
            <div style={styles.cardTitle}>Meteorological Technicians (Observers)</div>
            <div style={styles.cardDesc}>Select competencies to strengthen (Annex 5.A of WMO No. 8).</div>

            <div style={styles.cardCTA}>
              <span style={styles.ctaText}>Continue →</span>
            </div>
          </button>

          {/* Card 2: Instrument Technicians */}
          <button
            type="button"
            style={styles.roleCard}
            onClick={() => router.push("/planner/instrument")}
            aria-label="Meteorological Instrument Technicians"
          >
            <div style={styles.cardTitle}>Meteorological Instrument Technicians</div>
            <div style={styles.cardDesc}>Select competencies to strengthen (Annex 5.B of WMO No. 8).</div>

            <div style={styles.cardCTA}>
              <span style={styles.ctaText}>Continue →</span>
            </div>
          </button>
        </div>

        {/* Footer (no tips) */}
        <div style={styles.footer}>
          <button type="button" style={styles.backBtn} onClick={() => router.push("/")}>
            Back
          </button>

          {/* 右侧留空：与 Step2/Step4 的“左右布局”一致 */}
          <div style={{ width: 1 }} />
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#fff", color: "#111" },
  container: { width: "min(1100px, 92vw)", margin: "0 auto", padding: "44px 0 72px" },

  step: { fontSize: 20, marginBottom: 14 },
  h1: { fontSize: 56, lineHeight: 1.05, margin: "0 0 18px", fontWeight: 800 },

  lead: { fontSize: 22, lineHeight: 1.8, margin: "0 0 6px", maxWidth: 980 },
  savedLine: { fontSize: 22, lineHeight: 1.8, margin: "0 0 22px", maxWidth: 980 },

  cardsWrap: { display: "flex", flexDirection: "column", gap: 18 },

  roleCard: {
    border: "2px solid #111",
    borderRadius: 16,
    padding: "22px 22px",
    background: "#fff",
    textAlign: "left",
    cursor: "pointer",
  },
  cardTitle: { fontSize: 34, fontWeight: 900, lineHeight: 1.2, marginBottom: 10 },
  cardDesc: { fontSize: 22, lineHeight: 1.7, opacity: 0.95 },

  cardCTA: {
    display: "flex",
    justifyContent: "flex-end",
    marginTop: 22,
  },
  ctaText: { fontSize: 22, fontWeight: 800 },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 },

  // ✅ Back 按钮：对齐 Step2/Step4 的样式
  backBtn: {
    border: "2px solid #111",
    background: "#fff",
    color: "#111",
    padding: "14px 28px",
    borderRadius: 16,
    fontSize: 22,
    cursor: "pointer",
  },
};
