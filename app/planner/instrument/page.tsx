"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StoredPayload = {
  role: string;
  items: string[];
};

const STORAGE_KEY = "tp_competencies";

/** Instrument Technicians (Annex 5.B) - 6 items */
const INSTRUMENT_COMPETENCIES = [
  { id: "inst_1", label: "1. Install instruments and communications systems" },
  { id: "inst_2", label: "2. Maintain instrument and system performance" },
  { id: "inst_3", label: "3. Diagnose faults" },
  { id: "inst_4", label: "4. Repair faulty instruments and systems" },
  { id: "inst_5", label: "5. Maintain a safe work environment" },
  { id: "inst_6", label: "6. Prerequist: Basic Meteorological Knowledge" },
] as const;

export default function InstrumentCompetenciesPage() {
  const router = useRouter();
  const [selected, setSelected] = useState<string[]>([]);

  // Load from storage if user comes back
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const parsed = JSON.parse(raw) as StoredPayload;
      if (parsed?.role === "Meteorological Instrument Technicians" && Array.isArray(parsed.items)) {
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
    const payload: StoredPayload = {
      role: "Meteorological Instrument Technicians",
      items: [...selected].sort(), // keep stable order
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));

    router.push("/planner/instrument/recommendation");
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.step}>Step 2 · Select competencies</div>

        <h1 style={styles.h1}>Meteorological Instrument Technicians</h1>

        <p style={styles.lead}>
          According to Annex 5.B of WMO No. 8, Meteorological Instrument Technicians should master the
          following competencies. Please tick the competencies you would like to strengthen, based on your
          needs and situation.
        </p>

        <p style={styles.reference}>
          Reference: “Competencies specific for AWS (as defined in Annex 5.B of WMO No. 8):”
        </p>

        <section style={styles.box}>
          {INSTRUMENT_COMPETENCIES.map((item) => (
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
