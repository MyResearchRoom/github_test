import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { icuService } from "../../../services/icuService";
import {
  Calendar,
  Clock,
  User,
  Stethoscope,
  Activity,
  ShieldCheck,
  FileText,
  BedDouble,
} from "lucide-react";
import { statusStyles } from "../../../pages/ICU/ICUAdmission";

const DetailItem = ({ icon: Icon, label, value }) => (
  <div className="flex gap-3">
    <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
      <Icon size={17} className="text-[#7C3AED]" />
    </div>
    <div className="min-w-0">
      <p className="text-[11px] text-[#8BA3CB] mb-0.5">{label}</p>
      <p className="text-sm font-medium text-[#343C6A] break-words">
        {value || "-"}
      </p>
    </div>
  </div>
);

const Section = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
    <div className="px-4 sm:px-5 py-3 border-b border-[#f0f0f0] flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Icon size={17} className="text-[#521785] shrink-0" />
        <h2 className="text-sm sm:text-base font-semibold text-[#343C6A] truncate">
          {title}
        </h2>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>

    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

const ICUPatientOverview = ({ patient,setPatientAdmission }) => {
  const patientId =patient?.patientId;
  const [admission, setAdmission] = useState(null);
  const [admissionLoading, setAdmissionLoading] = useState(Boolean(patientId));
  const [admissionError, setAdmissionError] = useState("");
  const admissionData = admission || {};

  useEffect(() => {
    let active = true;

    const loadAdmissionDetails = async () => {
      if (!patientId) {
        setAdmission(null);
        setAdmissionError("");
        setAdmissionLoading(false);
        return;
      }

      setAdmissionLoading(true);
      setAdmissionError("");
      setAdmission(null);

      try {
        const response = await icuService.getAdmissionDetailsByPatientid(patientId);
        if (active) {
          setAdmission(response?.admission );
          setPatientAdmission(response?.admission);
        }
      } catch (err) {
        console.error("Failed to load ICU admission details:", err);
        if (active) {
          setAdmission(null);
          setAdmissionError("Failed to load ICU admission details.");
        }
      } finally {
        if (active) {
          setAdmissionLoading(false);
        }
      }
    };

    loadAdmissionDetails();

    return () => {
      active = false;
    };
  }, [patientId]);

  return (
    <>
      {admissionLoading && (
        <p className="text-sm text-[#8BA3CB]">Loading ICU admission details...</p>
      )}
      {admissionError && (
        <p role="alert" className="text-sm text-red-600">
          {admissionError}
        </p>
      )}

      <Section title="Admission Information" icon={Calendar}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <DetailItem icon={Calendar} label="Admission Date" value={admissionData.admissionDate } />
          <DetailItem icon={Clock} label="Admission Time" value={admissionData.admissionTime } />
          <DetailItem icon={Activity} label="IPD Admission Type" value={admissionData.admissionType } />
          <DetailItem icon={Activity} label="ICU Admission Type" value={admissionData.icuAdmissionType } />
          <DetailItem icon={BedDouble} label="ICU Unit" value={`${admissionData.ward?.wardName} (${admissionData.room?.wardType})`} />
          <DetailItem icon={BedDouble} label="Room Number" value={`${admissionData.room?.roomNumber} `} />
          <DetailItem icon={BedDouble} label="Bed" value={`${admissionData.bed?.bedCode} ${admissionData.bed?.bedType}`}/>

          {/* <DetailItem icon={ShieldCheck} label="Admission Status" value={admissionData.status} /> */}

          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
              <ShieldCheck size={17} className="text-[#7C3AED]" />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] text-[#8BA3CB] mb-0.5">Admission Status</p>
              <p className={`text-sm font-medium break-words text-center rounded-md p-1 ${statusStyles[admissionData.status]}`}>
                {admissionData.status || "-"}
              </p>
            </div>
          </div>
        </div>
      </Section>

      <Section title="Clinical Information" icon={Stethoscope}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          <DetailItem icon={User} label="Referring Doctor" value={admissionData.doctorData?.name } />
          <DetailItem icon={Stethoscope} label="Department" value={admissionData.doctorData?.department} />
          <DetailItem icon={Activity} label="Admission Reason" value={admissionData.admissionReason } />
        </div> 
      </Section>

      /

      <Section title="Admission Notes" icon={FileText}>
        <div className="bg-[#F8F9FC] rounded-lg p-4">
          <p className="text-sm text-[#343C6A] leading-6">
            {admissionData.admissionNotes  || "No admission notes available."}
          </p>
        </div>
      </Section>
    </>
  );
};

export default ICUPatientOverview;