import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import Button from "../../commonComponent/Button";
import { toast } from "react-toastify";
import { icuService } from "../../services/icuService";
import { ipdService } from "../../services/ipdService";
const PRIMARY = "#521785";

export const selectClass =
  "w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800";

const pad = (n) => String(n).padStart(2, "0");

// Local date/time (toISOString would give the UTC date, which can be off by a day in IST)
export const getCurrentDate = () => {
  const d = new Date();
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
};

export const getCurrentTime = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Pulls every number out of a string: "120/80" -> [120, 80]
const parseNumbers = (value) =>
  (String(value).match(/\d+(\.\d+)?/g) || []).map(Number);

const getInitialFormState = (patientId, icuAdmissionId, admissionId) => ({
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
  patientId: patientId || "",
  icuAdmissionId: icuAdmissionId || null,
  admissionId: admissionId || null,
});

const inputClass =
  "w-full border border-[#d3cccc] rounded-md px-3 py-2 text-[14px] text-[#343C6A] outline-none";
const labelClass = "text-[13px] font-medium text-[#343C6A]";

const AddVitalsModal = ({ isOpen, onClose, patientId, admissionId, icuAdmissionId, onSuccess, isICU = false }) => {
  const [form, setForm] = useState(getInitialFormState(patientId, icuAdmissionId, admissionId));
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [patients, setPatients] = useState([]);
  const [patientsLoading, setPatientsLoading] = useState(true);
  const [patientsError, setPatientsError] = useState("");

  useEffect(() => {
    if (isOpen) {
      setForm(getInitialFormState(patientId, icuAdmissionId, admissionId));
      setError("");
    }
  }, [isOpen]);

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

  const handleClose = () => {
    setForm(getInitialFormState(patientId, icuAdmissionId, admissionId));
    setError("");
    onClose();
  };

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

    const vitalValues = [
      form.temperature,
      form.spo2,
      form.pulse,
      form.respiratoryRate,
      form.bp,
      form.bsl,
    ];

    if (vitalValues.every((value) => !String(value ?? "").trim())) {
      setError("Please provide at least one vital record.");
      return;
    }

    const problems = [];

    if (!form.recordedAtDate) problems.push("Date");
    if (!form.recordedAtTime) problems.push("Time");

    const bpValues = parseNumbers(form.bp);
    if (bpValues.length !== 2 && form.bp) problems.push("BP (e.g. 120/80)");

    if (problems.length > 0) {
      setError(`Please fill / correct: ${problems.join(", ")}`);
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        ...((resolvedIcuAdmissionId && isICU )
          ? { icuAdmissionId: resolvedIcuAdmissionId ,
              admissionId: resolvedAdmissionId,
          }
          : {}),
        ...(resolvedAdmissionId
          ? { ipdAdmissionId: resolvedAdmissionId }
          : {}),
        patientId: resolvedPatientId,

        recordedAtDate: form.recordedAtDate,
        recordedAtTime: form.recordedAtTime,

        temperature:
          form.temperature === "" || form.temperature == null
            ? null
            : Number(form.temperature),

        pulse:
          form.pulse === "" || form.pulse == null
            ? null
            : Number(form.pulse),

        bp:
          form.bp === "" || form.bp == null
            ? null
            : form.bp.trim(),

        spo2:
          form.spo2 === "" || form.spo2 == null
            ? null
            : Number(form.spo2),

        bsl:
          form.bsl === "" || form.bsl == null
            ? null
            : Number(form.bsl),

        respiratoryRate:
          form.respiratoryRate === "" || form.respiratoryRate == null
            ? null
            : Number(form.respiratoryRate),

        insulin:
          form.insulin === "" || form.insulin == null
            ? null
            : Number(form.insulin),

        notes: form.notes?.trim() || null,
      };

      const res = await icuService.addvitals(payload);

      toast.success(res?.message || "Vitals recorded successfully.");

      setForm(getInitialFormState(patientId, icuAdmissionId, admissionId));
      await onSuccess?.();
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save vitals."
      );
    } finally {
      setSubmitting(false);
    }
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


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-5 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-[16px] font-semibold text-[#343C6A]">Add Vitals</h2>

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

        {/* Date & Time (default: now) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>
              Date <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              value={form.recordedAtDate}
              onChange={handleChange("recordedAtDate")}
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
              value={form.recordedAtTime}
              onChange={handleChange("recordedAtTime")}
              className={inputClass}
            />
          </div>
        </div>

        <p className="text-[12px] text-[#8BA3CB]">
          Enter at least one vital value. Date and time are required.
        </p>



        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Temp (°F)</label>
            <input
              type="number"
              step="0.1"
              value={form.temperature}
              onChange={handleChange("temperature")}
              placeholder="e.g. 98.6"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>SpO2 (%)</label>
            <input
              type="number"
              min="0"
              max="100"
              value={form.spo2}
              onChange={handleChange("spo2")}
              placeholder="e.g. 98"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Pulse (bpm)</label>
            <input
              type="number"
              value={form.pulse}
              onChange={handleChange("pulse")}
              placeholder="e.g. 78"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>RR (/min)</label>
            <input
              type="number"
              value={form.respiratoryRate}
              onChange={handleChange("respiratoryRate")}
              placeholder="e.g. 18"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5 sm:col-span-2">
            <label className={labelClass}>Blood Pressure (mmHg)</label>
            <input
              type="text"
              value={form.bp}
              onChange={handleChange("bp")}
              placeholder="e.g. 120/80"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>BSL (mg/dL)</label>
            <input
              type="number"
              value={form.bsl}
              onChange={handleChange("bsl")}
              placeholder="e.g. 186"
              className={inputClass}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Insulin (units)</label>
            <input
              type="number"
              step="0.5"
              min="0"
              value={form.insulin}
              onChange={handleChange("insulin")}
              placeholder="e.g. 4"
              className={inputClass}
            />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>
            Notes <span className="text-[#8BA3CB] text-[12px]">(optional)</span>
          </label>
          <textarea
            value={form.notes}
            onChange={handleChange("notes")}
            rows={2}
            placeholder="Any additional observations"
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
            {submitting ? "Saving..." : "Save Vitals"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddVitalsModal;