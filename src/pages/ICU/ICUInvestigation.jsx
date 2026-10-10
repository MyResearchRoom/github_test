import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Plus, Search, Eye, ClipboardList, Clock, FlaskConical, Download, FileText } from "lucide-react";
import ICUInvestigationModal from "../../modal/ICU/ICUInvestigationModal";
import { icuService } from "../../services/icuService";
import { toast } from "react-toastify";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { usePagination } from "../../hooks/usePagination";
import TableComponent from "../../commonComponent/TableComponent";
import { formatInvestigationDate, PRIMARY } from "../../components/ICU/ICUInvestigation/ICUInvestigation";
import { handleDownloadDocument, handleViewDocument } from "../IPD/IPDPatientDocuments";
import Pagination from "../../commonComponent/Pagination";

export const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";


const ITEMS_PER_PAGE = 10;

const ICUInvestigations = () => {
  const [investigations, setInvestigations] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(false);

  const {
    currentPage,
    totalPages,
    goToPage,
    setTotalPages,
  } = usePagination(1);

  const loadInvestigations = useCallback(async () => {
    setLoading(true);

    try {
      const response = await icuService.getInvestigations(
        "", "",
        selectedDate,
        searchTerm,
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
    } finally {
      setLoading(false);
    }
  }, [selectedDate, searchTerm]);

  useEffect(() => {
    loadInvestigations();
  }, [loadInvestigations]);

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
      // goToPage(1);
      await loadInvestigations();
    } catch (err) {
      console.error("Failed to add ICU investigation:", err);
      throw err;
    }
  };

  const columns = [
    {
      label: "Patient",
      headerClassName:
        "text-left pl-2  whitespace-nowrap",
      className: "pl-2 py-3",
      render: (item) => (
        <div className="flex flex-col items-start justify-start gap-1">
          <p className="text-sm font-medium text-[#343C6A] capitalize">
            {item.patient?.name || "-"}
          </p>

          <p className="text-xs font-medium text-[#8289af]">
            P-ID: {item.patient?.patientId || "-"}
          </p>
        </div>
      ),
    },
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
        "text-left pl-4 whitespace-nowrap",
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

  ];

  return (
    <div className="w-full mx-auto px-1 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">

      {/* HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight flex items-center gap-2">
            <FlaskConical className="text-[#521785]" size={24} />
            ICU Investigations
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Track diagnostic labs, cultures, and diagnostic imaging diagnostics order pipelines.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="bg-[#521785] px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
        >
          <Plus size={16} />
          <span>Order Investigation</span>
        </button>
      </div>

      {/* SEARCH AND FILTER TABLE CONTROLS */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">
          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">Orders Grid</p>
            <p className="text-xs text-zinc-400 mt-1">
              {paginatedData.length} {paginatedData.length === 1 ? "record" : "records"} discovered
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
                placeholder="Search patient, bed, lab test..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 transition text-sm"
              />
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
        </div>


        <div className="p-4 sm:p-5">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading investigations...
            </p>
          ) : paginatedData.length > 0 ? (
            <>
              {/* MOBILE TABLET VIEWPORT CARD STACK */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
                {paginatedData.map((item) => (
                  <div
                    key={item.id}
                    className="w-full border border-gray-100 rounded-xl bg-white shadow-sm p-2"
                  >
                    {/* CARD HEADER */}

                    <div className="flex items-center justify-between gap-3 pb-3 border-b border-gray-100">
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

                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wide text-zinc-400">
                          Patient
                        </p>

                        <p className="text-sm font-semibold text-[#343C6A] mt-1 break-words capitalize">
                          {item.patient?.name || "-"}
                        </p>
                        <p className="text-xs font-semibold text-[#343C6A] break-words">
                          {item.patient?.patientId || "-"}
                        </p>
                      </div>

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
                          Added by
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
                          ) : (
                            <p className="text-sm">Not Uploded</p>
                          )}
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </div>

              {/* DESKTOP MATRIX DATATABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedData}
                  loading={loading}
                />
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
      </div>

      {/* NEW ORDERS INGESTION INPUT PANEL MODAL */}
      <ICUInvestigationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveInvestigation}
      />
    </div>
  );
};

export default ICUInvestigations;
