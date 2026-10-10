import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { ipdService } from "../../services/ipdService";
import { icuService } from "../../services/icuService";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { toast } from "react-toastify";
import { getCurrentTime } from "../IPD/AddVitalsModal";

const inputClass = "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";
const selectClass = "w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800";
const textareaClass = "w-full min-h-[80px] px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300 resize-none";
const labelClass = "font-bold text-zinc-400 uppercase tracking-wide";

const proceduresList = [
  "Central Line Insertion (R. IJV)",
  "Central Line Insertion (L. IJV)",
  "Urinary Catheterization",
  "Arterial Line Insertion",
  "Endotracheal Intubation",
  "Chest Tube Insertion",
  "Lumbar Puncture",
];

const ICUProcedureModal = ({ isOpen, onClose, onSubmit, patientId, icuAdmissionId }) => {
  const [formData, setFormData] = useState({
    procedureName: "",
    procedureDate: getCurrentDate(),
    procedureTime: getCurrentTime(),
    preProcedureNotes: "",
    indication: "",
    details: "",
    complications: false,
    postProcedureCondition: "",
    patientId: patientId || "",
    icuAdmissionId: icuAdmissionId || "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");

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
      [name]: name === "complications" ? value === "Yes" : value,
    }));
    setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const resolvedPatientId = patientId || formData.patientId;
    const resolvedAdmissionId = icuAdmissionId || formData.icuAdmissionId;

    if (
      !resolvedPatientId ||
      !resolvedAdmissionId ||
      !formData.procedureName.trim() ||
      !formData.procedureDate ||
      !formData.procedureTime
    ) {
      setError("Patient, ICU admission, procedure name, date, and time are required.");
      return;
    }

    const payload = {
      patientId: resolvedPatientId,
      icuAdmissionId: resolvedAdmissionId,
      procedureName: formData.procedureName.trim(),
      procedureDate: formData.procedureDate,
      procedureTime: formData.procedureTime,
      preProcedureNotes: formData.preProcedureNotes.trim() || null,
      indication: formData.indication.trim() || null,
      details: formData.details.trim() || null,
      complications: formData.complications ? 1 : 0,
      postProcedureCondition: formData.postProcedureCondition.trim() || null,
    };

    setIsSubmitting(true);
    setError("");
    try {
      const response = await icuService.addProcedure(payload);
      toast.success(response?.message || "Procedure added successfully.");
      await onSubmit?.();
      setFormData({
        procedureName: "",
        procedureDate: getCurrentDate(),
        procedureTime: "",
        preProcedureNotes: "",
        indication: "",
        details: "",
        complications: false,
        postProcedureCondition: "",
        patientId:patientId || "",
        icuAdmissionId: icuAdmissionId || "",
      });
      onClose();
    } catch (err) {
      console.error("Failed to add ICU procedure:", err);
      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save procedure. Please try again.";
      setError(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-800">New Procedure</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Log new intensive care clinical procedures</p>
          </div>

          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(92vh-76px)]">

          {/* Patient Details */}
          <div className="grid grid-cols-1 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Patient</label>
              <select
                name="patientId"
                value={formData.patientId}
                onChange={handleChange}
                required
                disabled={Boolean(patientId) || patientsLoading || Boolean(patientsError)}
                className={`${selectClass} ${patientId
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

          {/* Date & Time */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Date <span className="text-sm pl-1 text-red-500">*</span></label>
              <input type="date" name="procedureDate" value={formData.procedureDate} onChange={handleChange} required className={inputClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Time <span className="text-sm pl-1 text-red-500">*</span></label>
              <input type="time" name="procedureTime" value={formData.procedureTime} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Procedure <span className="text-sm pl-1 text-red-500">*</span></label>
            <select
              name="procedureName"
              value={formData.procedureName}
              onChange={handleChange}
              required
              className={selectClass}
            >
              <option value="">Select Procedure</option>
              {proceduresList.map((procedure) => (
                <option key={procedure} value={procedure}>{procedure}</option>
              ))}
            </select>
          </div>

          {/* Indication & Details */}
          <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
            <div className="flex flex-col gap-1.5 mb-4">
              <label className={labelClass}>Pre-Procedure Notes</label>
              <textarea name="preProcedureNotes" value={formData.preProcedureNotes} onChange={handleChange} placeholder="Enter pre-procedure notes..." className={textareaClass} />
            </div>
            <div className="flex flex-col gap-1.5 mb-4">
              <label className={labelClass}>Indication</label>
              <textarea name="indication" value={formData.indication} onChange={handleChange} placeholder="Enter indications..." className={textareaClass} />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Procedure Details</label>
              <textarea name="details" value={formData.details} onChange={handleChange} placeholder="Enter description details..." className={textareaClass} />
            </div>
          </div>

          {/* Complications & Post-condition */}
          <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
            <div className="flex flex-col gap-1.5 mb-4">
              <label className={labelClass}>Complications</label>
              <div className="flex items-center gap-4 mt-1">
                <label className="flex items-center gap-1.5 text-zinc-700 cursor-pointer">
                  <input type="radio" name="complications" value="No" checked={!formData.complications} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
                  No
                </label>
                <label className="flex items-center gap-1.5 text-zinc-700 cursor-pointer">
                  <input type="radio" name="complications" value="Yes" checked={formData.complications} onChange={handleChange} className="w-4 h-4 accent-blue-600" />
                  Yes
                </label>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Post-Procedure Condition</label>
              <textarea name="postProcedureCondition" value={formData.postProcedureCondition} onChange={handleChange} placeholder="Enter condition status..." className={textareaClass} />
            </div>
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          {/* Actions */}
          <div className="flex items-center gap-2 justify-start mt-4 border-t border-zinc-100 pt-4">
            <button type="submit" disabled={isSubmitting} className="bg-[#0052cc] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm disabled:opacity-60">
              {isSubmitting ? "Saving..." : "Save Procedure"}
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

export default ICUProcedureModal;
