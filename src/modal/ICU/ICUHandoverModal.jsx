import React, { useState } from "react";
import { X } from "lucide-react";

const ICUHandoverModal = ({ isOpen, onClose, onSubmit, patients }) => {
  const [formData, setFormData] = useState({
    patient: "",
    bed: "",
    fromShift: "Morning (07:00-14:00)",
    toShift: "Afternoon (14:00-21:00)",
    situation: "",
    background: "",
    assessment: "",
    recommendation: "",
    medicationDue: "",
    pendingInvestigations: "",
    pendingProcedures: "",
    specialInstructions: "",
    handoverBy: "SN Meena Rao",
    date: "2026-09-03",
    time: "13:45",
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patient") {
      const selectedPatient = patients.find((item) => item.name === value);
      setFormData((prev) => ({
        ...prev,
        patient: value,
        bed: selectedPatient?.bed || "",
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (!formData.patient || !formData.situation.trim() || !formData.assessment.trim()) {
      return;
    }

    onSubmit(formData);
    
    // Reset defaults
    setFormData({
      patient: "",
      bed: "",
      fromShift: "Morning (07:00-14:00)",
      toShift: "Afternoon (14:00-21:00)",
      situation: "",
      background: "",
      assessment: "",
      recommendation: "",
      medicationDue: "",
      pendingInvestigations: "",
      pendingProcedures: "",
      specialInstructions: "",
      handoverBy: "SN Meena Rao",
      date: "2026-09-03",
      time: "13:45",
    });
  };

  const inputClass = "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-400";
  const selectClass = "w-full h-9 px-2 rounded-md border border-zinc-200 bg-white outline-none focus:border-blue-500 transition text-sm text-zinc-800";
  const textareaClass = "w-full min-h-[76px] px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-400 resize-none";
  const labelClass = "font-bold text-zinc-400 uppercase tracking-wide text-[10px]";

  const shiftOptions = [
    "Morning (07:00-14:00)",
    "Afternoon (14:00-21:00)",
    "Night (21:00-07:00)"
  ];

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl max-h-[95vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-800">New Shift Handover - SBAR</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Log clinical staff handovers securely using structured parameters</p>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        {/* FORM CONTAINER */}
        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(95vh-76px)]">
          
          {/* PATIENT & SHIFTS HEADER ROWS */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-zinc-50/50 p-3 rounded-xl border border-zinc-100">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Patient</label>
              <select name="patient" value={formData.patient} onChange={handleChange} required className={selectClass}>
                <option value="">Select Patient</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.name}>{p.name} ({p.bed})</option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>From Shift</label>
              <select name="fromShift" value={formData.fromShift} onChange={handleChange} className={selectClass}>
                {shiftOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>To Shift</label>
              <select name="toShift" value={formData.toShift} onChange={handleChange} className={selectClass}>
                {shiftOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {/* SBAR CORE SECTIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-1">
            {/* SITUATION */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-blue-100 bg-blue-50/10">
              <label className={`${labelClass} text-blue-600 flex items-center gap-1`}>
                <span className="w-4 h-4 rounded bg-blue-500 text-white flex items-center justify-center font-bold text-[9px]">S</span>
                Situation
              </label>
              <textarea
                name="situation"
                value={formData.situation}
                onChange={handleChange}
                required
                placeholder="Current patient status and reason for handover"
                className={textareaClass}
              />
            </div>

            {/* BACKGROUND */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-amber-100 bg-amber-50/10">
              <label className={`${labelClass} text-amber-600 flex items-center gap-1`}>
                <span className="w-4 h-4 rounded bg-amber-500 text-white flex items-center justify-center font-bold text-[9px]">B</span>
                Background
              </label>
              <textarea
                name="background"
                value={formData.background}
                onChange={handleChange}
                placeholder="Admission history, diagnosis, key events"
                className={textareaClass}
              />
            </div>

            {/* ASSESSMENT */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-orange-100 bg-orange-50/10">
              <label className={`${labelClass} text-orange-600 flex items-center gap-1`}>
                <span className="w-4 h-4 rounded bg-orange-500 text-white flex items-center justify-center font-bold text-[9px]">A</span>
                Assessment
              </label>
              <textarea
                name="assessment"
                value={formData.assessment}
                onChange={handleChange}
                required
                placeholder="Clinical assessment and level of concern"
                className={textareaClass}
              />
            </div>

            {/* RECOMMENDATION */}
            <div className="flex flex-col gap-1.5 p-3 rounded-xl border border-purple-100 bg-purple-50/10">
              <label className={`${labelClass} text-purple-600 flex items-center gap-1`}>
                <span className="w-4 h-4 rounded bg-purple-500 text-white flex items-center justify-center font-bold text-[9px]">R</span>
                Recommendation
              </label>
              <textarea
                name="recommendation"
                value={formData.recommendation}
                onChange={handleChange}
                placeholder="Actions required, escalation criteria"
                className={textareaClass}
              />
            </div>
          </div>

          {/* LOWER FIELDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 border-t border-zinc-100 pt-3">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Medication Due</label>
              <input type="text" name="medicationDue" value={formData.medicationDue} onChange={handleChange} placeholder="None" className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Pending Investigations</label>
              <input type="text" name="pendingInvestigations" value={formData.pendingInvestigations} onChange={handleChange} placeholder="None" className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Pending Procedures</label>
              <input type="text" name="pendingProcedures" value={formData.pendingProcedures} onChange={handleChange} placeholder="None" className={inputClass} />
            </div>
          </div>

          {/* METADATA LOWER GRID ROW */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 border-t border-zinc-100 pt-3">
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className={labelClass}>Special Instructions</label>
              <input type="text" name="specialInstructions" value={formData.specialInstructions} onChange={handleChange} placeholder="Enter any extra custom notes..." className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Handover By</label>
              <input type="text" name="handoverBy" value={formData.handoverBy} onChange={handleChange} className={inputClass} />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full h-9 px-1.5 rounded-md border border-zinc-200 text-[11px]" />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Time</label>
                <input type="time" name="time" value={formData.time} onChange={handleChange} className="w-full h-9 px-1.5 rounded-md border border-zinc-200 text-[11px]" />
              </div>
            </div>
          </div>

          {/* ACTION BUTTONS */}
          <div className="flex items-center gap-2 justify-start mt-4 border-t border-zinc-100 pt-4">
            <button type="submit" className="bg-[#0052cc] px-5 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm">
              Save Handover
            </button>
            <button type="button" onClick={onClose} className="bg-white border border-zinc-200 px-4 h-9 rounded-md text-zinc-700 font-semibold hover:bg-zinc-50 transition">
              Cancel
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default ICUHandoverModal;
