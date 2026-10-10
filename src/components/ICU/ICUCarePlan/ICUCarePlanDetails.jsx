import React, { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Eye, X } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import Pagination from "../../../commonComponent/Pagination";
import TableComponent from "../../../commonComponent/TableComponent";
import { usePagination } from "../../../hooks/usePagination";

import { icuService } from "../../../services/icuService";
const formatDateOnly = (value) =>
  typeof value === "string" ? value.split("T")[0] : value;

export const ICUCarePlanDetailsModal = ({ isOpen, onClose, carePlan }) => {
  React.useEffect(() => {
    if (!isOpen) {
      return undefined;
    }

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !carePlan) {
    return null;
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="icu-care-plan-details-title"
        className="w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-xl"
      >
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-100 bg-white px-4 py-4 sm:px-6">
          <div>
            <h2
              id="icu-care-plan-details-title"
              className="text-lg font-bold text-zinc-900 sm:text-xl"
            >
              Care Plan Details
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Patient ID: {carePlan.patientUniqueId || "—"}
              <span className="mx-2">•</span>
              ICU Admission ID: {carePlan?.icuAdmission?.icuAdmissionNumber || "—"}
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close care plan details"
            className="rounded-md p-2 text-zinc-500 transition hover:bg-zinc-100 hover:text-zinc-800"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-4 sm:p-6">
          <CarePlanCard plan={carePlan} />
        </div>
      </section>
    </div>
  );
};

const ITEMS_PER_PAGE = 10;

const statusBadge = (status) => {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-700";
    case "COMPLETED":
      return "bg-zinc-100 text-zinc-500";
    case "CANCELLED":
      return "bg-red-100 text-red-700";
    case "INPROCESS":
      return "bg-blue-100 text-blue-700";
    case "OVER_DUE":
      return "bg-amber-100 text-amber-700";
    default:
      return "bg-zinc-100 text-zinc-600";
  }
};

const formatStatus = (status) => {
  switch (status) {
    case "ACTIVE":
      return "Active";
    case "COMPLETED":
      return "Completed";
    case "CANCELLED":
      return "Cancelled";
    case "INPROCESS":
      return "In Process";
    case "OVER_DUE":
      return "Over Due";
    default:
      return status || "—";
  }
};

const FIELDS = [
  { key: "problem", label: "Problem" },
  { key: "goal", label: "Goal" },
  { key: "intervention", label: "Intervention" },
  { key: "frequency", label: "Frequency" },
  { key: "assignedNurse", label: "Assigned Nurse" },
  { key: "recordedByDetails", label: "Recorded By" },
  { key: "startDate", label: "Start Date" },
  { key: "reviewDate", label: "Review Date" },
];

const DetailBlock = ({ label, value, status, assignedNurse, recordedBy }) => (
  <div className="min-w-0">
    <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
      {label}
    </p>

    {status ? (
      <span
        className={`inline-flex text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${statusBadge(
          value
        )}`}
      >
        {formatStatus(value)}
      </span>
    ) : assignedNurse ? (
      <div className="text-xs sm:text-sm text-zinc-700 leading-5 break-words">
        <p>{assignedNurse.name || "—"}</p>
        {(assignedNurse.id != null || assignedNurse.receptionistId) && (
          <p className="text-xs text-zinc-500">
            {assignedNurse.receptionistId &&
              `Staff ID: ${assignedNurse.receptionistId}`}
          </p>
        )}
      </div>
    ) : recordedBy ? (
      <div className="text-xs sm:text-sm text-zinc-700 leading-5 break-words">
        <p>{recordedBy.name || "—"}</p>

        {recordedBy.email && (
          <p className="text-xs text-zinc-500">{recordedBy.email}</p>
        )}
      </div>
    ) : (
      <p className="text-xs sm:text-sm text-zinc-700 leading-5 whitespace-pre-line break-words">
        {value || "—"}
      </p>
    )}
  </div>
);

const CarePlanCard = ({ plan, index }) => {
  const isAlternate = index % 2 !== 0;

  return (
    <div
      className={`border rounded-xl overflow-hidden transition ${
        isAlternate
          ? "bg-[#F8F4FC] border-[#E8DDF1] hover:border-[#D8C4E8]"
          : "bg-white border-zinc-200 hover:border-zinc-300"
      }`}
    >
      {/* Card Header */}
      <div
        className={`px-4 sm:px-5 py-3.5 border-b ${
          isAlternate
            ? "border-[#E8DDF1]"
            : "border-zinc-100"
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-sm sm:text-base font-bold text-zinc-900">
              {plan.problem}
            </p>

            {/* <p className="text-xs text-zinc-400 mt-1">
              ICU Admission ID{" "}
              <span className="font-semibold text-zinc-500">
                {plan.icuAdmissionId}
              </span>
            </p> */}
          </div>

          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${statusBadge(
              plan.status
            )}`}
          >
            {formatStatus(plan.status)}
          </span>
        </div>
      </div>

      {/* Four Fields Per Row */}
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6">
          {FIELDS.map((field, fieldIndex) => (
            <div
              key={field.key}
              className={`py-3 ${
                fieldIndex < FIELDS.length - 4
                  ? isAlternate
                    ? "border-b border-[#E8DDF1]"
                    : "border-b border-zinc-100"
                  : ""
              }`}
            >
              <DetailBlock
                label={field.label}
                value={
                  field.key === "assignedNurse" || field.key === "recordedByDetails"
                    ? undefined
                    : ["startDate", "reviewDate"].includes(field.key)
                      ? formatDateOnly(plan[field.key])
                      : plan[field.key]
                }
                assignedNurse={field.key === "assignedNurse" ? plan.assignedNurse : undefined}
                recordedBy={field.key === "recordedByDetails" ? plan.recordedByDetails : undefined}
                status={field.key === "status"}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ICUCarePlanDetails = () => {
  const navigate = useNavigate();
  const { patientId: paramPatientId } = useParams();
  const { state } = useLocation();

  const patientId = state?.patientId || paramPatientId;
  const icuAdmissionId = state?.icuAdmissionId;

  const [patientCarePlans, setPatientCarePlans] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState("");
  const [selectedCarePlan, setSelectedCarePlan] = useState(null);

  const [selectedDate, setSelectedDate] = useState();

  useEffect(() => {
    const fetchPatientCarePlans = async () => {
      try {
        if (!patientId || !icuAdmissionId) {
          setPatientCarePlans([]);
          setError(
            "Patient or ICU admission details are missing. Return to the care plan list and open this patient again."
          );
          setLoading(false);
          return;
        }
        setLoading(true);
        setError("");

        const response = await icuService.getCarePlans(patientId, icuAdmissionId, selectedDate);

        const carePlans = [
          response,
          response?.data,
          response?.data?.data,
        ].find(Array.isArray);

        if (!carePlans) {
          throw new Error("Unexpected care plan response format.");
        }

        setPatientCarePlans(carePlans);
      } catch (error) {
        console.error("Failed to fetch patient care plans:", error);
        setPatientCarePlans([]);
        setError("Unable to load care plans. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchPatientCarePlans();
  }, [patientId, icuAdmissionId, selectedDate]);

  const patient =
    patientCarePlans[0]?.patient ||
    state?.patient ||
    (patientId ? { name: patientId } : null);

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination(1);

  useEffect(() => {
    setTotalPages(
      Math.max(
        1,
        Math.ceil(patientCarePlans.length / ITEMS_PER_PAGE)
      )
    );
  }, [patientCarePlans.length, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [patientId, goToPage]);

  const paginatedCarePlans = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return patientCarePlans.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [patientCarePlans, currentPage]);

  const handleViewCarePlan = (plan) => {
    setSelectedCarePlan(plan);
  };

  const columns = [
    {
      label: "Start Date",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3",
      render: (plan) => (
        <span className="whitespace-nowrap">
          {plan.startDate
            ? new Date(plan.startDate).toLocaleDateString("en-GB")
            : "—"}
        </span>
      ),
    },
    {
      label: "Problem",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3 min-w-[150px] max-w-[220px]",
      render: (plan) => (
        <span className="font-semibold text-[#343C6A] whitespace-normal break-words">
          {plan.problem || "—"}
        </span>
      ),
    },
    {
      label: "Goal",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3 min-w-[180px] max-w-[280px]",
      render: (plan) => (
        <span className="whitespace-normal break-words">
          {plan.goal || "—"}
        </span>
      ),
    },
    {
      label: "Frequency",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3",
      render: (plan) => plan.frequency || "—",
    },
    {
      label: "Status",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3",
      render: (plan) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold whitespace-nowrap ${statusBadge(
            plan.status
          )}`}
        >
          {formatStatus(plan.status)}
        </span>
      ),
    },
    {
      label: "Added By",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3",
      render: (plan) => plan.recordedByDetails?.name || "—",
    },
    {
      label: "Action",
      headerClassName: "text-center px-4 whitespace-nowrap",
      className: "px-4 py-3 text-center",
      render: (plan) => (
        <button
          type="button"
          onClick={(event) => {
            event.stopPropagation();
            handleViewCarePlan(plan);
          }}
          className="inline-flex items-center justify-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium text-[#521785] bg-[#F3E8FF] hover:bg-[#E9D5FF] transition-colors whitespace-nowrap"
        >
          <Eye size={14} />
          View
        </button>
      ),
    },
  ];

  if (loading) {
    return (
      <div className="w-full mx-auto p-4 sm:p-6 max-w-[1440px] 2xl:max-w-[1920px]">
        <div className="bg-white border border-zinc-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-zinc-500">
            Loading care plans...
          </p>
        </div>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="w-full mx-auto p-4 sm:p-6 max-w-[1440px] 2xl:max-w-[1920px]">
        <button
          type="button"
          onClick={() => navigate("/icu-care-plan")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#521785] hover:text-[#45126f] transition"
        >
          <ArrowLeft size={17} />
          Back to Care Plan
        </button>

        <div className="mt-6 bg-white border border-zinc-200 rounded-2xl p-8 text-center">
          <p className="text-sm font-semibold text-zinc-700">
            This patient could not be found.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* Back Button */}
      <div className="">
        <button
          type="button"
          onClick={() => navigate("/icu-care-plan")}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#521785] hover:text-[#45126f] transition"
        >
          <ArrowLeft size={17} />
          Back to Care Plan
        </button>
      </div>

  
      <div className="bg-white border border-zinc-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-zinc-100 px-4 py-4 sm:flex-row sm:items-end justify-end sm:px-5">
    
          <div className="w-full sm:w-auto">

            <input
              id="care-plan-details-date"
              type="date"
              value={selectedDate || ""}
              onChange={(event) => setSelectedDate(event.target.value)}
              className="h-9 w-full rounded-md border border-zinc-200 px-3 text-sm text-zinc-800 outline-none transition focus:border-blue-500 sm:w-auto"
            />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {error ? (
            <p role="alert" className="py-8 text-center text-sm text-red-600">
              {error}
            </p>
          ) : patientCarePlans.length > 0 ? (
            <>
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent columns={columns} data={paginatedCarePlans} />
              </div>

              <div className="grid grid-cols-1 gap-4 lg:hidden">
                {paginatedCarePlans.map((plan) => (
                  <article
                    key={plan.id}
                    className="rounded-xl border border-zinc-200 bg-white p-4 shadow-sm"
                  >
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      {[
                        {
                          label: "Start Date",
                          value: plan.startDate
                            ? new Date(plan.startDate).toLocaleDateString("en-GB")
                            : "—",
                        },
                        { label: "Problem", value: plan.problem || "—" },
                        { label: "Goal", value: plan.goal || "—" },
                        { label: "Frequency", value: plan.frequency || "—" },
                        {
                          label: "Status",
                          value: (
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ${statusBadge(
                                plan.status
                              )}`}
                            >
                              {formatStatus(plan.status)}
                            </span>
                          ),
                        },
                        {
                          label: "Added By",
                          value: plan.recordedByDetails?.name || "—",
                        },
                      ].map((field) => (
                        <div key={field.label} className="min-w-0">
                          <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                            {field.label}
                          </p>
                          <div className="break-words text-sm text-zinc-700">
                            {field.value}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 border-t border-zinc-100 pt-3">
                      <button
                        type="button"
                        onClick={() => handleViewCarePlan(plan)}
                        className="inline-flex w-full items-center justify-center gap-1.5 rounded-md bg-[#F3E8FF] px-3 py-2 text-xs font-medium text-[#521785] transition-colors hover:bg-[#E9D5FF]"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 0 && (
                <div className="pt-2">
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-600">
                No care plans recorded for this patient yet.
              </p>
            </div>
          )}
        </div>
      </div>
      <ICUCarePlanDetailsModal
        isOpen={Boolean(selectedCarePlan)}
        onClose={() => setSelectedCarePlan(null)}
        carePlan={selectedCarePlan}
      />
    </div>
  );
};

export default ICUCarePlanDetails;
