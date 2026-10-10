import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Activity, Eye, Plus } from "lucide-react";

import Pagination from "../../../commonComponent/Pagination";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import TableComponent from "../../../commonComponent/TableComponent";
import ICUCarePlanModal from "../../../modal/ICU/ICUCarePlanModal";
import { icuService } from "../../../services/icuService";
import { ICUCarePlanDetailsModal } from "./ICUCarePlanDetails";
import { formatInvestigationDate } from "../ICUInvestigation/ICUInvestigation";

const ITEMS_PER_PAGE = 5;
const PRIMARY = "#521785";

const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const statusStyles = {
  ACTIVE: "bg-[#DCFCE7] text-[#16A34A]",
  COMPLETED: "bg-[#E0E7FF] text-[#4338CA]",
  CANCELLED: "bg-[#FEE2E2] text-[#DC2626]",
  INPROCESS: "bg-[#DBEAFE] text-[#2563EB]",
  OVER_DUE: "bg-[#FFEDD5] text-[#EA580C]",
};

const ICUCarePlan = ({ patient , patientId, icuAdmissionId}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedCarePlan, setSelectedCarePlan] = useState(null);
  const [carePlanDate, setCarePlanDate] = useState(getCurrentDate());
  const [patientCarePlans, setPatientCarePlans] = useState([]);
  const [loading, setLoading] = useState(Boolean(patientId && icuAdmissionId));
  const [error, setError] = useState("");

  const loadCarePlans = useCallback(async () => {
    if (!patientId || !icuAdmissionId) {
      setPatientCarePlans([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await icuService.getCarePlans(
        patientId,
        icuAdmissionId,
        carePlanDate
      );
      setPatientCarePlans(Array.isArray(response?.data) ? response.data : []);
    } catch (err) {
      console.error("Failed to load ICU care plans:", err);
      setPatientCarePlans([]);
      setError("Failed to load care plans.");
    } finally {
      setLoading(false);
    }
  }, [patientId, icuAdmissionId, carePlanDate]);

  useEffect(() => {
    loadCarePlans();
  }, [loadCarePlans, patientId, icuAdmissionId, carePlanDate]);

  React.useEffect(() => {
    setCurrentPage(1);
  }, [patientCarePlans]);

  const totalPages = Math.ceil(
    patientCarePlans.length / ITEMS_PER_PAGE
  );

  const paginatedCarePlans = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return patientCarePlans.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [patientCarePlans, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewCarePlan = (carePlan) => {
    setSelectedCarePlan(carePlan);
  };

  const columns = [
    {
      key: "startDate",
      label: "Start Date",
      headerClassName: "text-left whitespace-nowrap",
      render: (row) => (
        <span className="whitespace-nowrap">
          {formatInvestigationDate(row.startDate) || "—"}
        </span>
      ),
    },
    {
      key: "problem",
      label: "Problem",
      headerClassName: "text-left whitespace-nowrap pl-5",
      render: (row) => (
        <div className="min-w-[120px] max-w-[150px] whitespace-normal break-words pl-5">
          <p className="font-semibold text-[#343C6A]">
            {row.problem || "—"}
          </p>
        </div>
      ),
    },
    {
      key: "goal",
      label: "Goal",
      headerClassName: "text-left whitespace-nowrap pl-5",
      
      render: (row) => (
        <div className="whitespace-normal break-words leading-5 min-w-[180px] max-w-[300px] pl-5">
          {row.goal || "—"}
        </div>
      ),
    },
    {
      key: "frequency",
      label: "Frequency",
      headerClassName: "text-left  pl-5",
      render: (row) => (
        <span className=" pl-5">
          {row.frequency || "—"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      headerClassName: "text-left whitespace-nowrap pl-5",
      render: (row) => (
        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium whitespace-nowrap pl-5 ${
            statusStyles[row.status] ||
            "bg-[#F3F4F6] text-[#6B7280]"
          }`}
        >
          {row.status || "—"}
        </span>
      ),
    },
    {
      label: "Added By",
      headerClassName: "text-left whitespace-nowrap pl-5",
      render: (row) => (
        <span className="whitespace-nowrap pl-5">
          {row.recordedByDetails?.name || "—"}
        </span>
      ),
    },
    {
      key: "action",
      label: "Action",
      headerClassName: "text-left whitespace-nowrap pl-5",
      render: (row) => (
        <button
          type="button"
          onClick={() => handleViewCarePlan(row)}
          className="inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md text-[12px] font-medium text-[#521785] bg-[#F3E8FF] hover:bg-[#E9D5FF] transition-colors whitespace-nowrap pl-5"
        >
          <Eye size={14} />
          View
        </button>
      ),
    },
  ];

  return (
    <>
      <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-5 py-3 border-b border-[#f0f0f0] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <Activity
              size={17}
              className="text-[#521785] shrink-0"
            />

            <h2 className="text-sm sm:text-base font-semibold text-[#343C6A] truncate">
              Care Plan ({patientCarePlans.length})
            </h2>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-end gap-2 w-full sm:w-auto">
            <div className="w-full sm:w-auto">
              <label
                htmlFor="care-plan-date"
                className="mb-1 block text-xs font-medium text-zinc-600"
              >
                Date
              </label>
              <input
                id="care-plan-date"
                type="date"
                value={carePlanDate}
                onChange={(event) => setCarePlanDate(event.target.value)}
                className={inputClass}
              />
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: PRIMARY }}
            >
              <Plus size={15} />
              <span>Add Care Plan</span>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-5">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading care plans...
            </p>
          ) : error ? (
            <p role="alert" className="py-8 text-center text-sm text-red-600">
              {error}
            </p>
          ) : patientCarePlans.length === 0 ? (
            <div className="bg-[#F8F9FC] rounded-lg p-6 text-center">
              <Activity
                size={32}
                className="mx-auto mb-2 text-[#8BA3CB]"
              />

              <p className="text-sm text-[#8BA3CB]">
                No care plans recorded for this patient.
              </p>
            </div>
          ) : (
            <>
              {/* ================= DESKTOP TABLE ================= */}
              <div className="hidden md:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedCarePlans}
                />
              </div>

              {/* ================= MOBILE CARDS ================= */}
              <div className="grid grid-cols-1 gap-4 md:hidden">
                {paginatedCarePlans.map((row) => (
                  <div
                    key={row.id}
                    className="border border-[#E5E7EB] rounded-lg bg-white overflow-hidden shadow-sm"
                  >
                    <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                          Start Date
                        </p>
                        <p className="text-sm text-zinc-700">
                          {formatInvestigationDate(row.startDate) || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                          Problem
                        </p>
                        <p className="text-sm font-semibold text-[#343C6A] break-words">
                          {row.problem || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                          Goal
                        </p>
                        <p className="text-sm text-zinc-700 break-words">
                          {row.goal || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                          Frequency
                        </p>
                        <p className="text-sm text-zinc-700">
                          {row.frequency || "—"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                          Status
                        </p>
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[12px] font-medium ${
                            statusStyles[row.status] ||
                            "bg-[#F3F4F6] text-[#6B7280]"
                          }`}
                        >
                          {row.status || "—"}
                        </span>
                      </div>

                      <div>
                        <p className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wide mb-1">
                          Added By
                        </p>
                        <p className="text-sm text-zinc-700 break-words">
                          {row.recordedByDetails?.name || "—"}
                        </p>
                      </div>
                    </div>

                    {/* Card Footer */}
                    <div className="px-4 py-3 border-t border-[#E5E7EB] bg-[#FAFAFA]">
                      <button
                        type="button"
                        onClick={() => handleViewCarePlan(row)}
                        className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-md text-xs font-medium text-[#521785] bg-[#F3E8FF] hover:bg-[#E9D5FF] transition-colors"
                      >
                        <Eye size={14} />
                        View Care Plan
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 0 && (
                <div className="mt-5 flex justify-end">
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    goToPage={handlePageChange}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Add Care Plan Modal */}
      <ICUCarePlanModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={loadCarePlans}
        patientId={patientId}
        icuAdmissionId={icuAdmissionId}
      />
      <ICUCarePlanDetailsModal
        isOpen={Boolean(selectedCarePlan)}
        onClose={() => setSelectedCarePlan(null)}
        carePlan={selectedCarePlan}
      />
    </>
  );
};

export default ICUCarePlan;
