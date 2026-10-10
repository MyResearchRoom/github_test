import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
  ArrowLeft,
  Activity,
  FileText,
  HeartPulse,
  ClipboardList,
  Pill,
  ClipboardCheck,
  Droplets,
  FlaskConical,
  Scissors,
  ArrowLeftRight,
  File,
  Phone,
} from "lucide-react";
import Button from "../../commonComponent/Button";
import { mockNursingNotes, mockIntakeOutput } from "../../data/ICU/icuAdmissionData";
import { patientService } from "../../services/patientService";
import ICUDoctorNote from "../../components/ICU/ICUDoctorNotes/ICUDoctorNote";
import ICUNursingNote from "../../components/ICU/ICUNursingNotes/ICUNursingNotes";
import ICUIntakeOutput from "../../components/ICU/ICUIntakeOutput/ICUIntakeOutput";
import ICUPatientOverview from "../../components/ICU/ICUPatientOverview/ICUPatientOverview";
import IPDPatientDocuments from "../IPD/IPDPatientDocuments";
import IPDPatientVitals from "../../components/IPD/PatientDetails/IPDPatientVitals";
import ICUCarePlan from "../../components/ICU/ICUCarePlan/ICUCarePlan";
import ICUInvestigation from "../../components/ICU/ICUInvestigation/ICUInvestigation";
import ICUProcedure from "../../components/ICU/ICUProcedure/ICUProcedure";
import ICUMedication from "../../components/ICU/ICUMedication/ICUMedication";

const PRIMARY = "#521785";

const conditionStyles = {
  Stable: "bg-[#DCFCE7] text-[#16A34A]",
  Watch: "bg-[#FFEDD5] text-[#EA580C]",
  Critical: "bg-[#FEE2E2] text-[#EF4444]",
};

const statusStyles = {
  admitted: "bg-[#DCFCE7] text-[#16A34A]",
  discharged: "bg-[#E0E7FF] text-[#4338CA]",
  cancelled: "bg-[#FEE2E2] text-[#DC2626]",
};


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

const tabs = [
  { key: "overview", label: "Overview", icon: FileText },
  { key: "document", label: "Document", icon: File },
  { key: "vitals", label: "Vitals", icon: HeartPulse },
  { key: "doctorNotes", label: "Doctor Notes", icon: ClipboardList },
  { key: "nursingNotes", label: "Nursing Notes", icon: ClipboardCheck },
  { key: "medication", label: "Medication", icon: Pill },
  { key: "carePlan", label: "Care Plan", icon: Activity },
  { key: "intakeOutput", label: "Intake & Output", icon: Droplets },
  { key: "investigations", label: "Investigations", icon: FlaskConical },
  { key: "procedures", label: "Procedures", icon: Scissors },
  { key: "handover", label: "Handover", icon: ArrowLeftRight },
];

const mockInvestigations = [
  { investigation: "Complete Blood Count", date: "03 Sep 2026", priority: "STAT", status: "Available", result: "WBC: 14,500 | Hb: 9.2 | Plt: 88,000" },
  { investigation: "ABG", date: "03 Sep 2026", priority: "STAT", status: "Pending", result: "Awaiting result..." },
  { investigation: "Electrolytes", date: "03 Sep 2026", priority: "Urgent", status: "Available", result: "Na: 132 | K: 3.1 | Cl: 98" },
  { investigation: "Chest X-Ray", date: "02 Sep 2026", priority: "Routine", status: "Reviewed", result: "Bilateral infiltrates" },
];

const mockHandover = {
  from: "Morning (07:00 - 14:00)",
  to: "Afternoon (14:00 - 21:00)",
  by: "SN Meena Rao",
  date: "03 Sep 2026, 13:45",
  situation: "82M with acute respiratory failure and septic shock. On vasopressors and antibiotics. SpO2 91%, BP 88/56.",
  background: "Admitted 28 Aug with community-acquired pneumonia progressing to ARDS. Blood cultures sent yesterday.",
  assessment: "Condition critical. Haemodynamically unstable. Requires close monitoring.",
  recommendation: "Increase norepinephrine if MAP < 65. Recheck ABG at 14:00. Contact Dr. Mehta if SpO2 drops below 88%.",
  medicationDue: "Meropenem 1g IV at 15:00",
  pendingInvestigations: "ABG result awaited",
  pendingProcedures: "None",
  specialInstructions: "Family to be updated by Dr. Mehta at 16:00",
};

const ICUAdmissionDetails = () => {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");
  const [showAddVitalsModal, setShowAddVitalsModal] = useState(false);

  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [nursingNotes, setNursingNotes] = useState(mockNursingNotes);

  const [patientAdmission, setPatientAdmission] = useState(null);


  useEffect(() => {
    let active = true;

    const loadPatient = async () => {
      if (!patientId) {
        setPatient(null);
        setError("");
        setLoading(false);
        return;
      }

      setLoading(true);
      setError("");

      try {
        const response = await patientService.getPatientsById(patientId);
        if (active) {
          setPatient(response?.patient || null);
        }
      } catch (err) {
        console.error("Failed to load patient:", err);
        if (active) {
          setPatient(null);
          setError("Failed to load patient details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadPatient();

    return () => {
      active = false;
    };
  }, [patientId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent p-3 lg:p-1">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 text-center">
          <p className="text-sm text-[#8BA3CB]">Loading patient details...</p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="min-h-screen bg-transparent p-3 lg:p-1">
        <div className="bg-white rounded-lg border border-[#e5e5e5] p-8 text-center">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            {error ? "Unable to Load Patient" : "Patient Not Found"}
          </h2>
          <p className="text-sm text-[#8BA3CB] mt-1">
            {error || "The requested patient could not be found."}
          </p>
          <Button
            onClick={() => navigate("/icu-admission")}
            className="mt-5 text-white px-4 py-2 text-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            <ArrowLeft size={15} />
            Back to ICU Admissions
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent p-2 lg:p-1 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate("/icu-admission")}
            className="w-9 h-9 rounded-md border border-[#ddd] bg-white flex items-center justify-center text-[#343C6A] hover:bg-gray-50"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
              ICU Admission Details
            </h1>
            <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
              Complete admission information for {patient.name}.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full ${conditionStyles[patient.initialCondition]}`}
          >
            {patient.initialCondition}
          </span>
          <span
            className={`text-[12px] font-medium px-3 py-1.5 rounded-full ${statusStyles[patient.status]}`}
          >
            {patient.status}
          </span>
        </div>
      </div>

      {/* Patient Summary */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] p-4 sm:px-5 sm:py-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
              <span className="text-[#7C3AED] font-semibold text-2xl">
                {patient.name?.charAt(0) || "?"}
              </span>
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-semibold text-[#343C6A]">
                {patient.name}
              </h2>
              <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1">
                <span className="text-xs text-[#8BA3CB]">Patient id: {patient.patientId}</span>
                <span className="text-xs text-[#8BA3CB]">
                  {patient.age} Years / {patient.gender}
                </span>
              </div>
              <p className="text-xs text-[#8BA3CB] flex items-center gap-1 mt-1">
                <Phone size={12} />
                {patient.mobileNumber || "N/A"}
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Tab Bar */}
      <div className="bg-white rounded-lg border border-[#e5e5e5] px-2 py-2">
        <div className="flex flex-wrap items-center gap-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.key;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-md text-[13px] font-medium whitespace-nowrap transition-colors ${isActive
                  ? "text-white"
                  : "text-[#8BA3CB] hover:bg-[#F8F5FB] hover:text-[#343C6A]"
                  }`}
                style={isActive ? { backgroundColor: PRIMARY } : undefined}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex flex-col gap-4">
        {activeTab === "overview" && <ICUPatientOverview patient={patient} setPatientAdmission={setPatientAdmission} />}

        {activeTab === "document" && (
          <IPDPatientDocuments
            admissionId={patientAdmission.ipdAdmissionId}
            patientId={patient.id}
            patient={patientAdmission}
          />
        )}

        {activeTab === "vitals" && (
          <IPDPatientVitals
            patientId={patient.id}
            admissionId={patientAdmission?.ipdAdmissionId}
            icuAdmissionId={patientAdmission?.id}
            isAddModalOpen={showAddVitalsModal}
            onOpenAddModal={() => setShowAddVitalsModal(true)}
            onCloseAddModal={() => setShowAddVitalsModal(false)}
            success={() => setActiveTab("vitals")}
          />
        )}

        {activeTab === "doctorNotes" && (
          <ICUDoctorNote
            patientId={patient.id}
            icuAdmissionId={patientAdmission?.id}
          />
        )}

        {activeTab === "nursingNotes" && (
          <ICUNursingNote
            patientId={patient.id}
            icuAdmissionId={patientAdmission?.id}
          />
        )}

        {activeTab === "medication" && (
          <ICUMedication
            patientId={patient.id}
            icuAdmissionId={patientAdmission?.id}
          />
        )}


        {activeTab === "carePlan" && (
          <ICUCarePlan
            patient={patient}
            patientId={patient.id}
            icuAdmissionId={patientAdmission?.id}
          />
        )}

        {/*  */}
        {activeTab === "intakeOutput" && (
          <ICUIntakeOutput
            patient={patient}
            patientId={patient.id}
            icuAdmissionId={patientAdmission?.id}
          />
        )}

        {activeTab === "investigations" && (
          <ICUInvestigation
            patientId={patient.id}
            icuAdmissionId={patientAdmission?.id}
            // patient={patient}
          />
        )}

        {activeTab === "procedures" && (
          <ICUProcedure 
            patient={patient} 
            patientId={patient.id}
            icuAdmissionId={patientAdmission?.id}
          />
        )}

        {activeTab === "handover" && (
          <Section title="Shift Handover" icon={ArrowLeftRight}>
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4 text-[13px] text-[#8BA3CB]">
              <span>By: <span className="font-medium text-[#343C6A]">{mockHandover.by}</span></span>
              <span className="text-[#521785] font-medium">{mockHandover.from}</span>
              <span>→</span>
              <span className="text-[#521785] font-medium">{mockHandover.to}</span>
              <span className="ml-auto">{mockHandover.date}</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg border border-[#bfdbfe] bg-[#EFF6FF] p-4">
                <p className="text-[12px] font-bold text-[#2563EB] mb-1.5">SITUATION</p>
                <p className="text-sm text-[#343C6A]">{mockHandover.situation}</p>
              </div>
              <div className="rounded-lg border border-[#fde68a] bg-[#FFFBEB] p-4">
                <p className="text-[12px] font-bold text-[#D97706] mb-1.5">BACKGROUND</p>
                <p className="text-sm text-[#343C6A]">{mockHandover.background}</p>
              </div>
              <div className="rounded-lg border border-[#fecaca] bg-[#FEF2F2] p-4">
                <p className="text-[12px] font-bold text-[#EF4444] mb-1.5">ASSESSMENT</p>
                <p className="text-sm text-[#343C6A]">{mockHandover.assessment}</p>
              </div>
              <div className="rounded-lg border border-[#e9d5ff] bg-[#FAF5FF] p-4">
                <p className="text-[12px] font-bold text-[#7C3AED] mb-1.5">RECOMMENDATION</p>
                <p className="text-sm text-[#343C6A]">{mockHandover.recommendation}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-5 pt-4 border-t border-[#f0f0f0]">
              <DetailItem icon={Pill} label="Medication Due" value={mockHandover.medicationDue} />
              <DetailItem icon={FlaskConical} label="Pending Investigations" value={mockHandover.pendingInvestigations} />
              <DetailItem icon={Scissors} label="Pending Procedures" value={mockHandover.pendingProcedures} />
              <DetailItem icon={FileText} label="Special Instructions" value={mockHandover.specialInstructions} />
            </div>
          </Section>
        )}
      </div>


    </div>
  );
};

export default ICUAdmissionDetails;