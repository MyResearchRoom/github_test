import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Download, Eye, FileText, FlaskConical, Plus } from "lucide-react";

import TableComponent from "../../../commonComponent/TableComponent";
import { usePagination } from "../../../hooks/usePagination";
import Pagination from "../../../commonComponent/Pagination";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import InvestigationModal from "../../../modal/ICU/ICUInvestigationModal";
import { icuService } from "../../../services/icuService";
import { handleDownloadDocument, handleViewDocument } from "../../../pages/IPD/IPDPatientDocuments";
import { toast } from "react-toastify";
// import ICUInvestigationModal from "../../../modals/ICUInvestigationModal";

const ITEMS_PER_PAGE = 10;
export const PRIMARY = "#521785";

export const formatInvestigationDate = (value) => {
  if (!value) return "-";

  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "-";

  return new Date(year, month - 1, day).toLocaleDateString("en-GB");
};

const ICUInvestigation = ({
  patient = [],
  patientId,
  icuAdmissionId,
  onSuccess,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [investigations, setInvestigations] = useState([]);
  const [loading, setLoading] = useState(Boolean(patientId && icuAdmissionId));
  const [error, setError] = useState("");

  const {
    currentPage,
    totalPages,
    goToPage,
    setTotalPages,
  } = usePagination(1);

  const loadInvestigations = useCallback(async () => {
    if (!patientId || !icuAdmissionId) {
      setInvestigations([]);
      setError("");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await icuService.getInvestigations(
        patientId,
        icuAdmissionId,
        selectedDate
      );
      setInvestigations(
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []
      );
    } catch (err) {
      console.error("Failed to load ICU investigations:", err);
      setInvestigations([]);
      setError("Failed to load investigations.");
    } finally {
      setLoading(false);
    }
  }, [patientId, icuAdmissionId, selectedDate]);

  useEffect(() => {
    loadInvestigations();
  }, [patientId, icuAdmissionId, selectedDate]);

  useEffect(() => {
    const pages = Math.ceil(
      investigations.length / ITEMS_PER_PAGE
    );

    const updatedTotalPages = Math.max(1, pages);

    setTotalPages(updatedTotalPages);

    if (currentPage > updatedTotalPages) {
      goToPage(updatedTotalPages);
    }
  }, [
    investigations.length,
    currentPage,
    setTotalPages,
    goToPage,
  ]);

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return investigations.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [investigations, currentPage]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveInvestigation = async (newInvestigation) => {
    const payload = new FormData();
    payload.append("patientId", newInvestigation.patientId);
    payload.append("icuAdmissionId", newInvestigation.icuAdmissionId);
    payload.append("investigationName", newInvestigation.investigationName);
    payload.append("result", newInvestigation.result);
    payload.append("investigationDate", newInvestigation.investigationDate);
    if (newInvestigation.document) {
      payload.append("document", newInvestigation.document);
    }

    try {
      const response = await icuService.addInvestigations(payload);
      toast.success(response?.message || "Investigations Added successfully...");
      goToPage(1);
      await loadInvestigations();
      await onSuccess?.(response);
    } catch (err) {
      console.error("Failed to add ICU investigation:", err);
      throw err;
    }
  };

  const columns = [
    {
      label: "Date",
      headerClassName:
        "text-left pl-4 min-w-[130px] whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-sm text-[#343C6A] whitespace-nowrap">
          {formatInvestigationDate(item.investigationDate)}
        </p>
      ),
    },

    {
      label: "Investigation",
      headerClassName:
        "text-left pl-8 min-w-[180px] whitespace-nowrap",
      className: "pl-8 py-3",
      render: (item) => (
        <div className="flex items-center gap-2">
          <FlaskConical
            size={16}
            className="text-[#521785] shrink-0"
          />

          <p className="text-sm font-medium text-[#343C6A]">
            {item.investigationName}
          </p>
        </div>
      ),
    },

    {
      label: "Result",
      headerClassName:
        "text-left pl-4 min-w-[250px] whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-sm text-[#343C6A] max-w-[350px]">
          {item.result || "-"}
        </p>
      ),
    },

    {
      label: "Added by",
      headerClassName: "text-left whitespace-nowrap",
      render: (row) => (
        <p className="font-semibold text-[#343C6A] whitespace-nowrap">
          {row.recordedByDetails?.name || "—"}
        </p>
      ),
    },

    {
      label: "Document",
      headerClassName:
        "text-left pl-4  whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <>
        {item.document ? 
        (<div className="flex items-center justify-start gap-2">
          <button
            type="button"
            onClick={() => handleViewDocument(item)}
            title="View document"
            className="w-8 h-8 rounded-md flex items-center justify-center border border-[#D9D1E8] hover:bg-[#F3E8FF] transition"
          >
            <Eye size={15} color={PRIMARY} />
          </button>
          <button
            type="button"
            onClick={() => handleDownloadDocument(item)}
            title="Download document"
            className="w-8 h-8 rounded-md flex items-center justify-center border border-[#D9D1E8] hover:bg-[#F3E8FF] transition"
          >
            <Download size={15} color={PRIMARY} />
          </button>
        </div>)
        : (
          <p className="">Not uploded</p>
        )}

        </>
      ),
    },

    // {
    //   label: "Document",
    //   headerClassName:
    //     "text-left pl-4 min-w-[180px] whitespace-nowrap",
    //   className: "pl-4 py-3",
    //   render: (item) => (
    //     <div className="flex items-center gap-2 min-w-0">
    //       <FileText
    //         size={15}
    //         className="text-[#521785] shrink-0"
    //       />

    //       <span className="text-sm text-[#343C6A] truncate max-w-[150px]">
    //         {item.document || "-"}
    //       </span>
    //     </div>
    //   ),
    // },
  ];

  const inputClass =
    "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

  const PRIMARY = "#521785";

  return (
    <>
      <div className="w-full bg-white rounded-xl border border-gray-100 shadow-sm p-4 sm:p-5">

        <div className="flex flex-col lg:flex-row lg:items-center gap-4 mb-5 justify-between">

          {/* TITLE */}

          <div className="flex items-center">
            <div className="w-9 h-9 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
              <FlaskConical
                size={19}
                className="text-[#521785]"
              />
            </div>

            <div className="ml-3">
              <h3 className="text-base sm:text-lg font-semibold text-[#343C6A]">
                Investigations
              </h3>
            </div>
          </div>

          {/* DATE + ADD BUTTON */}

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className={`${inputClass} w-full sm:w-auto`}
            />

            <button
              type="button"
              onClick={handleOpenModal}
              className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
              style={{ backgroundColor: PRIMARY }}
            >
              <Plus size={15} />

              <span>
                Add Investigation
              </span>
            </button>
          </div>
        </div>


        {loading ? (
          <p className="py-8 text-center text-sm text-gray-500">
            Loading investigations...
          </p>
        ) : error ? (
          <p role="alert" className="py-8 text-center text-sm text-red-600">
            {error}
          </p>
        ) : investigations.length > 0 ? (
          <>

            <div className="hidden lg:block">
              <TableComponent
                columns={columns}
                data={paginatedData}
                loading={loading}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
              {paginatedData.map((item) => (
                <div
                  key={item.id}
                  className="w-full border border-gray-100 rounded-xl bg-white shadow-sm p-4"
                >
                  {/* CARD HEADER */}

                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-gray-100">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-purple-50 flex items-center justify-center shrink-0">
                        <FlaskConical
                          size={14}
                          className="text-[#521785]"
                        />
                      </div>

                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-[#343C6A] break-words">
                          {item.investigationName}
                        </p>
                      </div>
                    </div>

                    <span className="text-xs text-gray-500 whitespace-nowrap">
                      {formatInvestigationDate(item.investigationDate)}
                    </span>
                  </div>

                  {/* PATIENT */}

                  <div className="pt-3 space-y-3">

                    {/* RESULT */}

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                        Result
                      </p>

                      <p className="text-sm text-[#343C6A] mt-1 leading-relaxed break-words">
                        {item.result || "-"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                        Added By
                      </p>

                      <p className="text-sm text-[#343C6A] mt-1 leading-relaxed break-words">
                        {item.recordedByDetails?.name || "-"}
                      </p>
                    </div>

                    {/* DOCUMENT */}

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                        Document
                      </p>

                      <div className="flex items-center gap-2 mt-1 min-w-0">
                        <FileText
                          size={15}
                          className="text-[#521785] shrink-0"
                        />

                        {item.document ? (
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleViewDocument(item)}
                            title="View document"
                            className="w-8 h-8 rounded-md flex items-center justify-center border border-[#D9D1E8] hover:bg-[#F3E8FF] transition"
                          >
                            <Eye size={15} color={PRIMARY} />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDownloadDocument(item)}
                            title="Download document"
                            className="w-8 h-8 rounded-md flex items-center justify-center border border-[#D9D1E8] hover:bg-[#F3E8FF] transition"
                          >
                            <Download size={15} color={PRIMARY} />
                          </button>
                        </div>
                        ) :(
                          <p className="text-sm">Not Uploded</p>
                        )}
                      </div>
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

          <div className="flex flex-col items-center justify-center py-12 text-center">
            <div className="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center mb-3">
              <FlaskConical
                size={22}
                className="text-[#521785]"
              />
            </div>

            <p className="text-sm font-medium text-[#343C6A]">
              No investigations found
            </p>

            <p className="text-xs text-gray-500 mt-1">
              There are no investigation records for this patient.
            </p>
          </div>
        )}
      </div>

      <InvestigationModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSubmit={handleSaveInvestigation}
        currentPatient={patient}
        isDetailsPage={true}
        patientId={patientId}
        icuAdmissionId={icuAdmissionId}
      />
    </>
  );
};

export default ICUInvestigation;