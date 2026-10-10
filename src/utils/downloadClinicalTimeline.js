const PRIMARY = "#521785";

const statusColors = {
  Stable: { bg: "#DCFCE7", text: "#16A34A" },
  "Under Treatment": { bg: "#FFEDD5", text: "#EA580C" },
  Critical: { bg: "#FEE2E2", text: "#EF4444" },
};

const icon = {
  cross: `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v8M8 12h8"/></svg>`,
  person: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7"/></svg>`,
  phone: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .3 2 .6 3a2 2 0 0 1-.5 2L8 10a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2-.5c1 .3 2 .5 3 .6a2 2 0 0 1 1.7 2z"/></svg>`,
  doctor: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><path d="M11 2v6a4 4 0 0 0 8 0V4"/><path d="M15 22a6 6 0 0 0 6-6v-2"/><path d="M3 2v8a4 4 0 0 0 4 4h1"/><circle cx="20" cy="19" r="2"/></svg>`,
  bed: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/><path d="M2 14h20"/><path d="M6 10V6a2 2 0 0 1 2-2h3"/></svg>`,
  calendar: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>`,
  shield: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>`,
  heading: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><path d="M4 4h16M4 12h16M4 20h10"/></svg>`,
  description: `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6M8 13h8M8 17h5"/></svg>`,
  file: `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${PRIMARY}" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><path d="M14 2v6h6"/></svg>`,
};

const escapeHtml = (value) =>
  String(value ?? "").replace(/[&<>"']/g, (c) => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;",
  }[c]));

const infoRow = (iconKey, label, value, subValue) => `
  <div class="info-item">
    <div class="info-icon">${icon[iconKey]}</div>
    <div>
      <p class="info-label">${escapeHtml(label)}</p>
      <p class="info-value">${escapeHtml(value)}</p>
      ${subValue ? `<p class="info-sub">${escapeHtml(subValue)}</p>` : ""}
    </div>
  </div>
`;

const detailRow = (iconKey, label, value, isBadge) => `
  <div class="detail-row">
    <div class="detail-label">${icon[iconKey]}<span>${escapeHtml(label)}</span></div>
    <div class="detail-value">${isBadge ? value : escapeHtml(value)}</div>
  </div>
`;

const buildEntryCard = (entry, index) => {
  const colors = statusColors[entry.status] || { bg: "#f1f1f1", text: "#555" };
  const badge = `<span class="status-badge" style="background:${colors.bg};color:${colors.text}">${escapeHtml(entry.status)}</span>`;

  return `
    <div class="entry-card">
      <div class="entry-header">
        <div class="entry-title">${icon.file}<span>${escapeHtml(entry.heading || `Entry ${index + 1}`)}</span></div>
        ${badge}
      </div>
      ${detailRow("doctor", "Doctor", entry.doctorName || "-")}
      ${detailRow("calendar", "Date", entry.date ? formatDate(entry.date) : "-")}
      ${detailRow("shield", "Status", badge, true)}
      ${detailRow("heading", "Heading", entry.heading || "-")}
      ${detailRow("description", "Description", entry.description || "-")}
    </div>
  `;
};

const formatDate = (value) =>
  value
    ? new Date(value).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "";

const formatDateTime = (value) =>
  value
    ? new Date(value).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

const buildReportHtml = (patient, entries) => {
  const generatedOn = formatDateTime(new Date());

  const entriesHtml = entries.length
    ? entries.map((entry, i) => buildEntryCard(entry, i)).join("")
    : `<div class="empty-state">No clinical timeline entries recorded yet.</div>`;

  return `
<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8" />
<title>Clinical Timeline - ${escapeHtml(patient.name)}</title>
<style>
  * { box-sizing: border-box; }
  body {
    font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif;
    color: #343C6A;
    margin: 0;
    padding: 32px;
    background: #ffffff;
  }
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 16px;
    border-bottom: 2px solid ${PRIMARY};
  }
  .brand {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .brand h1 {
    font-size: 20px;
    color: ${PRIMARY};
    margin: 0;
  }
  .generated {
    text-align: right;
    font-size: 12px;
    color: #8BA3CB;
  }
  .report-title {
    text-align: center;
    margin: 24px 0 6px;
  }
  .report-title h2 {
    color: ${PRIMARY};
    font-size: 22px;
    margin: 0;
  }
  .report-title p {
    color: #8BA3CB;
    font-size: 13px;
    margin: 6px 0 0;
  }
  .patient-box {
    background: #F8F6FC;
    border: 1px solid #ECE5F7;
    border-radius: 10px;
    padding: 18px 20px;
    margin-top: 24px;
  }
  .patient-box-title {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${PRIMARY};
    font-size: 13px;
    font-weight: 700;
    letter-spacing: 0.4px;
    margin-bottom: 14px;
  }
  .info-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    row-gap: 16px;
  }
  .info-item {
    display: flex;
    gap: 10px;
    align-items: flex-start;
  }
  .info-icon {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: #EFE4FA;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
  }
  .info-label {
    font-size: 11px;
    color: #8BA3CB;
    margin: 0;
  }
  .info-value {
    font-size: 13px;
    font-weight: 600;
    color: #343C6A;
    margin: 2px 0 0;
  }
  .info-sub {
    font-size: 11px;
    color: #8BA3CB;
    margin: 2px 0 0;
  }
  .entry-card {
    border: 1px solid #ECE5F7;
    border-radius: 10px;
    padding: 16px 20px;
    margin-top: 18px;
    page-break-inside: avoid;
  }
  .entry-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #F8F6FC;
    margin: -16px -20px 10px;
    padding: 12px 20px;
    border-radius: 10px 10px 0 0;
    border-bottom: 1px solid #ECE5F7;
  }
  .entry-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 700;
    color: ${PRIMARY};
    text-transform: uppercase;
    letter-spacing: 0.3px;
  }
  .status-badge {
    font-size: 11px;
    font-weight: 600;
    padding: 3px 10px;
    border-radius: 999px;
  }
  .detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 9px 0;
    border-bottom: 1px solid #F1EDF8;
    font-size: 13px;
  }
  .detail-row:last-child { border-bottom: none; }
  .detail-label {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${PRIMARY};
    font-weight: 600;
    min-width: 140px;
  }
  .detail-value {
    color: #343C6A;
    text-align: right;
    max-width: 65%;
  }
  .empty-state {
    text-align: center;
    color: #8BA3CB;
    padding: 40px 0;
    font-size: 13px;
  }
  .page-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-top: 1px solid #ECE5F7;
    margin-top: 32px;
    padding-top: 14px;
    font-size: 11px;
    color: #8BA3CB;
  }
  .page-footer .page-num {
    color: ${PRIMARY};
    font-weight: 600;
  }
  @media print {
    body { padding: 0 24px; }
  }
</style>
</head>
<body>

  <div class="page-header">
    <div class="brand">
      ${icon.cross}
      <h1>Hospital Management System</h1>
    </div>
    <div class="generated">
      Generated On<br />
      ${generatedOn}
    </div>
  </div>

  <div class="report-title">
    <h2>Clinical Timeline Report</h2>
    <p>This document contains the clinical timeline entries recorded for the patient.</p>
  </div>

  <div class="patient-box">
    <div class="patient-box-title">${icon.person} PATIENT INFORMATION</div>
    <div class="info-grid">
      ${infoRow("person", "Patient", patient.name, `MRN: ${patient.mrn}`)}
      ${infoRow("phone", "Phone", patient.phone)}
      ${infoRow("doctor", "Doctor", patient.doctor, patient.doctorRole)}
      ${infoRow("bed", "Ward / Room / Bed", `${patient.ward} / ${patient.room}`, patient.currentBed)}
      ${infoRow("calendar", "Admission Date", patient.admissionDate, patient.admissionTime)}
    </div>
  </div>

  ${entriesHtml}

  <div class="page-footer">
    <span>This is a system generated document.</span>
    <span class="page-num">Page 1 of 1</span>
  </div>

</body>
</html>
`;
};

// Opens the styled clinical timeline report in a new tab and triggers the
// browser's print dialog so it can be saved as a PDF.
export const downloadClinicalTimeline = (patient, entries = []) => {
  const html = buildReportHtml(patient, entries);
  const reportWindow = window.open("", "_blank");

  if (!reportWindow) {
    alert("Please allow pop-ups to download the clinical timeline report.");
    return;
  }

  reportWindow.document.open();
  reportWindow.document.write(html);
  reportWindow.document.close();

  reportWindow.onload = () => {
    reportWindow.focus();
    reportWindow.print();
  };
};
