import React, { useCallback, useEffect, useState } from "react";
import { ClipboardList, Plus } from "lucide-react";
import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import DoctorNoteModal from "../../../modal/ICU/ICUDoctorNoteModal";
import { icuService } from "../../../services/icuService";
import { formatTime } from "../../../utils/formatTime";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const Section = ({ title, icon: Icon, children, action }) => (
    <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-[#f0f0f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
                <Icon size={17} className="text-[#521785] shrink-0" />
                <h2 className="text-sm sm:text-base font-semibold text-[#343C6A] truncate">
                    {title}
                </h2>
            </div>

            {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
        </div>

        <div className="p-4 sm:p-5">{children}</div>
    </div>
);

const inputClass =
    "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const ICUDoctorNote = ({
    patientId,
    icuAdmissionId,
}) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [doctorNotes, setDoctorNotes] = useState([]);
    const [noteDate, setNoteDate] = useState(getCurrentDate());
    
    const [loading, setLoading] = useState(Boolean(patientId && icuAdmissionId));
    const [error, setError] = useState("");
    const { currentPage, totalPages, goToPage, setTotalPages } =
        usePagination(1);

    const loadDoctorNotes = useCallback(async () => {
            if (!patientId || !icuAdmissionId) {
                setDoctorNotes([]);
                setError("");
                setLoading(false);
                return;
            }

            setLoading(true);
            setError("");

            try {
                const response = await icuService.getDoctorNotes(
                    patientId,
                    icuAdmissionId,
                    noteDate
                );
                const notes = response?.data || [];
                setDoctorNotes(notes);
            } catch (err) {
                console.error("Failed to load ICU doctor notes:", err);
                setDoctorNotes([]);
                setError("Failed to load doctor notes.");
            } finally {
                setLoading(false);
            }
    }, [patientId, icuAdmissionId, noteDate]);

    useEffect(() => {
        loadDoctorNotes();
    }, [loadDoctorNotes]);

    useEffect(() => {
        const pages = Math.max(1, Math.ceil(doctorNotes.length / ITEMS_PER_PAGE));
        setTotalPages(pages);
        if (currentPage > pages) {
            goToPage(pages);
        }
    }, [doctorNotes.length, currentPage, goToPage, setTotalPages]);

    useEffect(() => {
        goToPage(1);
    }, [noteDate, goToPage]);

    const paginatedDoctorNotes = doctorNotes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <Section
                title="Doctor Notes"
                icon={ClipboardList}
                action={
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <div>
                            <input
                                type="date"
                                value={noteDate}
                                onChange={(event) => setNoteDate(event.target.value)}
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
                            <span>Add Doctor Note</span>
                        </button>
                    </div>
                }
            >
                {loading ? (
                    <p className="py-8 text-center text-sm text-gray-500">
                        Loading doctor notes...
                    </p>
                ) : error ? (
                    <p role="alert" className="py-8 text-center text-sm text-red-600">
                        {error}
                    </p>
                ) : doctorNotes.length > 0 ? (
                    <>
                        {/* Desktop */}
                        <div className="hidden lg:block overflow-x-auto border border-[#e5e5e5] rounded-md">
                            <TableComponent
                                columns={[
                                    {
                                        label: "Date",
                                        headerClassName: "text-left pl-4 min-w-[140px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A] font-medium">
                                                {item.noteDate || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Time",
                                        headerClassName: "text-left pl-4 min-w-[120px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A] font-medium">
                                                {formatTime(item.noteTime)|| "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Chief Complaint",
                                        headerClassName: "text-left pl-4 min-w-[180px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.chiefComplaint || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Clinical Findings",
                                        headerClassName: "text-left pl-4 min-w-[220px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.clinicalFindings || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Diagnosis",
                                        headerClassName: "text-left pl-4 min-w-[180px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.diagnosis || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Treatment Plan",
                                        headerClassName: "text-left pl-4 min-w-[220px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.treatmentPlan || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Doctor Advice",
                                        headerClassName: "text-left pl-4 min-w-[220px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.advice || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Notes",
                                        headerClassName: "text-left pl-4 min-w-[180px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.notes || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Doctor",
                                        headerClassName: "text-left pl-4 min-w-[150px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#521785] font-medium">
                                                {item?.doctor?.name || "-"}
                                            </p>
                                        ),
                                    },
                                ]}
                                data={paginatedDoctorNotes}
                                loading={loading}
                            />
                        </div>

                        {/* Mobile + Tablet */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {paginatedDoctorNotes.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="rounded-xl border border-[#e5e5e5] bg-[#F8F9FC] p-2 md:p-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                                        <div>
                                            <p className="text-sm font-semibold text-[#343C6A]">
                                                {item.noteDate || "—"}
                                            </p>
                                            <p className="text-xs text-[#8BA3CB] mt-0.5">
                                                {formatTime(item.noteTime) || "—"}
                                            </p>
                                        </div>

                                        <p className="text-xs font-medium text-[#521785]">
                                            {item.doctor?.name || "—"}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee]">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Chief Complaint
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.chiefComplaint || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee]">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Diagnosis
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.diagnosis || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Clinical Findings
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.clinicalFindings || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Treatment Plan
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.treatmentPlan || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Doctor Advice
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.advice || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Notes
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.notes || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 0 && (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                                <p className="text-xs text-zinc-500">
                                    Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                                    {Math.min(currentPage * ITEMS_PER_PAGE, doctorNotes.length)} of{" "}
                                    {doctorNotes.length} doctor notes
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
                    <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
                        No doctor notes recorded for this patient.
                    </div>
                )}
            </Section>

            <DoctorNoteModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={loadDoctorNotes}
                patientId={patientId}
                icuAdmissionId={icuAdmissionId}
            />
        </>
    );
};

export default ICUDoctorNote;