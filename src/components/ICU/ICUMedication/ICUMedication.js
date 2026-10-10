import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Pill, Plus } from "lucide-react";

import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import MedicationModal from "../../../modal/ICU/ICUMedicationModal";
import { icuService } from "../../../services/icuService";

const ITEMS_PER_PAGE = 10;
const PRIMARY = "#521785";

const inputClass =
    "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const formatDate = (value) => {
    if (!value) return "-";

    return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const ICUMedication = ({
    patientId,
    icuAdmissionId,
}) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [medications, setMedications] = useState([]);
    const [medicationDate, setMedicationDate] = useState(getCurrentDate());
    const [loading, setLoading] = useState(Boolean(patientId && icuAdmissionId));
    const [error, setError] = useState("");

    const loadMedications = useCallback(async () => {
            if (!patientId || !icuAdmissionId) {
                setMedications([]);
                setError("");
                setLoading(false);
                return;
            }
            setLoading(true);
            setError("");

            try {
                const response = await icuService.getMedications(
                    patientId,
                    icuAdmissionId,
                    medicationDate
                );

                setMedications(response?.data || []);

            } catch (err) {
                console.error("Failed to load ICU medications:", err);
                setMedications([]);
                setError("Failed to load medications.");
     
            } finally {
                setLoading(false);
            }
    }, [patientId, icuAdmissionId, medicationDate]);


    useEffect(() => {

        if (!patientId || !icuAdmissionId) {
            setMedications([]);
            setError("");
            setLoading(false);
            return;
        }

        loadMedications();

    }, [patientId, icuAdmissionId, medicationDate]);

    useEffect(() => {
        setCurrentPage(1);
    }, [medications,medicationDate]);

    const totalPages = Math.max(
        1,
        Math.ceil(medications.length / ITEMS_PER_PAGE)
    );

    const paginatedMedications = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

        return medications.slice(
            startIndex,
            startIndex + ITEMS_PER_PAGE
        );
    }, [medications, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleOpenMedicationModal = () => {
        setIsModalOpen(true);
    };

    const handleCloseMedicationModal = () => {
        setIsModalOpen(false);
    };


    const columns = [
        {
            key: "medicineName",
            label: "Medicine",
            headerClassName: "text-left whitespace-nowrap pl-2",
            render: (row) => (
                <div className="min-w-[160px] max-w-[240px] whitespace-normal break-words pl-2">
                    <p className="font-semibold text-[#343C6A]">
                        {row.medicineName || "—"}
                    </p>
                </div>
            ),
        },

        {
            key: "recordedByDetails",
            label: "Recorded By",
            headerClassName: "text-left pl-2 whitespace-nowrap",
            render: (row) => (
                <div className="pl-2 whitespace-nowrap">
                    <p className="font-semibold text-[#343C6A]">
                        {row.recordedByDetails?.name || "—"}
                    </p>
                </div>
            ),
        },
        {
            key: "dose",
            label: "Dose",
            headerClassName: "text-left whitespace-nowrap pl-8",
            render: (row) => (
                <span className="whitespace-nowrap pl-8">
                    {row.dose || "—"}
                </span>
            ),
        },
        {
            key: "route",
            label: "Route",
            headerClassName: "text-left whitespace-nowrap pl-8",
            render: (row) => (
                <span className="whitespace-nowrap pl-8">
                    {row.route || "—"}
                </span>
            ),
        },
        {
            key: "frequency",
            label: "Frequency",
            headerClassName: "text-left whitespace-nowrap pl-8",
            render: (row) => (
                <span className="whitespace-nowrap pl-8 ">
                    {row.frequency || "—"}
                </span>
            ),
        },
        {
            key: "startDate",
            label: "Start Date",
            headerClassName: "text-left whitespace-nowrap pl-8",
            render: (row) => (
                <span className="whitespace-nowrap pl-8">
                    {formatDate(row.startDate)}     
                </span>
            ),
        },
        {
            key: "endDate",
            label: "End Date",
            headerClassName: "text-left whitespace-nowrap pl-8",
            render: (row) => (
                <span className="whitespace-nowrap pl-8">
                    {formatDate(row.endDate)}
                </span>
            ),
        },

        {
            key: "instructions",
            label: "Instructions",
            headerClassName: "text-left whitespace-nowrap pl-8",
            className: "py-4 pl-8 pr-2 align-top font-semibold whitespace-nowrap",
            render: (item) => (
                <span className="font-semibold text-[#343C6A] capitalize min-w-0 max-w-xs text-wrap whitespace-nowrap text-sm">
                {item?.instructions || "-"}
                </span>
            ),
            },
    ];

    return (
        <>
            <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
                {/* Header */}
                <div className="px-4 sm:px-5 py-3 border-b border-[#f0f0f0]">
                    <div className="flex flex-col lg:flex-row justify-between gap-3">
                        <div className="flex items-center gap-2 min-w-0">
                            <Pill
                                size={17}
                                className="text-[#521785] shrink-0"
                            />

                            <h2 className="text-sm sm:text-base font-semibold text-[#343C6A] truncate">
                                Medication ({medications.length})
                            </h2>
                        </div>

                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full lg:w-auto">
                            <input
                                type="date"
                                value={medicationDate}
                                onChange={(event) => setMedicationDate(event.target.value)}
                                className={`${inputClass} w-full sm:w-auto`}
                            />

                            <button
                                type="button"
                                onClick={handleOpenMedicationModal}
                                className="w-full sm:w-auto flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
                                style={{ backgroundColor: PRIMARY }}
                            >
                                <Plus size={15} />
                                <span>Add Medication</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                    {loading ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Loading medications...
                        </p>
                    ) : error ? (
                        <p role="alert" className="py-8 text-center text-sm text-red-600">
                            {error}
                        </p>
                    ) : medications.length === 0 ? (
                        <div className="bg-[#F8F9FC] rounded-lg p-6 text-center">
                            <Pill
                                size={32}
                                className="mx-auto mb-2 text-[#8BA3CB]"
                            />

                            <p className="text-sm text-[#8BA3CB]">
                                No medications recorded for this patient.
                            </p>
                        </div>
                    ) : (
                        <>

                            <div className="hidden lg:block overflow-x-auto">
                                <TableComponent
                                    columns={columns}
                                    data={paginatedMedications}
                                />
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:hidden">
                                {paginatedMedications.map((medication) => (
                                    <div
                                        key={medication.id}
                                        className="border border-[#E5E7EB] rounded-lg bg-white p-4 shadow-sm"
                                    >
                                        {/* Medicine Header */}
                                        <div className="flex items-start justify-between gap-3 pb-3 border-b border-[#F0F0F0]">
                                            <div className="flex items-start gap-2 min-w-0">
                                                <div className="w-8 h-8 rounded-md bg-[#F3E8FF] flex items-center justify-center shrink-0">
                                                    <Pill
                                                        size={16}
                                                        className="text-[#521785]"
                                                    />
                                                </div>

                                                <div className="min-w-0">
                                                    <p className="text-sm font-semibold text-[#343C6A] break-words">
                                                        {medication.medicineName ||
                                                            "—"}
                                                    </p>

                                                    <p className="text-xs text-zinc-400 mt-0.5">
                                                        Medication
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Medication Details */}
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-3">
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                                                    Dose
                                                </p>

                                                <p className="text-sm text-zinc-700 mt-0.5 break-words">
                                                    {medication.dose || "—"}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                                                    Route
                                                </p>

                                                <p className="text-sm text-zinc-700 mt-0.5 break-words">
                                                    {medication.route || "—"}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                                                    Frequency
                                                </p>

                                                <p className="text-sm text-zinc-700 mt-0.5 break-words">
                                                    {medication.frequency ||
                                                        "—"}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                                                    Recorded By
                                                </p>

                                                <p className="text-sm text-zinc-700 mt-0.5 break-words">
                                                    {medication.recordedByDetails?.name || "—"}
                                                </p>
                                            </div>
                                            
                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                                                    Start Date
                                                </p>

                                                <p className="text-sm text-zinc-700 mt-0.5 whitespace-nowrap">
                                                    {formatDate(
                                                        medication.startDate
                                                    )}
                                                </p>
                                            </div>

                                            <div className="min-w-0">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                                                    End Date
                                                </p>

                                                <p className="text-sm text-zinc-700 mt-0.5 whitespace-nowrap">
                                                    {formatDate(
                                                        medication.endDate
                                                    )}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Instructions */}
                                        {medication.instructions && (
                                            <div className="mt-3 pt-3 border-t border-[#F0F0F0]">
                                                <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-400">
                                                    Instructions
                                                </p>

                                                <p className="text-sm text-zinc-600 mt-1 leading-5 break-words">
                                                    {medication.instructions}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            {totalPages > 0 && (
                                <div className="mt-5 flex justify-end">
                                    <Pagination
                                        currentPage={currentPage}
                                        setCurrentPage={setCurrentPage}
                                        totalPages={totalPages}
                                        goToPage={handlePageChange}
                                    />
                                </div>
                            )}
                        </>
                    )}
                </div>
            </div>

            {/* Medication Modal */}
            <MedicationModal
                isOpen={isModalOpen}
                onClose={handleCloseMedicationModal}
                onSave={loadMedications}
                patientId={patientId}
                icuAdmissionId={icuAdmissionId}
            />
        </>
    );
};

export default ICUMedication;