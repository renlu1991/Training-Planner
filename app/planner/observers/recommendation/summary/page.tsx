"use client";

import React, { useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

type ContentBlock = {
  /** e.g., "a.", "b." */
  label?: string;
  /** e.g., "Meteorological Observation" */
  heading?: string;
  /** e.g., "Cognitive level: Understand, Apply" */
  cognitive: string;
  /** paragraph text */
  description: string;
  /** e.g., "Theoretical lecture + practical operation" */
  methods: string;
};

type ThemeRow = {
  theme: string;
  blocks: ContentBlock[];
};

type CompetencyCard = {
  id: string;
  title: string;
  subtitle?: string;
  table: ThemeRow[];
  isPlaceholder?: boolean;
};

function Methods(lines: string[]) {
  return lines.join(" + ");
}

function normalizeSpaces(s: string) {
  return s.replace(/\s+/g, " ").trim();
}

function Table({ rows }: { rows: ThemeRow[] }) {
  return (
    <table style={styles.table}>
      <thead>
        <tr>
          <th style={{ ...styles.th, width: "22%" }}>Course Themes</th>
          <th style={{ ...styles.th, width: "60%" }}>Course Content</th>
          <th style={{ ...styles.th, width: "18%" }}>Teaching Methods</th>
        </tr>
      </thead>

      <tbody>
        {rows.map((r, idx) => {
          const span = Math.max(1, r.blocks.length);
          return r.blocks.map((b, bi) => (
            <tr key={`${idx}-${bi}`}>
              {bi === 0 ? (
                <td style={styles.tdTheme} rowSpan={span}>
                  {r.theme}
                </td>
              ) : null}

              <td style={styles.tdContent}>
                {b.heading ? (
                  <div style={styles.contentHeadingLine}>
                    {b.label ? <span style={styles.blockLabel}>{b.label}</span> : null}
                    <span style={styles.blockHeading}>{b.heading}</span>
                  </div>
                ) : b.label ? (
                  <div style={styles.contentHeadingLine}>
                    <span style={styles.blockLabel}>{b.label}</span>
                  </div>
                ) : null}

                <div style={styles.cognitive}>{normalizeSpaces(b.cognitive)}</div>
                <div style={styles.desc}>{normalizeSpaces(b.description)}</div>
              </td>

              <td style={styles.tdMethods}>{b.methods}</td>
            </tr>
          ));
        })}
      </tbody>
    </table>
  );
}

export default function ObserversRecommendationSummaryPage() {
  const router = useRouter();
  const printRef = useRef<HTMLDivElement | null>(null);

  const competencies: CompetencyCard[] = useMemo(() => {
    const placeholderTable = (text: string): ThemeRow[] => [
      {
        theme: "(Placeholder)",
        blocks: [
          {
            cognitive: "Cognitive level: (Placeholder)",
            description: text,
            methods: "—",
          },
        ],
      },
    ];

    return [
      {
        id: "obs_1",
        title: "1. Monitor the meteorological situation",
        table: placeholderTable("Placeholder – content to be provided later."),
        isPlaceholder: true,
      },
      {
        id: "obs_2",
        title: "2. Perform a surface observation",
        table: placeholderTable("Placeholder – content to be provided later."),
        isPlaceholder: true,
      },
      {
        id: "obs_3",
        title: "3. Perform a balloon-borne upper-air observation",
        table: placeholderTable("Placeholder – content to be provided later."),
        isPlaceholder: true,
      },
      {
        id: "obs_4",
        title: "4. Utilize remote-sensing technology in making observations",
        table: placeholderTable("Placeholder – content to be provided later."),
        isPlaceholder: true,
      },

      // ===== Competency 5 (from your screenshots) =====
      {
        id: "obs_5",
        title: "5. Monitor the performance of instruments and systems",
        table: [
          {
            theme: "1) Meteorological parameters, instruments, and observation methods",
            blocks: [
              {
                label: "a.",
                heading: "Meteorological Observation",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the representativeness of surface meteorological observations and the fundamental knowledge of metadata; apply this understanding to identify the selection criteria and basic requirements for surface meteorological observation stations, and to correctly use observation elements and measurement units.",
                methods: "Theoretical lecture",
              },
              {
                label: "b.",
                heading: "Weather Phenomena",
                cognitive: "Cognitive level: Remember, Understand, Apply",
                description:
                  "Remember the classifications of weather phenomena observed at surface meteorological stations; understand their characteristics and explain their formation mechanisms; understand the relationships between various weather phenomena and surface observation elements; apply this knowledge to operate and evaluate weather-phenomena monitoring instruments, including their measurement methods, technical specifications, and applicable ranges.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "c.",
                heading: "Temperature",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the different temperature measurement methods and principles, as well as the sources of measurement errors; apply this understanding to select suitable instruments that meet technical specifications, determine their applicable ranges, and ensure proper installation and traceability.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "d.",
                heading: "Humidity",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the different humidity measurement methods and principles, and the sources of measurement errors; apply this understanding to select instruments that comply with technical requirements, determine their appropriate application ranges, and follow correct installation and traceability procedures.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "e.",
                heading: "Wind Direction and Wind Speed",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the various measurement methods and principles for wind direction and wind speed, as well as the origins of measurement errors; apply this knowledge to ensure that selected instruments meet technical standards, are properly installed, and can be accurately traced to reference systems.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "f.",
                heading: "Visibility",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the different measurement methods and principles of visibility and the possible sources of measurement errors; apply this knowledge to ensure compliance with technical specifications and the correct installation, calibration, and traceability of instruments.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "g.",
                heading: "Precipitation",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the different measurement methods and principles of precipitation and the causes of measurement errors; apply this understanding to select appropriate instruments, evaluate their technical performance and applicable conditions, and perform correct installation and traceability operations.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "h.",
                heading: "Radiation",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the different measurement methods and principles for shortwave and longwave radiation and identify the possible sources of measurement errors; apply this knowledge to select and operate instruments that meet technical requirements, with proper installation and traceability.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "i.",
                heading: "Atmospheric Pressure",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the various pressure measurement methods and principles, and the origins of measurement errors; apply this understanding to ensure the instruments meet the required technical specifications and are properly installed and traceable.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "j.",
                heading: "Sunshine Duration",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the various measurement methods and principles for sunshine duration, as well as potential measurement errors; apply this knowledge to select appropriate instruments, determine their performance standards, and implement proper installation and traceability.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "k.",
                heading: "Evaporation",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the different evaporation measurement methods and principles and identify the main sources of measurement errors; apply this understanding to select appropriate instruments according to technical standards, ensuring correct installation, operation, and traceability.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
            ],
          },

          {
            theme: "2) Performance of Monitoring Instruments and Systems",
            blocks: [
              {
                label: "a.",
                heading: "Automatic Meteorological Observation System",
                cognitive: "Cognitive level: Apply, Analyse",
                description: "Apply knowledge of the fundamental requirements, performance.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "b.",
                heading: "Instrument Maintenance, Inspection and/or Verification",
                cognitive: "Cognitive level: Analyse, Apply",
                description:
                  "Demonstrate proficiency in performing routine maintenance and inspection of meteorological monitoring instruments (e.g., precipitation, temperature, humidity, and wind instruments) according to technical standards; analyse and apply technical requirements for the maintenance and inspection of automatic weather station systems, communication systems, and backup systems (such as uninterruptable power supply (UPS) and emergency communication systems).",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "c.",
                heading: "Routine Maintenance Operations",
                cognitive: "Cognitive level: Apply, Analyse",
                description:
                  "Apply procedures to carry out prescribed daily maintenance tasks (e.g., replacing temperature instruments, cleaning observation instruments, and ensuring proper installation status); analyse the maintenance process to ensure compliance with operational standards.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "d.",
                heading: "Fault Diagnosis and Coordination",
                cognitive: "Cognitive level: Analyse, Evaluate",
                description:
                  "Conduct initial fault analysis and diagnosis; evaluate the issue and alert technical staff; take appropriate action under the guidance of remote instrument specialists.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "e.",
                heading: "Maintenance Recording and Metadata Management",
                cognitive: "Cognitive level: Apply, Analyse",
                description:
                  "Apply knowledge to accurately record interventions and anomalies in maintenance logs or metadata repositories; analyse recorded information to support long-term system performance tracking.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "f.",
                heading: "System Operation and Configuration",
                cognitive: "Cognitive level: Apply, Analyse",
                description:
                  "Operate power supply and communication systems safely and correctly, including communication networks (e.g., mobile, wireless, and wired systems); apply and analyse procedures for configuring and initializing data logging and processing systems.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
            ],
          },
        ],
      },

      // ===== Competency 6 (your screenshot) =====
      {
        id: "obs_6",
        title: "6. Maintain the quality of observational information",
        table: [
          {
            theme: "1) Meteorological measurements",
            blocks: [
              {
                heading: "Performance of Monitoring Instruments and Systems",
                cognitive: "Cognitive level: Understand, Apply, Analyse",
                description:
                  "Understand the key requirements for meteorological monitoring instruments, including measurement units, technical performance indicators, operation, maintenance, verification, calibration, and methods; understand the concepts of measurement uncertainty, reliability, stability, and traceability. Apply knowledge of surface instrument characteristics to select the most appropriate data sources for observing the parameters or phenomena of interest. (Source: WMO No.1083)",
                methods: Methods(["Theoretical lecture", "group discussion", "practical operation"]),
              },
            ],
          },
          {
            theme: "2) Climate data",
            blocks: [
              {
                heading: "Climate Metadata",
                cognitive: "Cognitive level: Apply, Analyse, Evaluate",
                description:
                  "Apply the requirements of the climate observation network to evaluate station characteristics; collect and store climate data and metadata in relevant databases; be aware of causes of inhomogeneity.",
                methods: Methods(["Theoretical lecture", "group discussion", "practical operation"]),
              },
            ],
          },
          {
            theme: "3) Quality control of observational data",
            blocks: [
              {
                heading: "Observation Data Management and Contingency Planning",
                cognitive: "Cognitive level: Apply, Analyse, Evaluate",
                description:
                  "Interpret available observational data sources; apply knowledge to monitor and verify all observation results; record corrections, flagging actions, and follow-up measures in metadata repositories; be familiar with the formats and contents of observation information to perform necessary corrections; develop contingency plans for potential failures (e.g., data transmission interruptions, power outages).",
                methods: Methods(["Theoretical lecture", "group discussion", "practical operation"]),
              },
            ],
          },
        ],
      },

      // ===== Competency 7 (your screenshot) =====
      {
        id: "obs_7",
        title: "7. Maintain a safe work environment",
        table: [
          {
            theme: "1) Safe Working Environment",
            blocks: [
              {
                label: "a.",
                cognitive: "Cognitive level: Understand",
                description: "Understand the principles of safe working practices in electrical hazardous areas.",
                methods: "Theoretical lecture",
              },
              {
                label: "b.",
                cognitive: "Cognitive level: Apply",
                description:
                  "Safely perform all observation tasks while minimizing exposure to hazardous environmental conditions (e.g., severe weather, lightning, floods, hurricanes, fires).",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "c.",
                cognitive: "Cognitive level: Apply, Analyse",
                description: "Maintain a hazardous materials register and implement hazardous materials management procedures.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
            ],
          },
          {
            theme: "2) Hazard Identification and Risk Assessment",
            blocks: [
              {
                label: "a.",
                cognitive: "Cognitive level: Analyse, Evaluate",
                description:
                  "Identify and assess hazards and risks, and develop plans for routine on-site maintenance activities.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
              {
                label: "b.",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the health and safety plan, including identified risks and measures to mitigate them as far as practicable.",
                methods: "Theoretical lecture",
              },
              {
                label: "c.",
                cognitive: "Cognitive level: Remember, Understand",
                description: "Be familiar with appropriate hazard warning signs.",
                methods: "Theoretical lecture",
              },
            ],
          },
          {
            theme: "3) Safe Handling, Storage, and Disposal of Hazardous Chemicals",
            blocks: [
              {
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the safe handling methods and apply correct procedures for the storage or disposal of hazardous chemicals.",
                methods: Methods(["Theoretical lecture", "practical operation"]),
              },
            ],
          },
        ],
      },

      // ===== Competency 8 (your screenshot) =====
      {
        id: "obs_8",
        title: "8. Prerequisite: Basic Meteorological Knowledge",
        table: [
          {
            theme: "1) Basic Geography",
            blocks: [
              {
                cognitive: "Cognitive level: Understand",
                description:
                  "Understand the topographical features and station locations within the area of responsibility; understand the local terrain and basic climatic characteristics.",
                methods: "Theoretical lecture",
              },
            ],
          },
          {
            theme: "2) Physical Meteorology and Meteorology",
            blocks: [
              {
                label: "a.",
                heading: "Atmospheric Composition and Structure",
                cognitive: "Cognitive level: Understand, Apply",
                description: "Understand the composition of the atmosphere and the fundamentals of atmospheric structure.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "b.",
                heading: "Radiation",
                cognitive: "Cognitive level: Remember, Understand",
                description:
                  "Understand the basics of radiative transfer; recognize the diurnal, latitudinal, and seasonal variations of radiation reaching the Earth's surface; understand the processes affecting shortwave and longwave radiation (reflection, scattering, and absorption).",
                methods: "Theoretical lecture",
              },
              {
                label: "c.",
                heading: "Atmospheric Pressure",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the basic concepts of atmospheric pressure and the conversion between station pressure and sea-level pressure; understand the principle of pressure variation with altitude and the effects of meteorological elements such as temperature, humidity, and weather phenomena on atmospheric pressure.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "d.",
                heading: "Atmospheric Temperature",
                cognitive: "Cognitive level: Understand, Analyse",
                description:
                  "Understand the effects of convection, advection, turbulence, and evaporation/condensation on atmospheric heating and cooling; understand the major factors influencing the global distribution of surface air temperature; explain the effects of water vapor, clouds, and wind on surface temperature; understand the diurnal variation of surface temperature.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "e.",
                heading: "Atmospheric Humidity",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the basic concepts of atmospheric humidity; understand vapor pressure, saturation vapor pressure, wet-bulb temperature, dew point, and relative humidity; understand the factors influencing the rate of evaporation.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "f.",
                heading: "Wind",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the principles of wind formation; understand the basic concepts of pressure gradient force and the Coriolis force; understand the influence of friction on wind and explain the causes of common local winds (e.g., sea and land breezes, foehn winds, and mountain–valley winds).",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "g.",
                heading: "Dew, Frost, and Fog",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the basic concept of visibility; understand the factors affecting visibility; understand the formation of dew and frost.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "h.",
                heading: "Atmospheric Optics and Electricity",
                cognitive: "Cognitive level: Remember, Understand",
                description:
                  "Understand the formation of atmospheric optical and electrical phenomena such as rainbows, halos, blue skies, and lightning.",
                methods: "Theoretical lecture",
              },
            ],
          },
          {
            theme: "3) Clouds and Weather",
            blocks: [
              {
                label: "a.",
                heading: "Cloud Identification",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the main cloud genera, species, and characteristics; identify the typical height ranges of different cloud types; understand the weather phenomena associated with various clouds.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "b.",
                heading: "Cloud Formation",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the main mechanisms of cloud formation and their relationships with topography and underlying surface conditions; understand the relationship between cloud development and weather changes.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "c.",
                heading: "Hydrometeors",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the basic concepts and formation processes of various hydrometeors and apply this knowledge to identify different types of hydrometeors.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "d.",
                heading: "Precipitation",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the processes that lead to precipitation and understand the typical life cycle of precipitation events.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
              {
                label: "e.",
                heading: "Thunderstorms",
                cognitive: "Cognitive level: Understand, Apply",
                description:
                  "Understand the triggering processes of thunderstorms and understanding of the life cycle and development stages of thunderstorm systems.",
                methods: Methods(["Theoretical lecture", "group discussion"]),
              },
            ],
          },
        ],
      },
    ];
  }, []);

  async function handleDownloadPdf() {
    if (!printRef.current) return;

    // Make the capture crisp
    const canvas = await html2canvas(printRef.current, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
      windowWidth: printRef.current.scrollWidth,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // Convert canvas px to mm while keeping aspect ratio
    const imgWidth = pageWidth;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;

    let heightLeft = imgHeight;
    let position = 0;

    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 1) {
      pdf.addPage();
      position = - (imgHeight - heightLeft);
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save("Observers_Training_Recommendations_Summary.pdf");
  }

  return (
    <main style={styles.page}>
      <div style={styles.container}>
        <div style={styles.step}>Step 4 · Summary</div>
        <h1 style={styles.h1}>Training Recommendations (Observers)</h1>

        {/* This wrapper is what we export to PDF */}
        <div ref={printRef} style={styles.printArea}>
          {competencies.map((c) => (
            <section key={c.id} style={styles.card}>
              <div style={styles.cardTitle}>
                {c.title}
                {c.subtitle ? <span style={styles.subtitle}> {c.subtitle}</span> : null}
              </div>

              <Table rows={c.table} />

              {c.isPlaceholder ? (
                <div style={styles.placeholderNote}>
                  Placeholder: this competency will be updated later.
                </div>
              ) : null}
            </section>
          ))}
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <button
            type="button"
            style={styles.backBtn}
            onClick={() => router.push("/planner/observers/recommendation")}
          >
            Back
          </button>

          <button type="button" style={styles.nextBtn} onClick={handleDownloadPdf}>
            Finish & Download PDF
          </button>
        </div>
      </div>
    </main>
  );
}

const styles: Record<string, React.CSSProperties> = {
  page: { minHeight: "100vh", background: "#fff", color: "#111" },
  container: { width: "min(1200px, 92vw)", margin: "0 auto", padding: "44px 0 72px" },

  step: { fontSize: 20, marginBottom: 14 },
  h1: { fontSize: 48, lineHeight: 1.1, margin: "0 0 18px", fontWeight: 800 },

  printArea: { display: "flex", flexDirection: "column", gap: 18 },

  card: { border: "2px solid #111", borderRadius: 16, padding: "16px 18px" },
  cardTitle: { fontSize: 22, fontWeight: 800, lineHeight: 1.3, marginBottom: 12 },
  subtitle: { fontWeight: 700 },

  // table styles
  table: {
    width: "100%",
    borderCollapse: "collapse",
    tableLayout: "fixed",
    border: "2px solid #111",
  },
  th: {
    border: "2px solid #111",
    padding: "10px 10px",
    fontSize: 18,
    textAlign: "left",
    fontWeight: 800,
    verticalAlign: "top",
  },
  tdTheme: {
    border: "2px solid #111",
    padding: "10px 10px",
    fontSize: 18,
    verticalAlign: "top",
    whiteSpace: "pre-wrap",
  },
  tdContent: {
    border: "2px solid #111",
    padding: "10px 12px",
    verticalAlign: "top",
  },
  tdMethods: {
    border: "2px solid #111",
    padding: "10px 10px",
    fontSize: 18,
    verticalAlign: "top",
    whiteSpace: "pre-wrap",
  },

  contentHeadingLine: { display: "flex", gap: 8, alignItems: "baseline", marginBottom: 4 },
  blockLabel: { fontSize: 18, fontWeight: 800 },
  blockHeading: { fontSize: 20, fontWeight: 800 },

  cognitive: { fontSize: 18, fontWeight: 800, margin: "4px 0 6px" },
  desc: { fontSize: 18, lineHeight: 1.6 },

  placeholderNote: { marginTop: 10, fontSize: 16, opacity: 0.75 },

  footer: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 22 },
  backBtn: {
    border: "2px solid #111",
    background: "#fff",
    color: "#111",
    padding: "14px 24px",
    borderRadius: 16,
    fontSize: 20,
    cursor: "pointer",
  },
  nextBtn: {
    border: "2px solid #111",
    background: "#111",
    color: "#fff",
    padding: "14px 24px",
    borderRadius: 16,
    fontSize: 20,
    cursor: "pointer",
  },
};
