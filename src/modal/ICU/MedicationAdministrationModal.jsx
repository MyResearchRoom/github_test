import React, { useState } from "react";
import { X } from "lucide-react";

const MedicationAdministrationModal = ({ isOpen, onClose, medication, onSubmit }) => {
  const [formData, setFormData] = useState({
    actualAdministrationTime: "",
    administeredBy: "",
    remarks: "",
    action: "Given",
  });

  if (!isOpen || !medication) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.actualAdministrationTime || !formData.administeredBy) {
      return;
    }

    onSubmit({
      ...medication,
      ...formData,
      status: formData.action,
    });

    setFormData({
      actualAdministrationTime: "",
      administeredBy: "",
      remarks: "",
      action: "Given",
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-800">Medication Administration</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Record medication administration details</p>
          </div>

          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Medicine</label>
              <input type="text" value={medication.medicine} readOnly className="w-full h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50 outline-none text-sm text-zinc-600" />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Dose</label>
              <input type="text" value={medication.dose} readOnly className="w-full h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50 outline-none text-sm text-zinc-600" />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Route</label>
              <input type="text" value={medication.route} readOnly className="w-full h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50 outline-none text-sm text-zinc-600" />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Scheduled</label>
              <input type="text" value={medication.scheduledTime} readOnly className="w-full h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50 outline-none text-sm text-zinc-600" />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Patient</label>
            <input type="text" value={medication.patient} readOnly className="w-full h-9 px-3 rounded-md border border-zinc-200 bg-zinc-50 outline-none text-sm text-zinc-600" />
          </div>

          <div className="border-t border-zinc-100 pt-4">
            <h3 className="text-xs font-bold text-zinc-700 uppercase tracking-wide mb-3">Administration Details</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Actual Administration Time</label>
                <input type="time" name="actualAdministrationTime" value={formData.actualAdministrationTime} onChange={handleChange} className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700" />
              </div>

              <div>
                <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Administered By</label>
                <select name="administeredBy" value={formData.administeredBy} onChange={handleChange} className="w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 bg-white">
                  <option value="">Select Staff</option>
                  <option value="Staff Nurse Meena Rao">Staff Nurse Meena Rao</option>
                  <option value="Staff Nurse Preethi K">Staff Nurse Preethi K</option>
                  <option value="Staff Nurse Anand Nair">Staff Nurse Anand Nair</option>
                  <option value="Staff Nurse Kavita Joshi">Staff Nurse Kavita Joshi</option>
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Remarks</label>
            <textarea name="remarks" value={formData.remarks} onChange={handleChange} rows="3" placeholder="Enter remarks..." className="w-full px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 placeholder:text-zinc-300 resize-none" />
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Administration Status</label>

            <div className="grid grid-cols-3 gap-2">
              <button type="button" onClick={() => setFormData((prev) => ({ ...prev, action: "Given" }))} className={`h-9 rounded-md border font-semibold transition ${formData.action === "Given" ? "bg-emerald-50 border-emerald-300 text-emerald-700" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>
                Give Medication
              </button>

              <button type="button" onClick={() => setFormData((prev) => ({ ...prev, action: "Held" }))} className={`h-9 rounded-md border font-semibold transition ${formData.action === "Held" ? "bg-amber-50 border-amber-300 text-amber-700" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>
                Hold
              </button>

              <button type="button" onClick={() => setFormData((prev) => ({ ...prev, action: "Refused" }))} className={`h-9 rounded-md border font-semibold transition ${formData.action === "Refused" ? "bg-red-50 border-red-300 text-red-700" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50"}`}>
                Refused
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 justify-start mt-2 border-t border-zinc-100 pt-4">
            <button type="submit" className="bg-[#0052cc] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm">
              Save Administration
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

export default MedicationAdministrationModal;