import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ipdService } from "../../services/ipdService";
import { patientService } from "../../services/patientService";
import { ArrowLeft, BadgeInfo, CalendarDays, Download, Eye, Loader2, MapPin, Phone, UserRound } from "lucide-react";
import { toast } from "react-toastify";
import DualInvoicePDF from "../../pdf/dualInvoicePdf";
import { pdf } from "@react-pdf/renderer";
import TableComponent from "../../commonComponent/TableComponent";
import { usePagination } from "../../hooks/usePagination";
import Pagination from "../../commonComponent/Pagination";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

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

const InfoBlock = ({ icon: Icon, label, value, subValue }) => (

  <div className="flex items-start gap-2.5 sm:gap-3 min-w-0">
    <div className="w-9 h-9 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
      <Icon size={16} color={PRIMARY} />
    </div>

    <div className="min-w-0">
    <p className="text-[11px] sm:text-[12px] text-[#8BA3CB]">
        {label}
    </p>

    <p className="text-[13px] sm:text-[14px] font-semibold text-[#343C6A] break-words">
        {value}
    </p>

    {subValue && (
        <p className="text-[11px] sm:text-[12px] text-[#8BA3CB] break-words">
        {subValue}
        </p>
    )}
    </div>


  </div>
);

export default function PaymentView() {
  const { admissionId } = useParams();

  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [patientId, setPatientId] = useState(null);
  const [patient, setPatient] = useState({});

  const navigate=useNavigate();

  const { currentPage, totalPages, goToPage, setTotalPages } =
      usePagination();
  
    useEffect(() => {
      setTotalPages(Math.ceil(payments.length / ITEMS_PER_PAGE) || 1);
    }, [payments, setTotalPages]);

  useEffect(() => {
    const getPayments = async () => {
      if (!admissionId) return;

      try {
        setLoading(true);
        setError("");

        const res = await ipdService.getAccountPaymentsByAdmissionId(
          admissionId
        );

        console.log("Payments response:", res);

        const paymentList = res?.payments || [];

        setPayments(paymentList);
        setPatientId(paymentList?.[0]?.account?.patientId || null);
      } catch (err) {
        console.error("Failed to fetch payments:", err);
        setError("Failed to load payments");
        setPayments([]);
        setPatientId(null);
      } finally {
        setLoading(false);
      }
    };

    getPayments();
  }, [admissionId]);

  useEffect(() => {
    const getPatient = async () => {
      if (!patientId) {
        setPatient({});
        return;
      }

      try {
        const res = await patientService.getPatientsById(patientId);

        console.log("Patient response:", res);

        setPatient(res?.patient || {});
      } catch (err) {
        console.error("Failed to load patient:", err);
        setPatient({});
      }
    };

    getPatient();
  }, [patientId]);

  const columns = [
    {
      label: "Payment No.",
      field: "paymentNumber",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className:
        "pl-2 py-4 align-top font-semibold text-[#343C6A] whitespace-nowrap text-sm",
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
        <span className="font-semibold text-[#343C6A] capitalize min-w-0 max-w-lg  text-wrap whitespace-nowrap text-sm">
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

//   const handleEditClick = (item) => {
//       setIsEditMode(true);
//       setEditingPaymentId(item.id);
  
//       setSelectedInvoice(item.account);
  
//       setAccountId(item.accountId);
//       setPaymentAmount(item.amount);
//       setPaymentDate(item.paymentDate?.split("T")[0]);
//       setPaymentMode(item.paymentMode);
//       setPaymentNotes(item.remarks || "");
  
//       setPaymentError("");
//       setIsPaymentModalOpen(true);
//     };
  
    const handleDownloadClick = async (item) => {
      try {
        const accountId = item.accountId;
        const patientId = item.account?.patientId;
        const paymentId = item.id;
  
  
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


    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const paginatedData = payments.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE,
    );

  return (
    <div className="min-h-full w-full bg-transparent p-2 lg:p-1 flex flex-col gap-3 overflow-y-auto">
        {/* paymentView */}
        <div>
          <button
            onClick={() => navigate("/ipd/payments")}
            className="flex items-center gap-1 text-[12px] sm:text-[13px] font-medium mb-2"
            style={{ color: PRIMARY }}
          > 
            <ArrowLeft size={15} />
            Back 
          </button>

        </div>

        <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-5 md:gap-6">
            <InfoBlock
                icon={UserRound}
                label="Name"
                value={patient.name}
            />

            <InfoBlock
                icon={Phone}
                label="Phone"
                value={patient.mobileNumber}
            />

            <InfoBlock
                icon={BadgeInfo}
                label="Patient ID"
                value={patient.patientId}
            />

            <InfoBlock
                icon={MapPin}
                label="Address"
                value={patient.address}
            />

            <InfoBlock
                icon={CalendarDays}
                label="Age | Date of Birth"
                value={`${patient.age} Y | ${patient.dateOfBirth}`}
            />
        </div>

        {error && (
          <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-4 py-2.5">
            {error}
          </div>
        )}

        {loading ? (
        <div className="flex items-center justify-center text-[#8BA3CB] gap-2 py-8 sm:py-10 text-sm text-center">
            <Loader2
            size={16}
            className="animate-spin shrink-0"
            />
            Loading Payments...
        </div>
        ) :(
        <>
        <div className="hidden lg:flex bg-white rounded-lg border border-[#e5e5e5] flex-col overflow-hidden min-w-0">
            <div className="overflow-x-auto w-full">
                <TableComponent
                    columns={columns}
                    data={paginatedData}
                    loading={loading}
                    headerBg="bg-[#F8F9FC]"
                    actions={(item) => (
                    <div className="flex gap-2 justify-center items-center pr-2">
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
        </div>

        <div className="lg:hidden bg-white rounded-lg border border-[#e5e5e5] overflow-hidden w-full min-w-0">

                  <div className="p-3 sm:p-4 space-y-3 w-full min-w-0">
                    {paginatedData.map((item, index) => {
                          
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
                            {/* <div className="flex items-center gap-3 mb-4 min-w-0">
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
                            </div> */}
  
        
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
                            <div className="grid grid-cols-1">
        
                              <button
                                onClick={() => handleDownloadClick(item)}
                                title="Download invoice"
                                className="p-2 rounded-md border border-[#343C6A] text-[#343C6A] hover:bg-gray-50 flex items-center justify-center gap-3"
                              >
                                <Download size={15} /> Download
                              </button>
                            </div>
        
                          </div>
                        </div>
                      );
                    })}
                  </div>
        
              </div>
        </>
        )}


        {payments.length > 0 && (
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
            />
        )}
    </div>
  );
}