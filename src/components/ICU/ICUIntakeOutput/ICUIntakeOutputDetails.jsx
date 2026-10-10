import React, { useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, Plus, BedDouble, User } from "lucide-react";
import ICUIntakeOutputModal from "../../../modal/ICU/ICUIntakeOutputModal";
// import { initialEntries, patients } from "../../../pages/ICU/ICUIntakeOutput";
import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import { icuService } from "../../../services/icuService";
import AddIntakeOutputModal from "../../../modal/IPD/AddIntakeOutputModal";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const categoryBadge = (category) =>
    category?.toLowerCase() === "intake" ? "bg-blue-100 text-blue-700" : "bg-amber-100 text-amber-700";

const inputClass = "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const formatDate = (value) => {
    if (!value) return "-";
    return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

const ICUIntakeOutputDetails = () => {
    const navigate = useNavigate();
    const { patientId: paramPatientId } = useParams();
    const { state } = useLocation();

    const patientId = state?.patientId || paramPatientId;
    const icuAdmissionId = state?.icuAdmissionId;

    const [entries, setEntries] = useState([]);
    const [patient, setPatient] = useState(state?.patient || null);
    const [loading, setLoading] = useState(false);
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [selectedDate, setSelectedDate] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");
    const { currentPage, totalPages, goToPage, setTotalPages } =
        usePagination(1);


    const visibleEntries = entries;

    const intake = visibleEntries
        .filter((e) => e.category?.toLowerCase() === "intake")
        .reduce((sum, e) => {
            const quantity = parseFloat(e.quantity) || 0;
            return sum + quantity;
        }, 0);

    const output = visibleEntries
        .filter((e) => e.category?.toLowerCase() === "output")
        .reduce((sum, e) => {
            const quantity = parseFloat(e.quantity) || 0;
            return sum + quantity;
        }, 0);

    const totals = {
        intake,
        output,
        net: intake - output,
    };

    const fetchInputOutput = useCallback(async () => {
        if (!patientId || !icuAdmissionId) {
            setEntries([]);
            return;
        }

        try {
            setLoading(true);

            const response = await icuService.getInputOutput({
                patientId,
                icuAdmissionId,
                date: selectedDate,
                category: categoryFilter === "All" ? "" : categoryFilter.toLowerCase(),
            });

            if (response?.success) {
                const data = response.intakeAndOutput || [];

                setEntries(data);

                if (data.length > 0) {
                    setPatient(data[0].patient);
                }
            } else {
                setEntries([]);
            }
        } catch (error) {
            console.error("Failed to fetch ICU intake/output:", error);
            setEntries([]);
        } finally {
            setLoading(false);
        }
    }, [patientId, icuAdmissionId, selectedDate, categoryFilter]);

    useEffect(() => {
        fetchInputOutput();
    }, [fetchInputOutput]);

    useEffect(() => {
        goToPage(1);
    }, [selectedDate, categoryFilter, goToPage]);

    useEffect(() => {
        const pages = Math.max(1, Math.ceil(entries.length / ITEMS_PER_PAGE));
        setTotalPages(pages);
        if (currentPage > pages) {
            goToPage(pages);
        }
    }, [entries.length, currentPage, goToPage, setTotalPages]);

    const paginatedEntries = entries.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    const handleOpenModal = (category) => {
        setSelectedCategory(category);
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setSelectedCategory("");
    };

    const handleSaveEntry = (formData) => {
        fetchInputOutput();
        handleCloseModal();
    };

    if (!patient) {
        return (
            <div className="w-full mx-auto p-3 sm:p-4 md:p-6 max-w-[1100px] flex flex-col gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-sm font-medium w-fit"
                    style={{ color: PRIMARY }}
                >
                    <ArrowLeft size={16} />
                    Back to Intake & Output
                </button>

                <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500">
                    This patient could not be found. Please go back and open it again from the list.
                </div>
            </div>
        );
    }

    return (
        <div className="w-full mx-auto p-1 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">
            {/* Header */}
            <div className="flex items-center gap-3">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition shrink-0"
                >
                    <ArrowLeft size={18} />
                </button>

                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                        Intake &amp; Output
                    </h1>
                    <p className="text-xs sm:text-sm text-zinc-400">
                        Fluid balance tracking for {patient.name}.
                    </p>
                </div>
            </div>
        

            {/* Toolbar: filter + add buttons */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm px-4 sm:px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-end gap-3">
                <div className="flex items-center gap-2">
                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        aria-label="Filter intake and output by category"
                        className="h-9 px-3 rounded-md border border-zinc-200 bg-white outline-none focus:border-blue-500 transition text-sm font-medium text-zinc-800"
                    >
                        <option value="All">All Category</option>
                        <option value="Intake">Intake</option>
                        <option value="Output">Output</option>
                    </select>
                </div>

                <div className="flex flex-col sm:flex-row gap-2">
                    <div>
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(event) => setSelectedDate(event.target.value)}
                            aria-label="Filter intake and output by date"
                            className={inputClass}
                        />
                    </div>
                    <button
                        type="button"
                        onClick={() => handleOpenModal("intake")}
                        className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
                    >
                        <Plus size={16} />
                        <span>Add Intake</span>
                    </button>

                    <button
                        type="button"
                        onClick={() => handleOpenModal("output")}
                        className="bg-[#521785] px-3 sm:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
                    >
                        <Plus size={16} />
                        <span>Add Output</span>
                    </button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 sm:p-5">
                    <p className="text-2xl sm:text-3xl font-bold text-blue-600">{totals.intake} mL</p>
                    <p className="text-xs text-zinc-500 mt-1">Total Intake</p>
                </div>

                <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4 sm:p-5">
                    <p className="text-2xl sm:text-3xl font-bold text-amber-600">{totals.output} mL</p>
                    <p className="text-xs text-zinc-500 mt-1">Total Output</p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 sm:p-5">
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-600">
                        {totals.net >= 0 ? "+" : ""}{totals.net} mL
                    </p>
                    <p className="text-xs text-zinc-500 mt-1">Net Balance</p>
                </div>
            </div>

            {/* Entries table */}
            <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
                <div className="p-4 sm:p-5">
                    {loading ? (
                        <p className="py-12 text-center text-sm text-zinc-500">
                            Loading intake and output entries...
                        </p>
                    ) : visibleEntries.length > 0 ? (
                        <>
                            {/* Mobile / Tablet cards */}
                            <div className="flex lg:hidden flex-col gap-3">
                                {paginatedEntries.map((entry) => (
                                    <div key={entry.id} className="border border-zinc-200 rounded-xl p-4">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className={`text-xs font-semibold px-2 py-1 capitalize rounded-md ${categoryBadge(entry.category)}`}>
                                                {entry.category || "-"}
                                            </span>
                                            <p className="text-xs text-zinc-400 font-medium">
                                                {formatDate(entry.date)} · {entry.time}
                                            </p>
                                        </div>

                                        <p className="text-xs text-zinc-500 mb-2">
                                            Recorded by: {entry.recordedByDetails?.name || "—"}
                                        </p>

                                        <p className="text-sm font-semibold text-zinc-900">{entry.type}</p>

                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-xs text-zinc-500">{entry.remarks || "—"}</p>
                                            <p className="text-sm font-bold text-zinc-800">   {entry.quantity || "-"}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Desktop table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr className="border-b border-zinc-100 bg-zinc-50/60">
                                            <th className="text-left px-4 xl:px-5 py-3 text-[10px] xl:text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Date</th>
                                            <th className="text-left px-4 xl:px-5 py-3 text-[10px] xl:text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Time</th>
                                            <th className="text-left px-4 xl:px-5 py-3 text-[10px] xl:text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Category</th>
                                            <th className="text-left px-4 xl:px-5 py-3 text-[10px] xl:text-[11px] font-bold text-zinc-400 uppercase tracking-wider min-w-[180px]">Type</th>
                                            <th className="text-left px-4 xl:px-5 py-3 text-[10px] xl:text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Qty (mL)</th>
                                            <th className="text-left px-4 xl:px-5 py-3 text-[10px] xl:text-[11px] font-bold text-zinc-400 uppercase tracking-wider whitespace-nowrap">Recorded By</th>
                                            <th className="text-left px-4 xl:px-5 py-3 text-[10px] xl:text-[11px] font-bold text-zinc-400 uppercase tracking-wider min-w-[200px]">Remarks</th>
                                            
                                        </tr>
                                    </thead>

                                    <tbody>
                                        {paginatedEntries.map((entry) => (
                                            <tr key={entry.id} className="border-b border-zinc-100 last:border-b-0 hover:bg-zinc-50/50 transition">
                                                <td className="px-4 xl:px-5 py-4">
                                                    <p className="text-sm font-semibold text-zinc-800 whitespace-nowrap">{formatDate(entry.date)}</p>
                                                </td>
                                                <td className="px-4 xl:px-5 py-4">
                                                    <p className="text-sm text-zinc-700 whitespace-nowrap">{entry.time}</p>
                                                </td>
                                                <td className="px-4 xl:px-5 py-4">
                                                    <span className={`text-xs font-semibold px-2 py-1 rounded-md capitalize whitespace-nowrap ${categoryBadge(entry.category)}`}>
                                                        {entry.category || "-"}
                                                    </span>
                                                </td>
                                                <td className="px-4 xl:px-5 py-4">
                                                    <p className="text-sm text-zinc-700">{entry.type}</p>
                                                </td>
                                                <td className="px-4 xl:px-5 py-4">
                                                    <p className="text-sm font-bold text-zinc-800 whitespace-nowrap">{entry.quantity}</p>
                                                </td>
                                                <td className="px-4 xl:px-5 py-4">
                                                    <p className="text-sm text-zinc-700 whitespace-nowrap">
                                                        {entry.recordedByDetails?.name || "—"}
                                                    </p>
                                                </td>
                                                <td className="px-4 xl:px-5 py-4">
                                                    <p className="text-sm text-zinc-600">{entry.remarks || "—"}</p>
                                                </td>
                                                
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </>
                    ) : (
                        <div className="py-12 text-center">
                            <p className="text-sm font-semibold text-zinc-600">No entries recorded</p>
                            <p className="text-xs text-zinc-400 mt-1">Add an intake or output entry for this patient.</p>
                        </div>
                    )}
                    {!loading && entries.length > 0 && totalPages > 0 && (
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">
                            <p className="text-xs text-zinc-500">
                                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                                {Math.min(currentPage * ITEMS_PER_PAGE, entries.length)} of{" "}
                                {entries.length} entries
                            </p>
                            <Pagination
                                currentPage={currentPage}
                                setCurrentPage={goToPage}
                                totalPages={totalPages}
                                goToPage={goToPage}
                            />
                        </div>
                    )}
                </div>
            </div>

            <AddIntakeOutputModal
                isOpen={isModalOpen}
                onClose={handleCloseModal}
                onSuccess={handleSaveEntry}
                category={selectedCategory}
                patientId={patientId}
                icuAdmissionId={icuAdmissionId}
                isICU={true}
            />
        </div>
    );
};

export default ICUIntakeOutputDetails;