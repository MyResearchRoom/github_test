import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Eye, Plus, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import NursingNoteModal from "../../modal/ICU/ICUNursingNoteModal";
import TableComponent from "../../commonComponent/TableComponent";
import Pagination from "../../commonComponent/Pagination";
import { formatTime } from "../../utils/formatTime";
import { icuService } from "../../services/icuService";

const ITEMS_PER_PAGE = 5;

const ICUNursingNotes = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [noteDate, setNoteDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadNursingNotes = useCallback(
    async (searchValue = searchTerm) => {
      setLoading(true);
      setError("");

      try {
        const response = await icuService.getLatestNursingNote({
          searchTerm: searchValue?.trim() || "",
          noteDate
        });

        console.log(
          "Nursing Notes Search:",
          searchValue
        );

        console.log(
          "Nursing Notes Response:",
          response
        );

        if (!response?.success) {
          throw new Error(
            response?.message ||
            "Failed to fetch nursing notes."
          );
        }

        setNotes(
          Array.isArray(response?.data)
            ? response.data
            : []
        );

        setCurrentPage(1);
      } catch (err) {
        console.error(
          "Failed to load ICU nursing notes:",
          err
        );

        setNotes([]);

        setError(
          err?.response?.data?.message ||
          err?.message ||
          "Failed to load nursing notes."
        );
      } finally {
        setLoading(false);
      }
    },
    [searchTerm, noteDate]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      loadNursingNotes(searchTerm);
    }, 400);

    return () => {
      clearTimeout(timer);
    };
  }, [searchTerm, noteDate, loadNursingNotes]);


  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(notes.length / ITEMS_PER_PAGE)
    );

    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [notes.length, currentPage]);


  const totalPages = Math.max(
    1,
    Math.ceil(notes.length / ITEMS_PER_PAGE)
  );

  const paginatedNotes = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return notes.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [notes, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleViewNote = (item) => {
    const patientId = item?.patient?.id;

    const icuAdmissionId =
      item?.icuAdmissionId || item?.icuAdmission?.id;

    if (!patientId) {
      console.error("Database Patient ID missing:", item);
      return;
    }

    if (!icuAdmissionId) {
      console.error("ICU Admission ID missing:", item);
      return;
    }

    navigate(`/icu-nursing-notes/${patientId}`, {
      state: {
        patientId,
        icuAdmissionId,
      },
    });
  };

  const handleNursingNoteSuccess = async () => {
    setIsModalOpen(false);

    await loadNursingNotes(searchTerm);
  };

  const columns = [
    {
      label: "Name",
      headerClassName:
        "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <div>
          <p className="font-semibold text-zinc-900 whitespace-nowrap">
            {item?.patient?.name || "-"}
          </p>

          <p className="text-xs text-zinc-400 mt-0.5 whitespace-nowrap">
            PatientID -{" "}
            {item?.patient?.patientId || "-"}
          </p>
        </div>
      ),
    },

    {
      label: "Date & Time",
      headerClassName:
        "text-left px-6 whitespace-nowrap",
      className: "px-6 py-3",
      render: (item) => (
        <div>
          <p className="text-zinc-700 whitespace-nowrap">
            {item?.noteDate || "-"}
          </p>

          <p className="text-zinc-500 text-xs whitespace-nowrap mt-0.5">
            {formatTime(item?.noteTime) || "-"}
          </p>
        </div>
      ),
    },

    {
      label: "Patient Condition",
      headerClassName:
        "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-normal min-w-[250px] max-w-[350px]">
          {item?.patientCondition || "-"}
        </p>
      ),
    },

    {
      label: "Observations",
      headerClassName:
        "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-normal min-w-[250px] max-w-[350px]">
          {item?.observations || "-"}
        </p>
      ),
    },

    {
      label: "Recorded By",
      headerClassName:
        "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-normal min-w-[150px] max-w-[250px]">
          {item?.nurse.name || "-"}
        </p>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-3 max-w-[1440px] 2xl:max-w-[1920px]">

      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Nursing Notes
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Record and review nursing observations and patient care
          </p>
        </div>

        {role==="nurse" &&
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
        >
          <Plus size={16} />
          <span>New Nursing Note</span>
        </button>
        }
      </div>

      {/* MAIN CARD */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">

        {/* CARD HEADER */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">

          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Nursing Notes
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              {notes.length}{" "}
              {notes.length === 1
                ? "note"
                : "notes"}{" "}
              shown
            </p>
          </div>

          {/* BACKEND SEARCH */}
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <input
              type="date"
              value={noteDate}
              onChange={(e) => {
                setNoteDate(e.target.value);
                setCurrentPage(1);
              }}
              aria-label="Filter nursing notes by date"
              className="w-full sm:w-40 h-9 px-3 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-700"
            />

            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search patient / nurse..."
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
              Loading nursing notes...
            </p>
          ) : error ? (
            /* ERROR */
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-red-600">
                Failed to load nursing notes
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                {error}
              </p>

              <button
                type="button"
                onClick={() =>
                  loadNursingNotes(searchTerm)
                }
                className="mt-4 px-4 h-9 rounded-md bg-[#521785] text-white text-sm hover:bg-[#45126f] transition"
              >
                Retry
              </button>
            </div>
          ) : paginatedNotes.length === 0 ? (
            /* EMPTY */
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-600">
                No nursing notes found
              </p>

              <p className="text-xs text-zinc-400 mt-1">
                {searchTerm
                  ? "No nursing notes match your search."
                  : "No nursing notes are available."}
              </p>
            </div>
          ) : (
            <>
              {/* MOBILE + TABLET */}
              <div className="flex lg:hidden flex-col gap-3">
                {paginatedNotes.map(
                  (item, index) => (
                    <div
                      key={
                        item?.id || index
                      }
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
                            {item?.patient?.name ||
                              "-"}
                          </p>

                          <p className="text-xs text-zinc-400 mt-1">
                            Patient ID{" "}
                            <span className="font-semibold text-zinc-600">
                              {item?.patient?.patientId ||
                                "-"}
                            </span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-xs font-semibold text-zinc-700">
                            {item?.noteDate ||
                              "-"}
                          </p>

                          <p className="text-xs text-zinc-400 mt-0.5">
                            {formatTime(
                              item?.noteTime
                            ) || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="mt-3 space-y-2">

                        {/* CONDITION */}
                        <div>
                          <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                            Patient Condition
                          </p>

                          <p className="text-xs text-zinc-700 mt-1">
                            {item?.patientCondition ||
                              "-"}
                          </p>
                        </div>

                        {/* OBSERVATIONS */}
                        <div>
                          <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                            Observations
                          </p>

                          <p className="text-xs text-zinc-700 mt-1">
                            {item?.observations ||
                              "-"}
                          </p>
                        </div>

                        {/* NURSE */}
                        <div className="pt-2 border-t border-zinc-100">
                          <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                            Nurse
                          </p>

                          <p className="text-xs text-zinc-700 mt-1">
                            {item?.nurse?.name ||
                              "-"}
                          </p>
                        </div>

                        {/* VIEW */}
                        <button
                          type="button"
                          onClick={() =>
                            handleViewNote(
                              item
                            )
                          }
                          className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition"
                        >
                          <Eye
                            size={14}
                            className="text-[#521785]"
                          />
                          View
                        </button>
                      </div>
                    </div>
                  )
                )}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedNotes}
                  actions={(item) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewNote(item);
                      }}
                      title="View nursing note"
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
                    setCurrentPage={
                      setCurrentPage
                    }
                    totalPages={totalPages}
                    goToPage={
                      handlePageChange
                    }
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <NursingNoteModal
        isOpen={isModalOpen}
        onClose={() =>
          setIsModalOpen(false)
        }
        onSuccess={
          handleNursingNoteSuccess
        }
      />
    </div>
  );
};

export default ICUNursingNotes;