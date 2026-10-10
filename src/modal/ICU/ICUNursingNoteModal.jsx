import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { getCurrentDate } from "../../utils/getCurrentDate";
import { getCurrentTime } from "../../utils/getCurrentTime";
import { ipdService } from "../../services/ipdService";
import { icuService } from "../../services/icuService";

const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const selectClass =
  "w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800";

const textareaClass =
  "w-full min-h-[80px] px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300 resize-none";

const labelClass =
  "font-bold text-zinc-400 uppercase tracking-wide";

const getInitialFormState = (patientId = "", icuAdmissionId = null) => ({
  patient: "",
  patientId: patientId || "",
  icuAdmissionId: icuAdmissionId || null,
  noteDate: getCurrentDate(),
  noteTime: getCurrentTime(),
  patientCondition: "",
  observations: "",
  nursingIntervention: "",
  patientResponse: "",
  additionalNotes: "",
});

const NursingNoteModal = ({
  isOpen,
  onClose,
  onSuccess,
  patients: externalPatients = [],
  currentPatient = null,
  isDetailsPage = false,
  patientId = "",
  icuAdmissionId = "",
}) => {
  const [formData, setFormData] = useState(
    getInitialFormState(patientId, icuAdmissionId)
  );

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(false);
  const [patientsError, setPatientsError] = useState("");


  useEffect(() => {
    if (!isOpen) return undefined;

    let active = true;

    const loadPatients = async () => {
      setPatientsLoading(true);
      setPatientsError("");

      try {
        const response = await ipdService.getPatientsWithAccount();

        const admittedPatients = response?.data || [];

        if (!active) return;

        setPatients(admittedPatients);

        /*
         * If modal is opened from patient details page,
         * find and preselect the current patient.
         */
        if (isDetailsPage && patientId) {
          const selectedPatient = admittedPatients.find(
            (item) =>
              String(item.patientId) === String(patientId)
          );

          if (selectedPatient) {
            setFormData((previous) => ({
              ...previous,
              patient:
                selectedPatient.patientName || "",
              patientId:
                selectedPatient.patientId || patientId,
              icuAdmissionId:
                selectedPatient.icuAdmissionId ||
                icuAdmissionId ||
                null,
            }));
          }
        }
      } catch (err) {
        console.error(
          "Failed to load admitted patients:",
          err
        );

        if (active) {
          setPatients([]);
          setPatientsError(
            "Failed to load patient list."
          );
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
  }, [
    isOpen,
    isDetailsPage,
    patientId,
    icuAdmissionId,
  ]);

  useEffect(() => {
    if (!isOpen) return;

    setFormData(
      getInitialFormState(
        patientId,
        icuAdmissionId
      )
    );

    setError("");
    setIsSaving(false);
  }, [
    isOpen,
    patientId,
    icuAdmissionId,
  ]);

  useEffect(() => {
    if (
      !isOpen ||
      !isDetailsPage ||
      !currentPatient
    ) {
      return;
    }

    setFormData((previous) => ({
      ...previous,
      patient:
        currentPatient?.name ||
        currentPatient?.patientName ||
        "",
      patientId:
        currentPatient?.patientId ||
        patientId ||
        "",
      icuAdmissionId:
        currentPatient?.icuAdmissionId ||
        icuAdmissionId ||
        null,
    }));
  }, [
    isOpen,
    isDetailsPage,
    currentPatient,
    patientId,
    icuAdmissionId,
  ]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    if (error) {
      setError("");
    }
  };

  /*
   * Handle patient selection.
   */
  const handlePatientChange = (e) => {
    const selectedPatientId = e.target.value;

    const selectedPatient = patients.find(
      (item) =>
        String(item.patientId) ===
        String(selectedPatientId)
    );

    if (!selectedPatient) {
      setFormData((previous) => ({
        ...previous,
        patient: "",
        patientId: "",
        icuAdmissionId: null,
      }));

      return;
    }

    setFormData((previous) => ({
      ...previous,
      patient:
        selectedPatient.patientName || "",
      patientId:
        selectedPatient.patientId || "",
      icuAdmissionId:
        selectedPatient.icuAdmissionId || null,
    }));

    setError("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (isSaving) return;

    setError("");

    if (!formData.patientId) {
      setError("Please select a patient.");
      return;
    }

    if (!formData.icuAdmissionId) {
      setError(
        "ICU admission information is missing for this patient."
      );
      return;
    }

    if (!formData.noteDate) {
      setError("Please select note date.");
      return;
    }

    if (!formData.noteTime) {
      setError("Please select note time.");
      return;
    }

    const hasNursingDetails = [
      formData.patientCondition,
      formData.observations,
      formData.nursingIntervention,
      formData.patientResponse,
      formData.additionalNotes,
    ].some((value) => value.trim());

    if (!hasNursingDetails) {
      setError("Please enter at least one nursing note detail.");
      return;
    }

    try {
      setIsSaving(true);

      const payload = {
        icuAdmissionId:
          formData.icuAdmissionId,
        patientId:
          formData.patientId,
        noteDate:
          formData.noteDate,
        noteTime:
          formData.noteTime,
        patientCondition:
          formData.patientCondition.trim(),
        observations:
          formData.observations.trim(),
        nursingIntervention:
          formData.nursingIntervention.trim(),
        patientResponse:
          formData.patientResponse.trim(),
        additionalNotes:
          formData.additionalNotes.trim(),
      };

      console.log(
        "Nursing Note Payload:",
        payload
      );

      const response =
        await icuService.addNursingNote(payload);

      if (!response?.success) {
        throw new Error(
          response?.message ||
            "Failed to save nursing note."
        );
      }

      toast.success(
        response?.message ||
          "Nursing note added successfully."
      );

      /*
       * Notify parent page so it can refresh
       * the nursing note list.
       */
      if (onSuccess) {
        await onSuccess(response);
      }

      /*
       * Close modal after successful save.
       */
      onClose();
    } catch (err) {
      console.error(
        "Error saving nursing note:",
        err
      );

      const message =
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save nursing note.";

      setError(message);

      toast.error(message);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">

        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-800">
              New Nursing Note
            </h2>

            <p className="text-xs text-zinc-400 mt-0.5">
              Record patient care observations and nursing interventions
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="text-zinc-400 hover:text-zinc-600 transition p-1 disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleFormSubmit}
          className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(92vh-76px)]"
        >
          {/* PATIENT */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Patient
            </label>

            <select
              name="patientId"
              value={formData.patientId}
              onChange={handlePatientChange}
              required
              disabled={
                isDetailsPage ||
                patientsLoading ||
                isSaving
              }
              className={`${selectClass} ${
                isDetailsPage
                  ? "bg-gray-100 text-gray-500 cursor-not-allowed"
                  : "bg-white"
              }`}
            >
              <option value="">
                {patientsLoading
                  ? "Loading patients..."
                  : patientsError
                  ? "Unable to load patients"
                  : "Select Patient"}
              </option>

              {patients.map((patient) => (
                <option
                  key={patient.patientId}
                  value={patient.patientId}
                >
                  {patient.patientName} (
                  {patient.patientUniqueId})
                </option>
              ))}
            </select>

            {patientsError && (
              <p className="text-[11px] text-red-500">
                {patientsError}
              </p>
            )}
          </div>

          {/* DATE + TIME */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Date
              </label>

              <input
                type="date"
                name="noteDate"
                value={formData.noteDate}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Time
              </label>

              <input
                type="time"
                name="noteTime"
                value={formData.noteTime}
                onChange={handleChange}
                className={inputClass}
                required
                disabled={isSaving}
              />
            </div>
          </div>

          {/* PATIENT CARE */}
          <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Patient Care
            </p>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className={labelClass}>
                Patient Condition
              </label>

              <textarea
                name="patientCondition"
                value={formData.patientCondition}
                onChange={handleChange}
                placeholder="Enter patient's current condition..."
                className={textareaClass}
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Observations
              </label>

              <textarea
                name="observations"
                value={formData.observations}
                onChange={handleChange}
                placeholder="Enter observations, urine output, IV sites, catheter status, etc..."
                className={textareaClass}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* NURSING CARE */}
          <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
            <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
              Nursing Care
            </p>

            <div className="flex flex-col gap-1.5 mb-4">
              <label className={labelClass}>
                Nursing Intervention
              </label>

              <textarea
                name="nursingIntervention"
                value={formData.nursingIntervention}
                onChange={handleChange}
                placeholder="Enter nursing interventions and care provided..."
                className={textareaClass}
                disabled={isSaving}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Patient Response
              </label>

              <textarea
                name="patientResponse"
                value={formData.patientResponse}
                onChange={handleChange}
                placeholder="Enter patient's response after intervention..."
                className={textareaClass}
                disabled={isSaving}
              />
            </div>
          </div>

          {/* ADDITIONAL NOTES */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Additional Notes
            </label>

            <textarea
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              placeholder="Enter additional nursing notes or instructions..."
              className={textareaClass}
              disabled={isSaving}
            />
          </div>

          {/* ERROR */}
          {error && (
            <p className="text-xs text-red-500">
              {error}
            </p>
          )}

          {/* ACTIONS */}
          <div className="flex items-center gap-2 justify-start mt-4 border-t border-zinc-100 pt-4">
            <button
              type="submit"
              disabled={isSaving}
              className="bg-[#0052cc] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {isSaving
                ? "Saving..."
                : "Save Nursing Note"}
            </button>

            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="bg-white border border-zinc-200 px-4 h-9 rounded-md text-zinc-700 font-semibold hover:bg-zinc-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NursingNoteModal;