import React, { useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import { usePagination } from "../../hooks/usePagination";
import { useNavigate } from "react-router-dom";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { icuService } from "../../services/icuService";
import ICUProcedureModal from "../../modal/ICU/ICUProcedureModal";
import Pagination from "../../commonComponent/Pagination";
import TableComponent from "../../commonComponent/TableComponent";
import { formatTime } from "../../utils/formatTime";
import { hasComplications } from "../../components/ICU/ICUProcedure/ICUProcedure";

const ITEMS_PER_PAGE = 10;

const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-[#521785] transition text-sm text-zinc-800 placeholder-zinc-300";

const ICUProcedures = () => {
  const navigate = useNavigate();

  const [procedures, setProcedures] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDate, setSelectedDate] = useState();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const {
    currentPage,
    totalPages,
    goToPage,
    setTotalPages,
  } = usePagination(1);


  const fetchProcedures = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await icuService.getProcedure(
        selectedDate,
        "",
        "",
        searchTerm
      );

      if (response?.success) {
        setProcedures(response?.data || []);
      } else {
        setProcedures([]);
        setError(response?.message || "Failed to fetch procedures.");
      }
    } catch (err) {
      console.error("Error fetching ICU procedures:", err);

      setProcedures([]);
      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch procedures."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProcedures();

  }, [searchTerm, selectedDate]);

  useEffect(() => {
    const pages = Math.max(
      1,
      Math.ceil(procedures.length / ITEMS_PER_PAGE)
    );

    setTotalPages(pages);

    if (currentPage > pages) {
      goToPage(pages);
    }
  }, [
    procedures.length,
    currentPage,
    setTotalPages,
    goToPage,
  ]);

  useEffect(() => {
    goToPage(1);
  }, [searchTerm, selectedDate, goToPage]);

  const paginatedProcedures = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return procedures.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [procedures, currentPage]);

  const handleViewProcedure = (procedure) => {
    navigate(`/icu-procedure/${procedure.id}`, {
      state: {
        procedureId: procedure.id,
      },
    });
  };

  const columns = [
    {
      label: "Patient",
      headerClassName:
        "text-left pl-4 min-w-[160px] whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <div>
          <p className="text-sm font-semibold text-[#343C6A] whitespace-nowrap">
            {item.patient?.name || "-"}
          </p>

          <p className="text-xs text-zinc-400 mt-0.5">
            PatientId-{item.patient?.patientId || "-"}
          </p>
        </div>
      ),
    },
    {
      label: "Date / Time",
      headerClassName:
        "text-left pl-4 min-w-[150px] whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <div>
          <p className="text-sm text-[#343C6A] whitespace-nowrap">
            {item.procedureDate || "-"}
          </p>

          <p className="text-xs text-gray-400 mt-0.5">
            {formatTime(item.procedureTime) || "-"}
          </p>
        </div>
      ),
    },
    {
      label: "Procedure Name",
      headerClassName:
        "text-left pl-4 min-w-[220px] whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-sm font-medium text-[#343C6A]">
          {item.procedureName || "-"}
        </p>
      ),
    },

    {
      label: "Complications",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-3",
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${hasComplications(item)
            ? "bg-red-50 text-red-700"
            : "bg-green-50 text-green-700"
            }`}
        >
          {hasComplications(item) ? "Yes" : "No"}
        </span>
      ),
    },
    {
      label: "Indication",
      headerClassName:
        "text-left pl-4 min-w-[250px] whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-sm text-[#343C6A] max-w-[350px] leading-5">
          {item.indication || "-"}
        </p>
      ),
    },
    {
      label: "Action",
      headerClassName:
        "text-center min-w-[90px] whitespace-nowrap",
      className: "text-center py-3",
      render: (item) => (
        <button
          type="button"
          onClick={() => handleViewProcedure(item)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#521785] hover:bg-purple-50 transition"
          title="View Procedure"
        >
          <Eye size={17} />
        </button>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-4 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            ICU Procedures
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Procedure documentation
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
        >
          <Plus size={16} />
          <span>Add Procedure</span>
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-1">
        {/* CARD HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">
          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
              ICU Procedures
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              {procedures.length}{" "}
              {procedures.length === 1
                ? "procedure"
                : "procedures"}{" "}
              shown
            </p>
          </div>

          <div className="flex flex-col gap-2 md:flex-row">
            {/* DATE FILTER */}
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                goToPage(1);
              }}
              className={`${inputClass} w-full sm:w-auto`}
            />

            {/* SEARCH */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search patient / procedure..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  goToPage(1);
                }}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-[#521785] transition text-sm"
              />

              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
              />
            </div>
          </div>
        </div>

        {/* CONTENT */}
        <div className="p-4 sm:p-5">
          {loading ? (
            <div className="py-12 text-center">
              <p className="text-sm text-zinc-500">
                Loading procedures...
              </p>
            </div>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-red-500">
                {error}
              </p>

              <button
                type="button"
                onClick={fetchProcedures}
                className="mt-3 px-4 h-9 rounded-md bg-[#521785] text-white text-sm font-medium hover:bg-[#45126f] transition"
              >
                Retry
              </button>
            </div>
          ) : procedures.length > 0 ? (
            <>
              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedProcedures}
                />
              </div>

              {/* MOBILE / TABLET CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {paginatedProcedures.map((procedure) => (
                  <div
                    key={procedure.id}
                    className="border border-zinc-200 rounded-xl bg-white shadow-sm p-4"
                  >
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-zinc-100">
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#343C6A] break-words">
                          {procedure.procedureName || "-"}
                        </p>

                        <p className="text-xs text-gray-500 mt-1 break-words">
                          {procedure.patient?.name || "-"}
                        </p>

                        <p className="text-[11px] text-zinc-400 mt-0.5">
                          {procedure.patient?.patientId || "-"}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() =>
                          handleViewProcedure(procedure)
                        }
                        className="w-8 h-8 rounded-md flex items-center justify-center text-[#521785] hover:bg-purple-50 transition shrink-0"
                        title="View Procedure"
                      >
                        <Eye size={17} />
                      </button>
                    </div>

                    <div className="pt-3 space-y-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                          Date / Time
                        </p>

                        <p className="text-sm text-[#343C6A] mt-1">
                          {procedure.procedureDate || "-"}{" "}
                          <span className="text-gray-400">
                            ·
                          </span>{" "}
                          {formatTime(procedure.procedureTime) || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                          Complication
                        </p>

                        <p
                          className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${hasComplications(procedure)
                            ? "bg-[#FEE2E2] text-[#DC2626]"
                            : "bg-[#DCFCE7] text-[#16A34A]"
                            }`}
                        >
                          {hasComplications(procedure) ? "Yes" : "No"}
                        </p>
                      </div>


                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                          Indication
                        </p>

                        <p className="text-sm text-[#343C6A] mt-1 leading-relaxed break-words">
                          {procedure.indication || "-"}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {totalPages > 0 && (
                <div className="mt-4">
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
                No procedures found
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                Try searching with another patient or procedure.
              </p>
            </div>
          )}
        </div>
      </div>

      <ICUProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={() => fetchProcedures()}
      />
    </div>
  );
};

export default ICUProcedures;
