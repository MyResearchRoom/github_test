import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

import {getCurrentDate} from "../../utils/getCurrentDate";
import { getCurrentTime } from "../../utils/getCurrentTime";

const parseNumbers = (value) =>
    (String(value).match(/\d+(\.\d+)?/g) || []).map(Number);

const getInitialFormState = (patient = "") => ({
    patient,
    recordedAtDate: getCurrentDate(),
    recordedAtTime: getCurrentTime(),
    temperature: "",
    spo2: "",
    pulse: "",
    respiratoryRate: "",
    bp: "",
    bsl: "",
    insulin: "",
    notes: "",
});

const ICURecordVitalModal = ({
    isOpen,
    onClose,
    onSubmit,
    patients = [],
    isDetailsPage = false,
    currentPatient = null,
}) => {
    const [formData, setFormData] = useState(getInitialFormState());
    const [error, setError] = useState("");

    const getCurrentPatientName = () => {
        if (!currentPatient) return "";

        if (typeof currentPatient === "string") {
            return currentPatient;
        }

        return (
            currentPatient.patient ||
            currentPatient.patientName ||
            currentPatient.name ||
            ""
        );
    };

    useEffect(() => {
        if (isOpen) {
            const patientName = isDetailsPage ? getCurrentPatientName() : "";

            setFormData(getInitialFormState(patientName));
            setError("");
        }
    }, [isOpen, isDetailsPage, currentPatient]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const resetForm = () => {
        const patientName = isDetailsPage ? getCurrentPatientName() : "";

        setFormData(getInitialFormState(patientName));
        setError("");
    };

    const handleClose = () => {
        resetForm();
        onClose();
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();
        setError("");

        const problems = [];

        if (!formData.patient) problems.push("Patient");
        if (!formData.recordedAtDate) problems.push("Date");
        if (!formData.recordedAtTime) problems.push("Time");
        if (!formData.temperature) problems.push("Temperature");
        if (!formData.spo2) problems.push("SpO2");
        if (!formData.pulse) problems.push("Pulse");
        if (!formData.respiratoryRate) problems.push("RR");
        if (!formData.bsl) problems.push("BSL");
        if (!formData.insulin) problems.push("Insulin");

        const bpValues = parseNumbers(formData.bp);

        if (bpValues.length !== 2) {
            problems.push("BP (e.g. 120/80)");
        }

        if (problems.length > 0) {
            setError(`Please fill / correct: ${problems.join(", ")}`);
            return;
        }

        const newVital = {
            patient: formData.patient,
            recordedAtDate: formData.recordedAtDate,
            recordedAtTime: formData.recordedAtTime,
            temperature: Number(formData.temperature),
            pulse: Number(formData.pulse),
            respiratoryRate: Number(formData.respiratoryRate),
            systolicBP: bpValues[0],
            diastolicBP: bpValues[1],
            spo2: Number(formData.spo2),
            bsl: Number(formData.bsl),
            insulin: Number(formData.insulin),
            notes: formData.notes.trim(),
        };

        onSubmit?.(newVital);
        resetForm();
    };

    const inputClass =
        "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

    const selectClass =
        "w-full h-9 px-2 rounded-md border border-zinc-200 bg-white outline-none focus:border-blue-500 transition text-sm text-zinc-800";

    const labelClass = "font-bold text-zinc-600 uppercase tracking-wide";

    return (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[92vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
                    <div>
                        <h2 className="text-base font-bold text-zinc-800">
                            Record Vitals
                        </h2>
                        <p className="text-xs text-zinc-600 mt-0.5">
                            Record patient's current vital signs
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={handleClose}
                        className="text-zinc-400 hover:text-zinc-600 transition p-1"
                    >
                        <X size={18} />
                    </button>
                </div>

                <form
                    onSubmit={handleFormSubmit}
                    className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(92vh-76px)]"
                >
                    {/* Patient */}
                    <div className="flex flex-col gap-1.5">
                        <label className={labelClass}>
                            Patient
                        </label>

                        {isDetailsPage ? (
                            <input
                                type="text"
                                value={formData.patient}
                                readOnly
                                className={`${inputClass} bg-zinc-50 cursor-not-allowed`}
                            />
                        ) : (
                            <select
                                name="patient"
                                value={formData.patient}
                                onChange={handleChange}
                                required
                                className={selectClass}
                            >
                                <option value="">Select Patient</option>

                                {patients.map((patient) => (
                                    <option
                                        key={patient.id}
                                        value={patient.patient}
                                    >
                                        {patient.patient}
                                    </option>
                                ))}
                            </select>
                        )}
                    </div>

                    {/* Date & Time */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-dashed border-zinc-100 pt-4 mt-1">
                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>
                                Date
                            </label>

                            <input
                                type="date"
                                name="recordedAtDate"
                                value={formData.recordedAtDate}
                                onChange={handleChange}
                                max={getCurrentDate()}
                                className={inputClass}
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className={labelClass}>
                                Time
                            </label>

                            <input
                                type="time"
                                name="recordedAtTime"
                                value={formData.recordedAtTime}
                                onChange={handleChange}
                                className={inputClass}
                            />
                        </div>
                    </div>

                    {/* Vital Signs */}
                    <div className="border-t border-dashed border-zinc-100 pt-4 mt-1">
                        <p className="text-[11px] font-bold text-zinc-600 uppercase tracking-wider mb-3">
                            Vital Signs
                        </p>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* Temperature */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Temp (°F)
                                </label>

                                <input
                                    type="number"
                                    step="0.1"
                                    name="temperature"
                                    value={formData.temperature}
                                    onChange={handleChange}
                                    placeholder="e.g. 98.6"
                                    className={inputClass}
                                />
                            </div>

                            {/* Pulse */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Pulse (bpm)
                                </label>

                                <input
                                    type="number"
                                    name="pulse"
                                    value={formData.pulse}
                                    onChange={handleChange}
                                    placeholder="e.g. 78"
                                    className={inputClass}
                                />
                            </div>

                            {/* Respiratory Rate */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    RR (breaths/min)
                                </label>

                                <input
                                    type="number"
                                    name="respiratoryRate"
                                    value={formData.respiratoryRate}
                                    onChange={handleChange}
                                    placeholder="e.g. 18"
                                    className={inputClass}
                                />
                            </div>

                            {/* Blood Pressure */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Blood Pressure (mmHg)
                                </label>

                                <input
                                    type="text"
                                    name="bp"
                                    value={formData.bp}
                                    onChange={handleChange}
                                    placeholder="e.g. 120/80"
                                    className={inputClass}
                                />
                            </div>

                            {/* SpO2 */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    SpO2 (%)
                                </label>

                                <input
                                    type="number"
                                    name="spo2"
                                    min="0"
                                    max="100"
                                    value={formData.spo2}
                                    onChange={handleChange}
                                    placeholder="e.g. 98"
                                    className={inputClass}
                                />
                            </div>

                            {/* BSL */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    BSL (mg/dL)
                                </label>

                                <input
                                    type="number"
                                    name="bsl"
                                    value={formData.bsl}
                                    onChange={handleChange}
                                    placeholder="e.g. 186"
                                    className={inputClass}
                                />
                            </div>

                            {/* Insulin */}
                            <div className="flex flex-col gap-1.5">
                                <label className={labelClass}>
                                    Insulin (units)
                                </label>

                                <input
                                    type="number"
                                    step="0.5"
                                    min="0"
                                    name="insulin"
                                    value={formData.insulin}
                                    onChange={handleChange}
                                    placeholder="e.g. 4"
                                    className={inputClass}
                                />
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="flex flex-col gap-1.5 mt-4">
                            <label className={labelClass}>
                                Notes{" "}
                                <span className="normal-case font-normal text-zinc-400">
                                    (optional)
                                </span>
                            </label>

                            <textarea
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={2}
                                placeholder="Any additional observations"
                                className="w-full px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300 resize-none"
                            />
                        </div>
                    </div>

                    {/* Error */}
                    {error && (
                        <p className="text-[12px] text-red-500 normal-case">
                            {error}
                        </p>
                    )}

                    {/* Actions */}
                    <div className="flex items-center gap-2 justify-start mt-4 border-t border-zinc-100 pt-4">
                        <button
                            type="submit"
                            className="bg-[#0052cc] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm"
                        >
                            Save Vitals
                        </button>

                        <button
                            type="button"
                            onClick={handleClose}
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

export default ICURecordVitalModal;