import React, { useCallback, useEffect, useState } from "react";
import { Download, FileText, Eye, Upload } from "lucide-react";
import { toast } from "react-toastify";
import TableComponent from "../../commonComponent/TableComponent";
import { patientService } from "../../services/patientService";
import AddPatientDocumentModal from "../../modal/IPD/addPatientDocuments";
import { getDocumentRows } from "../../utils/getDocuemnts";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

  export const handleViewDocument = (item) => {
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
              html, body { margin:0; padding:0; width:100%; height:100%; background:#f5f5f5; }
              iframe { width:100%; height:100%; border:none; }
              img { max-width:100%; max-height:100%; object-fit:contain; display:block; margin:auto; }
            </style>
          </head>
          <body>
            ${
              item.documentMimeType === "application/pdf"
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

  export const handleDownloadDocument = (item) => {
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

const IPDPatientDocuments = ({
  admissionId,
  patientId,
  patient,
}) => {

  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);

  const [documentType, setDocumentType] = useState("All");
  const [showAddDocumentModal, setShowAddDocumentModal] = useState(false);

  const { currentPage, totalPages, goToPage, setTotalPages } =
      usePagination();

  const fetchDocuments = useCallback(async () => {
    if (!patientId || !admissionId) {
      setDocuments([]);
      return;
    }

    setLoading(true);

    try {
      const data = await patientService.getPatientDocuments(
        patientId,
        admissionId,
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
  }, [patientId, admissionId]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);


  const allDocumentRows = getDocumentRows(patient, documents);
  
  const documentRows =
      documentType === "All"
          ? allDocumentRows
          : allDocumentRows.filter(
              (row) =>
                String(
                  row.uploadedDocument?.documentType || row.documentType || ""
                ).trim().toUpperCase() === documentType.trim().toUpperCase()
          );

  useEffect(() => {
      setTotalPages(
        Math.ceil(documentRows.length / ITEMS_PER_PAGE) || 1
      );
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
            {(item?.uploadedDocument?.documentType === "MLC-DOC" ||
              item.documentType === "MLC-DOC") && (
              <span className="pl-1">
                ({item?.uploadedDocument?.documentType || item.documentType})
              </span>
            )}
          </p>
          {/* {!item.uploaded && item.source === "GENERATED" && (
            <Button
              onClick={() => handleGeneratedDocument(item, patient)}
              className="flex items-center gap-1 text-xs 2xl:text-sm border border-green-500 text-green-500 bg-green-100 rounded-md"
            >
              <Download size={14} />
              Download
            </Button>
          )} */}
        </div>
      ),
    },
    {
      label: "Status",
      headerClassName: "",
      className: "py-3",
      render: (item) => (
        <div>
          {item.required && !item.uploaded && (
            <p className="text-xs text-red-500 mt-1">Document not uploaded</p>
          )}
          {item.uploaded && <p className="text-xs text-green-600 mt-1">Uploaded</p>}
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
                onClick={() => handleViewDocument(item.uploadedDocument)}
                title="View document"
                className="w-8 h-8 rounded-md flex items-center justify-center border border-[#D9D1E8] hover:bg-[#F3E8FF] transition"
              >
                <Eye size={15} color={PRIMARY} />
              </button>
              <button
                type="button"
                onClick={() => handleDownloadDocument(item.uploadedDocument)}
                title="Download document"
                className="w-8 h-8 rounded-md flex items-center justify-center border border-[#D9D1E8] hover:bg-[#F3E8FF] transition"
              >
                <Download size={15} color={PRIMARY} />
              </button>
            </>
          ) : (
            <span>-</span>
          )}
        </div>
      ),
    },
  ];

  const startIndex =
    (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = documentRows.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="min-h-[150px] flex flex-col items-center justify-center text-center p-2 md:px-4 md:py-2">
     
            <div className="flex justify-end ml-auto mb-3">
           
                        <select
                            value={documentType}
                            onChange={(e) => setDocumentType(e.target.value)}
                            className="w-full border border-gray-500 rounded-lg px-3 py-2 text-sm outline-none focus:border-[#521785] disabled:bg-gray-100 disabled:cursor-not-allowed"
                        >
                            <option value="All">All</option>
                            <option value="MEDICAL">Medical</option>
                            <option value="MLC-DOC">MLC Document</option>
                            <option value="BIRTH_CERTIFICATE">BIRTH CERTIFICATE</option>
                            <option value="OTHER">Other</option>
                        </select>
            </div>

            <div className="hidden md:block w-full [&_thead]:!static [&_thead]:!top-auto [&_th]:!static [&_th]:!top-auto [&_thead]:!z-auto">
              <TableComponent columns={columns} data={paginatedData} loading={loading} />
            </div>

            <div className="md:hidden space-y-3 mt-3">
              {loading ? (
                <div className="flex items-center justify-center py-10">
                  <p className="text-sm text-gray-500">Loading documents...</p>
                </div>
              ) : (paginatedData.length === 0 ? 

                <div className="flex flex-col justify-center items-center">

                  <p className="text-[13px] font-medium text-[#343C6A]">No documents</p>
                  <p className="text-[11px] text-[#8BA3CB] mt-1">
                    Patient documents will appear here.
                  </p>
                </div>
                : (
                  paginatedData.map((item, idx) => (
                    <div
                      key={item.uploadedDocument?.id || `${item.documentName}-${idx}`}
                      className="bg-white border border-[#E5E7EB] rounded-xl p-2 shadow-sm"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
                          <FileText size={19} color={PRIMARY} />
                        </div>
                        <div className="min-w-0">
                          <p className="text-[11px] text-[#8BA3CB] mb-1">Document Name</p>
                          <p
                            className="text-[13px] font-semibold text-[#343C6A] break-words line-clamp-2"
                            title={item.documentName || "-"}
                          >
                            {item.documentName || "-"}
                          </p>
                        </div>
                      </div>

                      <div className="border-t border-[#F0F0F0] my-3" />

                      <div className="flex flex-col items-start gap-3">
                        <div>
                          <p className="text-[11px] text-[#8BA3CB] mb-1">Status</p>
                          {item.required && !item.uploaded && (
                            <p className="text-xs text-red-500">Document not uploaded</p>
                          )}
                          {item.uploaded && <p className="text-xs text-green-600">Uploaded</p>}
                        </div>

                        <div>
                          <p className="text-[11px] text-[#8BA3CB] mb-1">Uploaded Date</p>
                          <p className="text-[12px] font-medium text-[#343C6A]">
                            {item?.uploadedDocument?.createdAt
                              ? new Date(item.uploadedDocument.createdAt).toLocaleDateString(
                                  "en-IN",
                                  { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "Asia/Kolkata" }
                                )
                              : "-"}
                          </p>
                        </div>

                        <div className="flex items-center gap-2">
                          {item.uploaded ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleViewDocument(item.uploadedDocument)}
                                className="h-9 px-3 rounded-lg border border-[#D9D1E8] bg-white flex items-center justify-center gap-1.5 text-[#521785] hover:bg-[#F3E8FF] active:bg-[#EDE0FA] transition"
                              >
                                <Eye size={15} />
                                <span className="text-[11px] font-medium">View</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadDocument(item.uploadedDocument)}
                                className="h-9 px-3 rounded-lg bg-[#521785] text-white flex items-center justify-center gap-1.5 hover:opacity-90 active:opacity-80 transition"
                              >
                                <Download size={15} />
                                <span className="text-[11px] font-medium">Download</span>
                              </button>
                            </>
                          ) : (
                            <span className="text-[11px] text-[#8BA3CB]">-</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                ))}
            </div>

            <div className="flex justify-end ml-auto mt-3">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>

      </div>

      <AddPatientDocumentModal
        isOpen={showAddDocumentModal}
        onClose={() => {
          setShowAddDocumentModal(false);
          setSelectedDocument(null);
        }}
        patientId={patientId}
        admissionId={admissionId}
        onSuccess={fetchDocuments}
        selectedDocument={selectedDocument}
      />
    </div>
  );
};

export default IPDPatientDocuments;