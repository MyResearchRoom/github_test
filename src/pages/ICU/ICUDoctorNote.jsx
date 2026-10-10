import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Search, Eye } from "lucide-react";
import DoctorNoteModal from "../../modal/ICU/ICUDoctorNoteModal";
import TableComponent from "../../commonComponent/TableComponent";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { getCurrentDate } from "../../utils/getCurrentDate";
import { icuService } from "../../services/icuService";

const ITEMS_PER_PAGE = 10;


const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";


const ICUDoctorNote = () => {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination(1);

  const filteredNotes = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return  notes;
    }

    return notes.filter((note) => {
      return (
        note.patient.toLowerCase().includes(term) ||
        note.chiefComplaint?.toLowerCase().includes(term) ||
        note.doctorAdvice?.toLowerCase().includes(term)
      );
    });
  }, [notes, searchTerm]);

  useEffect(() => {
    const pages = Math.max(1, Math.ceil(filteredNotes.length / ITEMS_PER_PAGE));
    setTotalPages(pages);

    if (currentPage > pages) {
      goToPage(pages);
    }
  }, [filteredNotes.length, currentPage, goToPage, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [searchTerm, goToPage]);

  const paginatedNotes = filteredNotes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

 const handleViewNote = (item) => {
  navigate(`/icu-doctor-notes/${item.id}`, {
    state: {
      patientId: item.id,
      icuAdmissionId: item.icuAdmissionId,
    },
  });
};

  const fetchDoctorNotes = async () => {
  try {
    setLoading(true);

   const response = await icuService.getLatestDoctorNotes();

const formattedNotes = (response?.data || []).map((note) => ({
  ...note,
  id:note.patient?.id || null,
  patient: note.patient?.name || "-",
  patientId: note.patient?.patientId || "-",
  age: note.patient?.age || "-",
  date: note.noteDate || "-",
  time: note.noteTime || "-",
  doctorAdvice: note.advice || "-",
}));

setNotes(formattedNotes);

  } catch (error) {
    console.error("Failed to fetch doctor notes:", error);
    setNotes([]);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  fetchDoctorNotes();
}, []);

  const columns = [
    {
      label: "Name",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <div>
          <p className="text-zinc-700 whitespace-nowrap">
            {item?.patient || "-"}
          </p>
          <p className="text-[11px] text-zinc-400 whitespace-nowrap">
            {item?.patientId || "-"}
          </p>
        </div>
      ),
    },
    {
      label: "Date & Time",
      headerClassName: "text-left px-8 whitespace-nowrap",
      className: "px-8 py-3",
      render: (item) => (
        <div>
          <p className="text-zinc-700 whitespace-nowrap">{item.date}</p>
          <p className="text-zinc-700 whitespace-nowrap">{item.time}</p>
        </div>
      ),
    },

    {
      label: "Chief Complaint",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-normal min-w-[250px] max-w-[350px]">
          {item.chiefComplaint}
        </p>
      ),
    },
   
    {
      label: "Doctor Advice",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-normal min-w-[250px] max-w-[250px]">
          {item.doctorAdvice}
        </p>
      ),
    },
   
  ];

  return (
    <div className="w-full mx-auto p-1 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* PAGE HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Doctor Notes
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Clinical notes and treatment updates for ICU patients
          </p>
        </div>

        <div className="flex flex-col gap-3 lg:flex-row">
          <div>
            <input
              type="date"
              defaultValue={getCurrentDate()}
              className={inputClass}
            />
          </div>
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
          >
            <Plus size={16} />
            <span>New Doctor Note</span>
          </button>
        </div>

      </div>

      {/* NOTES CARD */}
      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">
          <div>
            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
              Clinical Notes
            </p>
            <p className="text-xs text-zinc-400 mt-1">
              {filteredNotes.length} {filteredNotes.length === 1 ? "note" : "notes"} shown
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search patient..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 transition text-sm"
            />

            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>
        </div>

        <div className="p-4 sm:p-5">
          {loading ? (
            <p className="py-12 text-center text-sm text-zinc-500">
              Loading doctor notes...
            </p>
          ) : filteredNotes.length > 0 ? (
            <>
              {/* MOBILE + TABLET CARDS */}
              <div className="flex lg:hidden flex-col gap-3">
                {paginatedNotes.map((note, index) => (
                  <div
                    key={note.id}
                    onClick={() => handleViewNote(note)}
                    className="border border-zinc-200 rounded-xl p-4 cursor-pointer hover:border-zinc-300 transition"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-xs text-zinc-400 mb-0.5">
                          #{(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                        </p>
                        <p className="text-sm font-semibold text-zinc-900 truncate">
                          {note.patient}
                        </p>
                        <p className="text-xs text-zinc-400 mt-1">
                          Patient ID{" "}
                          <span className="font-semibold text-zinc-600">
                            {note.patientId || "-"}
                          </span>
                          
                        </p>
                      </div>

                      <div className="text-right shrink-0">
                        <p className="text-xs font-semibold text-zinc-700">{note.date}</p>
                        <p className="text-xs text-zinc-400 mt-0.5">{note.time}</p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-1 gap-3 border-t border-zinc-100 pt-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Chief Complaint
                        </p>
                        <p className="mt-1 text-sm text-zinc-700 whitespace-pre-line">
                          {note.chiefComplaint || "-"}
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">
                          Doctor Advice
                        </p>
                        <p className="mt-1 text-sm text-zinc-700 whitespace-pre-line">
                          {note.doctorAdvice || "-"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewNote(note);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition"
                    >
                      <Eye size={14} />
                      View Details
                    </button>
                  </div>
                ))}
              </div>

              {/* DESKTOP TABLE */}
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedNotes}
                  loading={loading}
                  onClick={handleViewNote}
                  actions={(item) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewNote(item);
                      }}
                      title="View note"
                      className="w-8 h-8 rounded-md flex items-center justify-center border border-zinc-200 hover:bg-[#F3E8FF] transition mx-auto"
                    >
                      <Eye size={15} className="text-[#521785]" />
                    </button>
                  )}
                  actionLabel="Action"
                />
              </div>
              {!loading && totalPages > 0 && (
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                  <p className="text-xs text-zinc-500">
                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                    {Math.min(currentPage * ITEMS_PER_PAGE, filteredNotes.length)} of{" "}
                    {filteredNotes.length} doctor notes
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
              <p className="text-sm font-semibold text-zinc-600">No doctor notes found</p>
              <p className="text-xs text-zinc-400 mt-1">
                Try searching with another patient or diagnosis.
              </p>
            </div>
          )}
        </div>
      </div>

      <DoctorNoteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
};

export default ICUDoctorNote;