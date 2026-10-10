import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import "./print.css";
import { RxCross2 } from "react-icons/rx";
import useModalClose from "../../hooks/useModalClose";
import { getFormattedDateTime } from "../../utils/getFormattedDateTime";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { pdf } from "@react-pdf/renderer";
import BillPDF from "../../pdf/BillPDF";

const PrintBill = ({ setOpenBillModal, appointment }) => {
  const modalRef = useRef();
  const handleClose = () => setOpenBillModal(false);
  useModalClose(modalRef, handleClose);
  const contentRef = useRef(null);
  const reactToPrint = useReactToPrint({ contentRef });
  const handlePrint = () => reactToPrint();
  const [doctor, setDoctor] = useState({});

  const formatTime = (time) => {
    if (!time) return null;
    const [hour, minute] = time.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  const has = (v) => v !== undefined && v !== null && v !== "" && v !== "—";

  const { data: doctorData } = useFetch(`/api/doctors/get-doctor/${appointment.id}`);
  useEffect(() => {
    if (doctorData?.doctor) setDoctor(doctorData?.doctor);
  }, [doctorData]);

  const totalAmount = Number(appointment.fees || 0) + Number(appointment.extraFees || 0);

  const handlePrintPDF = async () => {
    // if (!pdf || !BillPDF) {
    //   handlePrint();
    //   return;
    // }
    try {
      console.log("success");
      
      const blob = await pdf(
        <BillPDF
          doctor={doctor}
          patient={appointment?.patient || {}}
          appointment={appointment}
        />
      ).toBlob();
      const url = URL.createObjectURL(blob);
      const win = window.open(url);
      win.onload = () => {
        win.print();
      };
    } catch (err) {
      console.log("err",err);
      
      handlePrint();
    }
  };

  return (
    <>
      <style>{`
        @media print {
          .bill-printable-area {
            width: 210mm !important;
            min-height: 297mm !important;
            max-height: 297mm !important;
            padding: 10mm 12mm 8mm 12mm !important;
            margin: 0 !important;
            overflow: hidden !important;
          }
        }
      `}</style>

      <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm px-2 sm:px-4">
        <motion.div
          ref={modalRef}
          initial={{ scale: 0.95, opacity: 0, y: 8 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 8 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
          className="bg-[#F8F9FF] rounded-2xl shadow-2xl overflow-x-auto flex flex-col print:shadow-none print:rounded-none print:bg-white"
          style={{ width: "min(880px, 96vw)", maxHeight: "95vh" }}
        >
          <div className="flex items-center px-3 sm:px-5 py-2.5 sm:py-3 bg-[#521785] shrink-0 print:hidden">
            <div className="flex items-center gap-2">
              <div className="w-1 h-5 bg-indigo-300 rounded-full" />
              <h1 className="text-white font-semibold text-sm tracking-wide">Invoice / Bill</h1>
            </div>
            <button
              onClick={() => setOpenBillModal(false)}
              className="ml-auto text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            >
              <RxCross2 className="text-lg" />
            </button>
          </div>

          <div className="overflow-y-auto overflow-x-auto flex-1" style={{ scrollbarWidth: "thin" }}>
            <div
              ref={contentRef}
              className="bill-printable-area"
              style={{
                // width: "210mm",
                // minHeight: "297mm",
                // maxHeight: "297mm",
                padding: "8mm",
                boxSizing: "border-box",
                background: "#fff",
                margin: "0 auto",
                fontFamily: "'Segoe UI', Arial, sans-serif",
                fontSize: "11px",
                lineHeight: "1.4",
                color: "#1F2937",
                position: "relative",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  borderBottom: "2px solid #521785", paddingBottom: "8px", marginBottom: "10px",
                }}>
                  <div style={{ width: "48%", borderLeft: "3px solid #4F46E5", paddingLeft: "8px" }}>
                    <p style={{ fontWeight: 700, fontSize: "14px", color: "#521785", margin: 0 }}>
                      Dr. {doctor?.name}
                    </p>
                    {has(doctor?.medicalDegree) && (
                      <p style={{ color: "#4F46E5", fontWeight: 600, fontSize: "10px", margin: "1px 0 3px" }}>{doctor.medicalDegree}</p>
                    )}
                    {has(doctor?.mobileNumber) && (
                      <p style={{ margin: "1px 0", color: "#374151" }}><strong>Mob:</strong> {doctor.mobileNumber}</p>
                    )}
                    {has(doctor?.medicalLicenceNumber) && (
                      <p style={{ margin: "1px 0", color: "#374151" }}><strong>Reg. No:</strong> {doctor.medicalLicenceNumber}</p>
                    )}
                  </div>

                  <div style={{ width: "48%", textAlign: "right", color: "#374151" }}>
                    {has(doctor?.clinicName) && (
                      <p style={{ fontWeight: 700, fontSize: "13px", color: "#521785", margin: 0 }}>{doctor.clinicName}</p>
                    )}
                    {has(doctor?.clinicAddress) && (
                      <p style={{ margin: "1px 0", fontSize: "10px" }}>{doctor.clinicAddress}</p>
                    )}
                  </div>
                </div>

                <div style={{ textAlign: "center", marginBottom: "10px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: 700, color: "#521785",
                    letterSpacing: "3px", textTransform: "uppercase",
                    borderBottom: "1px solid #4F46E5", paddingBottom: "2px",
                  }}>
                    Invoice / Receipt
                  </span>
                </div>

                <div style={{
                  display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                  background: "#F0F1FF", borderRadius: "6px", padding: "8px 12px", marginBottom: "12px",
                }}>
                  <div>
                    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", fontWeight: 700, fontSize: "12px", color: "#521785" }}>
                      {has(appointment?.patient?.patientId) && <span>{appointment.patient.patientId}</span>}
                      {has(appointment?.patient?.patientId) && has(appointment?.patient?.name) && <span>–</span>}
                      {has(appointment?.patient?.name) && <span>{appointment.patient.name}</span>}
                    </div>
                    {has(appointment?.patient?.mobileNumber) && (
                      <p style={{ margin: "2px 0 0", color: "#374151" }}>
                        <strong>Mobile:</strong> {appointment.patient.mobileNumber}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    {has(appointment?.date) && (
                      <p style={{ margin: 0, color: "#374151" }}>
                        <strong>Date:</strong> {appointment.date.slice(0, 10)}
                      </p>
                    )}
                  </div>
                </div>

                <div style={{ borderRadius: "8px", overflow: "hidden", border: "1px solid #E8EAF6" }}>
                  <div style={{ background: "#521785", padding: "7px 12px" }}>
                    <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: "9px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                      Billing Details
                    </p>
                  </div>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "12px" }}>
                    <thead>
                      <tr style={{ background: "#F0F1FF" }}>
                        {[
                          { label: "Sr.", align: "center", width: "8%" },
                          { label: "Description", align: "left" },
                          { label: "Amount", align: "left", width: "22%" },
                        ].map(({ label, align, width }) => (
                          <th key={label} style={{
                            padding: "8px 12px", textAlign: align, width,
                            fontWeight: 700, fontSize: "9px", color: "#521785",
                            textTransform: "uppercase", letterSpacing: "0.5px",
                            borderBottom: "1px solid #E8EAF6",
                          }}>{label}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <tr style={{ borderTop: "1px solid #E8EAF6", background: "#fff" }}>
                        <td style={{ textAlign: "center", padding: "10px 12px", color: "#6B7280", fontWeight: 600 }}>1</td>
                        <td style={{ padding: "10px 12px", color: "#521785", fontWeight: 600 }}>{appointment.reason}</td>
                        <td style={{ textAlign: "left", padding: "10px 12px", color: "#374151" }}>₹ {appointment.fees}</td>
                      </tr>
                      {appointment.extraFees > 0 && (
                        <tr style={{ borderTop: "1px solid #E8EAF6", background: "#F8F9FF" }}>
                          <td style={{ textAlign: "center", padding: "10px 12px", color: "#6B7280", fontWeight: 600 }}>2</td>
                          <td style={{ padding: "10px 12px", color: "#521785", fontWeight: 600 }}>Extra Charges</td>
                          <td style={{ textAlign: "left", padding: "10px 12px", color: "#374151" }}>₹ {appointment.extraFees}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>

                  <div style={{
                    display: "flex", justifyContent: "flex-end", alignItems: "center",
                    borderTop: "2px solid #521785", background: "#F0F1FF",
                    padding: "10px 14px", gap: "36px",
                  }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "12px", color: "#521785" }}>
                      Total Amount{" "}
                      <span style={{ fontWeight: 500, fontSize: "10px", color: "#6B7280" }}>(in ₹)</span>
                    </p>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: "14px", color: "#521785" }}>
                      ₹ {totalAmount}
                    </p>
                  </div>
                </div>

                <div style={{ marginTop: "auto", borderTop: "1px solid #D1D5DB", paddingTop: "8px", textAlign: "center" }}>
                  <p style={{ fontSize: "9px", color: "#6B7280", margin: 0 }}>
                    This is a system generated document — {getFormattedDateTime()}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="shrink-0 flex justify-end items-center px-3 sm:px-5 py-2.5 sm:py-3 bg-white border-t border-[#E8EAF6] print:hidden">
            <button
              onClick={handlePrintPDF}
              className="!text-white !font-semibold text-xs sm:text-sm rounded-[10px] px-4 sm:px-6 py-2 border-none cursor-pointer"
              style={{
                background: "linear-gradient(135deg, #521785 0%, #4F46E5 100%)",
                boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
              }}
            >
              Print Document
            </button>
          </div>

        </motion.div>
      </div>
    </>
  );
};

export default PrintBill;