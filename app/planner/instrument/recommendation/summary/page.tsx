"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

/** ==== localStorage keys（与你 Step3 一致）==== */
const LS_COMPETENCIES_KEY = "tp_competencies";
const LS_SELECTED_COURSES_KEY = "tp_selected_courses";

type StoredCompetencies = {
  role?: string;
  items?: string[];
};

/** ====== 课程结构：支持子行 a/b/c... ====== */
type SubRow = {
  key: "a" | "b" | "c" | "d" | "e" | "f";
  cognitive: string; // "Cognitive level: Understand, Apply"
  content: string; // content text
  teaching: string; // teaching methods
};

type TableRow =
  | {
      theme: string; // left column
      // 单行
      cognitive: string;
      content: string;
      teaching: string;
      // theme 是否是编号主题（用于左列样式）
      numbered?: boolean;
    }
  | {
      theme: string;
      subRows: SubRow[]; // 多行 a/b/c...
      numbered?: boolean;
    };

type CompetencyCard = {
  id: string; // inst_1 ...
  title: string; // Competency name line
  isPlaceholder?: boolean;
  rows: TableRow[];
};

/** ========= 这里是你 Step3 中用到的 course id（必须一致） =========
 * competency1 (inst_1): c1_1 ~ c1_8
 * competency2 (inst_2): placeholder
 * competency3 (inst_3): c3_1 ~ c3_8
 * competency4 (inst_4): c4_1 ~ c4_7
 * competency5 (inst_5): c5_1 ~ c5_4
 * competency6 (inst_6): c6_1 ~ c6_6
 */

/** ====== Step4 数据（按你给的截图整理）====== */
const COMPETENCY_CARDS: CompetencyCard[] = [
  /** ========= Competency 1 ========= */
  {
    id: "inst_1",
    title: "Competency 1 · Install instruments and communications systems (AWS Installation and Commissioning)",
    rows: [
      {
        theme: "1) AWS Siting and Measurement Principles",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content:
              "Understand and apply siting principles as per WMO Siting Classification (WMO No.8 annex 1.D) during site selection and installation.",
            teaching: "Theoretical lecture",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Understand",
            content: "WMO Measurement Quality Classification (WMO No.8 annex 1.G).",
            teaching: "Theoretical lecture",
          },
          {
            key: "c",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand correct installation requirements for instruments.",
            teaching: "Theoretical lecture",
          },
        ],
      },
      {
        theme: "2) Correct and Safe Use of Installation Tools",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply",
        content: "Understand and apply the correct use of tools and test equipment such as digital multimeters.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "3) AWS Installation",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand and apply correct installation of data loggers.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand and apply correct installation requirements for instruments.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "c",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand power system requirements and apply correct installation methods.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "d",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand communication system requirements and apply correct installation methods.",
            teaching: "Theoretical lecture + practical operation",
          },
        ],
      },
      {
        theme: "4) AWS Commissioning",
        numbered: true,
        cognitive: "Cognitive level: Apply, Analyse",
        content: "Perform correct field verification and commissioning methods for AWS, including functional testing.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "5) AWS Data Sampling, Processing and Transmission Workflow",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Perform consistency checks of AWS data.",
            teaching: "Theoretical lecture",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand basic workflow of AWS data sampling, processing and transmission.",
            teaching: "Theoretical lecture + practical operation",
          },
        ],
      },
      {
        theme: "6) AWS Operational Software Usage",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply",
        content: "Understand AWS operational software functions, data visualization, and system communication mechanisms.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "7) Monitoring AWS Operation and Fault Diagnosis",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Apply, Analyse",
            content: "",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "b",
            cognitive: "",
            content:
              "Monitor AWS operation status (datalogger, power, communication components), independently or under guidance, identify faults and replace parts.",
            teaching: "",
          },
        ],
      },
      {
        theme: "8) AWS Components and Working Principles",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply",
        content:
          "Components and working principles of various AWS types; including dataloggers, power supplies, communication modules and instruments (e.g. temperature, pressure, humidity, wind, precipitation, radiation, visibility, sunshine instruments).",
        teaching: "Theoretical lecture + equipment demonstration",
      },
    ],
  },

  /** ========= Competency 2（占位） ========= */
  {
    id: "inst_2",
    title: "Competency 2 · Maintain instrument and system performance (Placeholder)",
    isPlaceholder: true,
    rows: [
      {
        theme: "(Placeholder)",
        cognitive: "Content to be provided later",
        content: "This competency table is reserved and will be updated when the official course mapping is ready.",
        teaching: "(Placeholder)",
      },
    ],
  },

  /** ========= Competency 3（Diagnose faults） ========= */
  {
    id: "inst_3",
    title: "Competency 3 · Diagnose faults",
    rows: [
      {
        theme: "1) AWS Component Connections and Nodes",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand and apply knowledge of instrument and data logger coupling.",
            teaching: "Theoretical lecture",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand and apply knowledge of power supply systems.",
            teaching: "Theoretical lecture",
          },
          {
            key: "c",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand and apply knowledge of communication systems.",
            teaching: "Theoretical lecture",
          },
        ],
      },
      {
        theme: "2) AWS Operational Status Information",
        numbered: true,
        cognitive: "Cognitive level: Apply, Analyse",
        content: "Understand and apply methods to check AWS operational status including self-check.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "3) AWS Signal Outputs",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand and apply methods for detecting AWS instrument signals (e.g. resistance, frequency) to verify outputs.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand and apply checking of data logger performance to correctly process instrument signals.",
            teaching: "Theoretical lecture + practical operation",
          },
        ],
      },
      {
        theme: "4) Instrument manuals and Specifications",
        numbered: true,
        cognitive: "Cognitive level: Remember, Understand",
        content: "Understanding of instrument manuals and specifications.",
        teaching: "Theoretical lecture",
      },
      {
        theme: "5) End-to-end AWS System architecture",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply",
        content: "Understanding of end-to-end AWS system architecture including operation and query of central data processing software.",
        teaching: "Theoretical lecture",
      },
      {
        theme: "6) Inspection Procedures and Methods",
        numbered: true,
        cognitive: "Cognitive level: Apply, Analyse",
        content: "Ability to analyze instrument inspection reports, verification, and calibration records, and implement corrective actions.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "7) AWS Hardware Fault Examples",
        numbered: true,
        cognitive: "Cognitive level: Analyse, Evaluate",
        content: "Understanding of AWS hardware fault examples.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "8) Operational Software Maintenance Examples",
        numbered: true,
        cognitive: "Cognitive level: Analyse, Evaluate",
        content: "Understanding of operational software maintenance examples.",
        teaching: "Theoretical lecture + practical operation",
      },
    ],
  },

  /** ========= Competency 4（Repair faulty instruments and systems） ========= */
  {
    id: "inst_4",
    title: "Competency 4 · Repair faulty instruments and systems",
    rows: [
      {
        theme: "1) AWS Operational Software",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply, Analyse",
        content:
          "Installation and use of computer OS and office software; AWS software installation, uninstallation, backup, upgrade; Understand AWS software modules, parameter settings, engineering diagnostics and log files.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "2) AWS communication systems",
        numbered: true,
        cognitive: "Cognitive level: Understand, apply",
        content: "Understanding of different AWS communication (telemetry) methods, e.g. cellular, radio, satellites, Internet.",
        teaching: "",
      },
      {
        theme: "3) AWS Operational Flows",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply, Analyse",
        content:
          "Overview of AWS operational information flow; AWS system debugging, instrument, acquisition, communication, power system components, composition, function, debugging; ability to locally and remotely access real-time operational information to assist fault diagnosis.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "4) AWS System Data Quality Control",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply",
        content:
          "AWS data quality control procedures (algorithms); device-level quality control content and methods; software quality control content and parameter settings.",
        teaching: "Theoretical lecture",
      },
      {
        theme: "5) Exchange of instruments and components",
        numbered: true,
        cognitive: "Cognitive level: Apply, Analyse",
        content:
          "Methods and procedures for replacing instruments (e.g., temperature, humidity, wind direction, wind speed, pressure, precipitation instruments); replacing acquisition components (e.g., data logger, settings, operation status check); replacing communication components (e.g., modems, antenna); replacing power system components (e.g., batteries, solar panels, transformers).",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "6) On-site Inspection",
        numbered: true,
        cognitive: "Cognitive level: Apply, Analyse",
        content: "Perform functional Test and Inspection post-repair.",
        teaching: "Theoretical lecture + practical operation",
      },
      {
        theme: "7) Typical AWS Software and Hardware Fault examples",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Analyse, Evaluate",
            content:
              "Software faults: software installation failure, malfunction, disconnection with devices, inability to upload data, acquisition, device crashes, abnormal running status.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Apply, Analyse",
            content: "Communication faults: troubleshooting communication link devices with multimeter; reading device status.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "c",
            cognitive: "Cognitive level: Apply, Analyse",
            content: "Power faults: troubleshooting power supply with multimeter.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "d",
            cognitive: "Cognitive level: Apply, Analyse",
            content: "Instrument faults: measuring analog instrument output signals with multimeter.",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "e",
            cognitive: "Cognitive level: Apply, Analyse",
            content: "Circuit faults: checking circuit connections with multimeter, e.g., continuity test.",
            teaching: "Theoretical lecture + practical operation",
          },
        ],
      },
    ],
  },

  /** ========= Competency 5（Record and Reporting） ========= */
  {
    id: "inst_5",
    title: "Competency 5 · Record and Reporting",
    rows: [
      {
        theme: "Oral Communication",
        cognitive: "Cognitive level: Understand, Apply",
        content:
          "Building good communication channels with technical teams;; Understand different instant messaging tools; accurately convey fault descriptions; use technical language to report to supervisors and vendors.",
        teaching: "Theoretical lecture",
      },
      {
        theme: "Recording of fault information",
        cognitive: "Cognitive level: Apply, Analyse",
        content:
          "Timely and accurately filling out of fault information into forms; apply analytical skills to ensure that all information is recorded correctly and within the set timelines.",
        teaching: "Theoretical lecture",
      },
      {
        theme: "Writing Fault Reports",
        cognitive: "Cognitive level: Apply, Analyse, Evaluate",
        content:
          "Use software tools to collect and prepare high-quality images or graphics; use word processing software to write texts; write concise, accurate, and clearly written communications tailored to different clients within specified timeframes.",
        teaching: "Theoretical lecture",
      },
      {
        theme: "Teamwork",
        cognitive: "Cognitive level: Understand, Apply",
        content: "Share knowledge and engage in constructive collaboration with others.",
        teaching: "Theoretical lecture",
      },
    ],
  },

  /** ========= Competency 6（Prerequisite） ========= */
  {
    id: "inst_6",
    title: "Competency 6 · Prerequisite: Basic Observation Knowledge",
    rows: [
      {
        theme: "1) Observation Basic Knowledge",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Knowledge of meteorological observation practices.",
            teaching: "Theoretical lecture + practical operation + simulated assessment",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Remember, Understand",
            content:
              "Understand international and national meteorological observation regulations and relevant operational rules.",
            teaching: "Theoretical lecture + practical operation + simulated assessment",
          },
        ],
      },
      {
        theme: "2) ICT Skills",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content:
              "Basic computer knowledge, basic computer operation, basic ICT knowledge, ability to troubleshoot common computer and ICT issues (e.g., Internet connection loss, instrument interface failure, configuration errors).",
            teaching: "Theoretical lecture + practical operation",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Apply, Analyse",
            content: "Understanding AWS monitoring software, remote data transmission,and information backup.",
            teaching: "Theoretical lecture + practical operation",
          },
        ],
      },
      {
        theme: "3) Observation Instruments",
        numbered: true,
        subRows: [
          {
            key: "a",
            cognitive: "Cognitive level: Understand, Apply",
            content:
              "Understanding of AWS components, national AWS network distribution; installation locations and requirements for orientation, mounting height, and ingress protection.",
            teaching: "Theoretical lecture + on-site training",
          },
          {
            key: "b",
            cognitive: "Cognitive level: Understand, Apply",
            content: "Understand observation principles and methods of meteorological instruments.",
            teaching: "Theoretical lecture + on-site training",
          },
        ],
      },
      {
        theme: "4) Electronics and Instrumentation",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply",
        content:
          "Understanding of electronic fundamentals, instruments, signal transmission, and AWS instrumentation layout. Ability to use basic tools for component testing and measurement.",
        teaching: "Electronics and Instrumentation",
      },
      {
        theme: "5) Traceability Strategies",
        numbered: true,
        cognitive: "Cognitive level: Understand, Apply",
        content:
          "Knowledge of basic metrology principles and national traceability strategies. Understanding of traceability concepts and procedures for instrument verification and adjustment.",
        teaching: "Traceability Strategies",
      },
      {
        theme: "6) Field Safety",
        numbered: true,
        cognitive: "Cognitive level: Remember, Understand, Apply",
        content:
          "Identification and understanding of hazards, e.g. electrical, lightning, and height safety, apply appropriate mitigation including correct use of PPE for these hazards during AWS installation and maintenance.",
        teaching: "Field Safety",
      },
    ],
  },
];

function safeParseJSON<T>(value: string | null): T | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    return null;
  }
}

function todayYMD() {
  const d = new Date();
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function InstrumentRecommendationSummaryStep4() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement | null>(null);

  const [roleLabel, setRoleLabel] = useState("Meteorological Instrument Technicians");
  const [selectedCourseIds, setSelectedCourseIds] = useState<string[]>([]);
  const [selectedCompetencyIds, setSelectedCompetencyIds] = useState<string[]>([]);
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState<string | null>(null);

  useEffect(() => {
    const stored = safeParseJSON<StoredCompetencies>(localStorage.getItem(LS_COMPETENCIES_KEY));
    if (stored?.role) setRoleLabel(stored.role);
    setSelectedCompetencyIds((stored?.items ?? []).filter(Boolean));

    const selected = safeParseJSON<string[]>(localStorage.getItem(LS_SELECTED_COURSES_KEY));
    if (Array.isArray(selected)) setSelectedCourseIds(selected);
  }, []);

  /** 只展示用户在 Step3 勾选过的 competency 卡片（inst_2 placeholder 若用户选了也展示） */
  const visibleCards = useMemo(() => {
    if (!selectedCompetencyIds.length) return COMPETENCY_CARDS;
    const set = new Set(selectedCompetencyIds);
    return COMPETENCY_CARDS.filter((c) => set.has(c.id));
  }, [selectedCompetencyIds]);

  /** 在每个 competency 内，只展示用户选中的课程主题（按 Step3 的 course ids） */
  const filteredCards = useMemo(() => {
    // 没选课程 -> 仍然展示全部（避免空白）
    if (!selectedCourseIds.length) return visibleCards;

    // course id 到 theme 名称映射（与 Step3 的 courses title 对齐）
    const courseIdToTheme: Record<string, string> = {
      // competency1
      c1_1: "1) AWS Siting and Measurement Principles",
      c1_2: "2) Correct and Safe Use of Installation Tools",
      c1_3: "3) AWS Installation",
      c1_4: "4) AWS Commissioning",
      c1_5: "5) AWS Data Sampling, Processing and Transmission Workflow",
      c1_6: "6) AWS Operational Software Usage",
      c1_7: "7) Monitoring AWS Operation and Fault Diagnosis",
      c1_8: "8) AWS Components and Working Principles",
      // competency3
      c3_1: "1) AWS Component Connections and Nodes",
      c3_2: "2) AWS Operational Status Information",
      c3_3: "3) AWS Signal Outputs",
      c3_4: "4) Instrument manuals and Specifications",
      c3_5: "5) End-to-end AWS System architecture",
      c3_6: "6) Inspection Procedures and Methods",
      c3_7: "7) AWS Hardware Fault Examples",
      c3_8: "8) Operational Software Maintenance Examples",
      // competency4
      c4_1: "1) AWS Operational Software",
      c4_2: "2) AWS communication systems",
      c4_3: "3) AWS Operational Flows",
      c4_4: "4) AWS System Data Quality Control",
      c4_5: "5) Exchange of instruments and components",
      c4_6: "6) On-site Inspection",
      c4_7: "7) Typical AWS Software and Hardware Fault examples",
      // competency5
      c5_1: "Oral Communication",
      c5_2: "Recording of fault information",
      c5_3: "Writing Fault Reports",
      c5_4: "Teamwork",
      // competency6
      c6_1: "1) Observation Basic Knowledge",
      c6_2: "2) ICT Skills",
      c6_3: "3) Observation Instruments",
      c6_4: "4) Electronics and Instrumentation",
      c6_5: "5) Traceability Strategies",
      c6_6: "6) Field Safety",
    };

    const selectedThemes = new Set<string>();
    selectedCourseIds.forEach((id) => {
      const theme = courseIdToTheme[id];
      if (theme) selectedThemes.add(theme);
    });

    return visibleCards.map((card) => {
      if (card.isPlaceholder) return card;
      const rows = card.rows.filter((r) => selectedThemes.has(r.theme));
      return { ...card, rows: rows.length ? rows : card.rows };
    });
  }, [visibleCards, selectedCourseIds]);

  async function downloadPdf() {
    setDownloadError(null);
    if (!printRef.current) return;

    setIsDownloading(true);

    try {
      const element = printRef.current;

      // 暂时展开，避免被滚动裁切
      const prevOverflow = document.body.style.overflow;
      document.body.style.overflow = "visible";

      // 等一帧，让布局稳定
      await new Promise((r) => requestAnimationFrame(() => r(null)));

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        backgroundColor: "#ffffff",
        windowWidth: document.documentElement.scrollWidth,
      });

      document.body.style.overflow = prevOverflow;

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // 计算图片在 PDF 中的尺寸
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // 多页切分
      let heightLeft = imgHeight;
      let position = 0;

      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      while (heightLeft > 0) {
        position = position - pageHeight;
        pdf.addPage();
        pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      const filename = `Training_Plan_Summary_${todayYMD()}.pdf`;
      pdf.save(filename);
    } catch (e) {
      setDownloadError("PDF download failed. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.step}>Step 4 · Training plan</div>
        <h1 style={styles.h1}>Training Plan Summary</h1>

        <p style={styles.lead}>
          According to the WMO <em>Guideline for Developing the Training Curriculum on Automatic Weather Station Maintenance</em>,
          the following courses are recommended.
        </p>

        <div style={styles.roleLine}>
          <span style={styles.roleLabel}>Role:</span> {roleLabel}
        </div>

        {/* ====== 这块是导出区域（PDF 会抓取它） ====== */}
        <div ref={printRef} style={styles.exportArea}>
          {filteredCards.map((card) => (
            <section key={card.id} style={styles.card}>
              <div style={styles.cardHeader}>{card.title}</div>

              <div style={styles.tableWrap}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={{ ...styles.th, ...styles.thLeft }}>Course Themes</th>
                      <th style={{ ...styles.th, ...styles.thMid }}>Course Content</th>
                      <th style={{ ...styles.th, ...styles.thRight }}>Teaching Methods</th>
                    </tr>
                  </thead>

                  <tbody>
                    {card.rows.map((row, idx) => {
                      // 多行 subRows
                      if ("subRows" in row) {
                        return (
                          <React.Fragment key={`${row.theme}-${idx}`}>
                            <tr>
                              <td style={styles.tdTheme} rowSpan={row.subRows.length}>
                                {row.theme}
                              </td>

                              {/* 第一条 subRow */}
                              <td style={styles.tdContent}>
                                <div style={styles.subLine}>
                                  <span style={styles.subKey}>{row.subRows[0].key}.</span>
                                  <div>
                                    <div style={styles.cognitive}>{row.subRows[0].cognitive}</div>
                                    {row.subRows[0].content ? <div style={styles.content}>{row.subRows[0].content}</div> : null}
                                  </div>
                                </div>
                              </td>

                              <td style={styles.tdTeach}>
                                <div style={styles.teach}>{row.subRows[0].teaching}</div>
                              </td>
                            </tr>

                            {/* 剩余 subRows：确保左边框完整（你之前提到 b/c 左边框缺失） */}
                            {row.subRows.slice(1).map((sr, k) => (
                              <tr key={`${row.theme}-${sr.key}-${k}`}>
                                <td style={styles.tdContent}>
                                  <div style={styles.subLine}>
                                    <span style={styles.subKey}>{sr.key}.</span>
                                    <div>
                                      {sr.cognitive ? <div style={styles.cognitive}>{sr.cognitive}</div> : null}
                                      {sr.content ? <div style={styles.content}>{sr.content}</div> : null}
                                    </div>
                                  </div>
                                </td>
                                <td style={styles.tdTeach}>
                                  <div style={styles.teach}>{sr.teaching}</div>
                                </td>
                              </tr>
                            ))}
                          </React.Fragment>
                        );
                      }

                      // 单行
                      return (
                        <tr key={`${row.theme}-${idx}`}>
                          <td style={styles.tdTheme}>{row.theme}</td>
                          <td style={styles.tdContent}>
                            <div style={styles.cognitive}>{row.cognitive}</div>
                            <div style={styles.content}>{row.content}</div>
                          </td>
                          <td style={styles.tdTeach}>
                            <div style={styles.teach}>{row.teaching}</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {card.isPlaceholder ? <div style={styles.placeholderNote}>Placeholder: competency 2 will be updated later.</div> : null}
            </section>
          ))}
        </div>

        {downloadError ? <div style={styles.errorBox}>{downloadError}</div> : null}

        {/* Footer */}
        <div style={styles.footer}>
          <button type="button" style={styles.backBtn} onClick={() => router.push("/planner/instrument/recommendation")}>
            Back
          </button>

          <button type="button" style={styles.finishBtn} onClick={downloadPdf} disabled={isDownloading}>
            {isDownloading ? "Generating PDF..." : "Finish & Download PDF"}
          </button>
        </div>
      </div>
    </main>
  );
}

/** ============ 样式：保持你现在喜欢的 Step3/Step4 风格（粗外框、细内框一致） ============ */
const BORDER_OUTER = "2px solid #111";
const BORDER_INNER = "1px solid #111";

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#fff", color: "#111" },
  container: { width: "min(1100px, 92vw)", margin: "0 auto", padding: "44px 0 72px" },

  step: { fontSize: 20, marginBottom: 14 },
  h1: { fontSize: 56, lineHeight: 1.05, margin: "0 0 18px", fontWeight: 800 },

  lead: { fontSize: 22, lineHeight: 1.8, margin: "0 0 14px", maxWidth: 980 },
  roleLine: { fontSize: 22, marginBottom: 18 },
  roleLabel: { fontWeight: 800 },

  exportArea: {},

  card: { border: BORDER_OUTER, borderRadius: 16, padding: "16px 16px", marginBottom: 18 },
  cardHeader: { fontSize: 22, fontWeight: 800, marginBottom: 12 },

  tableWrap: { border: BORDER_OUTER, borderRadius: 12, overflow: "hidden" },
  table: { width: "100%", borderCollapse: "collapse" },

  th: {
    fontSize: 22,
    fontWeight: 800,
    textAlign: "left",
    padding: "12px 12px",
    borderBottom: BORDER_INNER,
    background: "#fff",
  },
  thLeft: { width: "30%", borderRight: BORDER_INNER },
  thMid: { width: "50%", borderRight: BORDER_INNER },
  thRight: { width: "20%" },

  tdTheme: {
    verticalAlign: "top",
    padding: "12px 12px",
    fontSize: 22,
    lineHeight: 1.4,
    borderRight: BORDER_INNER,
    borderBottom: BORDER_INNER,
  },
  tdContent: {
    verticalAlign: "top",
    padding: "12px 12px",
    borderRight: BORDER_INNER,
    borderBottom: BORDER_INNER,
  },
  tdTeach: {
    verticalAlign: "top",
    padding: "12px 12px",
    borderBottom: BORDER_INNER,
  },

  subLine: { display: "flex", gap: 10, alignItems: "flex-start" },
  subKey: { fontSize: 20, lineHeight: 1.4, minWidth: 18 },

  cognitive: { fontSize: 22, fontWeight: 800, lineHeight: 1.35, marginBottom: 6 },
  content: { fontSize: 22, lineHeight: 1.6, whiteSpace: "pre-wrap" },
  teach: { fontSize: 22, lineHeight: 1.6, whiteSpace: "pre-wrap" },

  placeholderNote: { marginTop: 10, fontSize: 16, opacity: 0.75 },

  errorBox: {
    border: BORDER_OUTER,
    borderRadius: 16,
    padding: "12px 14px",
    marginTop: 12,
    fontSize: 18,
  },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 26 },
  backBtn: {
    border: BORDER_OUTER,
    background: "#fff",
    color: "#111",
    padding: "14px 28px",
    borderRadius: 16,
    fontSize: 22,
    cursor: "pointer",
  },
  finishBtn: {
    border: BORDER_OUTER,
    background: "#111",
    color: "#fff",
    padding: "14px 28px",
    borderRadius: 16,
    fontSize: 22,
    cursor: "pointer",
    opacity: 1,
  },
};
