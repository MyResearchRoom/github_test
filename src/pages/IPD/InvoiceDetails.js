import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  UserRound,
  Calendar,
  Stethoscope,
  BedDouble,
  Loader2,
  Plus,
  X,
} from "lucide-react";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";
import GenerateInvoiceModal from "../../modal/IPD/generateInvoice";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";

import AddDiscountModal from "../../modal/IPD/AddDiscountModal";

const PRIMARY = "#521785";

const statusStyles = {
  paid: "bg-[#DCFCE7] text-[#16A34A]",
  pending: "bg-[#FFEDD5] text-[#EA580C]",
  partial: "bg-[#FEE2E2] text-[#EF4444]",
};

const formatDateTime = (date) => {
  if (!date) return null;

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const formatCurrency = (amount) =>
  `\u20B9 ${Number(amount || 0).toLocaleString("en-IN")}`;

const InfoBlock = ({ icon: Icon, label, value, subValue }) => (
  <div className="flex items-start gap-3 min-w-0">
    <div className="w-9 h-9 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
      <Icon size={16} color={PRIMARY} />
    </div>

    <div className="min-w-0 flex-1">
      <p className="text-[12px] text-[#8BA3CB]">{label}</p>

      <p className="text-[14px] font-semibold text-[#343C6A] break-words">
        {value}
      </p>

      {subValue && (
        <p className="text-[12px] text-[#8BA3CB] break-words">
          {subValue}
        </p>
      )}
    </div>
  </div>
);

const InvoiceDetails = () => {
  const { accountId } = useParams();
  const navigate = useNavigate();

  const [invoice, setInvoice] = useState(null);
  const [charges, setCharges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);

  const [isDiscountModalOpen, setIsDiscountModalOpen] = useState(false);

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination();

  const fetchInvoice = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ipdService.getAccountById(accountId);


      setInvoice(res?.data || null);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to load account details."
      );
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  const fetchAccountCharges = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await ipdService.getAccountChargesByAccountId(accountId);


      setCharges(res?.data);
    } catch (err) {
      setError(
        err?.response?.data?.message || "Failed to fetch account charges."
      );
    } finally {
      setLoading(false);
    }
  }, [accountId]);

  useEffect(() => {
    if (accountId) {
      fetchInvoice();
      fetchAccountCharges();
    } else {
      setError("Account details can not get");
    }
  }, [fetchInvoice, fetchAccountCharges, accountId]);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setTotalPages(Math.ceil(charges.length / ITEMS_PER_PAGE) || 1);
  }, [charges, setTotalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedCharges = charges.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const openInvoiceModal = () => {
    setIsInvoiceModalOpen(true);
  };

  const openDiscountModal = () => {
    setIsDiscountModalOpen(true);
  };

  if (loading) {
    return (
      <div className="h-full w-full max-w-full overflow-x-hidden bg-transparent p-2 sm:p-4 lg:p-6 flex flex-col gap-4">
        <button
          onClick={() => navigate("/ipd/accounts")}
          className="flex items-center gap-1 text-[14px] font-medium w-fit"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={16} />
          Back to Accounts
        </button>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 sm:p-10 flex items-center justify-center text-[#8BA3CB] gap-2">
          <Loader2 size={18} className="animate-spin" />
          Loading invoice...
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="h-full w-full max-w-full overflow-x-hidden bg-transparent p-2 sm:p-4 lg:p-6 flex flex-col gap-4">
        <button
          onClick={() => navigate("/ipd/accounts")}
          className="flex items-center gap-1 text-[14px] font-medium w-fit"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={16} />
          Back to Accounts
        </button>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 sm:p-10 text-center text-[#8BA3CB] break-words">
          {error || `Account ${accountId} was not found.`}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-full h-auto w-full max-w-full overflow-x-hidden overflow-y-auto bg-transparent p-2 sm:p-3 lg:px-3 flex flex-col gap-4 scrollbar-hide">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 min-w-0">
        <div className="min-w-0">
          <button
            onClick={() => navigate("/ipd/accounts")}
            className="flex items-center gap-1 text-[13px] font-medium mb-1"
            style={{ color: PRIMARY }}
          >
            <ArrowLeft size={15} />
            Back to Accounts
          </button>

          <p className="text-[#8BA3CB] text-sm break-words">
            Patient details and billing breakdown.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap sm:justify-end">
          <span className="text-[13px] sm:text-sm whitespace-nowrap">
            Account Status:
          </span>

          <span
            className={`px-2 sm:px-3 py-1 rounded-lg text-xs md:text-sm lg:text-base font-medium capitalize border whitespace-nowrap ${invoice.status === "open"
              ? "bg-green-100 text-green-700 border-green-700"
              : invoice.status === "closed"
                ? "bg-gray-100 text-gray-700 border-gray-700"
                : invoice.status === "cancelled"
                  ? "bg-red-100 text-red-700 border-red-700"
                  : "bg-gray-100 text-gray-700 border-gray-700"
              }`}
          >
            {invoice.status}
          </span>
        </div>
      </div>

      {/* Upper Section - Patient Details + Payment Status */}
      <div className="flex flex-col lg:flex-row gap-4 items-stretch w-full max-w-full min-w-0">

        <div className="w-full lg:flex-1 min-w-0 bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 lg:p-5 grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5 lg:gap-6">
          <InfoBlock
            icon={Stethoscope}
            label="Account number "
            value={invoice?.accountNumber || "-"}
          />

          <InfoBlock
            icon={UserRound}
            label="Patient name"
            value={invoice?.admission?.patient?.name || "-"}
          />

          <InfoBlock
            icon={UserRound}
            label="Patient details"
            value={invoice?.admission?.patient?.patientId}
            subValue={`${invoice?.admission?.patient?.age} Y / ${invoice?.admission?.patient?.gender}`}
          />

          <InfoBlock
            icon={Calendar}
            label="Admission - Discharge"
            value={`${formatDateTime(invoice?.admission?.admissionDate) || "-"} → ${formatDateTime(invoice?.admission?.dischargeDate) || "Ongoing"
              }`}
          />

          <InfoBlock
            icon={Stethoscope}
            label="Attending Doctor"
            value={
              invoice?.admission?.doctorId
                ? invoice?.admission?.doctor?.name
                : invoice?.admission?.subDoctorId
                  ? invoice?.admission?.subDoctor?.name
                  : "-"
            }
          />

          <InfoBlock
            icon={BedDouble}
            label="Ward / Room / Bed"
            value={`${invoice?.admission?.ward?.wardName || "-"} / ${invoice?.admission?.room?.roomNumber || "-"
              }`}
            subValue={invoice?.admission?.bed?.bedCode}
          />

        </div>

        <div className="w-full lg:w-[280px] lg:shrink-0 bg-white rounded-lg border border-[#e5e5e5] p-4 sm:p-5 flex flex-col gap-4 min-w-0 self-stretch box-border">
          <div className="flex justify-between items-center gap-3 w-full">
            <h2 className="text-[16px] font-semibold text-[#343C6A]">
              Payment Status
            </h2>

            <span
              className={`text-[13px] font-medium px-3 py-1.5 rounded-full w-fit capitalize border ${statusStyles[invoice.paymentStatus] ||
                "bg-gray-100 text-gray-600"
                }`}
            >
              {invoice.paymentStatus}
            </span>
          </div>

          <div className="flex flex-col gap-2 text-[13px] md:text-sm lg:text-base w-full font-semibold">
            <div className="flex justify-between items-center gap-3 w-full">
              <span className="text-gray-800 whitespace-nowrap">
                Total Amount
              </span>

              <span className="text-[#343C6A] font-medium whitespace-nowrap">
                {formatCurrency(invoice.totalAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 w-full">
              <span className="text-gray-800 whitespace-nowrap">
                Advance Paid
              </span>

              <span className="text-[#343C6A] font-medium whitespace-nowrap">
                {formatCurrency(invoice.advancePayment)}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 w-full">
              <span className="text-gray-800 whitespace-nowrap">
                Discount
              </span>

              <span className="text-[#343C6A] font-medium whitespace-nowrap">
                {formatCurrency(invoice.discount)}
              </span>
            </div>



            <div className="flex justify-between items-center gap-3 w-full">
              <span className="text-gray-800 whitespace-nowrap">
                Amount Paid
              </span>

              <span className="text-[#343C6A] font-medium whitespace-nowrap">
                {formatCurrency(invoice.paidAmount)}
              </span>
            </div>

            <div className="flex justify-between items-center gap-3 w-full">
              <span className="text-gray-800 whitespace-nowrap">
                Amount Due
              </span>

              <span className="font-medium text-[#EF4444] whitespace-nowrap">
                {formatCurrency(invoice.remainingAmount)}
              </span>
            </div>
          </div>
        </div>
      </div>


      <div className="w-full min-w-0 bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 lg:p-5 flex flex-col gap-3">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 min-w-0">
          <h2 className="text-[16px] font-semibold text-[#343C6A]">
            Billing breakdown
          </h2>

          {invoice.paymentStatus !== "paid" && (
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Button
                onClick={() => openDiscountModal()}
                className="text-white text-[13px] px-3 py-1.5 flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={14} />
                Add Discount
              </Button>
              <Button
                onClick={() => openInvoiceModal()}
                className="text-white text-[13px] px-3 py-1.5 flex items-center justify-center gap-1.5 w-full sm:w-auto shrink-0"
                style={{ backgroundColor: PRIMARY }}
              >
                <Plus size={14} />
                Add Charges
              </Button>
            </div>
          )}
        </div>

        {charges && charges.length > 0 ? (
          <>
            {/* Desktop - Table */}
            <div className="hidden md:block overflow-x-auto border border-[#e5e5e5] rounded-md">
              <table className="w-full text-left text-[13px]">
                <thead className="bg-[#F8F9FC] text-[#343C6A] font-semibold border-b border-[#e5e5e5]">
                  <tr>
                    <th className="py-2.5 px-3">Date</th>
                    <th className="py-2.5 px-3">Name</th>
                    <th className="py-2.5 px-3">Price</th>
                    <th className="py-2.5 px-3">Remarks</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-[#f0f0f0]">
                  {paginatedCharges.map((p, idx) => (
                    <tr key={p.id || idx}>
                      <td className="py-2.5 px-3 font-medium text-[#343C6A]">
                        {formatDateTime(p?.chargeDate) || "—"}
                      </td>

                      <td className="py-2.5 px-3 text-[#343C6A]">
                        <span className="text-[12px] font-medium">
                          {p?.chargeName === "Bed Charge"
                            ? `${p?.chargeName} (${Math.trunc(
                              p?.unitPrice || 0
                            )} x ${Math.trunc(p?.quantity || 0)})`
                            : p?.chargeName || "-"}
                        </span>
                      </td>

                      <td className="py-2.5 px-3 font-semibold text-[#16A34A]">
                        {formatCurrency(p.totalAmount)}
                      </td>

                      <td className="py-2.5 px-3">
                        {p?.remarks || "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile & Tablet - Cards */}
            <div className="md:hidden flex flex-col gap-3">
              {paginatedCharges.map((p, idx) => (
                <div
                  key={p.id || idx}
                  className="border border-[#e5e5e5] rounded-lg p-4 bg-[#F8F9FC] w-full min-w-0"
                >
                  <div className="flex justify-between items-start gap-3 mb-3">
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] text-[#8BA3CB] mb-1">
                        Charge Name
                      </p>

                      <p className="text-[14px] font-semibold text-[#343C6A] break-words">
                        {p?.chargeName === "Bed Charge"
                          ? `${p?.chargeName} (${Math.trunc(
                            p?.unitPrice || 0
                          )} x ${Math.trunc(p?.quantity || 0)})`
                          : p?.chargeName || "-"}
                      </p>
                    </div>

                    <div className="shrink-0 text-right">
                      <p className="text-[11px] text-[#8BA3CB] mb-1">
                        Price
                      </p>

                      <p className="text-[14px] font-semibold text-[#16A34A] whitespace-nowrap">
                        {formatCurrency(p.totalAmount)}
                      </p>
                    </div>
                  </div>

                  <div className="border-t border-[#e5e5e5] pt-3 flex flex-col gap-3">
                    <div>
                      <p className="text-[11px] text-[#8BA3CB] mb-1">
                        Date
                      </p>

                      <p className="text-[13px] font-medium text-[#343C6A] break-words">
                        {formatDateTime(p?.chargeDate) || "—"}
                      </p>
                    </div>

                    <div>
                      <p className="text-[11px] text-[#8BA3CB] mb-1">
                        Remarks
                      </p>

                      <p className="text-[13px] text-[#343C6A] break-words">
                        {p?.remarks || "—"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination - Billing Breakdown Only */}
            {totalPages > 1 && (
              <div className="pt-2">
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  goToPage={goToPage}
                />
              </div>
            )}
          </>
        ) : (
          <p className="text-[13px] text-[#8BA3CB] py-2">
            No charges history recorded yet.
          </p>
        )}
      </div>

      <GenerateInvoiceModal
        isOpen={isInvoiceModalOpen}
        onClose={() => {
          setIsInvoiceModalOpen(false);
          fetchAccountCharges();
          fetchInvoice();
        }}
        accountId={accountId}
      />

      <AddDiscountModal
        isOpen={isDiscountModalOpen}
        onClose={() => {
          setIsDiscountModalOpen(false);
          fetchAccountCharges();
          fetchInvoice();
        }}
        accountId={accountId}
      />
    </div>
  );
};

export default InvoiceDetails;