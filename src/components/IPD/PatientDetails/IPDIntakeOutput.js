import React, { useEffect, useState } from "react";
import { Droplets, Plus } from "lucide-react";
import Button from "../../../commonComponent/Button";
import TableComponent from "../../../commonComponent/TableComponent";
import AddIntakeOutputModal from "../../../modal/IPD/AddIntakeOutputModal";
import { icuService } from "../../../services/icuService";
import { toast } from "react-toastify";

const PRIMARY = "#521785";

const categoryStyles = {
    intake: "bg-[#EFF6FF] text-[#2563EB]",
    output: "bg-[#FFFBEB] text-[#D97706]",
};

const CATEGORY_OPTIONS = ["intake", "output"];

const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const IPDPatientIntakeOutput = ({ patientId, admissionId ,success,onOpenAddModal,isAddModalOpen,onCloseAddModal,addModalCategory,}) => {

    const [entries,setEntries]=useState([]);
    const [loading, setLoading] = useState(false);
    const [recordedAtDate, setRecordedAtDate] = useState(new Date().toISOString().split("T")[0]);
    const [category, setCategory] = useState();

    const fetchIntakeOutput = async () => {
              if (!patientId || !admissionId) return;
      
              setLoading(true);
      
              try {
                  const data = await icuService.getInputOutput({
                    ipdAdmissionId:admissionId,
                    patientId:patientId,
                    category:category,
                    date:recordedAtDate,
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
    }, [patientId,admissionId,category,recordedAtDate]);

    const totalIntake = entries
        .filter((entry) => entry.category === "intake")
        .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);

    const totalOutput = entries
        .filter((entry) => entry.category === "output")
        .reduce((sum, entry) => sum + Number(entry.quantity || 0), 0);

   
    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className=" items-center gap-2 min-w-0 hidden lg:flex">
                    <Droplets size={18} color={PRIMARY} className="shrink-0" />
                    <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
                        Intake & Output
                    </h2>
                </div>

                 <div className="flex flex-col gap-2 md:flex-row">
                    <div className="flex flex-col justify-end gap-1.5">
                        <select
                            value={category}
                            onChange={(e)=>setCategory(e.target.value)}
                            className={inputClass}
                        >
                            <option value="">Select category</option>
                            {CATEGORY_OPTIONS.map((option) => (
                            <option key={option} value={option}>
                                {option}
                            </option>
                            ))}
                        </select>
                    </div>
                    <div className="flex flex-col justify-end gap-1.5">
                        <input
                        type="date"
                        value={recordedAtDate}
                        onChange={(e) => setRecordedAtDate(e.target.value)}
                        className={inputClass}
                        />
                    </div>
                    <Button
                        onClick={() => onOpenAddModal("intake")}
                        className="text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 text-sm"
                        style={{ backgroundColor: PRIMARY }}
                    >
                        <Plus size={15} />
                        Add Intake
                    </Button>

                    <Button
                        onClick={() => onOpenAddModal("output")}
                        className="text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 text-sm"
                        style={{ backgroundColor: PRIMARY }}
                    >
                        <Plus size={15} />
                        Add Output
                    </Button>
                </div>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="rounded-lg border border-[#dbeafe] bg-[#EFF6FF] p-4 flex items-center gap-1">
                    <p className="text-xs text-[#8BA3CB] mt-1">Total Intake : </p>
                    <p className="text-xl font-bold text-[#2563EB]"> {totalIntake} mL</p>
                    
                </div>

                <div className="rounded-lg border border-[#fde68a] bg-[#FFFBEB] p-4 flex items-center gap-1">
                    <p className="text-xs text-[#8BA3CB] mt-1">Total Output : </p>
                    <p className="text-xl font-bold text-[#D97706]"> {totalOutput} mL</p>
                    
                </div>

            </div>

            {entries.length === 0 ? (
                <div className="text-center text-[#8BA3CB] text-[13px] py-8 sm:py-10 px-3 border border-dashed border-[#D9D1E8] rounded-lg">
                    No intake / output entries yet. Click "Add Intake / Output" to record the first entry.
                </div>
            ) : (
                <>
                    {/* Desktop table */}
                    <div className="hidden lg:block bg-white rounded-lg border border-[#e5e5e5] overflow-x-auto">
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
                                            className={`text-[12px] font-medium px-2 py-1 rounded-full capitalize ${categoryStyles[item.category] || "bg-gray-100 text-gray-600"}`}
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
                                    label: "Remarks",
                                    headerClassName: "text-left pl-4",
                                    className: "pl-4 py-3",
                                    render: (item) => (
                                        <p className="text-[#343C6A]">{item.remarks || "—"}</p>
                                    ),
                                },
                            ]}
                            data={entries}
                            loading={loading}
                        />
                    </div>

                    {/* Mobile + tablet cards */}
                    <div className="lg:hidden space-y-3">
                        {entries.map((item) => (
                            <div
                                key={item.id}
                                className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
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

                                <div className="grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-[#F8F9FC] p-3">
                                        <p className="text-[11px] font-medium text-[#8BA3CB]">Type</p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A] break-words">
                                            {item.type}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-[#F8F9FC] p-3">
                                        <p className="text-[11px] font-medium text-[#8BA3CB]">Qty (mL)</p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.quantity}
                                        </p>
                                    </div>

                                    {item.remarks && (
                                        <div className="rounded-lg bg-[#F8F9FC] p-3 col-span-2">
                                            <p className="text-[11px] font-medium text-[#8BA3CB]">Remarks</p>
                                            <p className="mt-1 text-sm font-semibold text-[#343C6A] break-words">
                                                {item.remarks}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            <AddIntakeOutputModal
                isOpen={isAddModalOpen}
                onClose={onCloseAddModal}
                patientId={patientId}
                admissionId={admissionId}
                category={addModalCategory}
                onSuccess={() => {
                    fetchIntakeOutput();
                    success();
                }}
            />
        </div>
    );
};

export default IPDPatientIntakeOutput;