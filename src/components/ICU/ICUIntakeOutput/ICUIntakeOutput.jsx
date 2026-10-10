import React, { useEffect, useState } from "react";
import { Droplets, Plus } from "lucide-react";
import { getCurrentDate } from "../../../utils/getCurrentDate";
// import ICUIntakeOutputModal from "../../../modals/ICUIntakeOutputModal";
import { toast } from "react-toastify";
import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import AddIntakeOutputModal from "../../../modal/IPD/AddIntakeOutputModal";
import { icuService } from "../../../services/icuService";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const categoryStyles = {
    intake: "bg-[#EFF6FF] text-[#2563EB]",
    output: "bg-[#FFFBEB] text-[#D97706]",
};

const inputClass =
    "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

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

const ICUIntakeOutput = ({ patient = null, patientId, icuAdmissionId }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("");

    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(false);
    const [recordedAtDate, setRecordedAtDate] = useState(new Date().toISOString().split("T")[0]);
    const [category, setCategory] = useState();
    const { currentPage, totalPages, goToPage, setTotalPages } =
        usePagination(1);

    const fetchIntakeOutput = async () => {
        if (!patientId || !icuAdmissionId) return;

        setLoading(true);

        try {
            const data = await icuService.getInputOutput({
                icuAdmissionId: icuAdmissionId,
                patientId: patientId,
                category: category,
                date: recordedAtDate,
            });

            setEntries(data.intakeAndOutput || []);
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to get intake / output."
            );

            setEntries([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchIntakeOutput();
    }, [patientId, icuAdmissionId, category, recordedAtDate]);

    useEffect(() => {
        const pages = Math.max(1, Math.ceil(entries.length / ITEMS_PER_PAGE));
        setTotalPages(pages);
        if (currentPage > pages) {
            goToPage(pages);
        }
    }, [entries.length, currentPage, goToPage, setTotalPages]);

    useEffect(() => {
        goToPage(1);
    }, [recordedAtDate, category, goToPage]);

    const paginatedEntries = entries.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );


    const totalIntake = entries
        .filter((entry) => entry.category === "intake")
        .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);

    const totalOutput = entries
        .filter((entry) => entry.category === "output")
        .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);

    const netBalance = totalIntake - totalOutput;
    const netBalanceLabel = `${netBalance > 0 ? "+" : ""}${netBalance} mL`;

    const handleOpenModal = (category) => {
        setSelectedCategory(category);
        setIsAddModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsAddModalOpen(false);
        setSelectedCategory("");
    };


    return (
        <>
            <Section
                title="Intake & Output"
                icon={Droplets}
                action={
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <div>
                            <input
                                type="date"
                                value={recordedAtDate}
                                onChange={(e) => setRecordedAtDate(e.target.value)}
                                className={inputClass}
                            />
                        </div>

                        <div>
                            <select
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                                className={inputClass}
                            >
                                <option value="">Select</option>
                                <option value="intake">Intake</option>
                                <option value="output">Output</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            onClick={() => handleOpenModal("intake")}
                            className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
                            style={{ backgroundColor: PRIMARY }}
                        >
                            <Plus size={15} />
                            <span>Add Intake</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => handleOpenModal("output")}
                            className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
                            style={{ backgroundColor: PRIMARY }}
                        >
                            <Plus size={15} />
                            <span>Add Output</span>
                        </button>
                    </div>
                }
            >
                {/* Summary cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                    <div className="rounded-lg border border-[#dbeafe] bg-[#EFF6FF] p-4">
                        <p className="text-xl font-bold text-[#2563EB]">{totalIntake} mL</p>
                        <p className="text-xs text-[#8BA3CB] mt-1">Total Intake</p>
                    </div>

                    <div className="rounded-lg border border-[#fde68a] bg-[#FFFBEB] p-4">
                        <p className="text-xl font-bold text-[#D97706]">{totalOutput} mL</p>
                        <p className="text-xs text-[#8BA3CB] mt-1">Total Output</p>
                    </div>

                    <div className="rounded-lg border border-[#bbf7d0] bg-[#F0FDF4] p-4">
                        <p className="text-xl font-bold text-[#16A34A]">{netBalanceLabel}</p>
                        <p className="text-xs text-[#8BA3CB] mt-1">Net Balance</p>
                    </div>
                </div>

                {entries.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
                        No intake / output entries recorded for this patient.
                    </div>
                ) : (
                    <>
                        {/* Desktop table */}
                        <div className="hidden lg:block overflow-x-auto border border-[#e5e5e5] rounded-md">
                            <TableComponent
                                columns={[
                                    {
                                        label: "Date",
                                        headerClassName: "text-left pl-4",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A] font-medium">{item.date}</p>
                                        ),
                                    },
                                    {
                                        label: "Time",
                                        headerClassName: "text-left pl-4",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A] font-medium">{item.time}</p>
                                        ),
                                    },
                                    {
                                        label: "Category",
                                        headerClassName: "text-left pl-4",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <span
                                                className={`text-[12px] font-medium px-2 py-1 capitalize rounded-full ${categoryStyles[item.category] || "bg-gray-100 text-gray-600"}`}
                                            >
                                                {item.category}
                                            </span>
                                        ),
                                    },
                                    {
                                        label: "Type",
                                        headerClassName: "text-left pl-4",
                                        className: "pl-4 py-3",
                                        render: (item) => <p className="text-[#343C6A]">{item.type}</p>,
                                    },
                                    {
                                        label: "Qty (mL)",
                                        headerClassName: "text-left pl-4",
                                        className: "pl-4 py-3",
                                        render: (item) => <p className="text-[#343C6A]">{item.quantity}</p>,
                                    },

                                    {
                                        label: "Added by",
                                        headerClassName: "text-left pl-4",
                                        className: "pl-4 py-3",
                                        render: (item) => <p className="text-[#343C6A]">
                                            {item.recordedByDetails?.name || "-"}
                                        </p>,
                                    },
                                    {
                                        label: "Remarks",
                                        headerClassName: "text-left pl-4",
                                        className: "pl-4 py-3",
                                        render: (item) => (
                                            <p className="text-[#343C6A]">{item.remarks || "—"}</p>
                                        ),
                                    },
                                ]}
                                data={paginatedEntries}
                                loading={loading}
                            />
                        </div>

                        {/* Mobile + tablet cards */}
                        <div className="lg:hidden flex flex-col gap-3">
                            {paginatedEntries.map((item, idx) => (
                                <div
                                    key={item.id || idx}
                                    className="rounded-xl border border-[#e5e5e5] bg-[#F8F9FC] p-4"
                                >
                                    <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#F0F0F0] pb-3">
                                        <div>
                                            <p className="text-sm font-semibold text-[#343C6A]">{item.time}</p>
                                            <p className="mt-0.5 text-xs text-[#8BA3CB]">{item.date}</p>
                                        </div>

                                        <span
                                            className={`text-[12px] font-medium px-2.5 py-1 rounded-full capitalize ${categoryStyles[item.category] || "bg-gray-100 text-gray-600"}`}
                                        >
                                            {item.category}
                                        </span>
                                    </div>

                                    <div className="grid md:grid-cols-3 gap-3">
                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee]">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">Type</p>
                                            <p className="text-[13px] font-semibold text-[#343C6A] break-words">
                                                {item.type}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee]">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">Qty (mL)</p>
                                            <p className="text-[13px] font-semibold text-[#343C6A]">
                                                {item.quantity}
                                            </p>
                                        </div>

                                        <div className="rounded-lg bg-white p-3 border border-[#eeeeee]">
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">Added  By</p>
                                            <p className="text-[13px] font-semibold text-[#343C6A]">
                                                {item.recordedByDetails?.name || "-"}
                                            </p>
                                        </div>

                                        {item.remarks && (
                                            <div className="rounded-lg bg-white p-3 border border-[#eeeeee] md:col-span-3">
                                                <p className="text-[11px] text-[#8BA3CB] mb-1">Remarks</p>
                                                <p className="text-[13px] font-semibold text-[#343C6A] break-words">
                                                    {item.remarks}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        {totalPages > 0 && (
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
                    </>
                )}
            </Section>

            <AddIntakeOutputModal
                isOpen={isAddModalOpen}
                onClose={handleCloseModal}
                onSuccess={fetchIntakeOutput}
                category={selectedCategory}
                currentPatient={patient}
                patientId={patientId}
                icuAdmissionId={icuAdmissionId}
                isICU={true}
            />
        </>
    );
};

export default ICUIntakeOutput;