import React, {
useState,
useEffect,
useCallback,
useMemo,
} from "react";
import {
Plus,
Search,
Filter,
Calendar,
ChevronDown,
Eye,
Download,
Info,
} from "lucide-react";
import TableComponent from "../../commonComponent/TableComponent";
import Button from "../../commonComponent/Button";
import NewDischargeModal from "../../modal/IPD/newDischarge";
import DischargeDetailsModal from "../../modal/IPD/DischargeDetailsModal";
import { ipdService } from "../../services/ipdService";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { wardService } from "../../services/wardService";
import { pdf } from "@react-pdf/renderer";
import FinalBill from "../../pdf/FinalBill";
import { toast } from "react-toastify";
import DischargeBill from "../../pdf/dischargeBill";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const statusStyles = {
  Initiated: "bg-[#F3E8FF] text-[#7E22CE]",   // Purple
  Pending: "bg-[#FFEDD5] text-[#EA580C]",     // Orange
  Discharged: "bg-[#DCFCE7] text-[#16A34A]",  // Green
  Cancelled: "bg-[#FEE2E2] text-[#EF4444]",   // Red
};

const wardFilterOptionsBase = ["All Wards"];

const statusFilterOptions = [
"All Status",
"Initiated",
"Discharged",
"Pending",
"Cancelled",
];

const FilterDropdown = ({
options,
value,
onChange,
}) => (

  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none w-full"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>


<ChevronDown
  size={14}
  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
/>


  </div>
);

const DischargeSummary = () => {
const [fromDate, setFromDate] = useState("");
const [toDate, setToDate] = useState("");
const [wardFilter, setWardFilter] =
useState("All Wards");
const [statusFilter, setStatusFilter] =
useState("All Status");
const [search, setSearch] = useState("");

const [records, setRecords] = useState([]);
const [activeAdmissions, setActiveAdmissions] =
useState([]);
const [wards, setWards] = useState([]);
const [loading, setLoading] = useState(false);
const [error, setError] = useState("");

const [isNewDischargeOpen, setIsNewDischargeOpen] =
useState(false);

const [isDetailsOpen, setIsDetailsOpen] =
useState(false);

const [admissionId,setAdmissionId]=useState(null);
const [dischargeId,setDischargeId]=useState(null);

const {
currentPage,
totalPages,
goToPage,
setTotalPages,
} = usePagination();

useEffect(() => {
const calculatedTotalPages =
Math.ceil(records.length / ITEMS_PER_PAGE) || 1;


setTotalPages(calculatedTotalPages);

if (currentPage > calculatedTotalPages) {
  goToPage(calculatedTotalPages);
}


}, [
records,
currentPage,
setTotalPages,
goToPage,
]);

useEffect(() => {
goToPage(1);
}, [
search,
wardFilter,
statusFilter,
fromDate,
toDate,
goToPage,
]);

const fetchActiveAdmissions = useCallback(async () => {
try {
const data =
await ipdService.getAdmissions({
status: "admitted",
});


  const eligiblePatients =
    (data.admissions || []).filter(
      (admission) =>
        admission.patientId &&
        admission.wardId &&
        admission.roomId &&
        admission.bedId
    );

  setActiveAdmissions(eligiblePatients);
} catch (err) {
  setActiveAdmissions([]);
}


}, []);

const fetchWards = useCallback(async () => {
try {
const data = await wardService.getWards();


  setWards(data?.wards || []);
} catch (err) {
  console.error("WARD ERROR:", err);
  setWards([]);
}


}, []);

const fetchDischarges = useCallback(async () => {
setLoading(true);
setError("");


try {
  const data =
    await ipdService.getDischarges({
      searchTerm:
        search || undefined,
      ward:
        wardFilter !== "All Wards"
          ? wardFilter
          : undefined,
      status:
        statusFilter !== "All Status"
          ? statusFilter
          : undefined,
      fromDate:
        fromDate || undefined,
      toDate:
        toDate || undefined,
    });

  setRecords(data.discharges || []);
} catch (err) {
  setError(
    "Failed to load discharge records."
  );
  setRecords([]);
} finally {
  setLoading(false);
}


}, [
search,
wardFilter,
statusFilter,
fromDate,
toDate,
]);

useEffect(() => {
fetchDischarges();
}, [fetchDischarges]);

useEffect(() => {
fetchActiveAdmissions();
}, [fetchActiveAdmissions]);

useEffect(() => {
fetchWards();
}, [fetchWards]);

const handleAddDischarge = () => {
fetchDischarges();
fetchActiveAdmissions();
};

const handleViewDetails = (item) => {
  setAdmissionId(item.admissionId);
  setDischargeId(item.id);
  setIsDetailsOpen(true);
};

const handleCloseDetails = () => {
  setIsDetailsOpen(false);
  setAdmissionId(null);
  setDischargeId(null);
  fetchDischarges();
};

const wardFilterOptions = useMemo(() => {
const wardNames = wards
.map((ward) => ward.wardName)
.filter(Boolean);


return [
  ...wardFilterOptionsBase,
  ...wardNames,
];


}, [wards]);

const columns = [
{
  label: "Discharge ID",
  field: "dischargeId",
  headerClassName:
  "text-left pl-4 whitespace-nowrap",
  className:
  "pl-4 py-3 font-semibold text-[#343C6A] whitespace-nowrap",
},
{
  label: "Patient",
  field: "",
  headerClassName:
  "text-left whitespace-nowrap px-5",
  className:
  "py-3 px-5 whitespace-nowrap",
  render: (item) => (
          <div className="flex items-center gap-2">

            <div>
              <p className="font-semibold text-[#343C6A] whitespace-nowrap">
                {item?.patientName || "-"}
              </p>

              <p className="text-[12px] text-[#8BA3CB] whitespace-nowrap">
                {item?.mrn || "-"}
              </p>

              <p className="text-[12px] text-[#8BA3CB] whitespace-nowrap">{item?.gender ||"-"}
              </p>
            </div>
          </div>
  ),
},
{
  label: "Ward / Room / Bed",
  field: "wardRoomBed",
  headerClassName:
  "text-left whitespace-nowrap min-w-0 max-w-xs",
  className:
  "py-3 whitespce-normal min-w-0 max-w-10 break-all text-sm",
},
{
  label: "Initiate Date",
  headerClassName:
  "text-left whitespace-nowrap px-3",
  className:
  "py-3 px-3 whitespace-nowrap",
  render: (item) => ( 
    <div className="flex flex-col"> 
      <span>{item.dischargeInitiateDate} </span>
    </div>
  ),
},
{
  label: "Discharge Date",
  headerClassName:
  "text-left whitespace-nowrap px-3",
  className:
  "py-3 whitespace-nowrap px-3",
  render: (item) => ( <div className="flex flex-col"> <span>
  {item.dischargeDate} </span>


        <span className="text-[12px] text-[#8BA3CB]">
          {item.dischargeTime}
        </span>
      </div>
    ),
},
{
  label: "Type",
  field: "dischargeType",
  headerClassName:
    "text-left",
  className:
    "py-3",
},
{
  label: "Condition",
  field: "dischargeCondition",
  headerClassName:
    "text-left px-3",
  className:
    "py-3 px-3",
},
{
  label: "Final Bill",
  headerClassName:
    "text-left whitespace-nowrap",
  className:
    "py-3 font-semibold whitespace-nowrap",
  render: (item) => (
    <span style={{ color: PRIMARY }}>
      &#8377;{" "}
      {Number(
        item.finalBill || 0
      ).toLocaleString("en-IN")}
    </span>
  ),
},
{
  label: "Status",
  headerClassName:
    "text-left whitespace-nowrap px-3",
  className:
    "py-3 whitespace-nowrap px-3",
  render: (item) => (
    <span
      className={`inline-flex text-[12px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
        statusStyles[item.status] ||
        "bg-gray-100 text-gray-600"
      }`}
    >
      {item.status}
    </span>
  ),
},


];

const handleDownloadClick=async(item)=> {
  if(!item.account.id){
    toast.error('Account not found to generate bill');
    return;
  }
    try {
      const accountId= item.account.id;
      const patient= item.patient;

      const res= await ipdService.getAccountChargesByAccountId(accountId);
      if(res.data){
        const blob = await pdf(<FinalBill charges={res.data} patient={patient} logo={item.logo}/>).toBlob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        const link = document.createElement("a");
        link.href = url;
        link.download = `IPD-Final-Bill-${accountId}-${item?.account?.accountNumber}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up after some time
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 5000);
      }else{
        toast.error("Failed to generate print bill");
      }
      
    } catch (err) {
      console.error("Failed to generate print bill:", err);
      toast.error("Failed to generate print bill:", err);

    }
}

const handleSummeryDownloadClick=async(item)=> {
  if(!item.admissionId){
    toast.error('Admission not found to download summary');
    return;
  }
    try {
      const accountId= item.account.id;
      const admissionId= item.admissionId;
      const patient= item.patient;
      const dischargeId=item.id;

      const charges = await ipdService.getAccountChargesByAccountId(accountId);

      const payments = await ipdService.getAccountPaymentsByAdmissionId(admissionId);

      const notes = await ipdService.getClinicalSummary(admissionId);

      const discharge= await ipdService.getDischargeDetails(admissionId,dischargeId);

      console.log("charges",charges.data);
      console.log("discharge",discharge.data);

      if(charges.data){
        const blob = await pdf(
          <DischargeBill 
            charges={charges.data} 
            patient={patient} 
            payments={payments.payments} 
            notes={notes?.sections || []}
            discharge={discharge.data ||[]}
            logo={item.logo}
          />
        ).toBlob();

        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");

        const link = document.createElement("a");
        link.href = url;
        link.download = `IPD-Final-Bill-${accountId}-${item?.account?.accountNumber}.pdf`;

        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        // Clean up after some time
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 5000);
      }else{
        toast.error("Failed to generate summery");
      }
      
    } catch (err) {
      console.error("Failed to generate summery:", err);
      toast.error("Failed to generate summery:", err);

    }
}

const startIndex =
(currentPage - 1) * ITEMS_PER_PAGE;

const paginatedData = records.slice(
startIndex,
startIndex + ITEMS_PER_PAGE
);

return ( 
<div className="min-h-screen bg-transparent p-2 lg:p-1 flex flex-col gap-4">
{/* Header */} 
  <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-start"> 
  <div> 
    <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
Discharge </h1>

      <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
        View and manage patient discharge records.
      </p>
    </div>
  </div>

  {/* Filters */}
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-[minmax(150px,0.8fr)_minmax(150px,0.8fr)_minmax(160px,0.9fr)_minmax(160px,0.9fr)_minmax(250px,1.5fr)_auto] gap-3 items-center">
    {/* From Date */}
    <div className="relative w-full">
      <input
        type="date"
        value={fromDate}
        onChange={(e) =>
          setFromDate(e.target.value)
        }
        placeholder="From Date"
        className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] outline-none"
      />

      <Calendar
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>

    {/* To Date */}
    <div className="relative w-full">
      <input
        type="date"
        value={toDate}
        onChange={(e) =>
          setToDate(e.target.value)
        }
        placeholder="To Date"
        className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] outline-none"
      />

      <Calendar
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>

    {/* Ward Filter */}
    <div className="w-full">
      <FilterDropdown
        options={wardFilterOptions}
        value={wardFilter}
        onChange={setWardFilter}
      />
    </div>

    {/* Status Filter */}
    <div className="w-full">
      <FilterDropdown
        options={statusFilterOptions}
        value={statusFilter}
        onChange={setStatusFilter}
      />
    </div>

    {/* Search */}
    <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-2 gap-2 w-full">
      <input
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        placeholder="Search by patient name, MRN..."
        className="outline-none text-[14px] w-full min-w-0"
      />

      <Search
        size={16}
        className="text-gray-400 shrink-0"
      />
    </div>

    {/* Filter Button */}
    <Button
      onClick={fetchDischarges}
      className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A] w-full xl:w-auto px-4"
    >
      <Filter size={14} />
      Filter
    </Button>
  </div>

  {/* Error */}
  {error && (
    <div className="bg-[#FEE2E2] text-[#EF4444] text-[13px] p-3 rounded-lg">
      {error}
    </div>
  )}

  {/* Desktop Table */}
  <div className="hidden xl:block bg-white rounded-lg border border-[#e5e5e5] overflow-y-auto">
    <div className="min-w-[1150px]">
      <TableComponent
        columns={columns}
        data={paginatedData}
        loading={loading}
        headerBg="bg-[#F8F9FC]"
        actions={(item) => (
          <div className="flex gap-2 justify-center whitespace-normal pl-2 pr-4">
            <button
              onClick={() =>
                handleViewDetails(item)
              }
              className="px-1.5 py-1 rounded-md border border-blue-500 text-blue-500"
              title="View Details"
            >
              <Eye size={15} />
            </button>

            <button
              onClick={() => handleDownloadClick(item)}
              className="px-1.5 py-1 rounded-md border border-[#7C3AED] text-[#7C3AED] flex flex-row items-center gap-1 text-sm disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
              title="Download"
              disabled={item.status !== "Discharged"}
            >
              <Download size={15} />
              Bill
            </button>

            <button
              onClick={() => handleSummeryDownloadClick(item)}
              className="px-1.5 py-1 rounded-md border border-[#7a30fa] text-[#7a30fa] flex flex-row items-center gap-1 text-sm "
              title="Download"
            >
              <Download size={15} />
              Summary
            </button>
          </div>
        )}
        actionLabel="Actions"
      />

      {/* {!loading &&
        records.length === 0 && (
          <div className="text-center text-[13px] text-[#8BA3CB] py-6">
            No discharge records found.
          </div>
        )} */}
    </div>
  </div>

  {/* Mobile & Tablet Cards */}
  <div className="xl:hidden flex flex-col gap-3">
    {loading && (
      <div className="bg-white rounded-xl border border-[#e5e5e5] text-center text-[13px] text-[#8BA3CB] py-8">
        Loading discharge records...
      </div>
    )}

    {!loading &&
      paginatedData.map((item, index) => (
        <div
          key={item.id || item.dischargeId || index}
          className="bg-white rounded-xl border border-[#e5e5e5] overflow-hidden shadow-sm"
        >
          {/* Top Patient Section */}
          <div className="p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-medium text-[#8BA3CB] mb-1">
                  Patient
                </p>

                <h3 className="text-[16px] font-semibold text-[#343C6A] truncate">
                  {item.patientName || "-"}
                </h3>

                <div className="flex flex-wrap items-center gap-x-2 gap-y-1 ">
                  <span className="text-[11px] text-[#8BA3CB]">
                    MRN
                  </span>

                  <span className="text-[12px] font-medium text-[#343C6A]">
                    {item.mrn || "-"}
                  </span>
                </div>
              </div>

              <span
                className={`shrink-0 inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-medium whitespace-nowrap ${
                  statusStyles[item.status] ||
                  "bg-gray-100 text-gray-600"
                }`}
              >
                {item.status || "-"}
              </span>
            </div>
          </div>

          {/* Admission / Discharge Information */}
          <div className="border-y border-[#f1eef7] bg-[#FAFBFD]">
            <div className="grid md:grid-cols-2">
              <div className="p-3.5 border-r border-[#f1eef7]">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#8BA3CB] mb-1.5">
                  Ward / Room / Bed
                </p>

                <p className="text-[13px] font-semibold text-[#343C6A] break-words">
                  {item.wardRoomBed || "-"}
                </p>
              </div>

              <div className="p-3.5 border-t md:border-t-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#8BA3CB] mb-1.5">
                  Discharge Date
                </p>

                <p className="text-[13px] font-semibold text-[#343C6A]">
                  {item.dischargeDate || "-"}
                </p>

                {item.dischargeTime && (
                  <p className="text-[11px] text-[#8BA3CB] mt-0.5">
                    {item.dischargeTime}
                  </p>
                )}
              </div>
            </div>
          </div>

  
          <div className="px-4 pt-4">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#8BA3CB]">
              Type
            </p>

            <p className="text-[13px] leading-5 text-[#343C6A] break-words">
              {item.dischargeType || "-"}
            </p>
          </div>

          <div className="px-4 pt-3">
            <p className="text-[10px] font-medium uppercase tracking-wide text-[#8BA3CB] ">
              Condition
            </p>

            <p className="text-[13px] leading-5 text-[#343C6A] break-words">
              {item.dischargeCondition || "-"}
            </p>
          </div>

          {/* Bottom Summary */}
          <div className="mx-4 mt-4 mb-4 rounded-lg border border-[#eeeaf8] bg-[#FCFBFF] p-3">
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#8BA3CB]">
                  Discharge ID
                </p>

                <p className="text-[12px] font-medium text-[#343C6A] mt-1 truncate">
                  {item.dischargeId || "-"}
                </p>
              </div>

              <div className="shrink-0 text-right">
                <p className="text-[10px] font-medium uppercase tracking-wide text-[#8BA3CB]">
                  Final Bill
                </p>

                <p
                  className="text-[16px] font-bold mt-1 whitespace-nowrap"
                  style={{ color: PRIMARY }}
                >
                  &#8377;{" "}
                  {Number(item.finalBill || 0).toLocaleString("en-IN")}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-[#f1eef7] p-3 grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 gap-3">
            <button
              onClick={() => handleViewDetails(item)}
              className="min-h-[42px] flex items-center justify-center gap-2 border border-[#d9d0f7] rounded-lg px-3 py-2 text-[13px] font-medium text-[#521785] bg-white transition-colors hover:bg-[#F8F5FC]"
            >
              <Eye size={15} />
              View Details
            </button>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDownloadClick(item)}
                className="px-1.5 py-1 rounded-md border border-[#7C3AED] text-[#7C3AED] flex flex-row items-center gap-1 text-sm disabled:text-gray-400 disabled:border-gray-300 disabled:bg-gray-100 disabled:cursor-not-allowed"
                title="Download"
                disabled={item.status !== "Discharged"}
              >
                <Download size={15} />
                Bill
              </button>

              <button
                onClick={() => handleSummeryDownloadClick(item)}
                className="px-1.5 py-1 rounded-md border border-[#7a30fa] text-[#7a30fa] flex flex-row items-center gap-1 text-sm "
                title="Download"
              >
                <Download size={15} />
                Summary
              </button>
            </div>
          </div>
        </div>
      ))}

    {!loading && records.length === 0 && (
      <div className="bg-white rounded-xl border border-[#e5e5e5] text-center text-[13px] text-[#8BA3CB] py-8 px-4">
        No discharge records found.
      </div>
    )}
  </div>

  {/* Pagination */}
  <div className="bg-white rounded-lg border border-[#e5e5e5] flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center p-2 lg:px-4">
    <span className="text-[12px] sm:text-[13px] text-[#8BA3CB] text-center sm:text-left">
      Showing{" "}
      {records.length === 0
        ? 0
        : startIndex + 1}{" "}
      to{" "}
      {Math.min(
        startIndex +
          ITEMS_PER_PAGE,
        records.length
      )}{" "}
      of {records.length} records
    </span>

    {records.length > 0 && (
      <div className="flex justify-center sm:justify-end max-w-full overflow-x-auto">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      </div>
    )}
  </div>

  {/* Info Banner */}
  <div className="flex items-start sm:items-center gap-2 bg-[#EEF2FF] text-[#4338CA] text-[12px] sm:text-[13px] p-3 rounded-lg">
    <Info
      size={16}
      className="shrink-0 mt-0.5 sm:mt-0"
    />

    <span>
      Click on a record to view discharge
      summary and details.
    </span>
  </div>

  {/* New Discharge Modal */}
  <NewDischargeModal
    isOpen={isNewDischargeOpen}
    onClose={() =>
      setIsNewDischargeOpen(false)
    }
    onAdd={handleAddDischarge}
    admissions={activeAdmissions}
  />

  {/* Discharge Details Modal */}
  <DischargeDetailsModal
    isOpen={isDetailsOpen}
    onClose={handleCloseDetails}
    admissionId={admissionId}
    dischargeId={dischargeId}
  />
</div>


);
};

export default DischargeSummary;












