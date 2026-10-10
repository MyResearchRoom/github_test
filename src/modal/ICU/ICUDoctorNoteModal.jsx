import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { getCurrentTime } from "../../utils/getCurrentTime";
import { ipdService } from "../../services/ipdService";
import { icuService } from "../../services/icuService";
import { toast } from "react-toastify";

const inputClass =
        "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

    const selectClass =
        "w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800";

    const textareaClass =
        "w-full min-h-[80px] px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300 resize-none";

    const labelClass =
        "font-bold text-zinc-400 uppercase tracking-wide";


const getInitialFormState = (patientId, icuAdmissionId) => ({
    patient: "",
    patientId: patientId || "",
    icuAdmissionId: icuAdmissionId || null,
    noteDate: getCurrentDate(),
    noteTime: getCurrentTime(),
    chiefComplaint: "",
    clinicalFindings: "",
    diagnosis: "",
    treatmentPlan: "",
    advice: "",
    notes: "",
});

const DoctorNoteModal = ({
    isOpen,
    onClose,
    onSuccess,
    patientId,
    icuAdmissionId,
}) => {
    const [formData, setFormData] = useState(
        getInitialFormState(patientId, icuAdmissionId)
    );
    console.log("patientId",patientId);


    const [error, setError] = useState("");
    const [submitting, setSubmitting] = useState(false);

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
                    const admittedPatients = response?.data;

                    if (active) {
                        setPatients(admittedPatients);

                        const selectedPatient = admittedPatients.find(
                            (item) => item.patientId === patientId
                        );

                        console.log("Selected Patient:", selectedPatient);

                        if (selectedPatient) {
                            setFormData((previous) => ({
                                ...previous,
                                patient: selectedPatient.patientName,
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
        if (isOpen) {
            setFormData(
                getInitialFormState(
                    patientId,
                    icuAdmissionId,
                )
            );
            setError("");
        }
    }, [isOpen, patientId, icuAdmissionId]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (error) {
            setError("");
        }
    };

    const handlePatientChange = (e) => {
        const selectedPatient = patients.find(
            (item) => String(item.patientId) === String(e.target.value)
        );
        if(!selectedPatient) {
            setError("Selected patient not found.");
            return;
        }

        setFormData((prev) => ({
            ...prev,
            patient: selectedPatient.patientName,
            patientId: e.target.value,
            icuAdmissionId: selectedPatient.icuAdmissionId || null,
        }));

        setError("");
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError("");

        if (
            !formData.patientId ||
            !formData.icuAdmissionId ||
            !formData.noteDate ||
            !formData.noteTime 
        ) {
            setError("Please fill all required fields.");
            return;
        }

        const noteFields = [
            formData.chiefComplaint,
            formData.clinicalFindings,
            formData.diagnosis,
            formData.treatmentPlan,
            formData.advice,
            formData.notes,
        ];

        if (!noteFields.some((field) => field.trim())) {
            setError("Please provide at least one doctor note field.");
            return;
        }

        const payload = {
            icuAdmissionId: formData.icuAdmissionId || icuAdmissionId,
            patientId: formData.patientId || patientId,
            noteDate: formData.noteDate,
            noteTime: formData.noteTime,
            chiefComplaint: formData.chiefComplaint.trim(),
            clinicalFindings: formData.clinicalFindings.trim(),
            advice: formData.advice.trim(),
            diagnosis: formData.diagnosis.trim(),
            treatmentPlan: formData.treatmentPlan.trim(),
            notes: formData.notes.trim(),
        };

        setSubmitting(true);
        try {
            const response = await icuService.addDoctorNote(payload);
            toast.success(response.message ||"Doctor note saved successfully.");
            await onSuccess?.(response);
            setFormData(getInitialFormState(patientId, icuAdmissionId));
            setError("");
            onClose();
        } catch (err) {
            console.error("Failed to add ICU doctor note:", err);
            toast.error(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to save doctor note."
            );
            setError(
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Failed to save doctor note."
            );
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">

                {/* HEADER */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <div>
                        <h2 className="text-base font-bold text-zinc-800">
                            New Doctor Note
                        </h2>
                        <p className="text-xs text-zinc-400 mt-0.5">
                            Record clinical observations and treatment notes
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="text-zinc-400 hover:text-zinc-600 transition p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* FORM */}
                <form
                    onSubmit={handleFormSubmit}
                    className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(92vh-76px)]"
                >
                    {/* PATIENT + BED */}
                    <div className="grid grid-cols-1 gap-4">

                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>
                                Patient
                            </label>
                            <select
                                    name="patientId"
                                    value={formData.patientId}
                                    onChange={handlePatientChange}
                                    required
                                    disabled={patientId}
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
                                                : "Select Patient"}
                                    </option>

                                    {patients.map((patient) => (
                                        <option
                                            key={patient.patientId}
                                            value={patient.patientId}
                                        >
                                            {patient.patientName} ({patient.patientUniqueId})
                                        </option>
                                    ))}
                            </select>                   
                        </div>


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
                            />
                        </div>
                    </div>  

                    {/* TREATMENT */}
                    <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                            Treatment & Advice
                        </p>

                        {/* TREATMENT PLAN */}
                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className={labelClass}>
                                Treatment Plan
                            </label>

                            <textarea
                                name="treatmentPlan"
                                value={formData.treatmentPlan}
                                onChange={handleChange}
                                placeholder="Enter treatment plan, medications, procedures..."
                                className={textareaClass}
                            />
                        </div>

                        {/* DOCTOR ADVICE */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>
                                Doctor Advice
                            </label>

                            <textarea
                                name="advice"
                                value={formData.advice}
                                onChange={handleChange}
                                placeholder="Enter monitoring instructions and doctor advice..."
                                className={textareaClass}
                            />
                        </div>
                    </div>

                     {/* CLINICAL INFORMATION */}
                    <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
                        <p className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">
                            Clinical Information
                        </p>

                        {/* CHIEF COMPLAINT */}
                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className={labelClass}>
                                Chief Complaint / Current Condition
                            </label>

                            <textarea
                                name="chiefComplaint"
                                value={formData.chiefComplaint}
                                onChange={handleChange}
                                placeholder="Enter chief complaint or current patient condition..."
                                className={textareaClass}
                            />
                        </div>

                        {/* CLINICAL FINDINGS */}
                        <div className="flex flex-col gap-1.5 mb-4">
                            <label className={labelClass}>
                                Clinical Findings
                            </label>

                            <textarea
                                name="clinicalFindings"
                                value={formData.clinicalFindings}
                                onChange={handleChange}
                                placeholder="Enter clinical findings, examination observations, vitals, investigations..."
                                className={textareaClass}
                            />
                        </div>

                        {/* DIAGNOSIS */}
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>
                                Diagnosis
                            </label>

                            <textarea
                                name="diagnosis"
                                value={formData.diagnosis}
                                onChange={handleChange}
                                placeholder="Enter diagnosis..."
                                className={textareaClass}
                            />
                        </div>
                    </div>

                    {/* NOTES */}
                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                            Notes
                        </label>

                        <textarea
                            name="notes"
                            value={formData.notes}
                            onChange={handleChange}
                            placeholder="Enter additional notes..."
                            className={textareaClass}
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
                            disabled={submitting}
                            className="bg-[#0052cc] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm"
                        >
                            {submitting ? "Saving..." : "Save Note"}
                        </button>

                        <button
                            type="button"
                            onClick={onClose}
                            className="bg-white border border-zinc-200 px-4 h-9 rounded-md text-zinc-700 font-semibold hover:bg-zinc-50 transition"
                        >
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default DoctorNoteModal;