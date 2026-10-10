import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowLeftRight,
  LogOut,
  Save,
  UserRound,
  Bed,
  CalendarDays,
  Clock3,
  Stethoscope,
  ClipboardList,
  FileText,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const inputClass =
  "w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-800 outline-none transition focus:border-[#521785] focus:ring-2 focus:ring-[#521785]/10";

const textareaClass =
  "w-full min-h-[92px] px-3 py-2.5 rounded-lg border border-zinc-200 bg-white text-sm text-zinc-800 outline-none transition resize-none focus:border-[#521785] focus:ring-2 focus:ring-[#521785]/10";

const labelClass =
  "block text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5";

const ICUTransferDischargeDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const record = location.state?.record;

  const [formData, setFormData] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!record) {
      navigate("/icu/transfer-discharge", { replace: true });
      return;
    }

    setFormData({
      ...record,
      details: { ...record.details },
    });
  }, [record, navigate]);

  if (!formData) return null;

  const isTransfer = formData.type === "Transfer";

  const updateField = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setSaved(false);
  };

  const updateDetail = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      details: {
        ...prev.details,
        [field]: value,
      },
    }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
  };

  return (
    <div className="w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:px-6 xl:py-0 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* PAGE HEADER */}
      <div className="pt-4 mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 text-sm font-medium text-zinc-500 hover:text-[#521785] transition mb-4"
        >
          <ArrowLeft size={17} />
          Back to Transfer / Discharge
        </button>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5">
              <div
                className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  isTransfer
                    ? "bg-purple-50 text-purple-700"
                    : "bg-emerald-50 text-emerald-600"
                }`}
              >
                {isTransfer ? (
                  <ArrowLeftRight size={19} />
                ) : (
                  <LogOut size={19} />
                )}
              </div>

              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                  {isTransfer ? "Transfer Details" : "Discharge Details"}
                </h1>

                <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                  Review and manage the complete patient transition record
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {saved && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 mr-2">
                <CheckCircle2 size={15} />
                Changes saved
              </span>
            )}

            <button
              type="button"
              onClick={() => navigate(-1)}
              className="h-9 px-4 rounded-lg border border-zinc-200 bg-white text-xs sm:text-sm font-medium text-zinc-600 hover:bg-zinc-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleSave}
              className="h-9 px-4 rounded-lg bg-[#521785] hover:bg-[#45126f] text-white text-xs sm:text-sm font-medium transition flex items-center gap-2 shadow-sm"
            >
              <Save size={15} />
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* PATIENT SUMMARY */}
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden mb-5">
        <div className="px-4 sm:px-5 py-4 border-b border-zinc-100 bg-zinc-50/60">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-xl bg-zinc-100 flex items-center justify-center text-zinc-500">
                <UserRound size={21} />
              </div>

              <div>
                <h2 className="text-base sm:text-lg font-bold text-zinc-900">
                  {formData.patientName}
                </h2>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Patient ID:{" "}
                  <span className="font-semibold text-zinc-600">
                    {formData.patientId}
                  </span>
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center self-start sm:self-auto gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${
                isTransfer
                  ? "bg-purple-50 text-purple-700 border border-purple-100"
                  : "bg-emerald-50 text-emerald-700 border border-emerald-100"
              }`}
            >
              {isTransfer ? (
                <ArrowLeftRight size={13} />
              ) : (
                <LogOut size={13} />
              )}
              {formData.type}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-0 divide-x divide-zinc-100">
          <SummaryItem
            icon={<Bed size={15} />}
            label="Current Bed"
            value={formData.bed}
          />

          <SummaryItem
            icon={<CalendarDays size={15} />}
            label="Transition Date"
            value={formData.date}
          />

          <SummaryItem
            icon={<Clock3 size={15} />}
            label="Transition Time"
            value={formData.time}
          />

          <SummaryItem
            icon={<Stethoscope size={15} />}
            label={isTransfer ? "Transferred By" : "Doctor"}
            value={formData.primaryActor}
          />
        </div>
      </div>

      {/* MAIN WORKSPACE */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-5">
        {/* LEFT SIDE */}
        <div className="xl:col-span-8 space-y-5">
          {/* TRANSITION INFORMATION */}
          <SectionCard
            icon={<ClipboardList size={17} />}
            title="Transition Information"
            description="Core information associated with this patient transition"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Field
                label="Patient Name"
                value={formData.patientName}
                onChange={(e) => updateField("patientName", e.target.value)}
              />

              <Field
                label="Patient ID"
                value={formData.patientId}
                onChange={(e) => updateField("patientId", e.target.value)}
              />

              <Field
                label="Current Bed"
                value={formData.bed}
                onChange={(e) => updateField("bed", e.target.value)}
              />

              <Field
                label={isTransfer ? "Transferred By" : "Doctor"}
                value={formData.primaryActor}
                onChange={(e) => updateField("primaryActor", e.target.value)}
              />

              <Field
                label="Date"
                value={formData.date}
                onChange={(e) => updateField("date", e.target.value)}
              />

              <Field
                label="Time"
                value={formData.time}
                onChange={(e) => updateField("time", e.target.value)}
              />

              <Field
                label={isTransfer ? "Destination" : "Discharge Outcome"}
                value={formData.statusLabel}
                onChange={(e) => updateField("statusLabel", e.target.value)}
              />

              <Field
                label={isTransfer ? "Received By" : "Outcome Status"}
                value={formData.secondaryActor}
                onChange={(e) => updateField("secondaryActor", e.target.value)}
              />
            </div>
          </SectionCard>

          {/* CLINICAL SUMMARY */}
          <SectionCard
            icon={<FileText size={17} />}
            title={isTransfer ? "Reason for Transfer" : "Clinical Summary"}
            description={
              isTransfer
                ? "Clinical reason and condition supporting the transfer"
                : "Summary of the patient's clinical status at discharge"
            }
          >
            <textarea
              value={formData.summaryText || ""}
              onChange={(e) => updateField("summaryText", e.target.value)}
              className={textareaClass}
              placeholder={
                isTransfer
                  ? "Enter reason for transfer..."
                  : "Enter clinical discharge summary..."
              }
            />
          </SectionCard>

          {/* TYPE SPECIFIC DETAILS */}
          <SectionCard
            icon={
              isTransfer ? (
                <ArrowLeftRight size={17} />
              ) : (
                <LogOut size={17} />
              )
            }
            title={isTransfer ? "Transfer Handover Details" : "Discharge Instructions"}
            description={
              isTransfer
                ? "Information required for safe clinical handover"
                : "Treatment, medical advice and follow-up instructions"
            }
          >
            {isTransfer ? (
              <div className="space-y-4">
                <TextAreaField
                  label="Pending Treatment"
                  value={formData.details?.pendingTreatment || ""}
                  onChange={(e) =>
                    updateDetail("pendingTreatment", e.target.value)
                  }
                  placeholder="Enter pending treatment..."
                />

                <TextAreaField
                  label="Pending Investigations"
                  value={formData.details?.pendingInvestigations || ""}
                  onChange={(e) =>
                    updateDetail("pendingInvestigations", e.target.value)
                  }
                  placeholder="Enter pending investigations..."
                />

                <TextAreaField
                  label="Handover Notes"
                  value={formData.details?.handoverNotes || ""}
                  onChange={(e) =>
                    updateDetail("handoverNotes", e.target.value)
                  }
                  placeholder="Enter important handover notes..."
                />
              </div>
            ) : (
              <div className="space-y-4">
                <TextAreaField
                  label="Treatment Summary"
                  value={formData.details?.treatmentSummary || ""}
                  onChange={(e) =>
                    updateDetail("treatmentSummary", e.target.value)
                  }
                  placeholder="Enter treatment summary..."
                />

                <TextAreaField
                  label="Doctor Advice"
                  value={formData.details?.doctorAdvice || ""}
                  onChange={(e) =>
                    updateDetail("doctorAdvice", e.target.value)
                  }
                  placeholder="Enter medical advice..."
                />

                <TextAreaField
                  label="Follow-up Instructions"
                  value={formData.details?.followUpInstructions || ""}
                  onChange={(e) =>
                    updateDetail("followUpInstructions", e.target.value)
                  }
                  placeholder="Enter follow-up instructions..."
                />
              </div>
            )}
          </SectionCard>
        </div>

        {/* RIGHT SIDE */}
        <div className="xl:col-span-4 space-y-5">
          {/* STATUS CARD */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">
                Transition Status
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Current recorded outcome
              </p>
            </div>

            <div className="p-4">
              <div
                className={`rounded-xl p-4 border ${
                  isTransfer
                    ? "bg-purple-50/60 border-purple-100"
                    : "bg-emerald-50/60 border-emerald-100"
                }`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                      isTransfer
                        ? "bg-purple-100 text-purple-700"
                        : "bg-emerald-100 text-emerald-600"
                    }`}
                  >
                    {isTransfer ? (
                      <ArrowLeftRight size={17} />
                    ) : (
                      <CheckCircle2 size={17} />
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                      {isTransfer ? "Destination" : "Outcome"}
                    </p>

                    <p className="text-sm font-bold text-zinc-900 mt-1 break-words">
                      {formData.statusLabel}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      {formData.secondaryActor}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* SIGN-OFF */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">
                Clinical Sign-Off
              </h3>
              <p className="text-xs text-zinc-400 mt-1">
                Responsible clinical personnel
              </p>
            </div>

            <div className="p-4">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-zinc-50 border border-zinc-100">
                <div className="w-9 h-9 rounded-full bg-white border border-zinc-200 flex items-center justify-center text-zinc-500">
                  <Stethoscope size={16} />
                </div>

                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                    Clinical Lead
                  </p>

                  <p className="text-sm font-semibold text-zinc-800 mt-0.5 truncate">
                    {formData.primaryActor}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* AUDIT INFORMATION */}
          <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
            <div className="px-4 py-4 border-b border-zinc-100">
              <h3 className="text-sm font-bold text-zinc-900">
                Record Information
              </h3>
            </div>

            <div className="p-4 space-y-3">
              <InfoRow label="Record ID" value={formData.id} />
              <InfoRow label="Patient ID" value={formData.patientId} />
              <InfoRow label="Record Type" value={formData.type} />
              <InfoRow label="Date" value={formData.date} />
              <InfoRow label="Time" value={formData.time} />
            </div>
          </div>

          {/* IMPORTANT NOTE */}
          <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
            <div className="flex gap-3">
              <AlertCircle
                size={17}
                className="text-amber-600 shrink-0 mt-0.5"
              />

              <div>
                <p className="text-xs font-bold text-amber-800">
                  Clinical Record Notice
                </p>

                <p className="text-[11px] leading-relaxed text-amber-700 mt-1">
                  Verify all clinical information, destination, handover
                  details and sign-off information before final submission.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="mt-5 bg-white border border-zinc-200 rounded-2xl shadow-sm p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <p className="text-xs font-semibold text-zinc-700">
            {isTransfer
              ? "Ready to update this transfer record?"
              : "Ready to update this discharge record?"}
          </p>

          <p className="text-[11px] text-zinc-400 mt-0.5">
            Changes should be verified before saving the clinical record.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="h-9 px-4 rounded-lg border border-zinc-200 bg-white text-xs font-medium text-zinc-600 hover:bg-zinc-50 transition"
          >
            Back
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="h-9 px-4 rounded-lg bg-[#521785] hover:bg-[#45126f] text-white text-xs font-medium transition flex items-center gap-2"
          >
            <Save size={14} />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

const SectionCard = ({ icon, title, description, children }) => (
  <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
    <div className="px-4 sm:px-5 py-4 border-b border-zinc-100">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-zinc-100 text-zinc-600 flex items-center justify-center shrink-0">
          {icon}
        </div>

        <div>
          <h3 className="text-sm font-bold text-zinc-900">{title}</h3>
          <p className="text-xs text-zinc-400 mt-0.5">{description}</p>
        </div>
      </div>
    </div>

    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

const Field = ({ label, value, onChange }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <input value={value || ""} onChange={onChange} className={inputClass} />
  </div>
);

const TextAreaField = ({ label, value, onChange, placeholder }) => (
  <div>
    <label className={labelClass}>{label}</label>
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={textareaClass}
    />
  </div>
);

const SummaryItem = ({ icon, label, value }) => (
  <div className="p-3 sm:p-4 min-w-0">
    <div className="flex items-center gap-1.5 text-zinc-400">
      {icon}
      <span className="text-[10px] font-bold uppercase tracking-wider truncate">
        {label}
      </span>
    </div>

    <p className="text-xs sm:text-sm font-semibold text-zinc-800 mt-1.5 truncate">
      {value}
    </p>
  </div>
);

const InfoRow = ({ label, value }) => (
  <div className="flex items-center justify-between gap-3 text-xs">
    <span className="text-zinc-400">{label}</span>
    <span className="font-semibold text-zinc-700 text-right break-all">
      {value}
    </span>
  </div>
);

export default ICUTransferDischargeDetails;
