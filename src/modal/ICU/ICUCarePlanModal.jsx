import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ipdService } from "../../services/ipdService";
import { icuService } from "../../services/icuService";
import { toast } from "react-toastify";
import { getCurrentDate } from "../../utils/getCurrentDate";

const frequencyOptions = ["Every shift", "Hourly", "2 hourly", "4 hourly", "Daily", "Once"];

const ICUCarePlanModal = ({ isOpen, onClose, onSubmit, patientId, icuAdmissionId }) => {
  const [formData, setFormData] = useState({
    patientId: patientId || "",
    icuAdmissionId: icuAdmissionId || null,
    bed: "",
    problem: "",
    goal: "",
    intervention: "",
    frequency: "Every shift",
    assignedNurseId: "",
    startDate: getCurrentDate(),
    reviewDate: "",
  });

  const [patients, setPatients] = useState([]);
  const [nurses, setNurses] = useState([]);
  const [error, setError] = useState("");
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");
  const [nursesLoading, setNursesLoading] = useState(true);
  const [nursesError, setNursesError] = useState("");
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

  useEffect(() => {
    if (!isOpen) return undefined;

    let active = true;

    const loadNurses = async () => {
      setNursesLoading(true);
      setNursesError("");

      try {
        const response = await icuService.getNurseData();
        const nurseList = response.data || [];
        console.log("nurseList", nurseList);
        

        if (active) {
          setNurses(nurseList);
        }
      } catch (err) {
        console.error("Failed to load ICU nurses:", err);
        if (active) {
          setNurses([]);
          setNursesError("Failed to load nurses.");
        }
      } finally {
        if (active) {
          setNursesLoading(false);
        }
      }
    };

    loadNurses();

    return () => {
      active = false;
    };
  }, [isOpen]);

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

    setFormData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const resolvedPatientId = patientId || formData.patientId;
    const resolvedAdmissionId = icuAdmissionId || formData.icuAdmissionId;

    if (
      !resolvedPatientId ||
      !resolvedAdmissionId ||
      !formData.problem.trim() ||
      !formData.goal.trim() ||
      !formData.assignedNurseId ||
      !formData.startDate
    ) {
      setError("Please complete all required fields, including the ICU admission.");
      return;
    }

    const payload = {
      icuAdmissionId: resolvedAdmissionId,
      patientId: resolvedPatientId,
      problem: formData.problem.trim(),
      goal: formData.goal.trim(),
      intervention: formData.intervention.trim(),
      frequency: formData.frequency,
      assignedNurseId: formData.assignedNurseId,
      startDate: formData.startDate,
      reviewDate: formData.reviewDate || null,
    };

    setIsSubmitting(true);
    try {
      const response = await icuService.addCarePlans(payload);
      toast.success(response?.message || "ICU care plan added successfully.");
      await onSubmit?.(response);
      setFormData({
            patientId: patientId || "",
            icuAdmissionId: icuAdmissionId || null,
            bed: "",
            problem: "",
            goal: "",
            intervention: "",
            frequency: "Every shift",
            assignedNurseId: "",
            startDate: "2026-09-15",
            reviewDate: "",
      });
      onClose();
    } catch (err) {
      console.error("Failed to add ICU care plan:", err);
      setError(
            err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to save care plan. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass = "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";
  const selectClass = "w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800";
  const labelClass = "font-bold text-zinc-400 uppercase tracking-wide";

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-800">New Care Plan</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Define a nursing goal and intervention plan for this patient</p>
          </div>

          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(92vh-76px)]">
          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Patient</label>
              <select 
                name="patientId" 
                value={formData.patientId} 
                onChange={handleChange} 
                required 
                disabled={Boolean(patientId) || patientsLoading || Boolean(patientsError)}
                className={`${selectClass} ${
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

          <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Problem & Goal</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Problem</label>
                <input type="text" name="problem" value={formData.problem} onChange={handleChange} placeholder="e.g. Risk of Infection" className={inputClass} />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Goal</label>
                <input type="text" name="goal" value={formData.goal} onChange={handleChange} placeholder="Expected outcome" className={inputClass} />
              </div>
            </div>
          </div>

          <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Care Plan Details</p>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className={labelClass}>Intervention</label>
              <input type="text" name="intervention" value={formData.intervention} onChange={handleChange} placeholder="Nursing actions" className={inputClass} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Frequency</label>
                <select name="frequency" value={formData.frequency} onChange={handleChange} className={selectClass}>
                  {frequencyOptions.map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Responsible Nurse</label>
                <select
                  name="assignedNurseId"
                  value={formData.assignedNurseId}
                  onChange={handleChange}
                  required
                  disabled={nursesLoading || Boolean(nursesError)}
                  className={selectClass}
                >
                  <option value="">
                    {nursesLoading
                      ? "Loading nurses..."
                      : nursesError
                        ? nursesError
                        : "Select Nurse"}
                  </option>
                  {nurses.map((nurse) => {
                    const nurseId = nurse.nurseId ?? nurse.id ?? nurse._id;
                    const nurseName =
                      nurse.fullName || nurse.nurseName || nurse.name;

                    if (nurseId == null || !nurseName) return null;

                    return (
                      <option key={nurseId} value={nurseId}>
                        {nurseName}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Start Date</label>
              <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Review Date</label>
              <input type="date" name="reviewDate" value={formData.reviewDate} onChange={handleChange} className={inputClass} />
            </div>
          </div>

          <div className="flex items-center gap-2 justify-start mt-4 border-t border-zinc-100 pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-[#521785] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#45126f] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed">
              {isSubmitting ? "Saving..." : "Add Care Plan"}
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

export default ICUCarePlanModal;