import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { icuService } from "../../../services/icuService";
import { formatTime } from "../../../utils/formatTime";

const ITEMS_PER_PAGE = 10;

const FIELD_PAIRS = [
  {
    left: { key: "noteDate", label: "Date" },
    right: { key: "noteTime", label: "Time" },
  },
  {
    left: { key: "patientCondition", label: "Patient Condition" },
    right: { key: "observations", label: "Observations" },
  },
  {
    left: { key: "nursingIntervention", label: "Nursing Intervention" },
    right: { key: "patientResponse", label: "Patient Response" },
  },
  {
    left: { key: "additionalNotes", label: "Additional Notes" },
    right: { key: "nurse", label: "Nurse" },
  },
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

const NoteCard = ({ note }) => (
  <div className="border border-zinc-200 rounded-xl overflow-hidden bg-white hover:border-zinc-300 transition">
    <div className="p-4 flex flex-col gap-4">
      {FIELD_PAIRS.map((pair) => (
        <div
          key={pair.left.key}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-b border-zinc-100 last:border-b-0 pb-4 last:pb-0"
        >
          <DetailBlock
            label={pair.left.label}
            value={note?.[pair.left.key]}
          />

          <DetailBlock
            label={pair.right.label}
            value={note?.[pair.right.key]}
          />
        </div>
      ))}
    </div>
  </div>
);

const ICUNursingNoteDetails = () => {
  const navigate = useNavigate();
  const { patientId: paramPatientId } = useParams();
  const { state } = useLocation();

  const patientId = state?.patientId || paramPatientId;
  const icuAdmissionId = state?.icuAdmissionId || "";

  const [notes, setNotes] = useState([]);
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noteDate, setNoteDate] = useState("");

  const {
    currentPage,
    totalPages,
    goToPage,
    setTotalPages,
  } = usePagination(1);

  const fetchNursingNotes = async () => {
    if (!patientId) {
      setError("Patient ID is missing.");
      setLoading(false);
      return;
    }

    if (!icuAdmissionId) {
      setError("ICU admission ID is missing.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      console.log("Fetching nursing notes with:", {
        patientId,
        icuAdmissionId,
      });

      const response = await icuService.getNursingNotes(
        patientId,
        icuAdmissionId,
        "",
        noteDate || undefined
      );

      // console.log("getNursingNotes response:", response);

      if (!response?.success) {
        throw new Error(
          response?.message || "Failed to fetch nursing notes."
        );
      }

      const apiNotes = response?.data || [];

      if (apiNotes.length > 0) {
        const apiPatient = apiNotes[0]?.patient;

        if (apiPatient) {
          setPatient(apiPatient);
        }
      }

      const formattedNotes = apiNotes
        .map((item) => ({
          ...item,
          noteTime: item?.noteTime
            ? formatTime(item.noteTime)
            : "-",
          nurse: item?.nurse?.name || "-",
        }))
        .sort((a, b) => {
          const aDateTime = new Date(
            `${a?.noteDate || ""} ${a?.noteTime || ""}`
          ).getTime();

          const bDateTime = new Date(
            `${b?.noteDate || ""} ${b?.noteTime || ""}`
          ).getTime();

          return bDateTime - aDateTime;
        });

      setNotes(formattedNotes);
    } catch (err) {
      console.error(
        "Error fetching nursing notes:",
        err
      );

      setNotes([]);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch nursing notes."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNursingNotes();
  }, [patientId, icuAdmissionId, noteDate]);

  useEffect(() => {
    setTotalPages(
      Math.max(
        1,
        Math.ceil(notes.length / ITEMS_PER_PAGE)
      )
    );
  }, [notes.length, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [patientId, icuAdmissionId, noteDate]);

  const paginatedNotes = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    return notes.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [notes, currentPage]);

  if (loading) {
    return (
      <div className="w-full mx-auto p-1 py-0 max-w-[1100px] 2xl:max-w-[1600px]">
        <div className="flex flex-col sm:flex-row sm:items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Nursing Notes
          </h1>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-zinc-200 p-10 text-center">
          <p className="text-sm font-semibold text-zinc-600">
            Loading nursing notes...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full mx-auto p-3 sm:p-4 md:p-6 lg:p-4 xl:px-6 xl:py-0 max-w-[1100px] 2xl:max-w-[1600px]">
        <div className="flex items-center gap-3 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900">
            Nursing Notes
          </h1>
        </div>

        <div className="mt-6 bg-white rounded-2xl border border-zinc-200 p-10 text-center">
          <p className="text-sm font-semibold text-red-600">
            Failed to load nursing notes
          </p>

          <p className="text-xs text-zinc-400 mt-1">
            {error}
          </p>

          <button
            type="button"
            onClick={fetchNursingNotes}
            className="mt-4 px-4 h-9 rounded-md bg-[#521785] text-white text-sm hover:bg-[#45126f] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-6">
      {/* HEADER */}
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
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight truncate">
                {patient?.name || "Nursing Notes"}
              </h1>

            </div>

            <p className="text-xs sm:text-sm text-zinc-400">
              {patient?.patientId
                ? `PatientID - ${patient.patientId}`
                : ""}
              {patient?.patientId && notes.length > 0
                ? " • "
                : ""}
              {notes.length}{" "}
              {notes.length === 1
                ? "note"
                : "notes"}{" "}
              recorded
            </p>
          </div>
        </div>
        <input
          type="date"
          value={noteDate}
          onChange={(event) => setNoteDate(event.target.value)}
          aria-label="Filter nursing notes by date"
          className="h-9 px-3 rounded-md border border-zinc-200 bg-white text-sm text-zinc-800 outline-none transition focus:border-blue-500 ml-auto "
        />
      </div>


      {notes.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4">
            {paginatedNotes.map((note) => (
              <NoteCard
                key={note?.id}
                note={note}
              />
            ))}
          </div>

          {totalPages > 0 && (
            <div className="flex justify-end">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center">
          <p className="text-sm font-semibold text-zinc-600">
            No notes recorded for this patient yet.
          </p>

          <p className="text-xs text-zinc-400 mt-1">
            No nursing notes were found for the selected ICU admission.
          </p>
        </div>
      )}
    </div>
  );
};

export default ICUNursingNoteDetails;