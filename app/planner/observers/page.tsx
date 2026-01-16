"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StoredPayload = {
  role: string;
  items: string[];
};

const STORAGE_KEY = "tp_competencies";

/** Observers (Annex 5.A) - 8 items */
const OBSERVER_COMPETENCIES = [
  { id: "obs_1", label: "1. Monitor the meteorological situation" },
  { id: "obs_2", label: "2. Perform a surface observation" },
  { id: "obs_3", label: "3. Perform a balloon-borne upper-air observation" },
  { id: "obs_4", label: "4. Utilize remote-sensing technology in making observations" },
  { id: "obs_5", label: "5. Monitor the performance of instruments and systems" },
  { id: "obs_6", label: "6. Maintain the quality of observational information" },
  { id: "obs_7", label: "7. Maintain a safe work environment" },
  { id: "obs_8", label: "8. Prerequisite: Basic Meteorological Knowledge" },
] as const;

export default function ObserverCompetenciesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  // Load from storage if user comes back
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredPayload;
      if (parsed?.role === "Meteorological Technicians (Observers)" && Array.isArray(parsed.items)) {
        setSelected(parsed.items);
      }
    } catch {
      // ignore
    }
  }, []);

  const selectedSet = useMemo(() => new Set(selected), [selected]);

  function toggle(id: string) {
    setSelected((prev) => {
      if (prev.includes(id)) return prev.filter((x) => x !== id);
      return [...prev, id];
    });
  }

  function handleNext() {
    // store
    const payload: StoredPayload = {
      role: "Meteorological Technicians (Observers)",
      items: [...selected].sort(), // sort just for stability
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    router.push("/planner/observers/recommendation");
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.step}>Step 2 · Select competencies</div>

        <h1 style={styles.h1}>Meteorological Technicians (Observers)</h1>

        <p style={styles.lead}>
          According to Annex 5.A of WMO No. 8, Meteorological Technicians (Observers) should master the
          following competencies. Please tick the competencies you would like to strengthen, based on your
          needs and situation.
        </p>

        <p style={styles.reference}>
          Reference: “Meteorological Technicians (Observers) competencies specific for AWS (as defined in
          Annex 5.A of WMO No. 8)”
        </p>

        {/* Competency box */}
        <section style={styles.box}>
          {OBSERVER_COMPETENCIES.map((item) => (
            <label key={item.id} style={styles.row}>
              <input
                type="checkbox"
                checked={selectedSet.has(item.id)}
                onChange={() => toggle(item.id)}
                style={styles.checkbox}
              />
              <span style={styles.rowText}>{item.label}</span>
            </label>
          ))}
        </section>

        {/* Buttons */}
        <div style={styles.actions}>
          <button type="button" onClick={() => router.push("/planner")} style={styles.secondaryBtn}>
            Back
          </button>

          <button type="button" onClick={handleNext} style={styles.primaryBtn}>
            Next →
          </button>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#fff", color: "#111" },
  container: { width: "min(1100px, 92vw)", margin: "0 auto", padding: "56px 0 72px" },

  step: { fontSize: 22, lineHeight: 1.4, marginBottom: 18 },

  h1: { fontSize: 36, lineHeight: 1.2, margin: "0 0 16px 0", fontWeight: 800 },

  lead: { fontSize: 24, lineHeight: 1.7, margin: "0 0 14px 0" },

  reference: { fontSize: 24, lineHeight: 1.7, margin: "0 0 18px 0", color: "#444" },

  box: {
    border: "2px solid #111",
    borderRadius: 14,
    padding: "18px 18px",
    marginTop: 8,
  },

  row: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
    padding: "8px 0",
  },

  checkbox: { width: 22, height: 22, marginTop: 4 },

  rowText: { fontSize: 26, lineHeight: 1.45, fontWeight: 600 },

  actions: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 22,
  },

  secondaryBtn: {
    padding: "16px 26px",
    borderRadius: 12,
    border: "2px solid #111",
    background: "#fff",
    fontSize: 26,
    cursor: "pointer",
  },

  primaryBtn: {
    padding: "18px 30px",
    borderRadius: 14,
    border: "2px solid #111",
    background: "#111",
    color: "#fff",
    fontSize: 28,
    cursor: "pointer",
  },
};
