import React, { useEffect, useRef, useState } from "react";
import {
  FileText,
  X,
  Bed,
  User,
  Printer,
} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import { ipdService } from "../../services/ipdService";
import { toast } from "react-toastify";

const PRIMARY = "#521785";

const getInitials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase())
    .join("");

const formatDateTime = (date) => {
  if (!date) return "—";

  return new Date(date).toLocaleString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
};

const statusStyles = {
  paid: "bg-[#DCFCE7] text-[#16A34A]",
  pending: "bg-[#FFEDD5] text-[#EA580C]",
  partial: "bg-[#FEE2E2] text-[#EF4444]",
};

const DischargeDetailsModal = ({
  isOpen,
  onClose,
  admissionId,
  dischargeId,
}) => {
  const contentRef = useRef();

  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen || !admissionId || !dischargeId) {
      return;
    }

    fetchDischargeDetails();
  }, [isOpen, admissionId, dischargeId]);

  const fetchDischargeDetails = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await ipdService.getDischargeDetails(
        admissionId,
        dischargeId
      );

      if (response?.success) {
        setRecord(response.data);
      } else {
        setRecord(null);
        setError(
          response?.message || "Failed to fetch discharge details."
        );
      }
    } catch (err) {
      console.error("Error fetching discharge details:", err);

      setRecord(null);
      setError(
        err?.response?.data?.message ||
          "Failed to fetch discharge details."
      );
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const patient = record?.patient;
  const admission = record?.admission;
  const doctor = record?.doctor;
  const discharge = record?.discharge;
  const account = record?.account;
  const billing = record?.billing;

  const patientName = patient?.name || "";
  const gender = patient?.gender || "";

  const dischargeIdValue = discharge?.dischargeId || "-";
  const dischargeDate = discharge?.dischargeDate;
  const dischargeTime = discharge?.dischargeTime;

  const wardRoomBed = [
    admission?.ward?.name,
    admission?.room?.number,
    admission?.bed?.code,
  ]
    .filter(Boolean)
    .join(" / ");

  const dischargeInitiateDate =
    discharge?.dischargeInitiateDate || "-";

  const formatCurrency = (value) =>
    Number(value || 0).toLocaleString("en-IN");

  const handleCompleteDischarge = async () => {
    if (!discharge?.id) {
      setError("Discharge ID is required.");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await ipdService.completeDischarge(discharge.id);

      if (response?.success) {
        toast.success(
          response.message || "Discharge completed successfully."
        );

        await fetchDischargeDetails();
      } else {
        setError(
          response?.message || "Failed to complete discharge."
        );
      }
    } catch (error) {
      setError(
        error?.response?.data?.message ||
          "Failed to complete discharge. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ================= SCREEN MODAL ================= */}
      <div
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-2 sm:p-3 md:p-4"
        onClick={onClose}
      >
        <div
          className="bg-white rounded-xl w-full max-w-4xl max-h-[96vh] sm:max-h-[94vh] md:max-h-[92vh] overflow-y-auto overflow-x-hidden shadow-xl flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="flex items-center justify-between gap-3 px-3 py-3 sm:px-4 sm:py-4 md:px-6 md:py-5 border-b border-[#eee] shrink-0">
            <div className="flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#e5e5e5] flex items-center justify-center shrink-0">
                <FileText size={16} style={{ color: PRIMARY }} />
              </div>

              <h2 className="text-base sm:text-lg font-semibold text-[#343C6A] truncate">
                Discharge Details
              </h2>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 shrink-0 p-1"
            >
              <X size={20} />
            </button>
          </div>

          {/* Loading */}
          {loading && (
            <div className="flex justify-center items-center py-12 sm:py-16 px-4">
              <p className="text-gray-500 text-sm sm:text-base text-center">
                Loading discharge details...
              </p>
            </div>
          )}

          {/* Error */}
          {!loading && error && (
            <div className="text-center py-12 sm:py-16 px-4 text-red-500 text-sm sm:text-base break-words">
              {error}
            </div>
          )}

          {/* Existing Screen Details */}
          {!loading && !error && record && (
            <div className="p-3 sm:p-4 md:p-6 min-w-0">
              {/* Patient + Discharge Information */}
              <div className="flex flex-col md:flex-row md:flex-wrap items-stretch gap-4 sm:gap-5 md:gap-6 mb-5 sm:mb-6">
                {/* Patient */}
                <div className="flex items-center gap-3 min-w-0 w-full md:w-auto md:min-w-[220px] md:flex-1">
                  <div
                    className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center text-lg sm:text-xl font-semibold shrink-0"
                    style={{
                      backgroundColor: "#EDE7F6",
                      color: PRIMARY,
                    }}
                  >
                    {getInitials(patientName)}
                  </div>

                  <div className="flex flex-col gap-1 text-[13px] min-w-0">
                    <span className="text-[14px] sm:text-[15px] font-semibold text-[#1F2937] break-words">
                      {patientName || "—"}{" "}
                      {gender === "Female"
                        ? "♀"
                        : gender === "Male"
                        ? "♂"
                        : ""}
                    </span>

                    <span className="text-[#6B7280] break-words">
                      MRN:{" "}
                      <span
                        className="font-medium"
                        style={{ color: PRIMARY }}
                      >
                        {patient?.patientId || "—"}
                      </span>
                    </span>

                    <span className="text-[#6B7280] break-words">
                      Mobile:{" "}
                      <span className="font-medium text-[#1F2937]">
                        {patient?.mobileNumber || "—"}
                      </span>
                    </span>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-[#eee]" />

                {/* Admission / Discharge */}
                <div className="flex flex-col gap-2 text-[13px] min-w-0 w-full md:w-auto md:min-w-[250px] md:flex-1">
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-8">
                    <div className="min-w-0">
                      <div className="text-[#6B7280] mb-0.5">
                        Admission No:
                      </div>

                      <div className="font-medium text-[#1F2937] break-words">
                        {admission?.admissionNumber || "—"}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <div className="text-[#6B7280] mb-0.5">
                        Discharge ID:
                      </div>

                      <div className="font-medium text-[#1F2937] break-words">
                        {dischargeIdValue}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 mt-1 min-w-0">
                    <Bed
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{ color: PRIMARY }}
                    />

                    <div className="min-w-0">
                      <div className="text-[#6B7280]">
                        Ward / Room / Bed
                      </div>

                      <div className="font-medium text-[#1F2937] break-words">
                        {wardRoomBed || "—"}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5 min-w-0">
                    <User
                      size={14}
                      className="mt-0.5 shrink-0"
                      style={{ color: PRIMARY }}
                    />

                    <div className="min-w-0">
                      <div className="text-[#6B7280]">
                        Doctor
                      </div>

                      <div className="font-medium text-[#1F2937] break-words">
                        {doctor?.name || "—"}

                        {doctor?.type && (
                          <span className="text-[12px] text-[#8BA3CB] font-normal ml-1">
                            ({doctor.type})
                          </span>
                        )}

                        {doctor?.department && (
                          <div className="text-[12px] text-gray-500 break-words">
                            {doctor.department}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="hidden md:block w-px bg-[#eee]" />

                {/* Status */}
                <div className="flex flex-col items-center justify-center gap-1.5 bg-[#F3FAF6] rounded-lg px-4 sm:px-6 py-3 min-w-0 w-full md:w-auto md:min-w-[160px] md:flex-1 lg:flex-none">
                  <span
                    className={`text-[13px] font-medium px-3 py-1 rounded-full whitespace-nowrap ${
                      discharge?.status === "Discharged"
                        ? "bg-[#DCFCE7] text-[#16A34A]"
                        : discharge?.status === "Initiated"
                        ? "bg-[#DBEAFE] text-[#2563EB]"
                        : discharge?.status === "Cancelled"
                        ? "bg-[#FEE2E2] text-[#EF4444]"
                        : "bg-[#FFEDD5] text-[#EA580C]"
                    }`}
                  >
                    {discharge?.status || "—"}
                  </span>

                  <span className="text-[12px] text-[#6B7280]">
                    Initiated On
                  </span>

                  <span className="text-[13px] font-medium text-[#1F2937] break-words text-center">
                    {discharge?.dischargeInitiateDate || "—"}
                  </span>
                </div>
              </div>

              {/* Discharge Details */}
              <div className="border-t border-[#eee] grid grid-cols-1 lg:grid-cols-2 gap-x-4 lg:gap-x-6">
                {[
                  {
                    label: "Discharge Initiate Date",
                    value: dischargeInitiateDate,
                  },
                  {
                    label: "Discharge Type",
                    value: discharge?.dischargeType,
                  },
                  {
                    label: "Discharge Condition",
                    value: discharge?.dischargeCondition,
                  },
                  {
                    label: "Discharge Date",
                    value: dischargeDate,
                  },
                  {
                    label: "Discharge Time",
                    value: dischargeTime,
                  },
                  {
                    label: "Follow-up Date",
                    value: discharge?.followUpDate,
                  },
                  {
                    label: "Follow-up Instructions",
                    value: discharge?.followUpInstructions,
                  },
                  {
                    label: "Discharge Note",
                    value: discharge?.dischargeNote,
                  },
                ].map((row) => (
                  <div
                    key={row.label}
                    className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4 lg:gap-6 py-3 sm:py-3.5 border-b border-[#eee] text-[13px] sm:text-[14px] min-w-0"
                  >
                    <span className="text-[#6B7280] sm:w-44 lg:w-52 shrink-0 font-medium">
                      {row.label}
                    </span>

                    <span className="text-[#1F2937] font-semibold whitespace-pre-wrap break-words min-w-0">
                      {row.value || "—"}
                    </span>
                  </div>
                ))}
              </div>

              {/* Billing */}
              <div className="mt-5 sm:mt-6">
                <h3
                  className="text-base font-semibold mb-3"
                  style={{ color: PRIMARY }}
                >
                  Billing Details
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
                  <div className="border rounded-lg p-3 sm:p-4 min-w-0">
                    <p className="text-xs text-gray-500">
                      Total Amount
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                      ₹{formatCurrency(billing?.totalAmount)}
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 sm:p-4 min-w-0">
                    <p className="text-xs text-gray-500">
                      Net Payable Amount
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-gray-800 break-words">
                      ₹{formatCurrency(billing?.netAmount)}
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 sm:p-4 min-w-0">
                    <p className="text-xs text-gray-500">
                      Discount
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-blue-600 break-words">
                      ₹{formatCurrency(billing?.discount)}
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 sm:p-4 min-w-0">
                    <p className="text-xs text-gray-500">
                      Paid Amount
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-green-600 break-words">
                      ₹{formatCurrency(billing?.paidAmount)}
                    </p>
                  </div>

                  <div className="border rounded-lg p-3 sm:p-4 min-w-0">
                    <p className="text-xs text-gray-500">
                      Remaining Amount
                    </p>
                    <p className="text-base sm:text-lg font-semibold text-red-600 break-words">
                      ₹{formatCurrency(billing?.remainingAmount)}
                    </p>
                  </div>
                </div>

                <div className="mt-3 sm:mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 bg-[#F8F5FB] rounded-lg px-3 sm:px-4 py-3">
                  <span className="font-medium text-gray-600 text-sm">
                    Payment Status
                  </span>

                  <span
                    className={`font-semibold capitalize px-2.5 py-1 rounded-md w-fit ${
                      statusStyles[billing?.paymentStatus] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {billing?.paymentStatus || "pending"}
                  </span>
                </div>
              </div>

              {/* Account Details */}
              {account && (
                <div className="mt-5 sm:mt-6">
                  <h3
                    className="text-base font-semibold mb-3"
                    style={{ color: PRIMARY }}
                  >
                    IPD Account
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Account Number
                      </p>
                      <p className="font-medium break-words">
                        {account.accountNumber || "—"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Account Status
                      </p>
                      <p className="font-medium capitalize break-words">
                        {account.status || "—"}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Opened At
                      </p>
                      <p className="font-medium break-words">
                        {formatDateTime(account?.openedAt)}
                      </p>
                    </div>

                    <div className="min-w-0">
                      <p className="text-xs text-gray-500">
                        Closed At
                      </p>
                      <p className="font-medium break-words">
                        {formatDateTime(account?.closedAt)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Modal Footer */}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 sm:gap-3 px-3 py-3 sm:px-4 sm:py-4 md:px-6 border-t border-[#eee] bg-[#F8F9FC] shrink-0">
            <button
              onClick={onClose}
              className="border border-[#d3cccc] text-[#343C6A] text-[14px] font-medium rounded-md px-4 py-2 hover:bg-white w-full sm:w-auto"
            >
              Close
            </button>

            <button
              type="button"
              onClick={handleCompleteDischarge}
              disabled={
                loading || discharge?.status !== "Initiated"
              }
              className="px-4 py-2 rounded-md bg-green-600 text-white disabled:opacity-50 w-full sm:w-auto"
            >
              {loading
                ? "Completing..."
                : discharge?.status === "Discharged"
                ? "Discharge Completed"
                : "Complete Discharge"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DischargeDetailsModal;