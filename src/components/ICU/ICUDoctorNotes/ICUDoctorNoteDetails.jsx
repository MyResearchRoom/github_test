import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BedDouble, User, Stethoscope } from "lucide-react";
// import { patients } from "../../../pages/ICU/ICUDoctorNote";
import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { icuService } from "../../../services/icuService";
import { formatTime } from "../../../utils/formatTime";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const FIELD_PAIRS = [
  { left: { key: "date", label: "Date" }, right: { key: "time", label: "Time" } },
  { left: { key: "chiefComplaint", label: "Chief Complaint" }, right: { key: "clinicalFindings", label: "Clinical Findings" } },
  { left: { key: "diagnosis", label: "Diagnosis" }, right: { key: "treatmentPlan", label: "Treatment Plan" } },
  { left: { key: "doctorAdvice", label: "Doctor Advice" }, right: { key: "notes", label: "Notes" } },
];

const DetailBlock = ({ label, value }) => (
  <div>
    <p className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
      {label}
    </p>
    <p className="text-xs sm:text-sm text-zinc-700 leading-5 whitespace-pre-line">
      {value || "-"}
    </p>
  </div>
);

const NoteCard = ({ note, index }) => {
  const isAlternate = index % 2 !== 0;

  return (
    <div className={`border border-zinc-200 rounded-xl overflow-hidden hover:border-zinc-300 transition ${isAlternate ? "bg-[#FAF7FF]" : "bg-white"}`}>
      <div className={`p-4 flex flex-col gap-4 ${isAlternate ? "bg-[#FAF7FF]" : "bg-white"}`}>
        {FIELD_PAIRS.map((pair) => (
          <div
            key={pair.left.key}
            className="grid md:grid-cols-2 gap-4 border-b border-zinc-100 last:border-b-0 pb-4 last:pb-0"
          >
            <DetailBlock
              label={pair.left.label}
              value={note[pair.left.key]}
            />

            <DetailBlock
              label={pair.right.label}
              value={note[pair.right.key]}
            />
          </div>
        ))}
        <div>
          <p className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
            Added By
          </p>
          <p className="text-xs sm:text-sm text-zinc-700 leading-5 whitespace-pre-line">
            {note?.doctor?.name || "-"}
          </p>
        </div>
      </div>
    </div>
  );
};

const ICUDoctorNoteDetails = () => {
  const navigate = useNavigate();
  const { patientId: paramPatientId } = useParams();
  const { state } = useLocation();

  const patientId = state?.patientId || paramPatientId;
  const icuAdmissionId = state?.icuAdmissionId;


  const [patientNotes, setPatientNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [noteDate, setNoteDate] = useState("");
  const [patient, setPatient] = useState(state?.patient || null);

  const fetchPatientNotes = useCallback(async () => {
    if (!patientId || !icuAdmissionId) return;

    try {
      setLoading(true);

      const response = await icuService.getDoctorNotes(
        patientId,
        icuAdmissionId,
        noteDate || undefined
      );

      const formattedNotes = (response?.data || []).map((note) => ({
        ...note,
        date: note.noteDate || "",
        time: note.noteTime ? formatTime(note.noteTime) : "",
        doctorAdvice: note.advice || "",
      }));

      setPatientNotes(formattedNotes);
      if (formattedNotes[0]?.patient) {
        setPatient(formattedNotes[0].patient);
      }
    } catch (error) {
      console.error("Failed to fetch patient doctor notes:", error);
      setPatientNotes([]);
    } finally {
      setLoading(false);
    }
  }, [patientId, icuAdmissionId, noteDate]);

  useEffect(() => {
    fetchPatientNotes();
  }, [fetchPatientNotes]);

  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination(1);

  useEffect(() => {
    goToPage(1);
  }, [noteDate, goToPage]);

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(patientNotes.length / ITEMS_PER_PAGE)));
    if (currentPage > Math.max(1, Math.ceil(patientNotes.length / ITEMS_PER_PAGE))) {
      goToPage(1);
    }
  }, [patientNotes.length, currentPage, setTotalPages, goToPage]);

  const paginatedNotes = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return patientNotes.slice(start, start + ITEMS_PER_PAGE);
  }, [patientNotes, currentPage]);

  if (!patient && !loading) {
    return (
      <div className="w-full mx-auto p-3 sm:p-4 md:p-6 max-w-[1100px] flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-medium w-fit"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={16} />
          Back to Doctor Notes
        </button>

        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500">
          This patient could not be found. Please go back and open it again from the list.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-4 ">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:tems-center gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight truncate capitalize">
                {patient?.name || "Doctor Notes"}
              </h1>

            </div>
            <p className="text-xs sm:text-sm text-zinc-400">
              {patientNotes.length} {patientNotes.length === 1 ? "note" : "notes"} recorded
            </p>
          </div>
        </div>
        <input
          type="date"
          value={noteDate}
          onChange={(event) => setNoteDate(event.target.value)}
          aria-label="Filter doctor notes by date"
          className="h-9 px-3 rounded-md border border-zinc-200 bg-white text-sm text-zinc-800 outline-none transition focus:border-blue-500 ml-auto"
        />
      </div>

      {/* Notes */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500">
          Loading doctor notes...
        </div>
      ) : patientNotes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-1 gap-4">
            {paginatedNotes.map((note, index) => (
              <NoteCard
                key={note.id}
                note={note}
                index={index}
              />
            ))}
          </div>

          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500">
          No notes recorded for this patient yet.
        </div>
      )}
    </div>
  );
};

export default ICUDoctorNoteDetails;