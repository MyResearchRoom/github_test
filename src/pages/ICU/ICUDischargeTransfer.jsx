import React, { useState, useMemo } from "react";
import {
  Plus,
  Search,
  FileText,
  ArrowLeftRight,
  LogOut,
  CheckCircle,
  Eye,
} from "lucide-react";
import ICUTransferDischargeModal from "../../modal/ICU/ICUTransferDischargeModal";
import { useNavigate } from "react-router-dom";

// Initial professional records log matrix
const initialRecords = [
  {
    id: "rec-01",
    type: "Transfer", // "Transfer" | "Discharge"
    patientId: "p-01",
    patientName: "Rahul Sharma",
    bed: "ICU-01",
    date: "03 Sep 2026",
    time: "14:00",
    primaryActor: "Dr. A. Mehta", // Transferred by / Doctor
    secondaryActor: "Staff Nurse Meena Rao", // Received by or Outcome status
    statusLabel: "Other Hospital", // Destination or Outcome
    summaryText:
      "Patient dynamically stable but requires tertiary cardiac monitoring facilities.",
    details: {
      pendingTreatment: "None",
      pendingInvestigations: "None",
      handoverNotes: "ECR records attached. Continuous pacing enabled.",
    },
  },
  {
    id: "rec-02",
    type: "Discharge",
    patientId: "p-03",
    patientName: "Priya Nair",
    bed: "ICU-04",
    date: "12 Sep 2026",
    time: "10:30",
    primaryActor: "Dr. S. Ramachandran",
    secondaryActor: "Discharged Home",
    statusLabel: "Recovered",
    summaryText:
      "Post-op recovery complete. Vitals normalized. Mobilizing well without oxygen support.",
    details: {
      treatmentSummary: "7-day post-CABG intensive management protocol.",
      doctorAdvice:
        "Avoid strenuous weightlifting. Take prescribed anti-coagulants.",
      followUpInstructions: "Review in OPD room 12 on next Monday morning.",
    },
  },
];

const ICUTransferDischarge = () => {
  const [records, setRecords] = useState(initialRecords);
  const [activeTab, setActiveTab] = useState("all"); // "all" | "transfer" | "discharge"
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [successState, setSuccessState] = useState(null); // null or { name, type, date, time }

  const navigate = useNavigate();

  const handleViewRecord = (record) => {
    navigate(`/icu-transfer-discharge/${record.id}`, {
      state: { record },
    });
  };

  // Filter matrix logic
  const filteredRecords = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    return records.filter((rec) => {
      const matchesTab =
        activeTab === "all" ||
        (activeTab === "transfer" && rec.type === "Transfer") ||
        (activeTab === "discharge" && rec.type === "Discharge");

      const matchesSearch =
        rec.patientName.toLowerCase().includes(term) ||
        rec.bed.toLowerCase().includes(term) ||
        rec.primaryActor.toLowerCase().includes(term) ||
        rec.statusLabel.toLowerCase().includes(term);

      return matchesTab && matchesSearch;
    });
  }, [records, activeTab, searchTerm]);

  const handleSaveRecord = (formData) => {
    const formattedDate = new Date(
      `${formData.date}T00:00:00`,
    ).toLocaleDateString("en-GB", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

    const newRecord = {
      id: `rec-${Date.now()}`,
      type: formData.formType, // "Transfer" or "Discharge"
      patientId: formData.patientId || "p-spec",
      patientName: formData.patientName,
      bed: formData.bed || "ICU-Bed",
      date: formattedDate,
      time: formData.time,
      primaryActor: formData.doctorOrTransferredBy,
      secondaryActor:
        formData.formType === "Transfer"
          ? formData.receivedBy
          : formData.outcome,
      statusLabel:
        formData.formType === "Transfer"
          ? formData.transferTo
          : formData.outcome,
      summaryText:
        formData.formType === "Transfer"
          ? formData.reasonForTransfer
          : formData.clinicalSummary,
      details:
        formData.formType === "Transfer"
          ? {
              pendingTreatment: formData.pendingTreatment,
              pendingInvestigations: formData.pendingInvestigations,
              handoverNotes: formData.handoverNotes,
            }
          : {
              treatmentSummary: formData.treatmentSummary,
              doctorAdvice: formData.doctorAdvice,
              followUpInstructions: formData.followUpInstructions,
            },
    };

    setRecords((prev) => [newRecord, ...prev]);
    setIsModalOpen(false);

    // Trigger localized layout confirmation view screen state
    setSuccessState({
      name: formData.patientName,
      type: formData.formType,
      date: formData.date,
      time: formData.time,
    });
  };

  if (successState) {
    return (
      <div className="w-full mx-auto p-4 md:p-6 max-w-[1440px] flex items-center justify-center min-h-[70vh]">
        <div className="bg-white p-8 rounded-xl border border-zinc-200 shadow-sm max-w-md w-full text-center animate-in fade-in zoom-in-95 duration-200">
          <div className="mx-auto w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
            <CheckCircle size={28} />
          </div>
          <h2 className="text-xl font-bold text-zinc-900 tracking-tight">
            ICU Outcome Recorded
          </h2>
          <p className="text-sm font-semibold text-zinc-700 mt-2">
            {successState.name}
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            Outcome:{" "}
            <span className="font-semibold text-zinc-600">
              {successState.type}
            </span>{" "}
            · {successState.date} {successState.time}
          </p>

          <button
            type="button"
            onClick={() => setSuccessState(null)}
            className="mt-6 w-full bg-[#0052cc] hover:bg-[#0043a8] text-white text-sm font-medium h-9 rounded-md transition shadow-sm"
          >
            New Transfer / Discharge
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:px-6 xl:py-0 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Transfer / Discharge
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage and audit ICU patient transition metrics, step-down logs, and
            outcomes
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#521785] px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
        >
          <Plus size={16} />
          <span>New Transfer / Discharge Form</span>
        </button>
      </div>

      {/* SEARCH AND FILTER WORKSPACE CONTROLS */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4 sm:px-5 py-4 border-b border-zinc-100 bg-zinc-50/50">
          <div className="flex items-center gap-1.5 p-0.5 bg-zinc-100 rounded-lg w-fit">
            <button
              type="button"
              onClick={() => setActiveTab("all")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition whitespace-nowrap ${
                activeTab === "all"
                  ? "bg-white text-zinc-800 shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              All Records ({records.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("transfer")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1 whitespace-nowrap ${
                activeTab === "transfer"
                  ? "bg-[#521785] text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <ArrowLeftRight size={12} />
              Transfers
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("discharge")}
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition flex items-center gap-1 whitespace-nowrap ${
                activeTab === "discharge"
                  ? "bg-emerald-600 text-white shadow-xs"
                  : "text-zinc-500 hover:text-zinc-800"
              }`}
            >
              <LogOut size={12} />
              Discharges
            </button>
          </div>

          <div className="relative w-full sm:w-72">
            <input
              type="text"
              placeholder="Search patient, bed, or actor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-400"
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>
        </div>

        {/* LOG MATRIX RENDERING GRID */}
        <div className="p-4 sm:p-5">
          {filteredRecords.length > 0 ? (
            <>
              {/* RESPONSIVE MOBILE DEVICE WORKSPACE: PORTABLE CARD LAYOUT */}
              <div className="flex lg:hidden flex-col gap-4">
                {filteredRecords.map((rec) => (
                  <div
                    key={rec.id}
                    className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:border-zinc-300 transition shadow-xs"
                  >
                    <div className="px-4 py-3 bg-zinc-50/80 border-b border-zinc-100 flex items-center justify-between gap-3">
                      <div>
                        <p className="text-sm font-bold text-zinc-900">
                          {rec.patientName}
                        </p>
                        <p className="text-xs text-zinc-400 mt-0.5">
                          Bed{" "}
                          <span className="font-semibold text-zinc-600">
                            {rec.bed}
                          </span>
                        </p>
                      </div>
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold tracking-wide uppercase ${
                          rec.type === "Transfer"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                        }`}
                      >
                        {rec.type}
                      </span>
                    </div>

                    <div className="p-4 space-y-3.5 text-xs text-zinc-600">
                      <div className="grid grid-cols-2 gap-2 border-b border-dashed border-zinc-100 pb-2">
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            Date / Time
                          </p>
                          <p className="text-zinc-700 font-medium mt-0.5">
                            {rec.date} at {rec.time}
                          </p>
                        </div>
                        <div>
                          <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                            Clinical Lead
                          </p>
                          <p className="text-zinc-700 font-medium mt-0.5">
                            {rec.primaryActor}
                          </p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          {rec.type === "Transfer"
                            ? "Destination / Target"
                            : "Outcome Status"}
                        </p>
                        <p className="text-zinc-800 font-semibold mt-0.5">
                          {rec.statusLabel}{" "}
                          <span className="text-zinc-400 font-normal">
                            ({rec.secondaryActor})
                          </span>
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                          Clinical Summary
                        </p>
                        <p className="text-zinc-700 leading-relaxed mt-0.5 bg-zinc-50 p-2 rounded-md border border-zinc-100">
                          {rec.summaryText}
                        </p>
                      </div>

                      {/* Accordion Expansion metadata summaries built for professional compliance fields */}
                      <div className="bg-zinc-50/50 p-2 rounded-lg text-[11px] space-y-1.5 border border-zinc-100/70">
                        {rec.type === "Transfer" ? (
                          <>
                            <p>
                              <span className="font-semibold text-zinc-500">
                                Pending Rx:
                              </span>{" "}
                              {rec.details.pendingTreatment}
                            </p>
                            <p>
                              <span className="font-semibold text-zinc-500">
                                Pending Labs:
                              </span>{" "}
                              {rec.details.pendingInvestigations}
                            </p>
                            <p>
                              <span className="font-semibold text-zinc-500">
                                Handover Note:
                              </span>{" "}
                              {rec.details.handoverNotes}
                            </p>
                          </>
                        ) : (
                          <>
                            <p>
                              <span className="font-semibold text-zinc-500">
                                Protocol Summary:
                              </span>{" "}
                              {rec.details.treatmentSummary}
                            </p>
                            <p>
                              <span className="font-semibold text-zinc-500">
                                Medical Advice:
                              </span>{" "}
                              {rec.details.doctorAdvice}
                            </p>
                            <p>
                              <span className="font-semibold text-zinc-500">
                                Follow-up Protocols:
                              </span>{" "}
                              {rec.details.followUpInstructions}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* WIDESCREEN DESKTOP MATRIX: HIGH-DENSITY SPATIAL VIEW DATATABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-200 bg-zinc-50/70 text-left">
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                        Type
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                        Patient
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                        Bed
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">
                        Date / Time
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider min-w-[150px]">
                        Destination / Outcome
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider min-w-[280px]">
                        Clinical Summary
                      </th>
                      <th className="px-4 py-3 text-[11px] font-bold text-zinc-400 uppercase tracking-wider text-center whitespace-nowrap">
                        Action
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredRecords.map((rec) => (
                      <tr
                        key={rec.id}
                        className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/40 transition align-middle"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                              rec.type === "Transfer"
                                ? "bg-purple-50 text-purple-700 border border-purple-100"
                                : "bg-emerald-50 text-emerald-700 border border-emerald-100"
                            }`}
                          >
                            {rec.type === "Transfer" ? (
                              <ArrowLeftRight size={12} />
                            ) : (
                              <LogOut size={12} />
                            )}
                            {rec.type}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-zinc-900">
                            {rec.patientName}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            ID: {rec.patientId}
                          </p>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-xs font-semibold text-zinc-600">
                            {rec.bed}
                          </span>
                        </td>

                        <td className="px-4 py-4 whitespace-nowrap">
                          <p className="text-sm font-semibold text-zinc-700">
                            {rec.date}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5">
                            {rec.time}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-sm font-bold text-zinc-800">
                            {rec.statusLabel}
                          </p>
                          <p className="text-xs text-zinc-400 mt-0.5 italic">
                            {rec.secondaryActor}
                          </p>
                        </td>

                        <td className="px-4 py-4">
                          <p className="text-xs xl:text-sm text-zinc-600 leading-relaxed max-w-md line-clamp-2">
                            {rec.summaryText}
                          </p>
                        </td>

                        <td className="px-4 py-4 text-center">
                          <button
                            type="button"
                            onClick={() => handleViewRecord(rec)}
                            title="View details"
                            className="w-8 h-8 inline-flex items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-500 hover:text-[#521785] hover:border-[#521785]/30 hover:bg-purple-50 transition"
                          >
                            <Eye size={15} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <FileText className="mx-auto text-zinc-300 mb-2" size={32} />
              <p className="text-sm font-semibold text-zinc-600">
                No outcomes logs located
              </p>
              <p className="text-xs text-zinc-400 mt-1">
                Try adapting your search parameters or query tags.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* DUAL WORKSPACE FULL WIDTH INTEGRATED MODAL WRAPPER FORM */}
      <ICUTransferDischargeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveRecord}
      />
    </div>
  );
};

export default ICUTransferDischarge;
