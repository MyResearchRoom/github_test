import React, { useMemo, useState } from "react";
import { Plus, Search, ArrowRight, ClipboardCheck } from "lucide-react";
import ICUHandoverModal from "../../modal/ICU/ICUHandoverModal";

const patients = [
  { id: "p-01", name: "Rahul Sharma", bed: "ICU-01" },
  { id: "p-02", name: "Amit Patil", bed: "ICU-02" },
  { id: "p-03", name: "Priya Nair", bed: "ICU-04" },
  { id: "p-04", name: "Suresh Iyer", bed: "ICU-05" },
  { id: "p-05", name: "Kavitha Rao", bed: "ICU-06" },
  { id: "p-06", name: "Mohan Das", bed: "ICU-07" },
];

const initialHandovers = [
  {
    id: "handover-01",
    patient: "Rahul Sharma",
    bed: "ICU-01",
    handoverBy: "SN Meena Rao",
    fromShift: "Morning (07:00 - 14:00)",
    toShift: "Afternoon (14:00 - 21:00)",
    date: "03 Sep 2026",
    time: "13:45",
    situation: "82M with acute respiratory failure and septic shock. On vasopressors and antibiotics. SpO2 91%, BP 88/56.",
    background: "Admitted 28 Aug with community-acquired pneumonia progressing to ARDS. Blood cultures sent yesterday.",
    assessment: "Condition critical. Haemodynamically unstable. Requires close monitoring.",
    recommendation: "Increase norepinephrine if MAP < 65. Recheck ABG at 14:00. Contact Dr. Mehta if SpO2 drops below 88%.",
    medicationDue: "Meropenem 1g IV at 15:00",
    pendingInvestigations: "ABG result awaited",
    pendingProcedures: "None",
    specialInstructions: "Family to be updated by Dr. Mehta at 16:00",
  },
];

const ICUHandover = () => {
  const [handovers, setHandovers] = useState(initialHandovers);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const filteredHandovers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    if (!term) return handovers;

    return handovers.filter((ho) => {
      return (
        ho.patient.toLowerCase().includes(term) ||
        ho.bed.toLowerCase().includes(term) ||
        ho.handoverBy.toLowerCase().includes(term) ||
        ho.situation.toLowerCase().includes(term) ||
        ho.assessment.toLowerCase().includes(term)
      );
    });
  }, [handovers, searchTerm]);

  const handleSaveHandover = (formData) => {
    const newHandover = {
      id: `handover-${Date.now()}`,
      patient: formData.patient,
      bed: formData.bed,
      handoverBy: formData.handoverBy,
      fromShift: formData.fromShift,
      toShift: formData.toShift,
      date: new Date(`${formData.date}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      time: formData.time,
      situation: formData.situation,
      background: formData.background,
      assessment: formData.assessment,
      recommendation: formData.recommendation,
      medicationDue: formData.medicationDue || "None",
      pendingInvestigations: formData.pendingInvestigations || "None",
      pendingProcedures: formData.pendingProcedures || "None",
      specialInstructions: formData.specialInstructions || "None",
    };

    setHandovers((prev) => [newHandover, ...prev]);
    setIsModalOpen(false);
  };

  return (
    <div className="w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:px-6 xl:py-0 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pt-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">Handover</h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Shift-to-shift clinical handover using structured SBAR protocol
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
        >
          <Plus size={16} />
          <span>New Handover</span>
        </button>
      </div>

      {/* FILTER & SEARCH UTILITIES */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-1 py-1">
        <div>
          <p className="text-xs text-zinc-400 font-medium">
            {filteredHandovers.length} {filteredHandovers.length === 1 ? "handover record" : "handover records"} active
          </p>
        </div>

        <div className="relative w-full sm:w-64">
          <input
            type="text"
            placeholder="Search patient / nurse / bed..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 bg-white outline-none focus:border-blue-500 transition text-sm"
          />
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
        </div>
      </div>

      {/* HANDOVER CARDS LIST (SBAR STRUCTURE) */}
      <div className="flex flex-col gap-6">
        {filteredHandovers.length > 0 ? (
          filteredHandovers.map((ho) => (
            <div
              key={ho.id}
              className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden hover:border-zinc-300 transition"
            >
              {/* CARD TOP META BAR */}
              <div className="px-5 py-4 bg-zinc-50/70 border-b border-zinc-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-base font-bold text-zinc-900">{ho.patient}</h2>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-zinc-100 text-xs font-semibold text-zinc-600">
                      Bed {ho.bed}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 mt-1 flex items-center gap-1.5 flex-wrap">
                    <span>Handover by: <span className="font-semibold text-zinc-600">{ho.handoverBy}</span></span>
                    <span className="text-zinc-300">•</span>
                    <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded text-[11px] font-medium">
                      {ho.fromShift}
                    </span>
                    <ArrowRight size={12} className="text-zinc-400" />
                    <span className="inline-flex items-center gap-1 bg-purple-50 text-purple-700 px-1.5 py-0.5 rounded text-[11px] font-medium">
                      {ho.toShift}
                    </span>
                  </p>
                </div>

                <div className="text-left md:text-right shrink-0">
                  <p className="text-xs sm:text-sm font-semibold text-zinc-700">{ho.date}</p>
                  <p className="text-xs text-zinc-400 mt-0.5">{ho.time}</p>
                </div>
              </div>

              {/* SBAR CORE BLOCKS GRID */}
              <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-5 border-b border-zinc-100 bg-white">
                {/* S - SITUATION */}
                <div className="p-4 rounded-xl border border-blue-100 bg-blue-50/20 flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-xs">S</span>
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wider">Situation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">{ho.situation}</p>
                </div>

                {/* B - BACKGROUND */}
                <div className="p-4 rounded-xl border border-amber-100 bg-amber-50/20 flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-xs">B</span>
                    <span className="text-xs font-bold text-amber-800 uppercase tracking-wider">Background</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed">{ho.background}</p>
                </div>

                {/* A - ASSESSMENT */}
                <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/20 flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded bg-orange-500 text-white flex items-center justify-center font-bold text-xs">A</span>
                    <span className="text-xs font-bold text-orange-800 uppercase tracking-wider">Assessment</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">{ho.assessment}</p>
                </div>

                {/* R - RECOMMENDATION */}
                <div className="p-4 rounded-xl border border-purple-100 bg-purple-50/20 flex flex-col gap-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="w-5 h-5 rounded bg-purple-500 text-white flex items-center justify-center font-bold text-xs">R</span>
                    <span className="text-xs font-bold text-purple-800 uppercase tracking-wider">Recommendation</span>
                  </div>
                  <p className="text-xs sm:text-sm text-zinc-700 leading-relaxed font-medium">{ho.recommendation}</p>
                </div>
              </div>

              {/* METRICS & WORKFLOW FOOTER FIELDS */}
              <div className="px-5 py-4 bg-zinc-50/30 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs">
                <div>
                  <p className="font-bold text-zinc-400 uppercase tracking-wider mb-1">Medication Due</p>
                  <p className="text-zinc-700 font-medium">{ho.medicationDue}</p>
                </div>
                <div>
                  <p className="font-bold text-zinc-400 uppercase tracking-wider mb-1">Pending Investigations</p>
                  <p className="text-zinc-700 font-medium">{ho.pendingInvestigations}</p>
                </div>
                <div>
                  <p className="font-bold text-zinc-400 uppercase tracking-wider mb-1">Pending Procedures</p>
                  <p className="text-zinc-700 font-medium">{ho.pendingProcedures}</p>
                </div>
                <div>
                  <p className="font-bold text-zinc-400 uppercase tracking-wider mb-1">Special Instructions</p>
                  <p className="text-zinc-700 font-medium">{ho.specialInstructions}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center bg-white border border-zinc-200 rounded-2xl">
            <ClipboardCheck className="mx-auto text-zinc-300 mb-2" size={40} />
            <p className="text-sm font-semibold text-zinc-600">No shift handovers discovered</p>
            <p className="text-xs text-zinc-400 mt-1">Try tuning your filters or adding a new SBAR log entry.</p>
          </div>
        )}
      </div>

      <ICUHandoverModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveHandover}
        patients={patients}
      />
    </div>
  );
};

export default ICUHandover;
