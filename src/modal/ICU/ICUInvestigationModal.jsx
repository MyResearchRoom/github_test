import React, { useEffect, useRef, useState } from "react";
import { X, AlertCircle, FileText, Upload } from "lucide-react";
import { ipdService } from "../../services/ipdService";
import { getCurrentDate } from "../../utils/getCurrentDate";

const inputClass = "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";
const selectClass = "w-full h-9 px-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800";
const textareaClass = "w-full min-h-[90px] px-3 py-2 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-400 resize-none leading-relaxed";
const labelClass = "font-bold text-zinc-400 uppercase tracking-wide text-[10px]";

const sampleInvestigations = [
  "Complete Blood Count",
  "ABG",
  "Electrolytes",
  "Chest X-Ray",
  "ECG",
  "Blood Culture",
  "Procalcitonin",
  "Renal Function Test",
  "Liver Function Test",
  "Coagulation Profile (PT/INR)",
];

const InvestigationModal = ({ isOpen, onClose, onSubmit, patientId, icuAdmissionId }) => {
  const [formData, setFormData] = useState({
    investigationName: "",
    otherInvestigationName: "",
    result: "",
    investigationDate: getCurrentDate(),
    document: null,
    patientId: patientId || "",
    icuAdmissionId: icuAdmissionId || "",
  });

  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const documentInputRef = useRef(null);

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
      ...(name === "investigationName" && value !== "OTHER"
        ? { otherInvestigationName: "" }
        : {}),
      [name]: name === "document" ? e.target.files?.[0] || null : value,
    }));
    setError("");
  };

  const handleDocumentSelect = (event) => {
    const document = event.target.files?.[0] || null;
    setFormData((previous) => ({ ...previous, document }));
    setError("");
  };

  const handleRemoveDocument = () => {
    setFormData((previous) => ({ ...previous, document: null }));
    if (documentInputRef.current) {
      documentInputRef.current.value = "";
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const resolvedPatientId = patientId || formData.patientId;
    const resolvedAdmissionId = icuAdmissionId || formData.icuAdmissionId;
    const investigationName =
      formData.investigationName === "OTHER"
        ? formData.otherInvestigationName.trim()
        : formData.investigationName;

    if (
      !resolvedPatientId ||
      !resolvedAdmissionId ||
      !investigationName ||
      !formData.investigationDate
    ) {
      setError("Please complete all required fields, including the ICU admission.");
      return;
    }

    const payload = {
      patientId: resolvedPatientId,
      icuAdmissionId: resolvedAdmissionId,
      investigationName,
      result: formData.result.trim(),
      investigationDate: formData.investigationDate,
      ...(formData.document ? { document: formData.document } : {}),
    };

    setIsSubmitting(true);
    setError("");
    try {
      await onSubmit(payload);
      setFormData({
        investigationName: "",
        otherInvestigationName: "",
        result: "",
        investigationDate: getCurrentDate(),
        document: null,
        patientId: patientId || "",
        icuAdmissionId: icuAdmissionId || "",
      });
      if (documentInputRef.current) {
        documentInputRef.current.value = "";
      }
      onClose();
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        err?.response?.data?.error ||
        "Failed to save investigation. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl max-h-[92vh] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">

        {/* HEADER BAR PANEL */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100">
          <div>
            <h2 className="text-base font-bold text-zinc-800">Order New ICU Investigation</h2>
            <p className="text-xs text-zinc-400 mt-0.5">Request pathology diagnostic metrics or clinical scanning grids</p>
          </div>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        {/* INPUT CAPTURE FORM CONTAINER */}
        <form onSubmit={handleFormSubmit} className="p-6 flex flex-col gap-4 text-xs overflow-y-auto max-h-[calc(92vh-76px)]">

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

          {/* SECTION 2: INVESTIGATION DETAILS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Investigation Name <span className="text-red-500">*</span></label>
              <select name="investigationName" value={formData.investigationName} onChange={handleChange} required className={selectClass}>
                <option value="">Select Lab Panel / Test</option>
                {sampleInvestigations.map((test, index) => (
                  <option key={index} value={test}>
                    {test}
                  </option>
                ))}
                <option value="OTHER">Other</option>
              </select>
            </div>

            {formData.investigationName === "OTHER" && (
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>
                  Other Investigation Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="otherInvestigationName"
                  value={formData.otherInvestigationName}
                  onChange={handleChange}
                  placeholder="Enter investigation name"
                  required
                  className={inputClass}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Investigation Date <span className="text-red-500">*</span></label>
              <input type="date" name="investigationDate" value={formData.investigationDate} onChange={handleChange} required className={inputClass} />
            </div>
          </div>

          {/* SECTION 3: RESULT */}
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Result</label>
            <textarea
              name="result"
              value={formData.result}
              onChange={handleChange}
              placeholder="Enter investigation result"
              className={textareaClass}
            />
          </div>

          {/* SECTION 4: DOCUMENT UPLOAD */}
          <div className="flex flex-col gap-1.5 mt-1">
            <label className={labelClass}>Document</label>
            <input
              ref={documentInputRef}
              type="file"
              name="document"
              accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
              onChange={handleDocumentSelect}
              className="hidden"
            />
            {formData.document ? (
              <div className="flex items-center gap-3 rounded-lg border border-[#E8DDF1] bg-[#FAF7FC] p-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-[#521785]">
                  <FileText size={20} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-zinc-800">
                    {formData.document.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {(formData.document.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleRemoveDocument}
                  aria-label="Remove selected document"
                  className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-zinc-500 transition hover:bg-red-50 hover:text-red-600"
                >
                  <X size={16} />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => documentInputRef.current?.click()}
                className="flex w-full flex-col items-center justify-center gap-2 rounded-lg border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-center transition hover:border-[#521785] hover:bg-[#FAF7FC]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#F3E8FF] text-[#521785]">
                  <Upload size={17} />
                </span>
                <span className="text-sm font-semibold text-zinc-700">
                  Choose a document to upload
                </span>
                <span className="text-xs text-zinc-500">
                  PDF, DOC, DOCX, JPG or PNG
                </span>
              </button>
            )}
          </div>

          {/* SYSTEM CONTEXT ALERT STRIP */}
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-3 flex gap-2.5 items-start mt-1">
            <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={15} />
            <p className="text-[11px] text-blue-700 leading-4">
              <strong>Investigation record:</strong> The patient, ICU admission, investigation details, result, and uploaded document will be saved to the patient record.
            </p>
          </div>

          {error && <p role="alert" className="text-sm text-red-600">{error}</p>}

          {/* SUBMIT BUTTON ROW ACTION TRAY */}
          <div className="flex items-center gap-2 justify-start mt-4 border-t border-zinc-100 pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#521785] px-5 h-9 rounded-md text-white font-semibold hover:bg-[#45126f] transition shadow-sm"
            >
              {isSubmitting ? "Saving..." : "Save Investigation"}
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

export default InvestigationModal;
