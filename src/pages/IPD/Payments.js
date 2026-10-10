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
  Plus,
  X,
  Loader2,
} from "lucide-react";

import TableComponent from "../../commonComponent/TableComponent";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";

import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { toast } from "react-toastify";
import DualInvoicePDF from "../../pdf/dualInvoicePdf";
import { pdf } from "@react-pdf/renderer";


const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const statCardMeta = [
  {
    key: "totalAccountPayments",
    heading: "Total Payements",
    icon: FileText,
    color: "#F3E8FF",
    iconColor: "#9333EA",
    isCurrency: false,
    subtext: "Total collected payments",
  },
  {
    key: "totalAmount",
    heading: "Total Billed",
    icon: Wallet,
    color: "#DCFCE7",
    iconColor: "#16A34A",
    isCurrency: true,
    subtext: "Across all invoices",
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
  completed: "bg-[#DCFCE7] text-[#16A34A]",
  cancelled: "bg-[#FEE2E2] text-[#EF4444]",
  refunded: "bg-[#E0E7FF] text-[#4F46E5]",
};

const formatDate = (date) => {
  if (!date) return "-";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};


const formatCurrency = (amount) =>
  `₹ ${Number(amount || 0).toLocaleString("en-IN")}`;

const Payments = () => {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [status,setStatus]=useState('all');
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [admissions, setAdmissions] = useState([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);

  const [stats, setStats] = useState({
    totalInvoices: 0,
    totalAmount: 0,
    paidAmount: 0,
    pendingAmount: 0,
  });

  const [statsLoading, setStatsLoading] = useState(false);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [paymentAmount, setPaymentAmount] = useState("");
  const [paymentDate, setPaymentDate] = useState(
    new Date().toISOString().split("T")[0],
  );
  const [paymentMode, setPaymentMode] = useState("cash");
  const [accountId, setAccountId] = useState(null);

  const [paymentNotes, setPaymentNotes] = useState("");
  const [paymentSubmitting, setPaymentSubmitting] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  const searchDebounceRef = useRef(null);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editingPaymentId, setEditingPaymentId] = useState(null);

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination();

  useEffect(() => {
    setTotalPages(Math.ceil(records.length / ITEMS_PER_PAGE) || 1);
  }, [records, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [search, status, fromDate, toDate, goToPage]);

  const fetchPayments = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const res = await ipdService.getAccountPayments({
        search,
        status,
        fromDate,
        toDate,
      });

      setRecords(res?.data || []);
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Failed to load payments. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }, [search,status,fromDate, toDate]);

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
    fetchPayments();
  }, [search,status,fromDate, toDate]);

  useEffect(() => {
    if (searchDebounceRef.current) {
      clearTimeout(searchDebounceRef.current);
    }

    searchDebounceRef.current = setTimeout(() => {
      fetchPayments();
    }, 400);

    return () => clearTimeout(searchDebounceRef.current);
  }, [search]);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  useEffect(() => {
      if (!isPaymentModalOpen) return;
  
      const loadAdmissions = async () => {
        setAdmissionsLoading(true);
        setError("");
  
        try {
          const res = await ipdService.getPatientsWithAccount();
  
          setAdmissions(res?.data);
        } catch (err) {
          setAdmissions([]);
          setError(
            err?.response?.data?.message ||
              err?.response?.data?.error ||
              "Failed to load admitted patients."
          );
        } finally {
          setAdmissionsLoading(false);
        }
      };
  
      loadAdmissions();
    }, [isPaymentModalOpen]);


  const handleEditClick = (item) => {
    setIsEditMode(true);
    setEditingPaymentId(item.id);

    setSelectedInvoice(item.account);

    setAccountId(item.accountId);
    setPaymentAmount(item.amount);
    setPaymentDate(item.paymentDate?.split("T")[0]);
    setPaymentMode(item.paymentMode);
    setPaymentNotes(item.remarks || "");

    setPaymentError("");
    setIsPaymentModalOpen(true);
  };

  const handleDownloadClick = async (item) => {
    try {
      const accountId = item.accountId;
      const patientId = item.account?.patient?.id;
      const paymentId = item.id;

      // console.log("1. IDs:", {
      //   accountId,
      //   patientId,
      //   paymentId,
      // });

      const res = await ipdService.getDetailsForPrint(
        accountId,
        patientId,
        paymentId
      );

      // console.log("2. API response:", res);

      if (!res) {
        toast.error("Failed to generate print bill");
        return;
      }

      // console.log("3. PDF data:", res.data);
      // console.log("4. Logo:", item.logo);

      const pdfDocument = (
        <DualInvoicePDF
          data={res.data}
          logo={item.logo}
        />
      );

      // console.log("5. PDF component created:", pdfDocument);

      const blob = await pdf(pdfDocument).toBlob();

      // console.log("6. Blob generated:", blob);

      const url = URL.createObjectURL(blob);

      window.open(url, "_blank");

      const link = document.createElement("a");
      link.href = url;
      link.download = `IPD-Bill-${accountId}-${paymentId}.pdf`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 5000);
    } catch (err) {
      console.error("Failed to generate print bill:", err);
      // console.error("Error stack:", err?.stack);

      toast.error("Failed to generate print bill");
    }
  };

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

  const openPaymentModal = () => {
    setIsEditMode(false);
    setEditingPaymentId(null);

    setAccountId(null);
    setSelectedInvoice(null);

    setPaymentAmount("");
    setPaymentDate(new Date().toISOString().split("T")[0]);
    setPaymentMode("cash");
    setPaymentNotes("");
    setPaymentError("");

    setIsPaymentModalOpen(true);
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();

    setPaymentError("");

    if (!accountId) {
      setPaymentError("Please select a patient.");
      return;
    }

    if (!paymentAmount) {
      setPaymentError("Please enter the payment amount.");
      return;
    }

    if (!paymentDate) {
      setPaymentError("Please select the payment date.");
      return;
    }

    if (!paymentMode) {
      setPaymentError("Please select a payment mode.");
      return;
    }

    if (!selectedInvoice) {
      setPaymentError("Please select a patient.");
      return;
    }

    const amount = Number(paymentAmount);

    if (Number.isNaN(amount) || amount <= 0) {
      setPaymentError("Enter a valid payment amount.");
      return;
    }


    if (isEditMode){
      if(amount > Number(selectedInvoice.remainingAmount || 0)) {
        setPaymentError("Payment amount cannot be greater than the due amount for edit.");
        return;
      }
    } else{
      if (amount > Number(selectedInvoice.dueAmount || 0)) {
        setPaymentError("Payment amount cannot be greater than the due amount.");
        return;
      }
    }
    setPaymentSubmitting(true);

    try {
      const payload={
        amount:amount,
        paymentMode:paymentMode,
        paymentDate:paymentDate,
        remarks:paymentNotes,
      }
      if (isEditMode) {
          const res = await ipdService.updatePatientAccountPayment(
            accountId,
            editingPaymentId,
            payload
          );

          toast.success(res?.message || "Payment updated successfully.");
      } else {
          const res = await ipdService.addPatientAccountPayments(
              accountId,
              payload
          );

          toast.success(res?.message || "Payment added successfully.");
      }
      setIsPaymentModalOpen(false);
      setPaymentAmount("");
      setPaymentNotes("");
      setSelectedInvoice(null);
      setAccountId(null);
      setPaymentMode("cash");

      await fetchPayments();
      await fetchStats();
    } catch (err) {
      setPaymentError(
        err?.response?.data?.message || "Failed to record payment."
      );
    } finally {
      setPaymentSubmitting(false);
    }
  };

  const columns = [
    {
      label: "Payment No.",
      field: "paymentNumber",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className:
        "pl-2 py-4 align-top font-semibold text-[#343C6A] whitespace-nowrap text-sm",
    },

    {
      label: "Patient Details",
      headerClassName: "text-left whitespace-nowrap px-6",
      className: "py-4 px-6 align-top",
      render: (item) => (
        <div className="flex items-center gap-2 ">
          <div>
            <p className="font-semibold text-[#343C6A] whitespace-nowrap capitalize text-sm">
              {item?.account?.patient?.name}
            </p>

            <p className="text-[12px] text-[#8BA3CB] whitespace-nowrap">
              ID: {item?.account?.patient?.patientId || "-"}
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
        <div className="flex flex-col gap-0.5  text-sm">
          <span className="text-[#343C6A] whitespace-nowrap">
            {item?.account?.admission?.admissionDate
              ? new Date(item.account.admission.admissionDate).toLocaleString("en-IN", {
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
            {item?.account?.admission?.dischargedAt
              ? new Date(item.account.admission.dischargedAt).toLocaleString("en-IN", {
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
      label: "Amount",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-4 pr-6 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A] text-sm">
          {formatCurrency(item.amount)}
        </span>
      ),
    },

    {
      label: "Mode",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-4 px-2 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A] capitalize text-sm">
          {item.paymentMode}
        </span>
      ),
    },

    {
      label: "Remark",
      headerClassName: "text-left whitespace-nowrap px-5",
      className: "py-4 px-5 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A] capitalize min-w-0 max-w-lg text-wrap whitespace-nowrap text-sm">
          {item?.remarks || "-"}
        </span>
      ),
    },

    {
      label: "Date",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-4 pr-6 align-top font-semibold whitespace-nowrap",
      render: (item) => (
        <span className="font-semibold text-[#343C6A] capitalize text-sm">
           {item?.paymentDate
              ? new Date(item.paymentDate).toLocaleString("en-IN", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })
              : "-"
            }
        </span>
      ),
    },

    {
      label: "Payment Status",
      headerClassName: "text-left whitespace-nowrap",
      className: "py-4 pr-6 align-top",
      render: (item) => (
        <div className="flex flex-col gap-1 text-sm">
          <span
            className={`text-[12px] font-medium px-2.5 py-1 rounded-full w-fit whitespace-nowrap capitalize ${
              statusStyles[item.status] ||
              "bg-gray-100 text-gray-600"
            }`}
          >
            {item.status}
          </span>
        </div>
      ),
    },
  ];

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = records.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  return (
    <div className="min-h-full w-full bg-transparent p-2 lg:p-1 flex flex-col gap-4 overflow-y-auto">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
            Payments
          </h1>

          <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
            All discharged patients and their billing details.
          </p>
        </div>

        <Button
          onClick={() => {openPaymentModal()}}
          className="text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2"
          style={{ backgroundColor: PRIMARY }}
        >
          <Plus size={16} />
          Add Payment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-[1fr_16%_16%_14%_14%_auto] gap-3 items-center">
        <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-2.5 gap-2 bg-white min-w-0">
          <Search size={16} className="text-gray-400 shrink-0" />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient number & patient name,id,gender, mobile number"
            className="outline-none text-[14px] w-full min-w-0 bg-transparent"
          />
        </div>

        <div className="relative w-full">
          <select 
            value={status} 
            onChange={(e) => setStatus(e.target.value)}
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-9 py-2.5 text-[14px] text-[#343C6A] outline-none bg-white"
          >
            <option value="all">All Status</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="refunded">Refunded</option>
          </select>
        </div>

        <div className="relative w-full">
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-9 py-2.5 text-[14px] text-[#343C6A] outline-none bg-white"
          />

          <Calendar
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <div className="relative w-full">
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-9 py-2.5 text-[14px] text-[#343C6A] outline-none bg-white"
          />

          <Calendar
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <Button
          onClick={fetchPayments}
          className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A] w-full lg:w-auto px-4 py-2.5"
        >
          <Filter size={14} />
          Filter
        </Button>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
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
              className="rounded-lg p-3 sm:p-4 flex items-center gap-2 sm:gap-3 min-w-0"
            >
              <div
                className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center shrink-0"
                style={{ background: "#ffffff90" }}
              >
                <IconComp size={18} color={meta.iconColor} />
              </div>

              <div className="min-w-0">
                <p className="text-[11px] sm:text-[13px] font-medium text-[#343C6A] truncate">
                  {meta.heading}
                </p>

                <p className="text-[17px] sm:text-[22px] font-bold text-[#343C6A] truncate">
                  {displayValue}
                </p>

                <p className="text-[9px] sm:text-[11px] text-[#8BA3CB] truncate">
                  {meta.subtext}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-4 py-2.5">
          {error}
        </div>
      )}

      {/* DESKTOP TABLE */}
      <div className="hidden lg:flex bg-white rounded-lg border border-[#e5e5e5] flex-col overflow-hidden min-w-0">
        <div className="overflow-x-auto w-full">
          <TableComponent
            columns={columns}
            data={paginatedData}
            loading={loading}
            headerBg="bg-[#F8F9FC]"
            actions={(item) => (
              <div className="flex gap-2 justify-center items-center pr-2">

                <Button
                  onClick={() => navigate(`/ipd/paymentView/${item.account.admissionId}`)}
                  // className="border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-0.5 w-auto px-2 py-1.5 text-[13px]"
                  className="p-1.5 rounded-md border border-[#7C3AED] text-[#7C3AED] hover:bg-gray-50"
                >
                  <Eye size={15} />
                </Button>

                <button
                  onClick={() => handleEditClick(item)}
                  title="Edit invoice"
                  className="p-1.5 rounded-md border border-blue-500 text-blue-500 hover:bg-gray-50"
                >
                  <Pencil size={15} />
                </button>

                <button
                  onClick={() => handleDownloadClick(item)}
                  title="Download invoice"
                  className="p-1.5 rounded-md border border-[#343C6A] text-[#343C6A] hover:bg-gray-50"
                >
                  <Download size={15} />
                </button>
              </div>
            )}
            actionLabel="Actions"
          />
        </div>

        <div className="flex justify-between items-center p-4">
          <span className="text-[13px] text-[#8BA3CB]">
            Showing {records.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, records.length)} of{" "}
            {records.length} records
          </span>

          {records.length > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              goToPage={goToPage}
            />
          )}
        </div>
      </div>

      {/* MOBILE + TABLET CARDS */}
      <div className="lg:hidden bg-white rounded-lg border border-[#e5e5e5] overflow-hidden w-full min-w-0">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="text-sm text-[#8BA3CB]">
              Loading payments...
            </div>
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="flex justify-center items-center py-12 px-4">
            <div className="text-sm text-[#8BA3CB]">
              No payments found.
            </div>
          </div>
        ) : (
          <div className="p-3 sm:p-4 space-y-3 w-full min-w-0">
            {paginatedData.map((item, index) => {
              const patientName =
                item?.account?.patient?.name || "-";

              const patientId =
                item?.account?.patient?.patientId || "-";

              const admissionDate =
                item?.account?.admission?.admissionDate;

              const dischargedAt =
                item?.account?.admission?.dischargedAt;

              return (
                <div
                  key={item.id || item.paymentNumber || index}
                  className="border border-[#e5e5e5] rounded-lg bg-white overflow-hidden w-full min-w-0"
                >
                  {/* CARD HEADER */}
                  <div className="bg-[#F8F9FC] px-3 sm:px-4 py-3 flex flex-row justify-between items-center sm:justify-between gap-2 border-b border-[#e5e5e5] min-w-0">
                    <div className="min-w-0">
                      <p className="text-[11px] text-[#8BA3CB]">
                        Payment No.
                      </p>

                      <p className="text-[14px] font-semibold text-[#343C6A] break-words">
                        {item?.paymentNumber || "-"}
                      </p>
                    </div>

                    <span
                      className={`text-[11px] sm:text-[12px] font-medium px-2.5 py-1 rounded-full w-fit whitespace-nowrap capitalize ${
                        statusStyles[item?.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {item?.status || "-"}
                    </span>
                  </div>

                  {/* CARD CONTENT */}
                  <div className="p-3 sm:p-4 min-w-0">
                    {/* PATIENT DETAILS */}
                    <div className="flex items-center gap-3 mb-4 min-w-0">
                      <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                        <span className="text-[#7C3AED] font-semibold text-sm">
                          {patientName !== "-"
                            ? patientName.charAt(0).toUpperCase()
                            : "?"}
                        </span>
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[#343C6A] text-sm break-words capitalize">
                          {patientName}
                        </p>

                        <p className="text-[11px] text-[#8BA3CB] break-words">
                          ID: {patientId}
                        </p>
                      </div>
                    </div>

                    {/* ADMISSION / DISCHARGE */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 mb-3 border-b border-[#eeeeee]">
                      <div className="min-w-0">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Admission
                        </p>

                        <p className="text-[13px] font-medium text-[#343C6A] break-words">
                          {formatDateTime(admissionDate)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Discharge
                        </p>

                        <p className="text-[13px] font-medium text-[#343C6A] break-words">
                          {formatDateTime(dischargedAt)}
                        </p>
                      </div>
                    </div>

                    {/* PAYMENT DETAILS */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pb-3 mb-3 border-b border-[#eeeeee]">

                      <div className="min-w-0">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Amount
                        </p>

                        <p className="text-[14px] font-semibold text-[#343C6A] whitespace-nowrap">
                          {formatCurrency(item?.amount)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Date
                        </p>

                        <p className="text-[14px] font-semibold text-[#343C6A] whitespace-nowrap">
                          {formatDate(item?.paymentDate)}
                        </p>
                      </div>

                      <div className="min-w-0">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Mode
                        </p>

                        <p className="text-[13px] font-semibold text-[#343C6A] capitalize break-words">
                          {item?.paymentMode || "-"}
                        </p>
                      </div>

                      {/* <div className="min-w-0">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Payment Status
                        </p>

                        <div
                          className={`inline-flex text-[11px] font-medium px-2.5 py-1 rounded-full w-fit whitespace-nowrap capitalize ${
                            statusStyles[item?.status] ||
                            "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {item?.status || "-"}
                        </div>
                      </div> */}

                    </div>

                    <div>
                      <div className="min-w-0 pb-4">
                        <p className="text-[11px] text-[#8BA3CB] mb-1">
                          Remarks
                        </p>

                        <p className="text-[14px] font-semibold text-[#343C6A] min-w-0 break-words">
                          {item?.remarks}
                        </p>
                      </div>
                    </div>


                    {/* ACTIONS */}
                    <div className="grid grid-cols-3 sm:grid-cols-[auto_auto_auto] gap-2">
                      {/* <Button
                        onClick={() =>
                          navigate(`/ipd/accounts/${item.invoiceNo}`)
                        }
                        className="border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-1 w-full px-3 py-2 text-[12px]"
                      >
                        <Eye size={14} />
                        View
                      </Button> */}

                      <Button
                        onClick={() => navigate(`/ipd/paymentView/${item.account.admissionId}`)}
                        className="p-2 rounded-md border border-[#7C3AED] text-[#7C3AED] hover:bg-gray-50 flex items-center justify-center"
                      >
                        <Eye size={15} />
                      </Button>

                      <button
                        onClick={() => handleEditClick(item)}
                        title="Edit invoice"
                        className="p-2 rounded-md border border-blue-500 text-blue-500 hover:bg-gray-50 flex items-center justify-center"
                      >
                        <Pencil size={15} />
                      </button>

                      <button
                        onClick={() => handleDownloadClick(item)}
                        title="Download invoice"
                        className="p-2 rounded-md border border-[#343C6A] text-[#343C6A] hover:bg-gray-50 flex items-center justify-center"
                      >
                        <Download size={15} />
                      </button>
                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* MOBILE + TABLET PAGINATION */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 p-3 sm:p-4 border-t border-[#eeeeee] w-full min-w-0">
          <span className="text-[11px] sm:text-[13px] text-[#8BA3CB] break-words">
            Showing {records.length === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, records.length)} of{" "}
            {records.length} records
          </span>

          {records.length > 0 && (
            <div className="w-full sm:w-auto overflow-x-auto">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>
          )}
        </div>
      </div>

      {/* ADD PAYMENT MODAL */}
      {isPaymentModalOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
          <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden">
            <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
              <div>
                <h2 className="text-lg font-semibold text-[#343C6A]">
                   {isEditMode ? "Edit Payment" : "Add Payment Record"}
                </h2>
                <p className="text-[12px] text-[#8BA3CB] mt-0.5">
                  {selectedInvoice !== null && (
                  <>
                    {selectedInvoice?.accountNumber} • Due:{" "}
                    {
                      isEditMode
                        ? (selectedInvoice?.remainingAmount
                            ? formatCurrency(selectedInvoice.remainingAmount)
                            : 0)
                        : (selectedInvoice?.dueAmount
                            ? formatCurrency(selectedInvoice.dueAmount)
                            : 0)
                    }
                  </>
                  )}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsPaymentModalOpen(false);
                  setSelectedInvoice(null);
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={handleRecordPayment}
              className="p-4 flex flex-col gap-4"
            >
              {paymentError && (
                <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-3 py-2">
                  {paymentError}
                </div>
              )}

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#343C6A]">Patient</label>
              
                <>
                  <div className="relative">
                    <select
                      name="admissionId"
                      value={accountId}
                      onChange={(e) => {
                        setPaymentError("");
                        const selectedAccountId = e.target.value;

                        setAccountId(selectedAccountId);

                        const selected = admissions.find(
                          (a) => String(a.accountId) === String(selectedAccountId)
                        );

                        setSelectedInvoice(selected || null);
                      }}
                      className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50"
                      required
                      disabled={admissionsLoading|| isEditMode}
                    >
                                  <option value="">
                                    {admissionsLoading ? "Loading patients..." : "Select patient"}
                                  </option>
                                  {admissions.map((a) => (
                                    <option key={a.patientId} value={a.accountId}>
                                      {a.patientName} ({a.patientUniqueId}) ({a.accountNumber})
                                    </option>
                                  ))}
                    </select>
                    {admissionsLoading ? (
                                  <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
                    ) : (
                                  <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    )}
                  </div>
                  {!admissionsLoading && admissions.length === 0 && (
                                <p className="text-[12px] text-[#8BA3CB]">No currently admitted patients found.</p>
                  )}
                </>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#343C6A]">
                  Amount Paid (₹) *
                </label>

                <input
                  type="number"
                  min="1"
                  max={selectedInvoice?.dueAmount || selectedInvoice?.remainingAmount ||""}
                  value={paymentAmount}
                  onChange={(e) => {
                    setPaymentError("");
                    setPaymentAmount(e.target.value);
                  }}
                  placeholder={
                    selectedInvoice
                      ? `Due: ${formatCurrency(selectedInvoice.dueAmount)}`
                      : "Enter payment amount"
                  }
                  className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
                  required
                  autoFocus
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#343C6A]">
                  Payment Date *
                </label>

                <input
                  type="date"
                  value={paymentDate}
                  onChange={(e) => {
                    setPaymentError("");
                    setPaymentDate(e.target.value);
                  }}
                  className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
                  required
                />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#343C6A]">
                  Mode of Payment *
                </label>

                <select
                  value={paymentMode}
                  onChange={(e) => {
                    setPaymentError("");
                    setPaymentMode(e.target.value);
                  }}
                  className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2 bg-white"
                  required
                >
                  <option value="cash">Cash</option>
                  <option value="upi">UPI</option>
                  <option value="card">Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="cheque">Cheque</option>
                  <option value="insurance">Insurance</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[13px] font-medium text-[#343C6A]">
                  Notes / Remarks (optional)
                </label>

                <input
                  type="text"
                  value={paymentNotes}
                  onChange={(e) => setPaymentNotes(e.target.value)}
                  placeholder="e.g. Part payment round 1"
                  className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  onClick={() => {
                    setIsPaymentModalOpen(false);
                    setSelectedInvoice(null);
                    fetchPayments();
                  }}
                  className="border border-[#d3cccc] bg-white text-[#343C6A] w-auto px-4 py-2"
                  disabled={paymentSubmitting}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  className="text-white w-auto px-4 py-2 flex items-center justify-center gap-1.5"
                  style={{ backgroundColor: PRIMARY }}
                  disabled={paymentSubmitting}
                >
                  {paymentSubmitting && (
                    <Loader2 size={14} className="animate-spin" />
                  )}

                  {paymentSubmitting
                    ? isEditMode
                        ? "Updating..."
                        : "Recording..."
                    : isEditMode
                        ? "Update Payment"
                        : "Save Payment"
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}  
    </div>
  );
};

export default Payments;