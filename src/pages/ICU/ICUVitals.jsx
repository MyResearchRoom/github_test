import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import TableComponent from "../../commonComponent/TableComponent";
import Pagination from "../../commonComponent/Pagination";
import ICURecordVitalModal from "../../modal/ICU/ICURecordVitals";
import { icuService } from "../../services/icuService";
import { formatTime } from "../../utils/formatTime";
import AddVitalsModal from "../../modal/IPD/AddVitalsModal";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { inputClass } from "./ICUInvestigation";

const ITEMS_PER_PAGE = 10;

const ICUVitals = () => {
  const navigate = useNavigate();

  const [vitals, setVitals] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedDate, setSelectedDate] = useState("");

  const loadVitals = useCallback(async (searchValue = "",selectedDate) => {
    setLoading(true);
    setError("");

    try {
      const response = await icuService.getLatestVitals({
        searchTerm: searchValue.trim(),
        recordedAtDate: selectedDate,
      });

      console.log("Latest Vitals Response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch latest vitals."
        );
      }

      setVitals(Array.isArray(response?.data) ? response.data : []);
      setCurrentPage(1);
    } catch (err) {
      console.error("Failed to load latest vitals:", err);

      setVitals([]);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to load latest vitals."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      loadVitals(searchTerm,selectedDate);
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm, loadVitals, selectedDate]);

  const totalPages = Math.max(
    1,
    Math.ceil(vitals.length / ITEMS_PER_PAGE)
  );

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  const paginatedVitals = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return vitals.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [vitals, currentPage]);

  const handleViewVitals = (row) => {
    const patientId = row?.patientId;

    const icuAdmissionId =
      row?.icuAdmissionId || row?.icuAdmission?.id;

    if (!patientId) {
      console.error("Patient ID missing:", row);
      return;
    }

    if (!icuAdmissionId) {
      console.error("ICU Admission ID missing:", row);
      return;
    }

    navigate(`/icu-vitals/${patientId}`, {
      state: {
        patientId,
        icuAdmissionId,
      },
    });
  };

  const handleSaveVitals = async () => {
    try {

      setIsModalOpen(false);

      await loadVitals(searchTerm);
    } catch (err) {
      console.error("Error adding vitals:", err);
    }
  };

  const getBloodPressure = (row) => {
    if (row?.bp) {
      return row.bp;
    }

    if (
      row?.systolicBP !== undefined &&
      row?.diastolicBP !== undefined
    ) {
      return `${row.systolicBP}/${row.diastolicBP}`;
    }

    return "-";
  };

  const columns = [
    {
      label: "PATIENT",
      headerClassName: "text-left px-5 whitespace-nowrap",
      className: "px-5 py-3",
      render: (row) => (
        <div>
          <p className="font-semibold text-zinc-900 whitespace-nowrap">
            {row?.patient?.name || "-"}
          </p>

          <p className="text-xs text-zinc-400 mt-0.5">
            P-Id {row?.patient?.patientId || "-"}
          </p>
        </div>
      ),
    },

    {
      label: "DATE & TIME",
      headerClassName: "text-left px-5 whitespace-nowrap",
      className: "px-5 py-3",
      render: (row) => (
        <div>
          <p className="text-sm font-medium text-zinc-700 whitespace-nowrap">
            {row?.recordedAtDate || "-"}
          </p>

          <p className="text-xs text-zinc-400 mt-0.5 whitespace-nowrap">
            {formatTime(row?.recordedAtTime) || "-"}
          </p>
        </div>
      ),
    },

    {
      label: "BP (mmHg)",
      headerClassName: "text-left px-5 whitespace-nowrap",
      className: "px-5 py-3 whitespace-nowrap",
      render: (row) => (
        <span className="font-semibold text-zinc-700">
          {getBloodPressure(row)}
        </span>
      ),
    },

    {
      label: "SpO2 (%)",
      headerClassName: "text-left px-5 whitespace-nowrap",
      className: "px-5 py-3 whitespace-nowrap",
      render: (row) => (
        <span
          className={`font-bold ${Number(row?.spo2) < 94
              ? "text-red-600"
              : "text-zinc-700"
            }`}
        >
          {Number(row?.spo2) ?? "-"}
        </span>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-1  flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Vitals
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Monitor and record current ICU patient vital signs
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium w-full sm:w-auto"
        >
          <Plus size={16} />
          <span>Record Vitals</span>
        </button>
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">

        {/* CARD HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">

          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Patient Vitals
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              {vitals.length}{" "}
              {vitals.length === 1 ? "patient" : "patients"} shown
            </p>
          </div>

          <div className="flex flex-row items-center gap-2">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className={`${inputClass} w-full sm:w-auto`}
            />
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search patient / admission..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 transition text-sm"
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

          {/* LOADING */}
          {loading ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              Loading vitals...
            </p>
          ) : error ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-red-600">
                Failed to load vitals
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={() => loadVitals(searchTerm)}
                className="mt-4 px-4 h-9 rounded-md bg-[#521785] text-white text-sm hover:bg-[#45126f] transition"
              >
                Retry
              </button>
            </div>
          ) : paginatedVitals.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-600">
                No vital recordings found
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                {searchTerm
                  ? "No vitals match your search."
                  : "No vital recordings are available."}
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE + TABLET */}
              <div className="flex lg:hidden flex-col gap-3">
                {paginatedVitals.map((row, index) => (
                  <div
                    key={row?.id || index}
                    className="border border-zinc-200 rounded-xl p-4"
                  >
                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">
                        <p className="text-xs text-zinc-400 mb-0.5">
                          #
                          {(currentPage - 1) *
                            ITEMS_PER_PAGE +
                            index +
                            1}
                        </p>

                        <p className="text-sm font-semibold text-zinc-900 truncate">
                          {row?.patient?.name || "-"}
                        </p>

                        <p className="text-xs text-zinc-400 mt-1">
                          Patient ID{" "}
                          <span className="font-semibold text-zinc-600">
                            {row?.patient?.patientId || "-"}
                          </span>
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-zinc-700">
                          {row?.recordedAtDate || "-"}
                        </p>

                        <p className="text-xs text-zinc-400 mt-0.5">
                          {formatTime(row?.recordedAtTime) || "-"}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4 bg-zinc-50 rounded-xl p-3 border border-zinc-100">

                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">
                          BP
                        </p>

                        <p className="text-sm font-semibold text-zinc-800 mt-1">
                          {getBloodPressure(row)}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">
                          SpO2
                        </p>

                        <p
                          className={`text-sm font-bold mt-1 ${Number(row?.spo2) < 94
                              ? "text-red-600"
                              : "text-zinc-800"
                            }`}
                        >
                          {row?.spo2 ?? "-"}
                          {row?.spo2 !== null &&
                            row?.spo2 !== undefined &&
                            row?.spo2 !== ""
                            ? "%"
                            : ""}
                        </p>
                      </div>

                      <div>
                        <p className="text-[10px] font-bold text-zinc-400 uppercase">
                          Pulse
                        </p>

                        <p className="text-sm font-semibold text-zinc-800 mt-1">
                          {row?.pulse ?? "-"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleViewVitals(row)}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition"
                    >
                      <Eye
                        size={14}
                        className="text-[#521785]"
                      />
                      View Vitals
                    </button>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedVitals}
                  actions={(row) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewVitals(row);
                      }}
                      title="View patient vitals"
                      className="w-8 h-8 rounded-md flex items-center justify-center border border-zinc-200 hover:bg-[#F3E8FF] transition mx-auto"
                    >
                      <Eye
                        size={15}
                        className="text-[#521785]"
                      />
                    </button>
                  )}
                  actionLabel="Action"
                />
              </div>

              {/* PAGINATION */}
              {totalPages > 0 && (
                <div className="mt-5 flex justify-end">
                  <Pagination
                    currentPage={currentPage}
                    setCurrentPage={setCurrentPage}
                    totalPages={totalPages}
                    goToPage={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* RECORD VITAL MODAL */}
      <AddVitalsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSaveVitals}
        // patients={patients}
        isICU={true}
      />
    </div>
  );
};

export default ICUVitals;