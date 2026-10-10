import React, { useEffect, useState } from "react";
import { FileText, Plus, Printer } from "lucide-react";
import Button from "../../../commonComponent/Button";
import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import AddVitalsModal from "../../../modal/IPD/AddVitalsModal";
import { icuService } from "../../../services/icuService";
import { toast } from "react-toastify";
import { formatTime } from "../../../utils/formateTime";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";


const IPDPatientVitals = ({
  patientId,
  admissionId,
  isAddModalOpen,
  onOpenAddModal,
  onCloseAddModal,
  success,
  icuAdmissionId,
}) => {

  const [vitals,setVitals]=useState([]);
  const [recordedAtDate, setRecordedAtDate] = useState(new Date().toISOString().split("T")[0]);

  const [loading, setLoading] = useState(false);
  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination(1);

  const fetchVitals = async () => {
           if (!patientId || (!admissionId && !icuAdmissionId)) return;
  
          setLoading(true);
  
          try {
            const payload = {
              recordedAtDate,
              patientId,
              ...(icuAdmissionId
                ? { icuAdmissionId, ipdAdmissionId: admissionId}
                : { ipdAdmissionId: admissionId }),
            };

            const data = await icuService.getVitals(payload);
  
            setVitals(data.vitals || []);
          } catch (error) {
              console.log(error);
  
              toast.error(
                  error?.response?.data?.message ||
                  error?.response?.data?.error ||
                  "Failed to get vitals."
              );
  
              setVitals([]);
          } finally {
              setLoading(false);
          }
  };
  
  useEffect(() => {
    fetchVitals();
  }, [patientId,admissionId,recordedAtDate,icuAdmissionId]);

  useEffect(() => {
    const pages = Math.max(1, Math.ceil(vitals.length / ITEMS_PER_PAGE));
    setTotalPages(pages);

    if (currentPage > pages) {
      goToPage(pages);
    }
  }, [vitals.length, currentPage, goToPage, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [recordedAtDate, goToPage]);

  const paginatedVitals = vitals.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const columns=[
                {
                  label: "Date",
                  headerClassName: "text-left pl-4",
                  className: "pl-4 py-3",
                  render: (item) => (
                    <p className="text-[#343C6A] font-medium text-sm">{item.recordedAtDate}</p>
                  ),
                },
                {
                  label: "Time",
                  headerClassName: "text-left pl-4",
                  className: "pl-4 py-3",
                  render: (item) => (
                    <p className="text-[#343C6A] font-medium text-sm">
                       {formatTime(item.recordedAtTime)}
                    </p>
                  ),
                },
                {
                  label: "Temp (°F)",
                  headerClassName: "text-left pl-4",
                  className: "pl-4 py-3",
                  render: (item) => <p className="text-[#343C6A]">{Number(item.temperature) ?? "-"}</p>,
                },
                {
                  label: (
                    <span className="leading-tight">
                      Pulse (bpm) &<br />
                      RR (breaths/min)
                    </span>
                  ),
                  headerClassName: "text-left pl-4 min-w-[140px] whitespace-normal align-top",
                  className: "pl-4 py-3 whitespace-nowrap",
                  render: (item) => (
                    <p className="text-[#343C6A]">
                      {Number(item.pulse) ?? "-"} & {Number(item.respiratoryRate) ?? "-"}
                    </p>
                  ),
                },
                {
                  label: (
                    <span className="leading-tight">
                      Blood Pressure<br />
                      (mmHg)
                    </span>
                  ),
                  headerClassName: "text-left pl-4 min-w-[140px] whitespace-normal align-top",
                  className: "pl-4 py-3 whitespace-nowrap",
                  render: (item) => (
                    <p className="text-[#343C6A]">
                      {item.bp ?? "-"}
                    </p>
                  ),
                },
                {
                  label: "SpO2 (%)",
                  headerClassName: "text-left pl-4",
                  className: "pl-4 py-3",
                  render: (item) => <p className="text-[#343C6A]">{Number(item.spo2) ?? "-"}</p>,
                },
                {
                  label: (
                    <span className="leading-tight">
                      BSL (mg/dL) &<br />
                      Insulin (units)
                    </span>
                  ),
                  headerClassName: "text-left pl-4 min-w-[140px] whitespace-normal align-top",
                  className: "pl-4 py-3 whitespace-nowrap",
                  render: (item) => (
                    <p className="text-[#343C6A]">
                      {Number(item.bsl) ?? "-"} {" & "}
                      {item.insulin !== null && item.insulin !== undefined
                        ? ` ${item.insulin}`
                        : "0 "}
                    </p>
                  ),
                },
                {
                  label: "Recorded By",
                  headerClassName: "text-left pl-4",
                  className: "pl-4 py-3",
                  render: (item) => (
                    <p className="text-[#343C6A] text-sm">{item?.recordedByDetails?.name || "-"}</p>
                  ),
                },
  ];
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex items-center gap-2 min-w-0">
          <FileText size={18} color={PRIMARY} className="shrink-0" />
          <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
            Vitals
          </h2>
        </div>

        <div className="flex flex-col gap-2 md:flex-row">
          <div className="flex flex-col justify-end gap-1.5">
            <input
              type="date"
              value={recordedAtDate}
              onChange={(e) => setRecordedAtDate(e.target.value)}
              className={inputClass}
            />
          </div>

          <Button
            onClick={onOpenAddModal}
            className="text-white flex items-center justify-center gap-1 w-full sm:w-auto sm:ml-auto md:w-[140px] lg:w-[120px] px-4 py-2 text-sm"
            style={{ backgroundColor: PRIMARY }}
          >
            <Plus size={15} />
            Add Vitals
          </Button>

          <Button
            // onClick={handleDownloadExcel}
            className="text-white flex items-center justify-center gap-1 w-full sm:w-auto sm:ml-auto lg:w-[160px] px-4 py-2 text-sm"
            style={{ backgroundColor: "#008000" }}
          >
            <Printer size={15} />
            Download Excel
          </Button>
        </div>
      </div>

      {vitals.length === 0 ? (
        <div className="text-center text-[#8BA3CB] text-[13px] py-8 sm:py-10 px-3 border border-dashed border-[#D9D1E8] rounded-lg">
          No vitals recorded yet. Click "Add Vitals" to record the first entry.
        </div>
      ) : (
        <>
          <div className="hidden lg:block bg-white rounded-lg border border-[#e5e5e5] overflow-x-auto">
            <TableComponent
              columns={columns}
              data={paginatedVitals}
              loading={loading}
            />
          </div>

          {/* Mobile + tablet cards */}
          <div className="lg:hidden space-y-3">
            {paginatedVitals.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-[#E5E7EB] bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex items-center justify-between gap-3 border-b border-[#F0F0F0] pb-3">
                  <div>
                    <p className="text-sm font-semibold text-[#343C6A]">
                      {item.recordedAtTime}
                    </p>
                    <p className="mt-0.5 text-xs text-[#8BA3CB]">
                      {item.recordedAtDate}
                    </p>
                  </div>

                  <p className="text-xs text-[#8BA3CB] text-right">
                    Recorded by
                    <span className="block text-[13px] font-semibold text-[#343C6A]">
                      {item.recordedByDetails?.name || "-"}
                    </span>
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-[#F8F9FC] p-3">
                    <p className="text-[11px] font-medium text-[#8BA3CB]">Temp (°F)</p>
                    <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                      {Number(item.temperature) ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F9FC] p-3">
                    <p className="text-[11px] font-medium text-[#8BA3CB]">Pulse & RR</p>
                    <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                      {Number(item.pulse) ?? "-"} bpm & {item.respiratoryRate ?? "-"} breaths/min
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F9FC] p-3">
                    <p className="text-[11px] font-medium text-[#8BA3CB]">
                      Blood Pressure (mmHg)
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                      {item.bp ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F9FC] p-3">
                    <p className="text-[11px] font-medium text-[#8BA3CB]">SpO2 (%)</p>
                    <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                      {Number(item.spo2) ?? "-"}
                    </p>
                  </div>

                  <div className="rounded-lg bg-[#F8F9FC] p-3 col-span-2">
                    <p className="text-[11px] font-medium text-[#8BA3CB]">
                      BSL & Insulin
                    </p>
                    <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                      {item.bsl ?? "-"} mg/dL{" & "}
                      {item.insulin !== null && item.insulin !== undefined
                        ? ` / ${item.insulin} units`
                        : "0 units"}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {totalPages > -0 && (
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <p className="text-xs text-zinc-500">
                Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}–
                {Math.min(currentPage * ITEMS_PER_PAGE, vitals.length)} of{" "}
                {vitals.length} vital records
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

      <AddVitalsModal
        isOpen={isAddModalOpen}
        onClose={onCloseAddModal}
        patientId={patientId}
        admissionId={admissionId}
        icuAdmissionId={icuAdmissionId}
        onSuccess={() => {
          fetchVitals();
          success();
        }}
      />
    </div>
  );
};

export default IPDPatientVitals;