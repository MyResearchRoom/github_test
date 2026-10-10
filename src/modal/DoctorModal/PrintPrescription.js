import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import "../ReceptionistModal/print.css";
import { RxCross2 } from "react-icons/rx";
import useModalClose from "../../hooks/useModalClose";
import { getFormattedDateTime } from "../../utils/getFormattedDateTime";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import { capitalizeWords } from "../../utils/capitalizeWords";
import PrescriptionPDF from "../../pdf/PrescriptionPDF";
import { pdf } from "@react-pdf/renderer";
import apiClient from "../../api/apiClient";

const parameterLabels = {
    en: {
        height: "Height",
        bp: "B.P",
        temperature: "Temperature",
        weight: "Weight",
        sugar: "Sugar",
        na: "NA",
        adviceGiven: "Advice Given",
        followUp: "Follow Up",
    },

    mr: {
        height: "उंची",
        bp: "रक्तदाब",
        temperature: "तापमान",
        weight: "वजन",
        sugar: "साखर",
        na: "उपलब्ध नाही",
        adviceGiven: "दिलेला सल्ला",
        followUp: "पुढील तपासणी",
    },

    hi: {
        height: "ऊंचाई",
        bp: "रक्तचाप",
        temperature: "तापमान",
        weight: "वजन",
        sugar: "शुगर",
        na: "उपलब्ध नहीं",
        adviceGiven: "दी गई सलाह",
        followUp: "अगली जांच",
    },
};

const PrintPrescription = ({ appointment, onClose,selectedLanguage }) => {
  const [doctor, setDoctor] = useState({});
  const modalRef = useRef();
  useModalClose(modalRef, onClose);
  const contentRef = useRef();
  const [patient,setPatient]=useState(appointment?.patient || {});
  const [translatedAppointment,setTranslatedAppointment]=useState(appointment||{});
  const [subDoctors, setSubDoctors] = useState([]);
  console.log("appointment",appointment);
  

  const formatTime = (time) => {
    if (!time) return null;
    const [hour, minute] = time.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return `${h}:${minute} ${ampm}`;
  };

  const { data: doctorData } = useFetch(`/api/doctors/get-doctor/${appointment.id}`);
  useEffect(() => {
    if (doctorData?.doctor) setDoctor(doctorData?.doctor);
  }, [doctorData]);

  useEffect(() => {
    const fetchSubDoctors = async () => {
      if (!appointment?.department) {
        setSubDoctors([]);
        return;
      }

      try {
        const response = await apiClient.get(
          "/api/subdoctors/departemntWiseSubdoctor",
          {
            params: {
              department: appointment.department,
            },
          }
        );

        console.log("subdoctor res",(response?.data?.data));
        

        setSubDoctors(response?.data?.data || []);
      } catch (error) {
        console.error("Failed to fetch sub-doctors:", error);
        setSubDoctors([]);
      }
    };

    fetchSubDoctors();
  }, [appointment?.department]);

  const has = (v) => v !== undefined && v !== null && v !== "" && v !== "—";
  const hasList = (arr) => Array.isArray(arr) && arr.length > 0;

  
  const labels = parameterLabels[selectedLanguage] || parameterLabels.en;

  const vitals = [
    { label: labels.height, value: appointment?.parameters?.height, unit: "cm" },
    { label: labels.bp, value: appointment?.parameters?.bloodPressure, unit: "mmHg" },
    { label: labels.temperature, value: appointment?.parameters?.temprature, unit: "°F" },
    { label: labels.weight, value: appointment?.parameters?.weight, unit: "Kg" },
    { label: labels.weight, value: appointment?.parameters?.sugar, unit: "mg/dL" },
  ].filter((v) => has(v.value));

  const showComplaints  = hasList(appointment?.chiefComplaints);
  const showInvestigation = hasList(appointment?.investigation);
  const showComplaintsRow = showComplaints || showInvestigation;
  const showDiagnosis   = hasList(appointment?.diagnosis);
  const showPrescription = hasList(appointment?.prescription);
  const showNote        = has(appointment?.note);
  const showFollowUp    = has(appointment?.followUp);
  const showNotesBlock  = showNote || showFollowUp;

  
  const S = {
    sectionLabel: {
      margin: "0 0 5px",
      fontWeight: 700,
      fontSize: "8.5px",
      color: "#4F46E5",
      textTransform: "uppercase",
      letterSpacing: "1px",
      borderBottom: "1px solid #E8EAF6",
      paddingBottom: "3px",
    },
    card: {
      background: "#fff",
      border: "1px solid #E8EAF6",
      borderRadius: "6px",
      padding: "5px 9px",
      marginBottom: "6px",
    },
    bullet: {
      display: "flex", gap: "5px", alignItems: "flex-start", margin: "2px 0",
    },
    dot: (color) => ({
      width: "5px", height: "5px", borderRadius: "50%",
      background: color, flexShrink: 0, marginTop: "3px",
    }),
  };

  const handlePrintPDF = async () => {
    try {

        console.log("appointment",appointment);
        
        const blob = await pdf(
            <PrescriptionPDF
              doctor={doctor}
              patient={appointment?.patient || {}}
              appointment={appointment || {}}
              prescriptiondata={appointment?.prescription || []}
              subDoctors={subDoctors}
              department={appointment.department}
              language={selectedLanguage}
            />
        ).toBlob();

        const url = URL.createObjectURL(blob);

        const win = window.open(url);

        if (win) {
            win.onload = () => {
                win.print();
            };
        }

        // Optional cleanup
        setTimeout(() => {
            URL.revokeObjectURL(url);
        }, 10000);

    } catch (error) {
        console.error("Failed to generate prescription PDF:", error);

        // Optional fallback:
        // Generate PDF with original English data
    } 
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center backdrop-blur-sm px-2 sm:px-4">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0, y: 8 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 8 }}
        transition={{ duration: 0.22, ease: "easeOut" }}
        className="bg-[#F8F9FF] rounded-2xl shadow-2xl overflow-hidden flex flex-col print:shadow-none print:rounded-none print:bg-white max-w-2xl"
        style={{  maxHeight: "95vh" }}
      >
        {/* ── Modal Header (screen only) ── */}
        <div className="flex items-center px-3 sm:px-5 py-2.5 sm:py-3 bg-[#521785] shrink-0 print:hidden">
          <div className="flex items-center gap-2">
            <div className="w-1 h-5 bg-indigo-300 rounded-full" />
            <h1 className="text-white font-semibold text-sm tracking-wide">Patient Prescription</h1>
          </div>
          <button onClick={onClose} className="ml-auto text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10">
            <RxCross2 className="text-lg" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 print:overflow-visible" style={{ scrollbarWidth: "thin" }}>
          <div
            ref={contentRef}
            style={{
              position: "relative",
              background: "#fff",
              // width: "210mm",
              minHeight: "220mm",
              padding: "4mm",
              boxSizing: "border-box",
              margin: "0 auto",
              fontFamily: "'Segoe UI', Arial, sans-serif",
              fontSize: "10.5px",
              color: "#1a1a2e",
            }}
          >
            {/* Watermark */}
            {doctor?.logo && (
              <img
                src={doctor.logo}
                alt="Doctor Logo Watermark"
                style={{
                  position: "absolute", top: "50%", left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: "50%", opacity: 0.05, objectFit: "contain",
                  pointerEvents: "none", zIndex: 0,
                }}
              />
            )}

            <div style={{ position: "relative", zIndex: 1 }}>

              {/* ── LETTERHEAD ── */}
              <div
                className="flex flex-col sm:flex-row sm:justify-between items-start gap-2 sm:gap-0"
                style={{
                  borderBottom: "2px solid #521785", paddingBottom: "7px", marginBottom: "7px",
                }}
              >
                {/* Doctor left */}
                <div className="w-full sm:w-[44%]" style={{ borderLeft: "3px solid #4F46E5", paddingLeft: "8px" }}>
                  <p style={{ fontWeight: 700, fontSize: "13.5px", color: "#521785", margin: 0 }}>
                    Dr. {capitalizeWords(doctor?.name)}
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

                {/* Clinic right */}
                <div
                  className="w-full sm:w-[52%] flex justify-start sm:justify-end"
                  style={{ gap: "7px", alignItems: "flex-start" }}
                >
                  {doctor?.logo && (
                    <img src={doctor.logo} alt="Doctor Logo" style={{ height: "42px", width: "42px", objectFit: "contain", borderRadius: "5px", border: "1px solid #E8EAF6", flexShrink: 0 }} />
                  )}
                  <div className="text-left sm:text-right" style={{ color: "#374151" }}>
                    {has(doctor?.clinicName) && (
                      <p style={{ fontWeight: 700, fontSize: "12.5px", color: "#521785", margin: 0 }}>{capitalizeWords(doctor.clinicName)}</p>
                    )}
                    {has(doctor?.clinicAddress) && (
                      <p style={{ margin: "1px 0", fontSize: "9.5px" }}>{doctor.clinicAddress}</p>
                    )}
                    {has(doctor?.mobileNumber) && (
                      <p style={{ margin: "1px 0" }}><strong>Mob:</strong> {doctor.mobileNumber}</p>
                    )}
                    {(has(doctor?.clinicStartTime) || has(doctor?.clinicEndTime)) && (
                      <p style={{ margin: "1px 0" }}>
                        <strong>Hours:</strong> {formatTime(doctor.clinicStartTime)} – {formatTime(doctor.clinicEndTime)}
                      </p>
                    )}
                    {hasList(doctor?.closedDays) && (
                      <p style={{ margin: "1px 0" }}><strong>Closed:</strong> {doctor.closedDays.join(", ")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ── TITLE ── */}
              <div style={{ textAlign: "center", marginBottom: "7px" }}>
                <span style={{
                  fontSize: "10px", fontWeight: 700, color: "#521785",
                  letterSpacing: "3px", textTransform: "uppercase",
                  borderBottom: "1px solid #4F46E5", paddingBottom: "2px",
                }}>
                  Patient Prescription
                </span>
              </div>

              {/* ── PATIENT INFO ── */}
              <div 
                className="flex flex-col md:flex-row justify-between items-start bg-[#F0F1FF] rounded-[6px] px-[10px] py-[6px] mb-[6px]"
              >
                <div>
                  <div style={{ display: "flex", gap: "5px", flexWrap: "wrap", fontWeight: 700, fontSize: "11.5px", color: "#521785" }}>
                    {has(patient?.patientId) && <span>{patient.patientId}</span>}
                    {has(patient?.patientId) && has(patient?.name) && <span>–</span>}
                    {has(patient?.name) && <span>{capitalizeWords(patient.name)}</span>}
                    <span style={{ fontWeight: 500, color: "#6B7280", fontSize: "10px" }}>
                      {has(patient?.gender) && `(${capitalizeWords(patient.gender).charAt(0)})`}
                      {has(patient?.age) && ` / ${patient.age} yrs`}
                    </span>
                  </div>
                  {has(patient?.address) && (
                    <p style={{ margin: "2px 0 0", color: "#374151" }}>
                      <strong>Address:</strong> {patient.address}
                    </p>
                  )}
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  {has(appointment?.date) && (
                    <p style={{ margin: 0, color: "#374151" }}>
                      <strong>Date:</strong> {appointment.date.slice(0, 10)}
                    </p>
                  )}
                  {has(appointment?.createdAt) && (
                    <p style={{ margin: "1px 0 0", fontSize: "9px", color: "#6B7280" }}>
                      {new Date(appointment.createdAt).toLocaleTimeString()}
                    </p>
                  )}
                </div>
              </div>

              {/* ── VITALS — only shown if at least one value exists ── */}
              {vitals.length > 0 && (
                <div style={{ display: "flex", gap: "5px", marginBottom: "6px", flexWrap: "wrap" }}>
                  {vitals.map(({ label, value, unit }) => (
                    <div key={label} style={{
                      background: "#fff", border: "1px solid #E8EAF6", borderRadius: "5px",
                      padding: "4px 8px", textAlign: "center", minWidth: "70px", flex: "1",
                    }}>
                      <p style={{ margin: 0, fontSize: "8px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>{label}</p>
                      <p style={{ margin: "1px 0", fontWeight: 700, fontSize: "12px", color: "#521785" }}>{value}</p>
                      <p style={{ margin: 0, fontSize: "8px", color: "#9CA3AF" }}>{unit}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* ── COMPLAINTS & INVESTIGATION — only if at least one has data ── */}
              {showComplaintsRow && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-[6px] mb-[6px]">
                  {showComplaints && (
                    <div style={S.card}>
                      <p style={S.sectionLabel}>Chief Complaints</p>
                      {translatedAppointment.chiefComplaints.map((item, idx) => (
                        <div key={idx} style={S.bullet}>
                          <span style={S.dot("#4F46E5")} />
                          <span style={{ color: "#374151" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  {showInvestigation && (
                    <div style={S.card}>
                      <p style={S.sectionLabel}>Investigation</p>
                      {translatedAppointment.investigation.map((item, idx) => (
                        <div key={idx} style={S.bullet}>
                          <span style={S.dot("#4F46E5")} />
                          <span style={{ color: "#374151" }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* ── DIAGNOSIS — only if data ── */}
              {showDiagnosis && (
                <div style={{ ...S.card }}>
                  <p style={S.sectionLabel}>Diagnosis</p>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                    {translatedAppointment.diagnosis.map((d, idx) => (
                      <div key={idx} style={S.bullet}>
                        <span style={S.dot("#521785")} />
                        <span style={{ color: "#374151" }}>{d}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── PRESCRIPTION — table on desktop/large tablet, cards on mobile/tablet — only if data ── */}
              {showPrescription && (
                <div style={{ marginBottom: "6px", borderRadius: "6px", overflow: "hidden", border: "1px solid #E8EAF6" }}>
                  <div style={{ background: "#521785", padding: "4px 10px" }}>
                    <p style={{ margin: 0, color: "#fff", fontWeight: 700, fontSize: "8.5px", letterSpacing: "1.5px", textTransform: "uppercase" }}>
                      Prescription Details
                    </p>
                  </div>

                  {/* Table view - desktop / large tablet only */}
                  <div className="hidden lg:block">
                    <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "10.5px" }}>
                      <thead>
                        <tr style={{ background: "#F0F1FF" }}>
                          {[
                            { label: "Sr.", align: "center" },
                            { label: "Medicine Name", align: "left" },
                            { label: "Dosage", align: "center" },
                            { label: "Duration / Qty", align: "center" },
                          ].map(({ label, align }) => (
                            <th key={label} style={{
                              padding: "4px 8px", textAlign: align,
                              fontWeight: 700, fontSize: "8.5px", color: "#521785",
                              textTransform: "uppercase", letterSpacing: "0.4px",
                              borderBottom: "1px solid #E8EAF6",
                            }}>{label}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {appointment.prescription.map((item, i) => (
                          <tr key={item.no} style={{ background: i % 2 === 0 ? "#fff" : "#F8F9FF", borderTop: "1px solid #E8EAF6" }}>
                            <td style={{ textAlign: "center", padding: "3px 8px", color: "#6B7280", fontWeight: 600 }}>{item.no}</td>
                            <td style={{ padding: "3px 8px", fontWeight: 600, color: "#521785" }}>{capitalizeWords(item.medicine)}</td>
                            <td style={{ textAlign: "center", padding: "3px 8px", color: "#374151" }}>
                              <span>{item.dosage.split("(")[0]}</span>
                              {item.dosage.split("(")[1] && (
                                <span style={{ display: "block", fontSize: "8.5px", color: "#6B7280" }}>({item.dosage.split("(")[1]}</span>
                              )}
                            </td>
                            <td style={{ textAlign: "center", padding: "3px 8px", color: "#374151" }}>
                              <span>{item.duration}</span>
                              {has(item.totalQuantity) && (
                                <span style={{ display: "block", fontSize: "8.5px", color: "#6B7280" }}>{item.totalQuantity}</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Card view - mobile / tablet only */}
                  <div className="lg:hidden p-2 space-y-1.5">
                    {appointment.prescription.map((item, i) => (
                      <div
                        key={item.no}
                        style={{
                          background: i % 2 === 0 ? "#fff" : "#F8F9FF",
                          border: "1px solid #E8EAF6",
                          borderRadius: "6px",
                          padding: "6px 9px",
                        }}
                      >
                        <p style={{ margin: 0, fontSize: "8.5px", color: "#6B7280", fontWeight: 600 }}>Sr. {item.no}</p>
                        <p style={{ margin: "1px 0 4px", fontWeight: 700, color: "#521785", fontSize: "11px", wordBreak: "break-word" }}>
                          {capitalizeWords(item.medicine)}
                        </p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          <div>
                            <p style={{ margin: 0, fontSize: "8px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>
                              Dosage
                            </p>
                            <p style={{ margin: "1px 0 0", color: "#374151", wordBreak: "break-word" }}>
                              {item.dosage.split("(")[0]}
                            </p>
                            {item.dosage.split("(")[1] && (
                              <p style={{ margin: 0, fontSize: "8.5px", color: "#6B7280", wordBreak: "break-word" }}>
                                ({item.dosage.split("(")[1]}
                              </p>
                            )}
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: "8px", color: "#6B7280", textTransform: "uppercase", letterSpacing: "0.4px", fontWeight: 600 }}>
                              Duration / Qty
                            </p>
                            <p style={{ margin: "1px 0 0", color: "#374151" }}>{item.duration}</p>
                            {has(item.totalQuantity) && (
                              <p style={{ margin: 0, fontSize: "8.5px", color: "#6B7280" }}>{item.totalQuantity}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ── NOTE & FOLLOW-UP — only if data ── */}
              {showNotesBlock && (
                <div style={{ ...S.card, marginBottom: "8px" }}>
                  <p style={S.sectionLabel}>Note & Follow-Up</p>
                  {showNote && (
                    <p style={{ margin: "0 0 3px", color: "#374151" }}>
                      <strong>{labels.adviceGiven}:</strong> {translatedAppointment.note}
                    </p>
                  )}
                  {showFollowUp && (
                    <p style={{ margin: 0, color: "#374151" }}>
                      <strong>{labels.followUp}:</strong> {appointment.followUp}
                    </p>
                  )}
                </div>
              )}

              {/* ── SIGNATURE ROW ── */}
              <div style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-end",
                borderTop: "1px solid #E8EAF6", paddingTop: "7px",
              }}>
                <p style={{ fontSize: "7.5px", color: "#9CA3AF", margin: 0, maxWidth: "55%" }}>
                  This is a system generated document — {getFormattedDateTime()}
                </p>
                <div style={{ textAlign: "right" }}>
                  {doctor?.signature && (
                    <div style={{
                      border: "1px solid #E8EAF6", borderRadius: "6px",
                      padding: "3px 8px", background: "#F8F9FF",
                      display: "inline-block", marginBottom: "3px",
                    }}>
                      <img
                        src={doctor.signature}
                        alt="Doctor signature"
                        style={{ height: "54px", width: "110px", objectFit: "contain", display: "block" }}
                      />
                    </div>
                  )}
                  <p style={{ margin: 0, fontWeight: 700, color: "#521785", fontSize: "10.5px" }}>
                    {capitalizeWords(doctor?.name)}
                  </p>
                  {has(doctor?.medicalDegree) && (
                    <p style={{ margin: "1px 0 0", color: "#4F46E5", fontSize: "8.5px", fontWeight: 600 }}>
                      {doctor.medicalDegree}
                    </p>
                  )}
                </div>
              </div>

            </div>{/* /z-index wrapper */}
          </div>
        </div>

        {/* ── Footer (screen only) ── */}
        <div className="shrink-0 flex justify-end items-center px-3 sm:px-5 py-2.5 sm:py-3 bg-white border-t border-[#E8EAF6] print:hidden">
          <button
            // onClick={handlePrint}
            onClick={handlePrintPDF}
            className="!text-white !font-semibold text-xs sm:text-sm rounded-[10px] px-4 sm:px-6 py-2 border-none cursor-pointer"
            style={{
              background: "linear-gradient(135deg, #521785 0%, #4F46E5 100%)",
              boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
            }}
          >
            {"Print PDF"}
          </button>
        </div>

      </motion.div>
    </div>
  );
};

export default PrintPrescription;
