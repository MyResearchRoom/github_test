import React, { useCallback, useEffect, useState } from "react";
import { ClipboardCheck, Plus } from "lucide-react";
import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import NursingNoteModal from "../../../modal/ICU/ICUNursingNoteModal";
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

const ICUNursingNote = ({
    patientId,
    icuAdmissionId
}) => {
    const role = localStorage.getItem("role");
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [noteDate, setNoteDate] = useState("");
    const [nursingNotes, setNursingNotes] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const fetchNursingNotes = useCallback(async () => {
        if (!patientId || !icuAdmissionId) {
            setNursingNotes([]);
            setError("Patient ID or ICU admission ID is missing.");
            return;
        }

        setLoading(true);
        setError("");
        try {
            const response = await icuService.getNursingNotes(
                patientId,
                icuAdmissionId,
                "",
                noteDate || undefined
            );

            if (!response?.success) {
                throw new Error(response?.message || "Failed to load nursing notes.");
            }

            setNursingNotes(
                (Array.isArray(response?.data) ? response.data : []).map((item) => ({
                    ...item,
                    recordedAtDate: item?.recordedAtDate || item?.noteDate,
                    recordedAtTime: item?.recordedAtTime || item?.noteTime,
                    nurse: item?.nurse?.name || item?.nurse || "-",
                    nurseId: item?.nurse?.receptionistId || item?.nurse?.id || "-",
                }))
            );
        } catch (fetchError) {
            console.error("Failed to fetch nursing notes:", fetchError);
            setNursingNotes([]);
            setError(
                fetchError?.response?.data?.message ||
                fetchError?.message ||
                "Failed to load nursing notes."
            );
        } finally {
            setLoading(false);
        }
    }, [patientId, icuAdmissionId, noteDate]);

    useEffect(() => {
        fetchNursingNotes();
    }, [fetchNursingNotes]);

    const totalPages = Math.max(
        1,
        Math.ceil(nursingNotes.length / ITEMS_PER_PAGE)
    );

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);

    const paginatedNotes = nursingNotes.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <Section
                title="Nursing Notes"
                icon={ClipboardCheck}
                action={
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <div>
                            <input
                                type="date"
                                value={noteDate}
                                onChange={(event) => {
                                    setNoteDate(event.target.value);
                                    setCurrentPage(1);
                                }}
                                aria-label="Filter nursing notes by date"
                                className={inputClass}
                            />
                        </div>

                        {role === "nurse" &&
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                <Plus size={15} />
                                <span>Add Nursing Note</span>
                            </button>
                        }
                    </div>
                }
            >
                {loading ? (
                    <p className="py-8 text-center text-sm text-zinc-500">
                        Loading nursing notes...
                    </p>
                ) : error ? (
                    <p role="alert" className="py-8 text-center text-sm text-red-600">
                        {error}
                    </p>
                ) : nursingNotes.length > 0 ? (
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
                                                {item.recordedAtDate || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Time",
                                        headerClassName: "text-left pl-4 min-w-[120px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A] font-medium">
                                                {formatTime(item.recordedAtTime) || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Patient Condition",
                                        headerClassName: "text-left pl-4 min-w-[200px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.patientCondition || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Observations",
                                        headerClassName: "text-left pl-4 min-w-[220px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">{item.observations || "-"}</p>
                                        ),
                                    },
                                    {
                                        label: "Nursing Intervention",
                                        headerClassName: "text-left pl-4 min-w-[220px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.nursingIntervention || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Patient Response",
                                        headerClassName: "text-left pl-4 min-w-[200px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.patientResponse || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Additional Notes",
                                        headerClassName: "text-left pl-4 min-w-[180px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">
                                                {item.additionalNotes || "-"}
                                            </p>
                                        ),
                                    },
                                    {
                                        label: "Nurse",
                                        headerClassName: "text-left pl-4 min-w-[160px] whitespace-normal",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#521785] font-medium">
                                                {item.nurse || "-"} {(item.nurseId || "-")}
                                            </p>
                                        ),
                                    },
                                ]}
                                data={paginatedNotes}
                                loading={false}
                            />
                        </div>

                        {/* Mobile + Tablet */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {paginatedNotes.map((item, index) => (
                                <div
                                    key={item.id || index}
                                    className="rounded-xl border border-[#e5e5e5] bg-[#F8F9FC] p-2 md:p-4"
                                >
                                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 mb-4">
                                        <div>
                                            <p className="text-sm font-semibold text-[#343C6A]">
                                                Date: {item.recordedAtDate || "—"}
                                            </p>
                                            <p className="text-xs text-[#8BA3CB] mt-0.5">
                                                {formatTime(item.recordedAtTime) || "—"}
                                            </p>
                                        </div>

                                        <p className="text-xs font-medium text-[#521785]">
                                            Recorded by: {item.nurse || "—"} {(item.nurseId || "-")}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Patient Condition
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.patientCondition || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Observations
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.observations || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Nursing Intervention
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.nursingIntervention || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Patient Response
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.patientResponse || "—"}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee] sm:col-span-2">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Additional Notes
                                            </p>
                                            <p className="text-[13px] text-[#343C6A]">
                                                {item.additionalNotes || "—"}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
                        No nursing notes recorded for this patient.
                    </div>
                )}
                {!loading && !error && nursingNotes.length > 0 && totalPages > 0 && (
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                        <p className="text-xs text-zinc-500">
                            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                            {Math.min(currentPage * ITEMS_PER_PAGE, nursingNotes.length)} of{" "}
                            {nursingNotes.length} nursing notes
                        </p>
                        <Pagination
                            currentPage={currentPage}
                            setCurrentPage={setCurrentPage}
                            totalPages={totalPages}
                            goToPage={setCurrentPage}
                        />
                    </div>
                )}
            </Section>

            <NursingNoteModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSuccess={fetchNursingNotes}
                isDetailsPage={true}
                patientId={patientId}
                icuAdmissionId={icuAdmissionId}
            />
        </>
    );
};

export default ICUNursingNote;