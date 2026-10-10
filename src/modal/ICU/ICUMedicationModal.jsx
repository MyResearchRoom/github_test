import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ipdService } from "../../services/ipdService";
import { icuService } from "../../services/icuService";
import { toast } from "react-toastify";

const MedicationModal = ({ isOpen, onClose, onSave,patientId,icuAdmissionId }) => {
  const [formData, setFormData] = useState({
    medicineName: "",
    dose: "",
    route: "IV",
    frequency: "Once",
    startDate: "",
    endDate: "",
    instructions: "",
    icuAdmissionId :icuAdmissionId,
    patientId:patientId,
  });

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
          if (!isOpen) return undefined;
  
              let active = true;
      
              const loadPatients = async () => {
                  setPatientsLoading(true);
                  setPatientsError("");
      
                  try {
                      const response = await ipdService.getPatientsWithAccount();
                      const admittedPatients = Array.isArray(response?.data)
                        ? response.data
                        : [];
  
                      if (active) {
                          setPatients(admittedPatients);
  
                          const selectedPatient = admittedPatients.find(
                              (item) => item.patientId === patientId
                          );
  
                          if (selectedPatient) {
                              setFormData((previous) => ({
                                  ...previous,
                                  patientId: selectedPatient.patientId,
                                  icuAdmissionId: selectedPatient.icuAdmissionId || null,
                              }));
                          }
                      }
                  } catch (err) {
                      console.error("Failed to load admitted patients:", err);
                      if (active) {
                          setPatients([]);
                          setPatientsError("Failed to load patient list.");
                      }
                  } finally {
                      if (active) {
                          setPatientsLoading(false);
                      }
                  }
              };
      
              loadPatients();
      
              return () => {
                  active = false;
              };
  }, [isOpen, patientId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "patientId") {
      const selectedPatient = patients.find(
            (item) => String(item.patientId) === String(e.target.value)
      );

      if (!selectedPatient) {
        setError("Selected patient could not be found.");
        return;
      }

      setFormData((prev) => ({
        ...prev,
        patientId: selectedPatient.patientId,
        icuAdmissionId: selectedPatient.icuAdmissionId || "",
      }));
      setError("");
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError("");
  };

  const resetForm = () => {
    setFormData({
      medicineName: "",
      dose: "",
      route: "IV",
      frequency: "Once",
      startDate: "",
      endDate: "",
      instructions: "",
      icuAdmissionId :icuAdmissionId,
      patientId:patientId,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const resolvedPatientId = patientId || formData.patientId;
    const resolvedAdmissionId = icuAdmissionId || formData.icuAdmissionId;

    if (
      !resolvedPatientId ||
      !resolvedAdmissionId ||
      !formData.medicineName.trim() ||
      !formData.dose.trim() ||
      !formData.startDate
    ) {
      setError("Patient, ICU admission, medicine, dose, and start date are required.");
      return;
    }

    const payload = {
      ...formData,
      patientId: resolvedPatientId,
      icuAdmissionId: resolvedAdmissionId,
      medicineName: formData.medicineName.trim(),
      dose: formData.dose.trim(),
      route: formData.route ||null,
      frequency: formData.frequency || null,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
      instructions: formData.instructions.trim(),
    };

    setIsSubmitting(true);
    try {
      const response = await icuService.addMedications(payload);
      toast.success(response.message || "ICU medication added successfully.");
      await onSave?.(response);
      resetForm();
      onClose();
    } catch (err) {
      console.error("Failed to add ICU medication:", err);
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save medication. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[92vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-800">New Medication</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Add medication schedule for the patient</p>
          </div>

          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(92vh-76px)]"
        >
          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Patient</label>

              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                disabled={patientId}
                className={`w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 ${
                                        patientId
                                            ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                                            : "bg-white"
                                    }`}
              >
                <option value="">
                  {patientsLoading
                    ? "Loading patients..."
                    : patientsError
                      ? "Unable to load patients"
                      : "Select Patient"
                  }
                </option>
                {patients.map((patient) => (
                  <option key={patient.patientId} value={patient.patientId}>
                    {patient.patientName} ({patient.patientUniqueId})
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Medicine Name</label>

            <input
              type="text"
              name="medicineName"
              value={formData.medicineName}
              onChange={handleChange}
              placeholder="Enter medicine name"
              className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 placeholder:text-zinc-300"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Dose</label>

              <input
                type="text"
                name="dose"
                value={formData.dose}
                onChange={handleChange}
                placeholder="e.g. 1g"
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 placeholder:text-zinc-300"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Route</label>

              <select
                name="route"
                value={formData.route}
                onChange={handleChange}
                className="w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 bg-white"
              >
                <option value="IV">IV</option>
                <option value="IM">IM</option>
                <option value="SC">SC</option>
                <option value="Oral">Oral</option>
                <option value="NG">NG</option>
                <option value="PR">PR</option>
                <option value="Topical">Topical</option>
                <option value="Inhaled">Inhaled</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Frequency</label>

            <select
              name="frequency"
              value={formData.frequency}
              onChange={handleChange}
              className="w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 bg-white"
            >
              <option value="Once">Once</option>
              <option value="Once daily">Once daily</option>
              <option value="Twice daily">Twice daily</option>
              <option value="8 hourly">8 hourly</option>
              <option value="6 hourly">6 hourly</option>
              <option value="4 hourly">4 hourly</option>
              <option value="12 hourly">12 hourly</option>
              <option value="Continuous">Continuous</option>
              <option value="As needed">As needed</option>
            </select>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">Start Date</label>

              <input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700"
              />
            </div>

            <div>
              <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">
                End Date <span className="normal-case font-normal text-zinc-300">(optional)</span>
              </label>

              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                min={formData.startDate || undefined}
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700"
              />
            </div>
          </div>

          <div>
            <label className="block mb-1.5 font-bold text-zinc-400 uppercase tracking-wide">
              Instructions <span className="normal-case font-normal text-zinc-300">(optional)</span>
            </label>

            <textarea
              name="instructions"
              value={formData.instructions}
              onChange={handleChange}
              rows={3}
              placeholder="e.g. Infuse over 30 minutes. Monitor for adverse reactions."
              className="w-full px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-[#0052cc] focus:ring-1 focus:ring-[#0052cc] text-sm text-zinc-700 placeholder:text-zinc-300 resize-none"
            />
          </div>

          <div className="flex items-center gap-2 justify-start mt-4 border-t border-zinc-100 pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-[#0052cc] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
            {isSubmitting ? "Saving..." : "Add Medication"}
            </button>

            <button type="button" onClick={onClose} disabled={isSubmitting} className="bg-white border border-zinc-200 px-4 h-9 rounded-md text-zinc-700 font-semibold hover:bg-zinc-50 transition disabled:opacity-60">
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicationModal;