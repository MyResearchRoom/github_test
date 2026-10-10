import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const formatCurrency = (amount) => `\u20B9 ${Number(amount || 0).toLocaleString("en-IN")}`;

const capitalize = (value) =>
  typeof value === "string" && value.length
    ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
    : value;

const iconCircle = (bg, stroke, path) => `
  <div style="display:flex;width:36px;height:36px;min-width:36px;border-radius:999px;background:${bg};align-items:center;justify-content:center;">
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="${stroke}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${path}</svg>
  </div>
`;

const ICONS = {
  user: '<circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  stethoscope: '<path d="M6 4v6a4 4 0 0 0 8 0V4"/><circle cx="18" cy="16" r="2"/><path d="M14 10a4 4 0 0 0 4 4"/>',
  bed: '<path d="M3 18v-6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v6"/><path d="M3 18h18M7 10V6h4v4"/>',
  file: '<path d="M6 2h9l5 5v15H6z"/><path d="M15 2v5h5"/>',
  card: '<rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/>',
  check: '<circle cx="12" cy="12" r="10"/><path d="M8 12l3 3 5-6"/>',
};

export const buildInvoiceReceiptHTML = (invoice) => {
  const clinic = invoice.clinic || {};
  const doctor = invoice.doctorObj || {};
  const isPaid = invoice.paymentStatus === "Paid";
  const displayInvoiceDate = invoice.invoiceDate || invoice.dischargeDate || invoice.admissionDate || "-";

  const rawDoctorName = doctor.name || invoice.doctor || "Rjeev Sharma";
  const doctorName = rawDoctorName.replace(/^Dr\.\s*/i, "");
  const doctorDegree = doctor.medicalDegree || doctor.degree || "MBBS, MD";
  const doctorMobile = doctor.mobileNumber || doctor.phone || clinic.phone || "9895569874";
  const doctorRegNo = doctor.medicalLicenceNumber || doctor.regNo || "";

  const clinicName = clinic.name || clinic.clinicName || doctor.clinicName || "New Clinic";
  const clinicAddress = clinic.address || clinic.clinicAddress || "";
  const clinicMobile = clinic.phone || doctor.mobileNumber || "9895569874";
  const clinicHours = clinic.hours || "7600840377";
  const clinicClosed = clinic.closed || "N/A";
  const logo = clinic.logo || doctor.logo || "";

  const bedChargePerDay =
    invoice.bedChargePerDay ||
    (invoice.stayDays > 0 ? invoice.bedCharge / invoice.stayDays : 0);

  const billingRows = [
    { label: `Bed Charge (${formatCurrency(bedChargePerDay)}/day)`, value: invoice.bedCharge },
    { label: "Medical Charges", value: invoice.medicalCharges },
    { label: "Other Charges", value: invoice.otherCharges },
  ];

  const infoBlocks = [
    {
      icon: iconCircle("#F3E8FF", "#521785", ICONS.user),
      label: "Patient Name",
      value: capitalize(invoice.patient?.name || invoice.patientName) || "-",
      sub1: `MRN: ${invoice.patient?.mrn || invoice.mrn || "-"}`,
      sub2: invoice.patient?.age
        ? `${invoice.patient.age} Y / ${capitalize(invoice.patient.gender)}`
        : capitalize(invoice.gender || "-"),
    },
    {
      icon: iconCircle("#F3E8FF", "#521785", ICONS.calendar),
      label: "Admission - Discharge",
      value: `${invoice.admissionDate || "-"} - ${invoice.dischargeDate || "Ongoing"}`,
      sub1: `${invoice.stayDays || 0} Days Stay`,
    },
    {
      icon: iconCircle("#F3E8FF", "#521785", ICONS.stethoscope),
      label: "Attending Doctor",
      value: capitalize(invoice.doctor || doctorName) || "-",
    },
    {
      icon: iconCircle("#F3E8FF", "#521785", ICONS.bed),
      label: "Ward / Room / Bed",
      value: `${invoice.ward || invoice.wardRoomBed || "-"} ${invoice.room ? `/ ${invoice.room}` : ""}`,
      sub1: invoice.bed || "-",
    },
  ];

  return `
    <div style="font-family:Arial,Helvetica,sans-serif;color:#343C6A;width:760px;padding:40px;background:#ffffff;">

      <!-- Letterhead Header Matching OPD View Details Format -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <!-- Doctor Info (Left) -->
          <td style="vertical-align:top;width:55%;border-left:4px solid #4F46E5;padding-left:14px;">
            <p style="margin:0;font-size:18px;font-weight:800;color:#521785;line-height:1.2;">
              Dr. ${capitalize(doctorName)}
            </p>
            ${doctorDegree ? `<p style="margin:3px 0 0;font-size:13px;font-weight:600;color:#4F46E5;">${doctorDegree}</p>` : ""}
            <div style="margin-top:6px;font-size:13px;color:#374151;line-height:1.4;">
              <p style="margin:0;"><span style="font-weight:700;color:#521785;">Mob:</span> ${doctorMobile}</p>
              <p style="margin:2px 0 0;"><span style="font-weight:700;color:#521785;">Reg. No:</span> ${doctorRegNo || "-"}</p>
            </div>
          </td>

          <!-- Clinic Info (Right) -->
          <td style="vertical-align:top;width:45%;text-align:right;">
            <table style="border-collapse:collapse;margin-left:auto;">
              <tr>
                ${logo ? `<td style="vertical-align:top;padding-right:12px;"><img src="${logo}" style="width:54px;height:54px;object-fit:contain;border-radius:8px;border:1px solid #E8EAF6;" /></td>` : ""}
                <td style="vertical-align:top;text-align:right;font-size:13px;color:#374151;line-height:1.4;">
                  <p style="margin:0;font-size:16px;font-weight:800;color:#521785;line-height:1.2;">${capitalize(clinicName)}</p>
                  ${clinicAddress ? `<p style="margin:3px 0 0;font-size:12px;color:#374151;line-height:1.3;">${clinicAddress}</p>` : ""}
                  <p style="margin:3px 0 0;"><span style="font-weight:700;color:#521785;">Mob:</span> ${clinicMobile}</p>
                  <p style="margin:2px 0 0;"><span style="font-weight:700;color:#521785;">Hours:</span> ${clinicHours}</p>
                  <p style="margin:2px 0 0;"><span style="font-weight:700;color:#521785;">Closed:</span> ${clinicClosed}</p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>

      <div style="height:1px;background:#521785;margin:18px 0 22px 0;"></div>

      <!-- Document Title & Badge -->
      <table style="width:100%;border-collapse:collapse;margin-bottom:20px;">
        <tr>
          <td style="vertical-align:middle;">
            <span style="font-size:20px;font-weight:800;color:#4F46E5;letter-spacing:1px;">INVOICE RECEIPT</span>
            ${invoice.invoiceNo ? `<div style="display:inline-block;background:#521785;color:#fff;font-size:13px;font-weight:700;padding:5px 14px;border-radius:6px;margin-left:12px;vertical-align:middle;">${invoice.invoiceNo}</div>` : ""}
          </td>
          <td style="vertical-align:middle;text-align:right;font-size:12px;color:#374151;">
            <span style="color:#6B7280;">Date:</span> <strong>${displayInvoiceDate}</strong>
            ${invoice.paymentStatus ? `&nbsp;&nbsp;&bull;&nbsp;&nbsp;<span style="color:#6B7280;">Status:</span> <strong>${invoice.paymentStatus}</strong>` : ""}
          </td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="width:36px;">${iconCircle("#F3E8FF", "#521785", ICONS.user)}</td>
          <td style="padding-left:10px;font-size:13px;font-weight:800;color:#521785;letter-spacing:0.5px;">PATIENT &amp; VISIT DETAILS</td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:26px;">
        <tr>
          ${infoBlocks
            .map(
              (block, idx) => `
            <td style="vertical-align:top;width:25%;padding:0 16px 0 ${idx === 0 ? "0" : "16px"};${idx < infoBlocks.length - 1 ? "border-right:1px solid #E8EAF6;" : ""}">
              <table style="border-collapse:collapse;">
                <tr>
                  <td style="vertical-align:top;padding-right:10px;">${block.icon}</td>
                  <td style="vertical-align:top;">
                    <p style="margin:0;font-size:11px;color:#8BA3CB;">${block.label}</p>
                    <p style="margin:3px 0 0;font-size:13px;font-weight:700;">${block.value}</p>
                    ${block.sub1 ? `<p style="margin:3px 0 0;font-size:11px;color:#4F46E5;font-weight:600;">${block.sub1}</p>` : ""}
                    ${block.sub2 ? `<p style="margin:3px 0 0;font-size:11px;color:#6B7280;">${block.sub2}</p>` : ""}
                  </td>
                </tr>
              </table>
            </td>
          `
            )
            .join("")}
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:16px;">
        <tr>
          <td style="width:36px;">${iconCircle("#F3E8FF", "#521785", ICONS.file)}</td>
          <td style="padding-left:10px;font-size:13px;font-weight:800;color:#521785;letter-spacing:0.5px;">BILLING BREAKDOWN</td>
        </tr>
      </table>

      <table style="width:100%;border-collapse:collapse;margin-bottom:26px;">
        <thead>
          <tr style="background:#521785;color:#fff;">
            <th style="text-align:left;font-size:12px;padding:11px 16px;letter-spacing:0.5px;">DESCRIPTION</th>
            <th style="text-align:right;font-size:12px;padding:11px 16px;letter-spacing:0.5px;">AMOUNT (\u20B9)</th>
          </tr>
        </thead>
        <tbody>
          ${billingRows
            .map(
              (row) => `
            <tr style="border-bottom:1px solid #E8EAF6;">
              <td style="padding:13px 16px;font-size:13px;">${row.label}</td>
              <td style="padding:13px 16px;font-size:13px;text-align:right;">${Number(row.value || 0).toLocaleString("en-IN")}</td>
            </tr>
          `
            )
            .join("")}
          <tr style="background:#F3F1FB;">
            <td style="padding:15px 16px;font-size:14px;font-weight:800;color:#521785;">TOTAL AMOUNT</td>
            <td style="padding:15px 16px;font-size:17px;font-weight:800;color:#521785;text-align:right;">${formatCurrency(invoice.totalAmount || invoice.finalBill)}</td>
          </tr>
        </tbody>
      </table>

      <div style="border:1px solid #E8EAF6;border-radius:10px;padding:20px 22px;margin-bottom:22px;">
        <table style="width:100%;border-collapse:collapse;margin-bottom:14px;">
          <tr>
            <td style="width:36px;">${iconCircle("#F3E8FF", "#521785", ICONS.card)}</td>
            <td style="padding-left:10px;font-size:13px;font-weight:800;color:#521785;letter-spacing:0.5px;">PAYMENT SUMMARY</td>
          </tr>
        </table>

        <table style="width:100%;border-collapse:collapse;">
          <tr style="border-bottom:1px solid #F0F0F0;">
            <td style="padding:7px 0;font-size:13px;color:#6B7280;">Total Amount</td>
            <td style="padding:7px 0;font-size:13px;font-weight:600;text-align:right;">${formatCurrency(invoice.totalAmount || invoice.finalBill)}</td>
          </tr>
          <tr style="border-bottom:1px solid #F0F0F0;">
            <td style="padding:7px 0;font-size:13px;color:#6B7280;">Amount Paid</td>
            <td style="padding:7px 0;font-size:13px;font-weight:600;text-align:right;">${formatCurrency(invoice.paidAmount != null ? invoice.paidAmount : (invoice.totalAmount || invoice.finalBill))}</td>
          </tr>
          <tr>
            <td style="padding:7px 0;font-size:13px;color:#6B7280;">${isPaid ? "Paid On" : "Amount Due"}</td>
            <td style="padding:7px 0;font-size:13px;font-weight:600;text-align:right;${isPaid ? "" : "color:#EF4444;"}">${
              isPaid ? invoice.paidDate || displayInvoiceDate : formatCurrency(invoice.dueAmount || 0)
            }</td>
          </tr>
        </table>

        ${
          invoice.payments && invoice.payments.length > 0
            ? `<div style="margin-top:14px;border-top:1px solid #F0F0F0;padding-top:12px;">
                <p style="margin:0 0 8px;font-size:12px;font-weight:700;color:#521785;">Payment History</p>
                <table style="width:100%;border-collapse:collapse;font-size:11px;">
                  <thead>
                    <tr style="border-bottom:1px solid #E8EAF6;color:#8BA3CB;">
                      <th style="text-align:left;padding:4px 0;">Date</th>
                      <th style="text-align:left;padding:4px 0;">Mode</th>
                      <th style="text-align:right;padding:4px 0;">Amount (\u20B9)</th>
                    </tr>
                  </thead>
                  <tbody>
                    ${invoice.payments
                      .map(
                        (p) => `
                      <tr style="border-bottom:1px solid #F8F9FC;">
                        <td style="padding:4px 0;color:#374151;">${p.paymentDate || "-"}</td>
                        <td style="padding:4px 0;color:#374151;">${p.paymentMode || "Cash"}</td>
                        <td style="padding:4px 0;text-align:right;font-weight:600;color:#16A34A;">${Number(p.amount || 0).toLocaleString("en-IN")}</td>
                      </tr>
                    `
                      )
                      .join("")}
                  </tbody>
                </table>
              </div>`
            : ""
        }
      </div>

      <div style="height:1px;background:#E8EAF6;margin:22px 0;"></div>
      <p style="text-align:center;font-size:12px;color:#8BA3CB;margin:0;">
        This is a system generated document — Thank you for choosing ${clinicName}.
      </p>
    </div>
  `;
};

export const downloadInvoiceReceipt = async (invoice) => {
  const container = document.createElement("div");
  container.style.position = "absolute";
  container.style.top = "0";
  container.style.left = "0";
  container.style.width = "760px";
  container.style.zIndex = "-1000";
  container.innerHTML = buildInvoiceReceiptHTML(invoice);
  document.body.appendChild(container);

  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));

  try {
    const canvas = await html2canvas(container, {
      scale: 2,
      useCORS: true,
      backgroundColor: "#ffffff",
    });

    if (canvas.width === 0 || canvas.height === 0) {
      throw new Error("html2canvas produced a zero-size canvas");
    }

    const imgData = canvas.toDataURL("image/jpeg", 0.98);
    const pdf = new jsPDF({ unit: "pt", format: "a4", orientation: "portrait" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = (canvas.height * pageWidth) / canvas.width;

    pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    pdf.save(`Invoice-${invoice.invoiceNo || invoice.dischargeId || "Bill"}.pdf`);
  } catch (error) {
    console.error("Failed to generate invoice PDF:", error);
    throw error;
  } finally {
    document.body.removeChild(container);
  }
};