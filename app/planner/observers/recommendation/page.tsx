"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StoredCompetencies = {
  role?: string;
  items?: string[];
};

type CompetencyId =
  | "obs_1"
  | "obs_2"
  | "obs_3"
  | "obs_4"
  | "obs_5"
  | "obs_6"
  | "obs_7"
  | "obs_8";

type Course = { id: string; title: string };

type CompetencyBlock = {
  id: CompetencyId;
  number: number;
  title: string;
  knowledge: string[];
  courses: Course[];
  isPlaceholder?: boolean;
};

const LS_COMPETENCIES_KEY = "tp_competencies";
const LS_SELECTED_COURSES_KEY = "tp_selected_courses";

/** ✅ 你提供的 8 个 competency 标题（逐一放入） */
const COMPETENCY_TITLES: Record<CompetencyId, string> = {
  obs_1: "Monitor the meteorological situation",
  obs_2: "Perform a surface observation",
  obs_3: "Perform a balloon-borne upper-air observation",
  obs_4: "Utilize remote-sensing technology in making observations",
  obs_5: "Monitor the performance of instruments and systems",
  obs_6: "Maintain the quality of observational information",
  obs_7: "Maintain a safe work environment",
  obs_8: "Prerequisite: Basic Meteorological Knowledge",
};

/** Step3: Recommendation 数据（目前按你要求：1-4 占位；5-8 课程已给；knowledge 5 给详细，6-8 占位） */
const COMPETENCY_MAP: Record<CompetencyId, CompetencyBlock> = {
  obs_1: {
    id: "obs_1",
    number: 1,
    title: COMPETENCY_TITLES.obs_1,
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [{ id: "obs1_placeholder", title: "(Placeholder courses – to be provided later)" }],
    isPlaceholder: true,
  },
  obs_2: {
    id: "obs_2",
    number: 2,
    title: COMPETENCY_TITLES.obs_2,
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [{ id: "obs2_placeholder", title: "(Placeholder courses – to be provided later)" }],
    isPlaceholder: true,
  },
  obs_3: {
    id: "obs_3",
    number: 3,
    title: COMPETENCY_TITLES.obs_3,
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [{ id: "obs3_placeholder", title: "(Placeholder courses – to be provided later)" }],
    isPlaceholder: true,
  },
  obs_4: {
    id: "obs_4",
    number: 4,
    title: COMPETENCY_TITLES.obs_4,
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [{ id: "obs4_placeholder", title: "(Placeholder courses – to be provided later)" }],
    isPlaceholder: true,
  },

  // competency5：knowledge 你给了详细；课程 2 条
  obs_5: {
    id: "obs_5",
    number: 5,
    title: COMPETENCY_TITLES.obs_5,
    knowledge: [
      "Standard Operating Procedures (SOPs) and prescribed practices for instrument and communication system inspections (e.g., regular checks of meteorological instruments, automatic observation systems, communication systems, and backup systems)",
      "Detailed understanding of meteorological instruments and methods of observation and particular familiarity with those employed at the site",
      "Ability to diagnose faults in meteorological instrumentation systems using structured troubleshooting techniques, remote and on-site diagnostic tools (e.g., multimeters, simulators, configuration software)",
      "Accurate reading of instruments and recording of observations",
      "Awareness of hazards near instruments and communication systems (e.g., proximity to cables, working at heights, electromagnetic radiation)",
      "Contingency planning to ensure continuity of observations (for example, in the event of power, instrument or system failure, backup instruments and communications systems)",
    ],
    courses: [
      { id: "obs5_c1", title: "Meteorological parameters, instruments, and observation methods" },
      { id: "obs5_c2", title: "Performance of Monitoring Instruments and Systems" },
    ],
  },

  // competency6：knowledge 占位；课程 3 条
  obs_6: {
    id: "obs_6",
    number: 6,
    title: COMPETENCY_TITLES.obs_6,
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [
      { id: "obs6_c1", title: "Meteorological measurements" },
      { id: "obs6_c2", title: "Climate data" },
      { id: "obs6_c3", title: "Quality control of observational data" },
    ],
    isPlaceholder: true,
  },

  // competency7：knowledge 占位；课程 2 条
  obs_7: {
    id: "obs_7",
    number: 7,
    title: COMPETENCY_TITLES.obs_7,
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [
      { id: "obs7_c1", title: "Safe Working Environment" },
      { id: "obs7_c2", title: "Hazard Identification and Risk Assessment" },
    ],
    isPlaceholder: true,
  },

  // competency8：knowledge 占位；课程 3 条
  obs_8: {
    id: "obs_8",
    number: 8,
    title: COMPETENCY_TITLES.obs_8,
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [
      { id: "obs8_c1", title: "Basic Geography" },
      { id: "obs8_c2", title: "Physical Meteorology and Meteorology" },
      { id: "obs8_c3", title: "Clouds and Weather" },
    ],
    isPlaceholder: true,
  },
};

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

export default function ObserversRecommendationStep3() {
  const router = useRouter();

  const [roleLabel, setRoleLabel] = useState("Meteorological Observers");
  const [selectedCompetencyIds, setSelectedCompetencyIds] = useState<CompetencyId[]>([]);
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);

  useEffect(() => {
    const stored = safeParseJSON<StoredCompetencies>(localStorage.getItem(LS_COMPETENCIES_KEY));
    if (stored?.role) setRoleLabel(stored.role);

    const ids = (stored?.items ?? []).filter(Boolean) as CompetencyId[];
    setSelectedCompetencyIds(ids);

    const prevCourses = safeParseJSON<string[]>(localStorage.getItem(LS_SELECTED_COURSES_KEY));
    if (Array.isArray(prevCourses)) setSelectedCourseIds(prevCourses);
  }, []);

  const selectedCompetencies: CompetencyBlock[] = useMemo(() => {
    return selectedCompetencyIds
      .map((id) => COMPETENCY_MAP[id])
      .filter(Boolean)
      .sort((a, b) => a.number - b.number);
  }, [selectedCompetencyIds]);

  const allCourseIds = useMemo(() => {
    const ids: string[] = [];
    selectedCompetencies.forEach((c) => c.courses.forEach((x) => ids.push(x.id)));
    return ids;
  }, [selectedCompetencies]);

  const allSelected =
    allCourseIds.length > 0 && allCourseIds.every((id) => selectedCourseIds.includes(id));

  function toggleCourse(courseId: string) {
    setSelectedCourseIds((prev) =>
      prev.includes(courseId) ? prev.filter((x) => x !== courseId) : [...prev, courseId]
    );
  }

  function toggleSelectAll() {
    setSelectedCourseIds((prev) => {
      if (allSelected) return prev.filter((id) => !allCourseIds.includes(id));
      const set = new Set(prev);
      allCourseIds.forEach((id) => set.add(id));
      return Array.from(set);
    });
  }

  function onContinue() {
    localStorage.setItem(LS_SELECTED_COURSES_KEY, JSON.stringify(selectedCourseIds));
    router.push("/planner/observers/recommendation/summary");
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.step}>Step 3 · Recommended learning</div>

        <h1 style={styles.h1}>Training Recommendations</h1>

        <div style={styles.roleLine}>
          <span style={styles.roleLabel}>Role:</span> {roleLabel}
        </div>

        <p style={styles.lead}>
          Based on your selected competencies, the following knowledge &amp; skill requirements and suggested
          course themes are recommended.
        </p>

        <div style={styles.selectAllCard}>
          <div style={styles.selectAllLeft}>
            <strong style={styles.selectAllTitle}>Select courses</strong>
            <span style={styles.selectAllHint}>(you can choose one, multiple, or select all)</span>
          </div>

          <label style={styles.selectAllRight}>
            <input type="checkbox" checked={allSelected} onChange={toggleSelectAll} style={styles.checkbox} />
            <span style={styles.selectAllRightText}>Select all courses</span>
          </label>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          {selectedCompetencies.length === 0 ? (
            <div style={styles.emptyBox}>
              <p style={styles.emptyText}>No competencies selected.</p>
              <p style={styles.emptyText}>Please go back to Step 2 and choose at least one competency.</p>
            </div>
          ) : (
            selectedCompetencies.map((c) => (
              <section key={c.id} style={styles.card}>
                <div style={styles.cardTitle}>
                  {c.number}. {c.title}
                </div>

                <div style={styles.sectionTitle}>Knowledge and skill requirements</div>
                <ul style={styles.bullets}>
                  {c.knowledge.map((k, idx) => (
                    <li key={idx} style={styles.bulletItem}>
                      {k}
                    </li>
                  ))}
                </ul>

                <div style={{ height: 14 }} />

                <div style={styles.sectionTitle}>Suggested course themes</div>
                <div style={styles.courseList}>
                  {c.courses.map((course) => {
                    const checked = selectedCourseIds.includes(course.id);
                    return (
                      <label key={course.id} style={styles.courseRow}>
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleCourse(course.id)}
                          style={styles.checkbox}
                        />
                        <span style={styles.courseText}>{course.title}</span>
                      </label>
                    );
                  })}
                </div>

                {c.isPlaceholder ? (
                  <div style={styles.placeholderNote}>Placeholder: this competency will be updated later.</div>
                ) : null}
              </section>
            ))
          )}
        </div>

        <div style={styles.footer}>
          <button type="button" style={styles.backBtn} onClick={() => router.push("/planner/observers")}>
            Back
          </button>

          <button type="button" style={styles.nextBtn} onClick={onContinue}>
            Continue →
          </button>
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

  roleLine: { fontSize: 22, marginBottom: 10 },
  roleLabel: { fontWeight: 800 },

  lead: { fontSize: 22, lineHeight: 1.8, margin: "0 0 20px", maxWidth: 980 },

  selectAllCard: {
    border: "2px solid #111",
    borderRadius: 16,
    padding: "14px 16px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 18,
  },
  selectAllLeft: { display: "flex", alignItems: "baseline", gap: 8, flexWrap: "wrap" },
  selectAllTitle: { fontSize: 22 },
  selectAllHint: { fontSize: 20 },
  selectAllRight: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  selectAllRightText: { fontSize: 20 },

  card: { border: "2px solid #111", borderRadius: 16, padding: "18px 20px" },
  cardTitle: { fontSize: 26, fontWeight: 800, lineHeight: 1.3, marginBottom: 14 },

  sectionTitle: { fontSize: 20, fontWeight: 800, marginBottom: 8 },

  bullets: {
    margin: "0 0 0 22px",
    padding: 0,
    fontSize: 20,
    lineHeight: 1.8,
    listStyleType: "disc",
  },
  bulletItem: { marginBottom: 4 },

  courseList: { display: "flex", flexDirection: "column", gap: 10, marginTop: 8 },
  courseRow: { display: "flex", alignItems: "center", gap: 10, cursor: "pointer" },
  courseText: { fontSize: 20, lineHeight: 1.6 },

  checkbox: { width: 20, height: 20 },

  placeholderNote: { marginTop: 12, fontSize: 16, opacity: 0.75 },

  emptyBox: { border: "2px solid #111", borderRadius: 16, padding: "18px 20px" },
  emptyText: { fontSize: 20, lineHeight: 1.8, margin: 0 },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 },
  backBtn: {
    border: "2px solid #111",
    background: "#fff",
    color: "#111",
    padding: "14px 28px",
    borderRadius: 16,
    fontSize: 22,
    cursor: "pointer",
  },
  nextBtn: {
    border: "2px solid #111",
    background: "#111",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: 16,
    fontSize: 22,
    cursor: "pointer",
  },
};
