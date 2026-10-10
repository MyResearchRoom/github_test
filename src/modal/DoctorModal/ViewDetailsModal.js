import React, { useEffect, useRef, useState } from "react";
import { RxCross2 } from "react-icons/rx";
import useModalClose from "../../hooks/useModalClose";
import { Button } from "@mui/material";
import { capitalizeWords } from "../../utils/capitalizeWords";
import { getFormattedDateTime } from "../../utils/getFormattedDateTime";
import { motion } from "framer-motion";
import { useFetch } from "../../hooks/useFetch";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { pdf } from "@react-pdf/renderer";
import PrescriptionPDF from "../../pdf/PrescriptionPDF";
const ViewDetailsModal = ({ onClose, patient, subDoctorId }) => {
  // console.log("subDoctorId",subDoctorId);

  const modalRef = useRef();
  useModalClose(modalRef, onClose);
  const [appointments, setAppointments] = useState([]);
  const [doctor, setDoctor] = useState({});
  const [appointment, setAppointment] = useState({});
  const [prescriptiondata, setPrescriptiondata] = useState(
    appointment?.prescription || []
  );
  const [subDoctors, setSubDoctors] = useState([]);
  

  const formatTime = (time) => {
    if (!time) return;
    const [hour, minute] = time.split(":");
    let h = parseInt(hour);
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12;
    h = h === 0 ? 12 : h;
    return `${h}:${minute} ${ampm}`;
  };

  const { data: appointmentsData } = useFetch(`/api/appointments/patient-appointments/${patient.id}`, {
    params: {
      subDoctorId: subDoctorId,
    },
  }, [subDoctorId]);
  
  // useEffect(() => {
  //   if (appointmentsData?.appointments) {
  //     setAppointments(appointmentsData?.appointments?.appointments);
  //     setAppointment(appointmentsData?.appointments?.appointments[0]);
  //     setPrescriptiondata(appointmentsData?.appointments?.appointments[0]?.prescription);
  //   }
  // }, [appointmentsData]);

  useEffect(() => {
    const appointments = appointmentsData?.appointments?.appointments;

    if (appointments?.length) {
      setAppointments(appointments);
      setAppointment(appointments[0]);
      setPrescriptiondata(appointments[0]?.prescription);
    }
  }, [appointmentsData]);

  useEffect(() => {
    if (appointment?.id) {
      (async () => {
        try {
          const res = await apiClient.get(`/api/doctors/get-doctor/${appointment.id}`);
          if (res?.status === 200) { setDoctor(res.data.doctor); }
        } catch (err) {
          toast.error("Failed to get doctor");
        }
      })();
    }
  }, [appointment]);

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

  const handlePrintPDF = async () => {
    const win = window.open("", "_blank");

    if (!win) {
      toast.error("Please allow popups for this site to print the PDF.");
      return;
    }

    const blob = await pdf(
      <PrescriptionPDF
        doctor={doctor}
        patient={patient}
        appointment={appointment}
        prescriptiondata={prescriptiondata}
        subDoctors={subDoctors}
        department={appointment.department}
        language={appointment?.language}
      />
    ).toBlob();

    const url = URL.createObjectURL(blob);
    win.location.href = url;

    win.onload = () => {
      win.print();
    };
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 backdrop-blur-sm px-2 sm:px-4">
      <motion.div
        ref={modalRef}
        initial={{ scale: 0.95, opacity: 0, y: 10 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0, y: 10 }}
        transition={{ duration: 0.25, ease: "easeOut" }}
        className="relative w-full sm:w-[95%] lg:w-[82%] h-[95%] lg:h-[92%] bg-[#F8F9FF] rounded-2xl overflow-hidden shadow-2xl flex flex-col"
      >
        {/* ── Modal Header ── */}
        <div className="flex items-center px-3 sm:px-6 py-2.5 sm:py-3.5 bg-[#521785] shrink-0">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="w-1.5 h-6 bg-indigo-300 rounded-full" />
            <h1 className="text-white font-semibold text-sm sm:text-base tracking-wide">
              Patient History
            </h1>
          </div>
          <button
            onClick={onClose}
            className="ml-auto text-indigo-200 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
          >
            <RxCross2 className="text-xl" />
          </button>
        </div>

        {/* ── Scrollable Body ── */}
        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: "thin", scrollbarColor: "#c7d2fe #f8f9ff" }}>
          <div
            // ref={contentRef}
            className="mx-auto w-[90%] lg:w-[88%] py-4 sm:py-6 mainDiv print:mainDiv print:text relative print:h-[292mm]"
          >
            {/* Watermark */}
            {doctor?.logo && (
              <img
                src={doctor.logo}
                alt="Doctor Logo Watermark"
                className="absolute print:fixed opacity-[0.06] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 object-contain h-[50%] w-[100%] pointer-events-none"
              />
            )}

            {/* ── Letterhead ── */}
            <div className="bg-white rounded-xl shadow-sm border border-[#E8EAF6] p-4 sm:p-5 mb-5 print:shadow-none print:border-0 print:rounded-none">
              <div className="flex flex-col sm:flex-row items-start sm:justify-between gap-4 sm:gap-0">
                {/* Doctor info */}
                <div className="w-full sm:w-[45%] border-l-4 border-[#4F46E5] pl-4 print:text">
                  <p className="font-bold text-[#521785] text-lg leading-tight">
                    Dr. {capitalizeWords(doctor?.name)}
                  </p>
                  <p className="text-[#4F46E5] font-medium text-sm mt-0.5">{doctor?.medicalDegree}</p>
                  <div className="mt-2 space-y-0.5 text-sm text-[#374151]">
                    <p><span className="font-semibold text-[#521785]">Mob:</span> {doctor?.mobileNumber}</p>
                    <p><span className="font-semibold text-[#521785]">Reg. No:</span> {doctor?.medicalLicenceNumber}</p>
                  </div>
                </div>

                {/* Clinic info */}
                <div className="w-full sm:w-[50%] flex gap-3 items-start justify-start sm:justify-end print:text">
                  {doctor?.logo && (
                    <img
                      src={doctor?.logo}
                      alt="Doctor Logo"
                      className="h-14 w-14 object-contain rounded-lg border border-[#E8EAF6] shrink-0"
                    />
                  )}
                  <div className="text-left sm:text-right text-sm text-[#374151]">
                    <p className="font-bold text-[#521785] text-base">{capitalizeWords(doctor?.clinicName)}</p>
                    <p className="text-[#374151] mt-0.5 leading-snug">{doctor?.clinicAddress}</p>
                    <p className="mt-1"><span className="font-semibold text-[#521785]">Mob:</span> {doctor?.mobileNumber}</p>
                    <p>
                      <span className="font-semibold text-[#521785]">Hours:</span>{" "}
                      {doctor?.clinicStartTime && formatTime(doctor?.clinicStartTime)} –{" "}
                      {doctor?.clinicEndTime && formatTime(doctor?.clinicEndTime)}
                    </p>
                    <p>
                      <span className="font-semibold text-[#521785]">Closed:</span>{" "}
                      {doctor?.closedDays?.length > 0 ? doctor.closedDays.join(", ") : "N/A"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* ── Section Title ── */}
            <div className="flex items-center gap-3 mb-4">
              <div className="h-px flex-1 bg-[#E8EAF6]" />
              <h2 className="text-[#521785] font-bold text-sm uppercase tracking-widest px-2">
                Patient History
              </h2>
              <div className="h-px flex-1 bg-[#E8EAF6]" />
            </div>

            {/* ── Patient Info Card ── */}
            <div className="bg-white rounded-xl border border-[#E8EAF6] shadow-sm p-4 sm:p-5 mb-5 grid grid-cols-1 sm:grid-cols-2 gap-4 print:shadow-none print:border-0 print:subText">
              <div className="border-l-4 border-[#4F46E5] pl-4">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-[#521785] text-base">{patient?.patientId}</span>
                  <span className="text-[#374151]">–</span>
                  <span className="font-bold text-[#521785] text-base">{capitalizeWords(patient?.name)}</span>
                  <span className="text-sm text-[#6B7280]">
                    ({capitalizeWords(patient?.gender)?.charAt(0)}) / {patient?.age} yrs
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-sm text-[#374151]">
                  <p><span className="font-semibold text-[#521785]">D.O.B:</span> {patient?.dateOfBirth}</p>
                  <p><span className="font-semibold text-[#521785]">Blood Group:</span> {patient?.bloodGroup}</p>
                  <p><span className="font-semibold text-[#521785]">Mobile:</span> {patient?.mobileNumber}</p>
                  <p><span className="font-semibold text-[#521785]">Special Category:</span> {patient?.toxicity ? "Yes" : "No"}</p>
                </div>
                <p className="mt-1 text-sm text-[#374151]">
                  <span className="font-semibold text-[#521785]">Address:</span> {patient?.address}
                </p>
                <p className="font-bold text-[#2c333f]">
                  <span className="font-semibold text-[#521785]">Reffered by:</span> {patient?.referredBy}
                </p>
              </div>

              <div className="flex flex-col items-start sm:items-end justify-center gap-1 text-sm text-[#374151]">
                <div className="bg-[#F0F1FF] rounded-lg px-4 py-2 text-left sm:text-right">
                  <p className="text-xs text-[#6B7280] uppercase tracking-wide font-semibold mb-0.5">Appointment Date</p>
                  <p className="font-bold text-[#521785]">{appointment?.date?.slice(0, 10)}</p>
                  <p className="text-xs text-[#6B7280]">
                    {appointment?.createdAt ? new Date(appointment.createdAt).toLocaleTimeString() : ""}
                  </p>
                </div>
              </div>
            </div>

            {/* ── Date Tabs ── */}
            <div
              className="flex flex-wrap gap-2 mb-5 print:hidden bg-white rounded-xl border border-[#E8EAF6] p-3 shadow-sm"
              style={{ scrollbarWidth: "none" }}
            >
              <p className="w-full text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-1">Select Visit Date</p>
              {appointments &&
                appointments.length > 0 &&
                appointments
                  .filter((data) => new Date(data.date) <= new Date())
                  .map((data) => (
                    <button
                      key={data.date}
                      onClick={() => {
                        setAppointment(data);
                        setPrescriptiondata(data?.prescription);
                      }}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all duration-150 ${data?.date === appointment?.date
                          ? "bg-[#4F46E5] text-white border-[#4F46E5] shadow-md"
                          : "bg-white text-[#374151] border-[#E8EAF6] hover:border-[#4F46E5] hover:text-[#4F46E5]"
                        }`}
                    >
                      {data?.date?.slice(0, 10)}
                    </button>
                  ))}
            </div>

            {/* ── Vitals ── */}
            <div className="bg-white rounded-xl border border-[#E8EAF6] shadow-sm px-4 sm:px-5 py-4 mb-5 print:shadow-none print:border-0">
              <p className="text-xs font-bold text-[#6B7280] uppercase tracking-widest mb-3">Vitals</p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-sm">
                {[
                  { label: "Height", value: appointment?.parameters?.height, unit: "cm" },
                  { label: "Blood Pressure", value: appointment?.parameters?.bloodPressure, unit: "mmHg" },
                  { label: "Temperature", value: appointment?.parameters?.temprature, unit: "°F" },
                  { label: "Weight", value: appointment?.parameters?.weight, unit: "Kg" },
                  { label: "Sugar", value: appointment?.parameters?.sugar, unit: "mg/dL" },
                ].map(({ label, value, unit }) => (
                  <div key={label} className="bg-[#F8F9FF] rounded-lg p-1 md:p-3 text-center border border-[#E8EAF6]">
                    <p className="text-[10px] text-[#6B7280] uppercase tracking-wide font-semibold leading-tight mb-1">{label}</p>
                    <p className="font-bold text-[#521785] text-base">{value || "—"}</p>
                    <p className="text-[10px] text-[#9CA3AF]">{unit}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* ── Complaints & Investigation ── */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
              {[
                { title: "Chief Complaints", items: appointment?.chiefComplaints },
                { title: "Investigation", items: appointment?.investigation },
              ].map(({ title, items }) => (
                <div key={title} className="bg-white rounded-xl border border-[#E8EAF6] shadow-sm p-4 print:shadow-none">
                  <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3 border-b border-[#E8EAF6] pb-2">{title}</p>
                  {items?.length > 0 ? (
                    <ul className="space-y-1">
                      {items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm text-[#374151]">
                          <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#4F46E5] shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-[#9CA3AF] italic">None recorded</p>
                  )}
                </div>
              ))}
            </div>

            {/* ── Diagnosis ── */}
            <div className="bg-white rounded-xl border border-[#E8EAF6] shadow-sm p-4 mb-5 print:shadow-none">
              <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3 border-b border-[#E8EAF6] pb-2">Diagnosis</p>
              {appointment?.diagnosis?.length > 0 ? (
                <ul className="space-y-1">
                  {appointment.diagnosis.map((d, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-sm text-[#374151]">
                      <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#521785] shrink-0" />
                      {d}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-[#9CA3AF] italic">None recorded</p>
              )}
            </div>

            {/* ── Notes & Follow-up ── */}
            <div className="bg-white rounded-xl border border-[#E8EAF6] shadow-sm p-4 mb-5 print:shadow-none">
              <p className="text-xs font-bold text-[#4F46E5] uppercase tracking-widest mb-3 border-b border-[#E8EAF6] pb-2">Additional Notes</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-[#374151]">
                <div>
                  <p className="text-xs font-semibold text-[#6B7280] uppercase mb-1">Reason</p>
                  <p>{appointment?.reason || "—"}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase mb-1">Note</p>
                  <p>{appointment?.note || "—"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold text-[#6B7280] uppercase mb-1">Follow-Up Date</p>
                  <p className="font-semibold text-[#521785]">{appointment?.followUp?.slice(0, 10) || "—"}</p>
                </div>
                {/* <div className="print:hidden">
                  <p className="text-xs font-semibold text-[#6B7280] uppercase mb-1">Prescription PDF</p>
                  <span
                    onClick={() => appointment?.document && openPDFInNewTab(appointment?.document)}
                    className="text-[#4F46E5] underline cursor-pointer hover:text-[#521785] font-medium"
                  >
                    View Document
                  </span>
                </div> */}
              </div>
            </div>

            {/* ── Prescription — table on desktop/large tablet ── */}
            <div className="hidden lg:block bg-white rounded-xl border border-[#E8EAF6] shadow-sm overflow-hidden mb-6 print:shadow-none print:border-0">
              <div className="bg-[#521785] px-5 py-3">
                <p className="text-white font-bold text-sm uppercase tracking-widest">Prescription</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-[#F0F1FF] text-[#521785]">
                      <th className="text-center py-2.5 px-3 font-semibold text-xs uppercase tracking-wide w-12">Sr.</th>
                      <th className="text-left py-2.5 px-4 font-semibold text-xs uppercase tracking-wide">Medicine Name</th>
                      <th className="text-center py-2.5 px-4 font-semibold text-xs uppercase tracking-wide">Dosage</th>
                      <th className="text-center py-2.5 px-4 font-semibold text-xs uppercase tracking-wide">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {prescriptiondata?.length > 0 ? (
                      prescriptiondata.map((item, i) => (
                        <tr
                          key={item.no}
                          className={`border-t border-[#E8EAF6] ${i % 2 === 0 ? "bg-white" : "bg-[#F8F9FF]"}`}
                        >
                          <td className="text-center py-3 px-3 text-[#6B7280] font-medium">{item.no}</td>
                          <td className="py-3 px-4 font-semibold text-[#521785]">{capitalizeWords(item.medicine)}</td>
                          <td className="py-3 px-4 text-center text-[#374151]">
                            <span>{item.dosage.split("(")[0]}</span>
                            {item.dosage.split("(")[1] && (
                              <span className="block text-xs text-[#6B7280]">({item.dosage.split("(")[1]}</span>
                            )}
                          </td>
                          <td className="py-3 px-4 text-center text-[#374151]">{item.duration}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} className="text-center py-8 text-[#9CA3AF] italic">No prescription recorded</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* ── Prescription — cards on mobile/tablet ── */}
            <div className="lg:hidden bg-white rounded-xl border border-[#E8EAF6] shadow-sm overflow-hidden mb-6">
              <div className="bg-[#521785] px-4 py-3">
                <p className="text-white font-bold text-sm uppercase tracking-widest">Prescription</p>
              </div>
              <div className="p-3">
                {prescriptiondata?.length > 0 ? (
                  <div className="space-y-2">
                    {prescriptiondata.map((item) => (
                      <div
                        key={item.no}
                        className="border border-[#E8EAF6] rounded-lg p-3 bg-[#F8F9FF]"
                      >
                        <div className="flex justify-between items-start gap-2">
                          <p className="text-xs text-[#6B7280]">Sr. {item.no}</p>
                        </div>
                        <p className="font-semibold text-[#521785] break-words">
                          {capitalizeWords(item.medicine)}
                        </p>
                        <div className="mt-2 grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-xs text-[#6B7280] uppercase">Dosage</p>
                            <p className="text-[#374151] break-words">{item.dosage.split("(")[0]}</p>
                            {item.dosage.split("(")[1] && (
                              <p className="text-xs text-[#6B7280] break-words">({item.dosage.split("(")[1]}</p>
                            )}
                          </div>
                          <div>
                            <p className="text-xs text-[#6B7280] uppercase">Duration</p>
                            <p className="text-[#374151]">{item.duration}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center py-8 text-[#9CA3AF] italic">No prescription recorded</p>
                )}
              </div>
            </div>

            {/* ── Signature (screen) ── */}
            <div className="flex justify-end mb-6 print:hidden">
              <div className="text-right">
                <div className="border border-[#E8EAF6] rounded-xl p-3 bg-white shadow-sm inline-block mb-2">
                  <img
                    src={doctor?.signature}
                    alt="Doctor signature"
                    className="h-24 w-40 object-contain"
                  />
                </div>
                <p className="font-bold text-[#521785] text-base">{capitalizeWords(doctor?.name)}</p>
                <p className="text-sm text-[#4F46E5] font-medium">{doctor?.medicalDegree}</p>
              </div>
            </div>

            {/* ── Signature (print only) ── */}
            <div className="print:fixed print:bottom-10 hidden print:flex print:justify-end print:w-full print:pr-8">
              <div className="hidden print:block text-right">
                <img src={doctor?.signature} alt="Doctor signature" className="h-20 w-36 object-contain" />
                <p className="text-base font-bold print:text">{capitalizeWords(doctor?.name)}</p>
                <p className="print:subText text-sm">{doctor?.medicalDegree}</p>
              </div>
            </div>

            {/* ── Print footer ── */}
            <div className="print:fixed print:bottom-0 hidden print:flex w-full print:w-full">
              <p className="print:text-xs text-black">
                This is a system generated document — {getFormattedDateTime()}
              </p>
            </div>
          </div>
        </div>

        {/* ── Footer Bar ── */}
        <div className="shrink-0 flex justify-end items-center px-3 sm:px-6 py-2.5 sm:py-3 bg-white border-t border-[#E8EAF6] print:hidden">

          <Button
            variant="contained"
            onClick={handlePrintPDF}
            sx={{
              background: "linear-gradient(135deg, #521785 0%, #4F46E5 100%)",
              color: "#fff",
              fontWeight: 600,
              fontSize: "0.8rem",
              textTransform: "none",
              borderRadius: "10px",
              px: 3.5,
              py: 1,
              boxShadow: "0 4px 14px rgba(79,70,229,0.35)",
              "&:hover": {
                background: "linear-gradient(135deg, #16165a 0%, #4338ca 100%)",
                boxShadow: "0 6px 18px rgba(79,70,229,0.45)",
              },
            }}
          >
            Print PDF
          </Button>
        </div>

      </motion.div>
    </div>
  );
};

export default ViewDetailsModal;
