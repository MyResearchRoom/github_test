import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom';
import AddPatientDocumentModal from '../../modal/IPD/addPatientDocuments';
import { ArrowLeft, Download, Eye, FileText, Plus, Upload } from 'lucide-react';
import TableComponent from '../../commonComponent/TableComponent';
import { patientService } from '../../services/patientService';
import { toast } from 'react-toastify';
import Button from '../../commonComponent/Button';
import { MLC_DOCUMENTS } from '../../constant/mlcDocument';
import { handleGeneratedDocument, viewBirthCertificate } from '../../utils/dounloadDocumentsFormate';
import { getDocumentRows } from '../../utils/getDocuemnts';
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

export default function Documnets() {
    const location = useLocation();

    const { admission } = location.state || {};
    const [documents, setDocuments] = useState([]);
    const [selectedDocument, setSelectedDocument] = useState(null);
    const [documentType, setDocumentType] = useState("All");
    const [loading, setLoading] = useState(false);

    const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);

    const { currentPage, totalPages, goToPage, setTotalPages } =
          usePagination();

    const fetchDocuments = async () => {
        if (!admission?.patientId || !admission?.id) return;

        setLoading(true);

        try {
            const data = await patientService.getPatientDocuments(
                admission.patientId,
                admission.id,
            );

            setDocuments(data.documents || []);
        } catch (error) {
            console.log(error);

            toast.error(
                error?.response?.data?.message ||
                error?.response?.data?.error ||
                "Failed to get patient documents."
            );

            setDocuments([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [admission?.patientId, admission?.id]);

    const allDocumentRows = getDocumentRows(admission, documents);

    const documentRows =
    documentType === "All"
        ? allDocumentRows
        : allDocumentRows.filter(
            (row) => row.documentType === documentType
        );

    useEffect(() => {
        setTotalPages(Math.ceil(documentRows.length / ITEMS_PER_PAGE) || 1);
    }, [documentRows, setTotalPages]);

    useEffect(() => {
        goToPage(1);
      }, [ goToPage,documentType]);

    const columns = [
        {
            label: "Document name",
            headerClassName: "text-left pl-4",
            className: "pl-4 py-3",
            render: (item) => (
                <div className="flex items-center gap-3">
                    <p className="font-semibold text-[14px] text-[#343C6A]">
                        {item.documentName}
                        {(item?.uploadedDocument?.documentType === "MLC-DOC" || item.documentType === "MLC-DOC")
                            &&
                            <span className='pl-1'>
                                ({item?.uploadedDocument?.documentType || item.documentType})
                            </span>
                        }
                    </p>
                    {!item.uploaded && item.source === "GENERATED" &&
                        <Button
                            onClick={() => handleGeneratedDocument(item, admission)}
                            className="flex items-center gap-1 text-xs 2xl:text-sm border border-green-500 text-green-500 bg-green-100 rounded-md"
                        >
                            <Download size={14} />
                            Download
                        </Button>
                    }

                    {!item.uploaded && item.source === "FILL" &&
                    <div className='flex gap-2 items-center'>
                        <Button
                            onClick={() => navigate("/ipd/birth-certificate", { state: { admission } })}
                            className="text-white flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] shrink-0"
                            style={{ backgroundColor: PRIMARY }}
                        >
                            <Plus size={14} />

                            <span className="hidden sm:inline">
                                Birth Certificate Details
                            </span>
                        </Button>

                        <Button
                            onClick={() => handleGeneratedDocument(item, admission)}
                            className="flex items-center gap-1 text-xs 2xl:text-sm border border-green-500 text-green-500 bg-green-100 rounded-md"
                        >
                            <Download size={14} />
                            Download
                        </Button>
                    </div>
                    }
                </div>

            ),
        },

        {
            label: "Status",
            headerClassName: "text-left pl-4",
            className: "pl-4 py-3",
            render: (item) => (
                <div>
                    {item.required && !item.uploaded && (
                        <p className="text-xs text-red-500 mt-1">
                            Document not uploaded
                        </p>
                    )}

                    {item.uploaded && (
                        <p className="text-xs text-green-600 mt-1">
                            Uploaded
                        </p>
                    )}
                </div>

            ),
        },

        {
            label: "Uploded Date",
            headerClassName: "text-left pl-4",
            className: "py-3 pl-4 text-left",
            render: (item) => (
                <div>
                    <p className="text-[#343C6A]">
                        {item?.uploadedDocument?.createdAt
                            ? new Date(item.uploadedDocument.createdAt).toLocaleDateString("en-IN", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                                timeZone: "Asia/Kolkata",
                            })
                            : "-"}
                    </p>
                </div>
            ),
        },

        {
            label: "Action",
            headerClassName: "text-center",
            className: "py-3 text-center",
            render: (item) => (
                <div className="flex items-center justify-center gap-2">

                    {item.uploaded ? (
                        <>
                            <button
                                type="button"
                                onClick={() =>
                                    handleViewDocument(item.uploadedDocument)
                                }
                                title="View document"
                                className="w-8 h-8 rounded-md flex items-center justify-center border border-blue-500 bg-blue-50 hover:bg-blue-100 transition text-blue-500"
                            >
                                <Eye size={15} />
                            </button>

                            <button
                                type="button"
                                onClick={() =>
                                    handleDownloadDocument(item.uploadedDocument)
                                }
                                title="Download document"
                                className="w-8 h-8 rounded-md flex items-center justify-center border border-[#521785] hover:bg-[#F3E8FF] transition"
                            >
                                <Download size={15} color={PRIMARY} />
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            className="flex flex-row items-center gap-1 border border-gray-400 bg-gray-50 hover:bg-gray-100 p-1 px-2 rounded-md "
                            onClick={() => {
                                setSelectedDocument(item);
                                setShowAddDocumentModal(true);
                            }}
                        >
                            <Upload size={15} />
                            Upload
                        </button>
                    )}

                </div>
            ),
        }
    ];

    const handleViewDocument = (item) => {
        try {
            if (!item?.document) {
                toast.error("Document is not available.");
                return;
            }

            let documentUrl = item.document;


            if (!documentUrl.startsWith("data:")) {
                documentUrl = `data:${item.documentMimeType || "application/octet-stream"};base64,${documentUrl}`;
            }

            const newWindow = window.open();

            if (!newWindow) {
                toast.error("Please allow pop-ups to view the document.");
                return;
            }

            newWindow.document.write(`
              <html>
                  <head>
                  <title>${item.documentName || "Document"}</title>
                  <style>
                      html, body {
                      margin: 0;
                      padding: 0;
                      width: 100%;
                      height: 100%;
                      background: #f5f5f5;
                      }
  
                      iframe {
                      width: 100%;
                      height: 100%;
                      border: none;
                      }
  
                      img {
                      max-width: 100%;
                      max-height: 100%;
                      object-fit: contain;
                      display: block;
                      margin: auto;
                      }
                  </style>
                  </head>
                  <body>
                  ${item.documentMimeType === "application/pdf"
                    ? `<iframe src="${documentUrl}"></iframe>`
                    : `<img src="${documentUrl}" alt="${item.documentName || "Document"}" />`
                }
                  </body>
              </html>
              `);

            newWindow.document.close();
        } catch (error) {
            console.error("View document error:", error);
            toast.error("Failed to view document.");
        }
    };

    const handleDownloadDocument = (item) => {
        try {
            if (!item?.document) {
                toast.error("Document is not available.");
                return;
            }

            let documentUrl = item.document;


            if (!documentUrl.startsWith("data:")) {
                documentUrl = `data:${item.documentMimeType || "application/octet-stream"};base64,${documentUrl}`;
            }

            const link = document.createElement("a");

            link.href = documentUrl;
            link.download = item.documentName || "patient-document";

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Document downloaded successfully.");
        } catch (error) {
            console.error("Download document error:", error);
            toast.error("Failed to download document.");
        }
    };

    const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

    const paginatedData = documentRows.slice(
        startIndex,
        startIndex + ITEMS_PER_PAGE
    );

    const navigate = useNavigate();

    return (
        <div className="flex flex-col gap-4">

            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">

                <div className='flex flex-col gap-1'>
                    <button
                        onClick={() => navigate("/ipd/admissions")}
                        className="flex items-center gap-1 text-[12px] sm:text-[13px] font-medium"
                        style={{ color: PRIMARY }}
                    >
                        <ArrowLeft size={15} />
                        Back to Admissions
                    </button>
                    <div className="flex items-center gap-2 min-w-0">
                        <FileText
                            size={18}
                            color={PRIMARY}
                            className="shrink-0"
                        />

                        <div className="min-w-0">
                            <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
                                Patient name: {admission.name} ({admission.mrn})
                            </h2>
                        </div>
                    </div>
                </div>


                <div className="flex items-center gap-2">
                    <div className="">
           
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#521785] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="All">All</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="MLC-DOC">MLC Document</option>
                            <option value="BIRTH_CERTIFICATE">BIRTH CERTIFICATE</option>
                            <option value="OTHER">Other</option>
                        </select>
                    </div>

                    <Button
                        onClick={() => setShowAddDocumentModal(true)}
                        className="text-white flex items-center justify-center gap-2 px-3 sm:px-4 py-2 text-[11px] sm:text-[12px] shrink-0"
                        style={{ backgroundColor: PRIMARY }}
                    >
                        <Upload size={14} />

                        <span className="hidden sm:inline">
                            Add Document
                        </span>

                        <span className="sm:hidden">
                            Add
                        </span>
                    </Button>
                </div>

            </div>

            <div className="flex bg-white rounded-lg border border-[#e5e5e5] flex-col overflow-x-auto">

                <>
                    <div className="hidden md:block w-full">
                        <TableComponent
                            columns={columns}
                            data={paginatedData}
                            loading={loading}
                        />
                    </div>

                    <div className="md:hidden space-y-3">
                        {loading ? (
                            <div className="flex items-center justify-center py-10">
                                <p className="text-sm text-gray-500">Loading documents...</p>
                            </div>
                        ) : (paginatedData.length === 0 ? 

                            <div className="flex flex-col justify-center items-center pt-3">

                                <p className="text-[13px] font-medium text-[#343C6A]">No documents</p>
                                <p className="text-[11px] text-[#8BA3CB] mt-1">
                                    Patient documents will appear here.
                                </p>
                            </div>
                            : (
                                paginatedData.map((item) => (
                                <div
                                    key={item.id}
                                    className="
                                    bg-white
                                    border border-[#E5E7EB]
                                    rounded-xl
                                    p-2
                                    shadow-sm
                                    "
                                >

                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex items-start gap-3 min-w-0">
                                            {/* Icon */}
                                            <div
                                                className="
                                  w-10 h-10
                                  rounded-lg
                                  bg-[#F3E8FF]
                                  flex items-center justify-center
                                  shrink-0
                              "
                                            >
                                                <FileText
                                                    size={19}
                                                    color={PRIMARY}
                                                />
                                            </div>

                                            {/* Name */}
                                            <div className="min-w-0">
                                                <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                    Document Name
                                                </p>

                                                <p
                                                    className="
                                  text-[13px]
                                  font-semibold
                                  text-[#343C6A]
                                  break-words
                                  line-clamp-2
                                  "
                                                    title={item.documentName || "-"}
                                                >
                                                    {item.documentName || "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Divider */}
                                    <div className="border-t border-[#F0F0F0] my-3" />

                                    <div className="flex flex-col items-start justify-between gap-3">
                                        <div>
                                            <p className="text-[11px] text-[#8BA3CB] mb-1">
                                                Uploaded Date
                                            </p>

                                            <p className="text-[12px] font-medium text-[#343C6A]">
                                                {item.createdAt
                                                    ? new Date(item.createdAt).toLocaleDateString(
                                                        "en-IN",
                                                        {
                                                            day: "2-digit",
                                                            month: "2-digit",
                                                            year: "numeric",
                                                            timeZone: "Asia/Kolkata",
                                                        }
                                                    )
                                                    : "-"}
                                            </p>
                                        </div>


                                        <div className="flex items-center gap-2">
                                            {/* View */}
                                            <button
                                                type="button"
                                                onClick={() => handleViewDocument(item)}
                                                title="View document"
                                                className="
                                  h-9
                                  px-3
                                  rounded-lg
                                  border border-[#D9D1E8]
                                  bg-white
                                  flex items-center justify-center gap-1.5
                                  text-[#521785]
                                  hover:bg-[#F3E8FF]
                                  active:bg-[#EDE0FA]
                                  transition
                              "
                                            >
                                                <Eye size={15} />
                                                <span className="text-[11px] font-medium">
                                                    View
                                                </span>
                                            </button>

                                            {/* Download */}
                                            <button
                                                type="button"
                                                onClick={() => handleDownloadDocument(item)}
                                                title="Download document"
                                                className="
                                  h-9
                                  px-3
                                  rounded-lg
                                  bg-[#521785]
                                  text-white
                                  flex items-center justify-center gap-1.5
                                  hover:opacity-90
                                  active:opacity-80
                                  transition
                              "
                                            >
                                                <Download size={15} />
                                                <span className="text-[11px] font-medium">
                                                    Download
                                                </span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ))}
                    </div>

                    <div className="flex justify-end ml-auto my-3">
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            goToPage={goToPage}
                        />
                    </div>

                </>


            </div>


            <AddPatientDocumentModal
                isOpen={showAddDocumentModal}
                onClose={() => {
                    setShowAddDocumentModal(false);
                    setSelectedDocument(null);
                }}
                patientId={admission.patientId}
                admissionId={admission.id}
                onSuccess={fetchDocuments}
                selectedDocument={selectedDocument}
            />

        </div>
    );
}
