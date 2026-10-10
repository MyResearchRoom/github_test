import React, { useState } from "react";
import { X, ArrowLeftRight, LogOut } from "lucide-react";

const patients = [
  { id: "p-01", name: "Rahul Sharma", bed: "ICU-01" },
  { id: "p-02", name: "Amit Patil", bed: "ICU-02" },
  { id: "p-03", name: "Priya Nair", bed: "ICU-04" },
  { id: "p-04", name: "Suresh Iyer", bed: "ICU-05" },
  { id: "p-05", name: "Kavitha Rao", bed: "ICU-06" },
  { id: "p-06", name: "Mohan Das", bed: "ICU-07" },
];

const ICUTransferDischargeModal = ({ isOpen, onClose, onSubmit }) => {
  const [formType, setFormType] = useState("Transfer"); // "Transfer" | "Discharge"
  
  // High density state structure matrix
  const [formData, setFormData] = useState({
    patientName: "",
    patientId: "",
    bed: "",
    currentCondition: "Stable",
    // Transfer specific metrics
    transferTo: "Other Hospital",
    reasonForTransfer: "",
    pendingTreatment: "",
    pendingInvestigations: "",
    handoverNotes: "",
    transferredBy: "Dr. A. Mehta",
    receivedBy: "",
    // Discharge specific metrics
    outcome: "Discharged Home",
    clinicalSummary: "",
    treatmentSummary: "",
    doctorAdvice: "",
    followUpInstructions: "",
    doctor: "Dr. A. Mehta",
    // Shared parameters
    date: "2026-09-15",
    time: "12:00"
  });

  if (!isOpen) return null;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "patientName") {
      const targetPat = patients.find(p => p.name === value);
      setFormData(prev => ({
        ...prev,
        patientName: value,
        patientId: targetPat ? targetPat.id : "",
        bed: targetPat ? targetPat.bed : ""
      }));
      return;
    }

    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.patientName) return;

    // Package appropriate payload mapped parameters dynamically
    const submissionPayload = {
      ...formData,
      formType: formType,
      doctorOrTransferredBy: formType === "Transfer" ? formData.transferredBy : formData.doctor
    };

    onSubmit(submissionPayload);
    
    // Clear and reset form tracking vectors
    setFormData({
      patientName: "",
      patientId: "",
      bed: "",
      currentCondition: "Stable",
      transferTo: "Other Hospital",
      reasonForTransfer: "",
      pendingTreatment: "",
      pendingInvestigations: "",
      handoverNotes: "",
      transferredBy: "Dr. A. Mehta",
      receivedBy: "",
      outcome: "Discharged Home",
      clinicalSummary: "",
      treatmentSummary: "",
      doctorAdvice: "",
      followUpInstructions: "",
      doctor: "Dr. A. Mehta",
      date: "2026-09-15",
      time: "12:00"
    });
  };

  // Cohesive styling variables following ICU design tokens
  const selectStyle = "w-full h-9 px-2 rounded-md border border-zinc-200 bg-white outline-none focus:border-blue-500 transition text-sm text-zinc-800";
  const inputStyle = "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";
  const areaStyle = "w-full min-h-[68px] px-3 py-1.5 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300 resize-none leading-normal";
  const headerLabel = "font-bold text-zinc-400 uppercase tracking-wider text-[10px] block mb-1";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-3 sm:p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl max-h-[95vh] overflow-hidden border border-zinc-100 flex flex-col animate-in fade-in zoom-in-95 duration-150">
        
        {/* MODAL HEADER ROW */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100 shrink-0">
          <div>
            <h2 className="text-base font-bold text-zinc-800">ICU Patient Transition Workflow</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Process formal patient exit parameters, specialized hospital updates or home discharges</p>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        {/* COMPACT SEGMENT TOGGLE TABS */}
        <div className="px-5 py-2.5 bg-zinc-50 border-b border-zinc-100 flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-2 p-1 bg-zinc-200/70 rounded-lg">
            <button
              type="button"
              onClick={() => setFormType("Transfer")}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-1.5 ${
                formType === "Transfer" 
                  ? "bg-[#521785] text-white shadow-sm" 
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <ArrowLeftRight size={13} />
              Transfer Patient
            </button>
            <button
              type="button"
              onClick={() => setFormType("Discharge")}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition flex items-center gap-1.5 ${
                formType === "Discharge" 
                  ? "bg-emerald-600 text-white shadow-sm" 
                  : "text-zinc-600 hover:text-zinc-900"
              }`}
            >
              <LogOut size={13} />
              ICU Discharge / Outcome
            </button>
          </div>
          <span className="text-[11px] font-semibold text-zinc-400 italic hidden sm:inline">
            Active Framework: Mode {formType}
          </span>
        </div>

        {/* INTERNAL FORM WORKSPACE LAYOUT (4-COLUMN COMPACT ARCHITECTURE) */}
        <form onSubmit={handleFormSubmit} className="p-5 flex-1 overflow-y-auto space-y-4 text-xs">
          
          {/* BASE DEMOGRAPHICS LAYER (SHARED) */}
          <div className="bg-zinc-50/60 p-3.5 rounded-xl border border-zinc-200/70">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider mb-2.5">Demographics & Current Status</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5">
              <div>
                <label className={headerLabel}>Patient</label>
                <select name="patientName" value={formData.patientName} onChange={handleInputChange} required className={selectStyle}>
                  <option value="">Select Patient</option>
                  {patients.map(p => (
                    <option key={p.id} value={p.name}>{p.name} ({p.bed})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className={headerLabel}>Current Bed</label>
                <input type="text" name="bed" value={formData.bed} readOnly placeholder="Auto mapped" className={`${inputStyle} bg-zinc-100 text-zinc-500`} />
              </div>
              <div>
                <label className={headerLabel}>Current Condition</label>
                <select name="currentCondition" value={formData.currentCondition} onChange={handleInputChange} className={selectStyle}>
                  <option value="Stable">Stable</option>
                  <option value="Critical but Stable">Critical but Stable</option>
                  <option value="Unstable">Unstable</option>
                  <option value="Guarded">Guarded</option>
                </select>
              </div>
              <div>
                <label className={headerLabel}>Operational Date</label>
                <input type="date" name="date" value={formData.date} onChange={handleInputChange} className={inputStyle} />
              </div>
            </div>
          </div>

          {/* DYNAMIC FORMS CONTEXT INJECTOR ROW */}
          {formType === "Transfer" ? (
            /* TRANSFER DYNAMIC COMPACT WORKSPACE MODULE */
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="bg-purple-50/30 p-3.5 rounded-xl border border-purple-100/70 grid grid-cols-1 md:grid-cols-4 gap-3.5">
                <div>
                  <label className={headerLabel}>Transfer To</label>
                  <select name="transferTo" value={formData.transferTo} onChange={handleInputChange} className={selectStyle}>
                    <option value="Other Hospital">Other Hospital</option>
                    <option value="General Ward (Step-down)">General Ward (Step-down)</option>
                    <option value="HDU (High Dependency Unit)">HDU (High Dependency)</option>
                    <option value="Cardiac Care Unit (CCU)">Cardiac Care Unit (CCU)</option>
                  </select>
                </div>
                <div>
                  <label className={headerLabel}>Transferred By</label>
                  <input type="text" name="transferredBy" value={formData.transferredBy} onChange={handleInputChange} className={inputStyle} />
                </div>
                <div>
                  <label className={headerLabel}>Received By Staff</label>
                  <input type="text" name="receivedBy" value={formData.receivedBy} onChange={handleInputChange} placeholder="Name of receiving staff" className={inputStyle} />
                </div>
                <div>
                  <label className={headerLabel}>Transfer Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} className={inputStyle} />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                <div className="md:col-span-2">
                  <label className={headerLabel}>Reason For Transfer</label>
                  <textarea name="reasonForTransfer" value={formData.reasonForTransfer} onChange={handleInputChange} placeholder="Detail clinical reasons or hospital capacity logistics..." className={areaStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={headerLabel}>Handover Notes</label>
                  <textarea name="handoverNotes" value={formData.handoverNotes} onChange={handleInputChange} placeholder="Enter relevant baseline updates or nursing handoff alerts..." className={areaStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={headerLabel}>Pending Treatment</label>
                  <textarea name="pendingTreatment" value={formData.pendingTreatment} onChange={handleInputChange} placeholder="Enter medication or treatment due in destination ward..." className={areaStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={headerLabel}>Pending Investigations</label>
                  <textarea name="pendingInvestigations" value={formData.pendingInvestigations} onChange={handleInputChange} placeholder="Enter diagnostic labs or radiology pending pipeline processing..." className={areaStyle} />
                </div>
              </div>
            </div>
          ) : (
            /* DISCHARGE DYNAMIC COMPACT WORKSPACE MODULE */
            <div className="space-y-4 animate-in fade-in-50 duration-150">
              <div className="bg-emerald-50/20 p-3.5 rounded-xl border border-emerald-100/70 grid grid-cols-1 md:grid-cols-4 gap-3.5">
                <div>
                  <label className={headerLabel}>Outcome Category</label>
                  <select name="outcome" value={formData.outcome} onChange={handleInputChange} className={selectStyle}>
                    <option value="Discharged Home">Discharged Home</option>
                    <option value="Transferred to Rehab">Transferred to Rehab</option>
                    <option value="LAMA (Left Against Medical Advice)">LAMA</option>
                    <option value="Absconded">Absconded</option>
                  </select>
                </div>
                <div>
                  <label className={headerLabel}>Attending Doctor</label>
                  <input type="text" name="doctor" value={formData.doctor} onChange={handleInputChange} className={inputStyle} />
                </div>
                <div>
                  <label className={headerLabel}>Discharge Time</label>
                  <input type="time" name="time" value={formData.time} onChange={handleInputChange} className={inputStyle} />
                </div>
                <div className="bg-transparent opacity-0 pointer-events-none hidden md:block"></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-3.5">
                <div className="md:col-span-2">
                  <label className={headerLabel}>Clinical Summary</label>
                  <textarea name="clinicalSummary" value={formData.clinicalSummary} onChange={handleInputChange} placeholder="Enter patient presentation baseline and ICU diagnostic history..." className={areaStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={headerLabel}>Treatment Summary</label>
                  <textarea name="treatmentSummary" value={formData.treatmentSummary} onChange={handleInputChange} placeholder="Detail clinical procedures and therapeutic care delivered..." className={areaStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={headerLabel}>Doctor Advice</label>
                  <textarea name="doctorAdvice" value={formData.doctorAdvice} onChange={handleInputChange} placeholder="Medications, restrictions, warning triggers, or activity caps..." className={areaStyle} />
                </div>
                <div className="md:col-span-2">
                  <label className={headerLabel}>Follow-up Instructions</label>
                  <textarea name="followUpInstructions" value={formData.followUpInstructions} onChange={handleInputChange} placeholder="OPD booking updates, timelines, or diagnostic parameters..." className={areaStyle} />
                </div>
              </div>
            </div>
          )}

          {/* ACTION BUTTON STRIP FOOTER */}
          <div className="flex items-center gap-2.5 justify-start border-t border-zinc-100 pt-4 mt-2 shrink-0">
            <button 
              type="submit" 
              className={`px-5 h-9 rounded-md text-white font-semibold shadow-sm transition ${
                formType === "Transfer" ? "bg-[#521785] hover:bg-[#43126e]" : "bg-emerald-600 hover:bg-emerald-700"
              }`}
            >
              {formType === "Transfer" ? "Complete Transfer Workflow" : "Record ICU Outcome"}
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

export default ICUTransferDischargeModal;
