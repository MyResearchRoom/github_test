import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../commonComponent/Button";
import { toast } from "react-toastify";
import { icuService } from "../../services/icuService";
import { cat } from "@huggingface/transformers";
import { ipdService } from "../../services/ipdService";
import { selectClass } from "./AddVitalsModal";

const PRIMARY = "#521785";

const OTHER_OPTION = "Other";

const CATEGORY_OPTIONS = ["intake", "output"];

const TYPE_OPTIONS = {
  intake: [
    "IV Fluids (NS)",
    "Oral Fluids",
    "Blood Transfusion",
    "Infusion",
    "Tube Feeding",
    OTHER_OPTION,
  ],
  output: [
    "Urine (Catheter)",
    "Urine (Spontaneous)",
    "Drain",
    "Vomit",
    "Stool",
    OTHER_OPTION,
  ],
};

const pad = (n) => String(n).padStart(2, "0");

const getCurrentDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

const getCurrentTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const getInitialFormState = (patientId, icuAdmissionId, admissionId, category) => ({
  category: category || "",
  type: "",
  customType: "",
  quantity: "",
  date: getCurrentDate(),
  time: getCurrentTime(),
  remarks: "",
  patientId: patientId || "",
  icuAdmissionId: icuAdmissionId || null,
  admissionId: admissionId || null,
});

const inputClass =
  "w-full border border-[#d3cccc] rounded-md px-3 py-2 text-[14px] text-[#343C6A] outline-none bg-white";
const labelClass = "text-[13px] font-medium text-[#343C6A]";

const AddIntakeOutputModal = ({ isOpen, onClose, patientId, admissionId, icuAdmissionId, onSuccess, category, isICU = false }) => {
  const [form, setForm] = useState(getInitialFormState);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");

  useEffect(() => {
    if (isOpen) {
      const initialForm = getInitialFormState(patientId, icuAdmissionId, admissionId, category);

      setForm(initialForm);
      setError("");
    }
  }, [isOpen, category, patientId, admissionId, icuAdmissionId]);

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

          // console.log("Selected Patient:", selectedPatient);

          if (selectedPatient) {
            setForm((previous) => ({
              ...previous,
              patientId: selectedPatient.patientId,
              icuAdmissionId: selectedPatient.icuAdmissionId || null,
              admissionId: selectedPatient.admissionId || null,
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

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleCategoryChange = (e) => {
    setForm((prev) => ({
      ...prev,
      category: e.target.value,
      type: "",
      customType: "",
    }));
  };

  const handleTypeChange = (e) => {
    const value = e.target.value;
    setForm((prev) => ({
      ...prev,
      type: value,
      customType: value === OTHER_OPTION ? prev.customType : "",
    }));
  };

  const handleClose = () => {
    setForm(getInitialFormState());
    setError("");
    onClose();
  };

  const handlePatientChange = (e) => {
    const selectedPatient = patients.find(
      (item) => String(item.patientId) === String(e.target.value)
    );
    if (!selectedPatient) {
      setError("Selected patient not found.");
      return;
    }

    setForm((prev) => ({
      ...prev,
      patientId: e.target.value,
      icuAdmissionId: selectedPatient.icuAdmissionId || null,
      admissionId: selectedPatient.admissionId || null,
    }));

    setError("");
  };

  const isOther = form.type === OTHER_OPTION;

  const handleSubmit = async () => {
    setError("");

    const resolvedPatientId = form.patientId || patientId;
    const resolvedAdmissionId = form.admissionId || admissionId;
    const resolvedIcuAdmissionId = form.icuAdmissionId || icuAdmissionId;

    if (
      !resolvedPatientId ||
      (isICU ? !resolvedIcuAdmissionId : !resolvedAdmissionId)
    ) {
      setError("Patient or admission details are missing.");
      return;
    }

    const missingFields = [];

    if (!form.category) missingFields.push("Category");
    if (!form.type) missingFields.push("Type");
    if (isOther && !form.customType.trim()) missingFields.push("Other type");
    if (!form.quantity || Number(form.quantity) <= 0) {
      missingFields.push("Quantity (must be greater than 0)");
    }
    if (!form.date) missingFields.push("Date");
    if (!form.time) missingFields.push("Time");

    if (missingFields.length > 0) {
      setError(`Please fill / correct: ${missingFields.join(", ")}`);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...((resolvedIcuAdmissionId && isICU )
          ? { 
            icuAdmissionId: resolvedIcuAdmissionId ,
            admissionId: resolvedAdmissionId,
          }
          : {}),
        ...(resolvedAdmissionId
          ? { ipdAdmissionId: resolvedAdmissionId }
          : {}),
        patientId: resolvedPatientId,
        date: form.date,
        time: form.time,
        category: form.category,
        type: isOther ? form.customType.trim() : form.type,
        quantity: Number(form.quantity),
        remarks: form.remarks.trim(),
      };

      const res = await icuService.addInputOutput(payload);

      toast.success(res?.message || "Intake/Output recorded successfully.");

      await onSuccess?.();

      setForm(getInitialFormState());
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message ||
        err?.response?.data?.error || "Failed to save intake / output entry.");
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = TYPE_OPTIONS[form.category] || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="bg-white rounded-lg w-full max-w-xl max-h-[90vh] overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#343C6A]">
            Add Intake / Output
          </h2>

          <button
            type="button"
            onClick={handleClose}
            className="p-1.5 rounded-md hover:bg-gray-100 text-gray-500"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Patient</label>

          <select
            name="patientId"
            value={form.patientId}
            onChange={handlePatientChange}
            required
            disabled={Boolean(patientId)}
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
                  : "Select Patient"}
            </option>

            {patients.map((patient) => (
              <option key={patient.patientId} value={patient.patientId}>
                {patient.patientName} ({patient.patientUniqueId})
              </option>
            ))}
          </select>
        </div>

        {/* Category (full width) */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Category <span className="text-red-500">*</span>
          </label>
          <select
            value={form.category}
            onChange={handleCategoryChange}
            className={inputClass}
          >
            <option value="">Select category</option>
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        {/* Type + Quantity */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 items-start">
          <div className="flex flex-col gap-2">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>
                Type <span className="text-red-500">*</span>
              </label>
              <select
                value={form.type}
                onChange={handleTypeChange}
                disabled={!form.category}
                className={`${inputClass} disabled:bg-gray-50 disabled:text-gray-400`}
              >
                <option value="">
                  {form.category ? "Select type" : "Select category first"}
                </option>
                {typeOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </div>

            {isOther && (
              <input
                type="text"
                value={form.customType}
                onChange={handleChange("customType")}
                placeholder="Enter type"
                autoFocus
                className={inputClass}
              />
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Quantity (mL) <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              min="1"
              value={form.quantity}
              onChange={handleChange("quantity")}
              placeholder="e.g. 250"
              className={inputClass}
            />
          </div>
        </div>

        {/* Date + Time (default: now) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.date}
              onChange={handleChange("date")}
              max={getCurrentDate()}
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Time <span className="text-red-500">*</span>
            </label>
            <input
              type="time"
              value={form.time}
              onChange={handleChange("time")}
              className={inputClass}
            />
          </div>
        </div>

        {/* Remarks */}
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Remarks <span className="text-[#8BA3CB] text-[12px]">(optional)</span>
          </label>
          <textarea
            value={form.remarks}
            onChange={handleChange("remarks")}
            rows={2}
            placeholder="e.g. Running at 125ml/hr"
            className="border border-[#d3cccc] rounded-md p-3 text-[14px] text-[#343C6A] outline-none resize-none"
          />
        </div>

        {error && <p className="text-[13px] text-[#EF4444]">{error}</p>}

        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            onClick={handleClose}
            className="border border-[#d3cccc] bg-white text-[#343C6A] w-full sm:w-auto px-5 py-2"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-white w-full sm:w-auto px-5 py-2"
            style={{ backgroundColor: PRIMARY }}
          >
            {submitting ? "Saving..." : "Save Entry"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddIntakeOutputModal;