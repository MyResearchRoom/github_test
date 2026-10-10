import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { getCurrentTime } from "../../utils/getCurrentTime";

const ICUIntakeOutputModal = ({
    isOpen,
    onClose,
    onSubmit,
    patients = [],
    defaultPatient = "",
    currentPatient = null,
    category = "",
}) => {
    const isDetailsPage = !!currentPatient;

    const getPatientName = () => {
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

    const getInitialFormData = () => ({
        patient: isDetailsPage ? getPatientName() : defaultPatient || "",
        date: getCurrentDate(),
        time: getCurrentTime(),
        category: category || "",
        type: "",
        quantity: "",
        remarks: "",
    });

    const [formData, setFormData] = useState(getInitialFormData());

    useEffect(() => {
        if (!isOpen) return;

        setFormData({
            patient: isDetailsPage ? getPatientName() : defaultPatient || "",
            date: getCurrentDate(),
            time: getCurrentTime(),
            category: category || "",
            type: "",
            quantity: "",
            remarks: "",
        });
    }, [isOpen, category, defaultPatient, currentPatient]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handlePatientChange = (e) => {
        setFormData((prev) => ({
            ...prev,
            patient: e.target.value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (
            !formData.patient ||
            !formData.category ||
            !formData.type.trim() ||
            !formData.quantity
        ) {
            return;
        }

        onSubmit(formData);

        setFormData(getInitialFormData());
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4">
                    <div>
                        <h2 className="text-lg font-semibold text-[#343C6A]">
                            Add {formData.category || "Intake / Output"} Entry
                        </h2>
                        <p className="mt-0.5 text-xs text-zinc-500">
                            Record patient intake or output details
                        </p>
                    </div>

                    <button
                        type="button"
                        onClick={onClose}
                        className="flex h-8 w-8 items-center justify-center rounded-md text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-700"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-5">
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {/* Patient - ONLY on standalone page */}
                        {!isDetailsPage && (
                            <div className="sm:col-span-2">
                                <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                    Patient <span className="text-red-500">*</span>
                                </label>

                                <select
                                    name="patient"
                                    value={formData.patient}
                                    onChange={handlePatientChange}
                                    required
                                    className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-blue-500"
                                >
                                    <option value="">Select Patient</option>

                                    {patients.map((patient) => (
                                        <option
                                            key={patient.id}
                                            value={patient.name}
                                        >
                                            {patient.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Date */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Date <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="date"
                                name="date"
                                value={formData.date}
                                onChange={handleChange}
                                required
                                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-800 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        {/* Time */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Time <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="time"
                                name="time"
                                value={formData.time}
                                onChange={handleChange}
                                required
                                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-800 outline-none transition focus:border-blue-500"
                            />
                        </div>

                        {/* Category */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Category <span className="text-red-500">*</span>
                            </label>

                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                                className="h-10 w-full rounded-md border border-zinc-200 bg-white px-3 text-sm text-zinc-800 outline-none transition focus:border-blue-500"
                            >
                                <option value="">Select Category</option>
                                <option value="Intake">Intake</option>
                                <option value="Output">Output</option>
                            </select>
                        </div>

                        {/* Type */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Type <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="text"
                                name="type"
                                value={formData.type}
                                onChange={handleChange}
                                placeholder="e.g. IV Fluids, Urine"
                                required
                                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-500"
                            />
                        </div>

                        {/* Quantity */}
                        <div>
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Quantity (mL) <span className="text-red-500">*</span>
                            </label>

                            <input
                                type="number"
                                name="quantity"
                                value={formData.quantity}
                                onChange={handleChange}
                                placeholder="Enter quantity"
                                min="0"
                                required
                                className="h-10 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-500"
                            />
                        </div>

                        {/* Remarks */}
                        <div className="sm:col-span-2">
                            <label className="mb-1.5 block text-sm font-medium text-zinc-700">
                                Remarks
                            </label>

                            <textarea
                                name="remarks"
                                value={formData.remarks}
                                onChange={handleChange}
                                placeholder="Enter remarks"
                                rows={3}
                                className="w-full resize-none rounded-md border border-zinc-200 px-3 py-2 text-sm text-zinc-800 outline-none transition placeholder:text-zinc-400 focus:border-blue-500"
                            />
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-6 flex justify-end gap-3 border-t border-zinc-100 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-md border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-50"
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="rounded-md bg-[#521785] px-4 py-2 text-sm font-medium text-white transition hover:opacity-90"
                        >
                            Save Entry
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ICUIntakeOutputModal;