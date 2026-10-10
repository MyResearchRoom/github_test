import React, { useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";
import CarePlanModal from "../../modal/ICU/ICUCarePlanModal";
import TableComponent from "../../commonComponent/TableComponent";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { icuService } from "../../services/icuService";

const ITEMS_PER_PAGE = 10;

const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";


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


const ICUCarePlan = () => {

  const navigate = useNavigate();

  const [carePlans, setCarePlans] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination(1);

  const fetchCarePlans = async () => {
    try {
      setLoading(true);

      const response = await icuService.getLatestCarePlans(
        searchTerm,
        startDate
      );

      setCarePlans(response?.data || []);
    } catch (error) {
      console.error("Failed to fetch care plans:", error);
      setCarePlans([]);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchCarePlans();
  }, [searchTerm, startDate]);

  const filteredPlans = carePlans;

  React.useEffect(() => {
    const pages = Math.max(1, Math.ceil(filteredPlans.length / ITEMS_PER_PAGE));
    setTotalPages(pages);

    if (currentPage > pages) {
      goToPage(pages);
    }
  }, [filteredPlans.length, currentPage, goToPage, setTotalPages]);

  React.useEffect(() => {
    goToPage(1);
  }, [searchTerm, startDate, goToPage]);

  const paginatedPlans = filteredPlans.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleViewPlan = (plan) => {
    navigate(`/icu-care-plan/${plan.patientId}`, {
      state: {
        patientId: plan.patientId,
        icuAdmissionId: plan.icuAdmissionId,
        patient: plan.patient,
      },
    });
  };

  const columns = [
    {
      label: "Patient Name",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="font-semibold text-zinc-900 whitespace-nowrap">
          {item.patient?.name || "Unknown Patient"}
        </p>
      ),
    },
    {
      label: "Start Date",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-nowrap">
          {item.startDate
            ? new Date(item.startDate).toLocaleDateString("en-GB")
            : "—"}
        </p>
      ),
    },
    {
      label: "Problem",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 leading-5">
          {item.problem || "—"}
        </p>
      ),
    },
    {
      label: "Goal",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "px-4 py-3",
      render: (item) => (
        <p className="text-sm text-zinc-700 whitespace-normal min-w-[200px] max-w-[300px]">
          {item.goal || "—"}
        </p>
      ),
    },
    {
      label: "Status",
      headerClassName: "text-left px-4 whitespace-nowrap",
      className: "py-3 px-4",
      render: (item) => (
        <span
          className={`font-semibold px-2 py-1 rounded-md whitespace-nowrap ${statusBadge(
            item.status
          )}`}
        >
          {formatStatus(item.status)}
        </span>
      ),
    },
    {
      label: "Action",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-3",
      render: (item) => (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            handleViewPlan(item);
          }}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#521785] hover:bg-[#F3E8FF] transition"
          title="View Care Plan"
        >
          <Eye size={17} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-4 max-w-[1440px] 2xl:max-w-[1920px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Care Plan
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Patient care planning and nursing goals
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">

          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
          >
            <Plus size={16} />
            <span>New Care Plan</span>
          </button>
        </div>

      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">
          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Care Plans
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              {filteredPlans.length}{" "}
              {filteredPlans.length === 1 ? "patient" : "patients"} found
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full sm:w-auto">
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className={`${inputClass} sm:w-40`}
            />

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search patient / problem..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 transition text-sm"
              />

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {filteredPlans.length > 0 ? (
            <>
              {/* Mobile / Tablet Cards */}
              <div className="flex lg:hidden flex-col gap-4">
                {paginatedPlans.map((plan, index) => (
                  <div
                    key={plan.id}
                    onClick={() => handleViewPlan(plan)}
                    className={`border rounded-xl overflow-hidden transition cursor-pointer ${index % 2 === 0
                      ? "bg-white border-zinc-200"
                      : "bg-[#F8F4FC] border-[#E8DDF1]"
                      }`}
                  >
                    <div className="px-4 sm:px-5 py-3.5 border-b border-zinc-100">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm sm:text-base font-bold text-zinc-900 truncate">
                            {plan.patient?.name || "Unknown Patient"}
                          </p>

                          <p className="text-xs text-zinc-400 mt-1">
                            {plan.problem || "—"}
                          </p>

                          <p className="text-xs text-zinc-500 mt-1">
                            Start Date:{" "}
                            {plan.startDate
                              ? new Date(plan.startDate).toLocaleDateString("en-GB")
                              : "—"}
                          </p>

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

                    <div className="px-4 sm:px-5 py-4">
                      <div>
                        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-1.5">
                          Goal
                        </p>

                        <p className="text-xs sm:text-sm text-zinc-700 leading-5">
                          {plan.goal || "—"}
                        </p>
                      </div>
                    </div>

                    <div className="px-4 sm:px-5 pb-4">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewPlan(plan);
                        }}
                        className="inline-flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-md border border-[#521785] text-[#521785] hover:bg-[#F3E8FF] transition"
                      >
                        <Eye size={14} />
                        View
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Desktop Table */}
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedPlans}
                  onClick={handleViewPlan}
                />
              </div>
              {totalPages > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                  <p className="text-xs text-zinc-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredPlans.length)}{" "}
                    of {filteredPlans.length} care plans
                  </p>
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={goToPage}
                    totalPages={totalPages}
                    goToPage={goToPage}
                  />
                </div>
              )}
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-600">
                No care plans found
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                Try searching with another patient, problem, or status.
              </p>
            </div>
          )}
        </div>
      </div>

      <CarePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={()=>fetchCarePlans()}
      />
    </div>
  );
};

export default ICUCarePlan;
