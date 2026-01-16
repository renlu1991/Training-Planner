"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type StoredCompetencies = {
  role?: string;
  items?: string[];
};

type CompetencyId = "inst_1" | "inst_2" | "inst_3" | "inst_4" | "inst_5" | "inst_6";

type Course = {
  id: string;
  title: string;
};

type CompetencyBlock = {
  id: CompetencyId;
  number: number;
  title: string;
  subtitle?: string;
  knowledge: string[];
  courses: Course[];
  isPlaceholder?: boolean;
};

const LS_COMPETENCIES_KEY = "tp_competencies";
const LS_SELECTED_COURSES_KEY = "tp_selected_courses";

/** ==== Step3 数据（按你当前版本）==== */
const COMPETENCY_MAP: Record<CompetencyId, CompetencyBlock> = {
  inst_1: {
    id: "inst_1",
    number: 1,
    title: "Install instruments and communications systems",
    subtitle: "(AWS Installation and Commissioning)",
    knowledge: [
      "Standardized installation of AWS",
      "Correct and safe use of installation tools",
      "Methods for AWS installation",
      "Methods for AWS commissioning",
      "AWS data acquisition",
      "Installation and use of AWS operational software",
    ],
    courses: [
      { id: "c1_1", title: "AWS Siting and Measurement Principles" },
      { id: "c1_2", title: "Correct and Safe Use of Installation Tools" },
      { id: "c1_3", title: "AWS Installation" },
      { id: "c1_4", title: "AWS Commissioning" },
      { id: "c1_5", title: "AWS Data Sampling, Processing and Transmission Workflow" },
      { id: "c1_6", title: "AWS Operational Software Usage" },
      { id: "c1_7", title: "Monitoring AWS Operation and Fault Diagnosis" },
      { id: "c1_8", title: "AWS Components and Working Principles" },
    ],
  },

  // competency2 暂时占位保留
  inst_2: {
    id: "inst_2",
    number: 2,
    title: "Maintain instrument and system performance",
    knowledge: ["(Placeholder – content to be provided later)"],
    courses: [{ id: "c2_placeholder", title: "(Placeholder courses – to be provided later)" }],
    isPlaceholder: true,
  },

  // competency3 Diagnose Faults（你最新提供）
  inst_3: {
    id: "inst_3",
    number: 3,
    title: "Diagnose faults",
    knowledge: [
      "Ability to connect different AWS components",
      "Ability to obtain AWS operational status and self-check information",
      "Detection of signals from various AWS instruments",
      "On-site equipment inspection and verification procedures and methods",
    ],
    courses: [
      { id: "c3_1", title: "AWS Component Connections and Nodes" },
      { id: "c3_2", title: "AWS Operational Status Information" },
      { id: "c3_3", title: "AWS Signal Outputs" },
      { id: "c3_4", title: "Instrument manuals and Specifications" },
      { id: "c3_5", title: "End-to-end AWS System architecture" },
      { id: "c3_6", title: "Inspection Procedures and Methods" },
      { id: "c3_7", title: "AWS Hardware Fault Examples" },
      { id: "c3_8", title: "Operational Software Maintenance Examples" },
    ],
  },

  inst_4: {
    id: "inst_4",
    number: 4,
    title: "Repair faulty instruments and systems",
    knowledge: [
      "Operation of computer operating systems, AWS operational software, and workflows, and fault diagnosis and troubleshooting",
      "Replace and reconfigure instruments and circuit boards",
      "Ability to log in and query systems both on-site and remotely; perform hardware diagnostics post-repair",
      "On-site inspection procedures and methods, including instrument calibration and correction",
    ],
    courses: [
      { id: "c4_1", title: "AWS Operational Software" },
      { id: "c4_2", title: "AWS communication systems" },
      { id: "c4_3", title: "AWS Operational Flows" },
      { id: "c4_4", title: "AWS System Data Quality Control" },
      { id: "c4_5", title: "Exchange of instruments and components" },
      { id: "c4_6", title: "On-site Inspection" },
      { id: "c4_7", title: "Typical AWS Software and Hardware Fault examples" },
    ],
  },

  inst_5: {
    id: "inst_5",
    number: 5,
    title: "Record and Reporting",
    knowledge: ["Structure and content of fault reports", "Communication skills with technical teams, vendors, and supervisors"],
    courses: [
      { id: "c5_1", title: "Oral Communication" },
      { id: "c5_2", title: "Recording of fault information" },
      { id: "c5_3", title: "Writing Fault Reports" },
      { id: "c5_4", title: "Teamwork" },
    ],
  },

  inst_6: {
    id: "inst_6",
    number: 6,
    title: "Prerequisite: Basic Observation Knowledge",
    knowledge: [
      "Knowledge of circuits and IT skills (basic computer knowledge, use of meteorological information and ICT)",
      "Understanding of AWS meteorological instruments and variables",
    ],
    courses: [
      { id: "c6_1", title: "Observation Basic Knowledge" },
      { id: "c6_2", title: "ICT Skills" },
      { id: "c6_3", title: "Observation Instruments" },
      { id: "c6_4", title: "Electronics and Instrumentation" },
      { id: "c6_5", title: "Traceability Strategies" },
      { id: "c6_6", title: "Field Safety" },
    ],
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

export default function InstrumentRecommendationStep3() {
  const router = useRouter();

  const [roleLabel, setRoleLabel] = useState("Meteorological Instrument Technicians");
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

  const allSelected = allCourseIds.length > 0 && allCourseIds.every((id) => selectedCourseIds.includes(id));

  function toggleCourse(courseId: string) {
    setSelectedCourseIds((prev) => (prev.includes(courseId) ? prev.filter((x) => x !== courseId) : [...prev, courseId]));
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
    // 写入课程选择（Step4 会读取）
    localStorage.setItem(LS_SELECTED_COURSES_KEY, JSON.stringify(selectedCourseIds));
    // 跳转到 Step4
    router.push("/planner/instrument/recommendation/summary");
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
          Based on your selected competencies, the following knowledge &amp; skill requirements and suggested course themes are
          recommended.
        </p>

        {/* Select all bar */}
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

        {/* Competency cards */}
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
                  {c.number}. {c.title} {c.subtitle ? <span style={styles.subtitle}> {c.subtitle}</span> : null}
                </div>

                <div style={styles.sectionTitle}>Knowledge and skill requirements</div>
                {/* 黑色实心小圆点 */}
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

                {c.isPlaceholder ? <div style={styles.placeholderNote}>Placeholder: competency 2 will be updated later.</div> : null}
              </section>
            ))
          )}
        </div>

        {/* Footer buttons */}
        <div style={styles.footer}>
          <button type="button" style={styles.backBtn} onClick={() => router.push("/planner/instrument")}>
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

  // 接近 Step2 的尺度（别太夸张）
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
  subtitle: { fontWeight: 700 },

  sectionTitle: { fontSize: 20, fontWeight: 800, marginBottom: 8 },

  // 黑色实心圆点（默认 disc）
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
