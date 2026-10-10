import React, { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  FileText,
  Wallet,
  CheckCircle2,
  Clock,
  Search,
  Calendar,
  ChevronDown,
  Filter,
  UserPlus,
  Eye,
  Pencil,
  Download,
} from "lucide-react";
import TableComponent from "../../commonComponent/TableComponent";
import Button from "../../commonComponent/Button";
import GenerateInvoiceModal from "../../modal/IPD/generateInvoice";
import { ipdService } from "../../services/ipdService";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const formatDateTime = (date) =>
  date
    ? new Date(date).toLocaleString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : "-";

const statCardMeta = [
  {
    key: "totalAccounts",
    heading: "Total Accounts",
    icon: FileText,
    color: "#F3E8FF",
    iconColor: "#9333EA",
    isCurrency: false,
    subtext: "All created accounts",
  },
  {
    key: "totalAmount",
    heading: "Total Billed",
    icon: Wallet,
    color: "#DCFCE7",
    iconColor: "#16A34A",
    isCurrency: true,
    subtext: "Across all accounts",
  },
  {
    key: "paidAmount",
    heading: "Amount Collected",
    icon: CheckCircle2,
    color: "#FFEDD5",
    iconColor: "#EA580C",
    isCurrency: true,
    subtext: "Paid so far",
  },
  {
    key: "pendingAmount",
    heading: "Amount Pending",
    icon: Clock,
    color: "#FEE2E2",
    iconColor: "#EF4444",
    isCurrency: true,
    subtext: "Due / partial",
  },
];

const statusStyles = {
  paid: "bg-[#DCFCE7] text-[#16A34A]",
  pending: "bg-[#FFEDD5] text-[#EA580C]",
  partial: "bg-[#FEE2E2] text-[#EF4444]",
};

const formatCurrency = (amount) =>
  `\u20B9 ${Number(amount || 0).toLocaleString("en-IN")}`;

const Accounts = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [status,setStatus]=useState('all');

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  const [statsLoading, setStatsLoading] = useState(false);

  const [isGenerateInvoiceOpen, setIsGenerateInvoiceOpen] = useState(false);

  const searchDebounceRef = useRef(null);

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination();

  useEffect(() => {
    setTotalPages(Math.ceil(records.length / ITEMS_PER_PAGE) || 1);
  }, [records, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [search, fromDate, toDate,status, goToPage]);

  const fetchAccounts = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await ipdService.getAccounts({
        search,
        status,
        fromDate,
        toDate,
      });

      setRecords(res?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load accounts. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [search, fromDate, toDate, status]);

  const fetchStats = useCallback(async () => {
    setStatsLoading(true);

    try {
      const res = await ipdService.getInvoiceStats();

      if (res?.stats) {
        setStats(res.stats);
      }
    } catch (err) {
      console.error("Failed to load invoice stats:", err);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAccounts();
  }, [ search,status,fromDate, toDate]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      fetchAccounts();
    }, 400);

    return () => clearTimeout(searchDebounceRef.current);
  }, [search]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const handleModalClose = () => {
    setIsGenerateInvoiceOpen(false);
    fetchStats();
    fetchAccounts();
  };

  const columns = [
    {
      label: "Patient Details",
      headerClassName: "text-left whitespace-nowrap px-6",
      className: "py-4 px-4 align-top",
      render: (item) => (
        <div className="flex items-center gap-2 min-w-[160px]">
          <div className="w-8 h-8 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
            <span className="text-[#7C3AED] font-semibold text-[13px]">
              {item?.admission?.patient?.name?.charAt(0) || "?"}
            </span>
          </div>

          <div>
            <p className="font-semibold text-[#343C6A] whitespace-nowrap">
              {item?.admission?.patient?.name || "-"}
            </p>

            <p className="text-[12px] text-[#8BA3CB] whitespace-nowrap">
              {item?.admission?.patient?.patientId || "-"}
            </p>

            <p className="text-[12px] text-[#8BA3CB] whitespace-nowrap">
              {item?.admission.patient?.age || "-"} Y / {item?.admission.patient?.gender ||"-"}
            </p>
          </div>
        </div>
      ),
    },
    {
      label: "Admission & Discharge",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-4 pr-6 align-top",
      render: (item) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-[#343C6A] whitespace-nowrap">
            {item?.admission?.admissionDate
              ? new Date(item.admission.admissionDate).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "-"
            }
          </span>


          <span className="text-[#343C6A] whitespace-nowrap mt-1">
            {item?.admission?.dischargedAt
              ? new Date(item.admission.dischargedAt).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: true,
                })
              : "-"
            }
          </span>


        </div>
      ),
    },
    {
      label: "Total",
      headerClassName: "text-left whitespace-nowrap",
      className:
        "py-4 pr-6 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A]">
          {formatCurrency(item.totalAmount)}
        </span>
      ),
    },
    {
      label: "Paid",
      headerClassName: "text-left whitespace-nowrap",
      className:
        "py-4 pr-6 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A]">
          {formatCurrency(item.paidAmount)}
        </span>
      ),
    },

    {
      label: "Remaining",
      headerClassName: "text-left whitespace-nowrap",
      className:
        "py-4 pr-6 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A]">
          {formatCurrency(item.remainingAmount)}
        </span>
      ),
    },
     {
      label: "Discount",
      headerClassName: "text-left whitespace-nowrap",
      className:
        "py-4 pr-6 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A]">
          {formatCurrency(item.discount)}
        </span>
      ),
    },
    {
      label: "Status",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-4 pr-2 align-top",
      render: (item) => (
        <div className="flex flex-col gap-1">
          <span
            className={`text-[12px] font-medium px-2.5 py-1 rounded-full w-fit whitespace-nowrap capitalize ${
              statusStyles[item.paymentStatus] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {item.paymentStatus}
          </span>
        </div>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = records.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-transparent p-2 sm:px-3  flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
            Accounts
          </h1>

          <p className="text-[#8BA3CB] text-sm mt-1">
            All discharged patients and their billing details.
          </p>
        </div>

        <Button
          onClick={() => setIsGenerateInvoiceOpen(true)}
          className="text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 shrink-0"
          style={{ backgroundColor: PRIMARY }}
        >
          <UserPlus size={16} />
          Add Charges
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-12 gap-3">
        {/* Search */}
        <div className="xl:col-span-4 flex items-center border border-[#d3cccc] bg-white rounded-md px-3 py-2 gap-2 min-w-0">
          <Search size={16} className="text-gray-400 shrink-0" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, id,gender, mobile number"
            className="outline-none text-[14px] w-full min-w-0"
          />
        </div>

        <div className="relative xl:col-span-2">
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2.5 text-[14px] text-[#343C6A] outline-none"
          >
            <option value="all">All Status</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="partial">Partial</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        {/* From Date */}
        <div className="relative xl:col-span-2">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            placeholder="From Date"
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] outline-none"
          />

          <Calendar
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* To Date */}
        <div className="relative xl:col-span-2">
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            placeholder="To Date"
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] outline-none"
          />

          <Calendar
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* Filter Button */}
        <Button
          onClick={fetchAccounts}
          className="xl:col-span-1 border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A] w-full px-4 py-2"
        >
          <Filter size={14} />
          Filter
        </Button>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {statCardMeta.map((meta) => {
          const IconComp = meta.icon;
          const rawValue = stats[meta.key];

          const displayValue = statsLoading
            ? "—"
            : meta.isCurrency
            ? formatCurrency(rawValue)
            : Number(rawValue || 0).toLocaleString("en-IN");

          return (
            <div
              key={meta.key}
              style={{ background: meta.color }}
              className="rounded-lg p-3 sm:p-4 flex items-center gap-3 min-w-0"
            >
              <div
                className="w-10 h-10 sm:w-11 sm:h-11 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#ffffff90" }}
              >
                <IconComp
                  size={20}
                  color={meta.iconColor}
                />
              </div>

              <div className="min-w-0">
                <p className="text-[13px] font-medium text-[#343C6A] truncate">
                  {meta.heading}
                </p>

                <p className="text-[20px] sm:text-[22px] font-bold text-[#343C6A] truncate">
                  {displayValue}
                </p>

                <p className="text-[11px] text-[#8BA3CB] truncate">
                  {meta.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Error */}
      {error && (
        <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-4 py-2.5">
          {error}
        </div>
      )}

      {/* Desktop Table */}
      <div className="hidden xl:flex bg-white rounded-lg border border-[#e5e5e5] flex-col overflow-x-auto">
        <TableComponent
          columns={columns}
          data={paginatedData}
          loading={loading}
          headerBg="bg-[#F8F9FC]"
          actions={(item) => (
            <div className="flex gap-2 justify-center items-center">
              <Button
                onClick={() =>
                  navigate(`/ipd/accounts/${item.id}`)
                }
                className="border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-1 w-auto px-3 py-1.5 text-[13px]"
              >
                <Eye size={14} />
                View
              </Button>

            </div>
          )}
          actionLabel="Actions"
        />
      </div>

      {/* Mobile & Tablet Cards */}
      <div className="xl:hidden flex flex-col gap-3 w-full min-w-0">
        {loading && (
          <div className="bg-white rounded-lg border border-[#e5e5e5] text-center text-[13px] text-[#8BA3CB] py-8">
            Loading invoice records...
          </div>
        )}

        {!loading &&
        <div className="grid md:grid-cols-2 gap-4">
         {paginatedData.map((item, index) => {
            const patient = item?.admission?.patient;

            return (
              <div
                key={item.id || item.invoiceNo || index}
                className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden w-full min-w-0"
              >
                {/* Card Header - Same Patient Fields as Desktop */}
                <div className="p-3 sm:p-4 flex items-start justify-between gap-3 border-b border-[#f1eef7] min-w-0">
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                      <span className="text-[#7C3AED] font-semibold text-sm">
                        {patient?.name?.charAt(0) || "?"}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-[15px] font-semibold text-[#343C6A] break-words">
                        {patient?.name || "-"}
                      </p>

                      <p className="text-[12px] text-[#8BA3CB] mt-0.5 break-words">
                        {patient?.patientId || "-"}
                      </p>

                      <p className="text-[12px] text-[#8BA3CB] mt-0.5">
                        {patient?.age || "-"} Y /{" "}
                        {patient?.gender || "-"}
                      </p>
                    </div>
                  </div>

                  {/* Same Status Field as Desktop */}
                  <span
                    className={`shrink-0 text-[11px] sm:text-[12px] font-medium px-2 py-1 rounded-full whitespace-nowrap capitalize ${
                      statusStyles[item.paymentStatus] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.paymentStatus || "-"}
                  </span>
                </div>

                {/* Admission & Discharge - Same Fields as Desktop */}
                <div className="p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 border-b border-[#f1eef7]">
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8BA3CB] mb-1">
                      Admission
                    </p>

                    <p className="text-[13px] font-medium text-[#343C6A] break-words">
                      {formatDateTime(item?.admission?.admissionDate)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8BA3CB] mb-1">
                      Discharge
                    </p>

                    <p className="text-[13px] font-medium text-[#343C6A] break-words">
                      {formatDateTime(item?.admission?.dischargedAt)}
                    </p>
                  </div>
                </div>

                {/* Billing Fields - Same Fields as Desktop */}
                <div className="p-3 sm:p-4 grid grid-cols-2 sm:grid-cols-3 gap-3 border-b border-[#f1eef7]">
                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8BA3CB] mb-1">
                      Total
                    </p>

                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#343C6A] break-words">
                      {formatCurrency(item.totalAmount)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8BA3CB] mb-1">
                      Paid
                    </p>

                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#343C6A] break-words">
                      {formatCurrency(item.paidAmount)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8BA3CB] mb-1">
                      Remaining
                    </p>

                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#343C6A] break-words">
                      {formatCurrency(item.remainingAmount)}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <p className="text-[11px] text-[#8BA3CB] mb-1">
                      Discount
                    </p>

                    <p className="text-[13px] sm:text-[14px] font-semibold text-[#343C6A] break-words">
                      {formatCurrency(item.discount)}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3 sm:p-4 flex flex-col sm:flex-row gap-2">
                  <Button
                    onClick={() =>
                      navigate(`/ipd/accounts/${item.id}`)
                    }
                    className="w-full border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-2 px-4 py-2 text-[13px]"
                  >
                    <Eye size={15} />
                    View
                  </Button>
                </div>
              </div>
            );
          })}
          </div>
        }

        {!loading && records.length === 0 && (
          <div className="bg-white rounded-lg border border-[#e5e5e5] text-center text-[13px] text-[#8BA3CB] py-8 px-4">
            No invoice records found.
          </div>
        )}
      </div>

      {/* Pagination */}
      {!loading && (
        <div className="bg-white rounded-lg border border-[#e5e5e5] flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 p-2">
          <span className="text-[13px] text-[#8BA3CB] text-center sm:text-left">
            Showing {records.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(
              startIndex + ITEMS_PER_PAGE,
              records.length
            )}{" "}
            of {records.length} records
          </span>

          {records.length > 0 && (
            <div className="flex justify-center sm:justify-end overflow-x-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>
          )}
        </div>
      )}

      <GenerateInvoiceModal
        isOpen={isGenerateInvoiceOpen}
        onClose={handleModalClose}
      />
    </div>
  );
};

export default Accounts;
