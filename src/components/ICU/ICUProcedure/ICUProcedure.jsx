import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Scissors,
  Calendar,
  Clock,
  FileText,
  Activity,
  AlertCircle,
  Plus,
  Eye,
  User,
} from "lucide-react";
import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import { useNavigate } from "react-router-dom";
import ICUProcedureModal from "../../../modal/ICU/ICUProcedureModal";
import { icuService } from "../../../services/icuService";
import { toast } from "react-toastify";
import { formatInvestigationDate } from "../ICUInvestigation/ICUInvestigation";
import { formatTime } from "../../../utils/formateTime";

const ITEMS_PER_PAGE = 5;
const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const PRIMARY = "#521785";

const Section = ({ title, icon: Icon, children, action }) => (
  <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
    <div className="px-2 sm:px-5 py-3 border-b border-[#f0f0f0] flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
      <div className="flex items-center gap-2 min-w-0">
        <Icon size={17} className="text-[#521785] shrink-0" />

        <h2 className="text-sm sm:text-base font-semibold text-[#343C6A] truncate">
          {title}
        </h2>
      </div>

      {action && <div className="shrink-0">{action}</div>}
    </div>

    <div className="p-4 sm:p-5">{children}</div>
  </div>
);

export function hasComplications(procedure) {
    return procedure?.complications === true ||
    procedure?.complications === 1 ||
    procedure?.complications === "1" ||
    procedure?.complications === "Yes";
  }

const ICUProcedure = ({ patientId, icuAdmissionId }) => {
  const [procedures, setProcedures] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [loading, setLoading] = useState(Boolean(patientId && icuAdmissionId));

  const loadInvestigations = useCallback(async () => {
    if (!patientId || !icuAdmissionId) {
      setProcedures([]);
      setLoading(false);
      return;
    }

    setLoading(true);

    try {
      const response = await icuService.getProcedure(
        selectedDate,
        icuAdmissionId,
        patientId,

      );
      setProcedures(
        Array.isArray(response?.data)
          ? response.data
          : Array.isArray(response)
            ? response
            : []
      );
    } catch (err) {
      console.error("Failed to load ICU investigations:", err);
      setProcedures([]);
      toast.error("Failed to load ICU investigations")
    } finally {
      setLoading(false);
    }
  }, [patientId, icuAdmissionId, selectedDate]);

  useEffect(() => {
    loadInvestigations();
  }, [patientId, icuAdmissionId, selectedDate]);

  const totalPages = Math.ceil(
    procedures.length / ITEMS_PER_PAGE
  );

  const paginatedProcedures = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return procedures.slice(
      startIndex,
      startIndex + ITEMS_PER_PAGE
    );
  }, [procedures, currentPage]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSaveProcedure = async () => {
    setCurrentPage(1);
    await loadInvestigations();
  };

  const tableColumns = [
    
    {
      key: "procedureDate",
      label: "Date",
      headerClassName: "text-left min-w-[150px] whitespace-nowrap",
      render: (row) => (
        <div className="flex flex-col gap-1.5 whitespace-nowrap py-2">
          <span>{formatInvestigationDate(row.procedureDate) || "—"}</span>
          <span>{formatTime(row.procedureTime) || "—"}</span>
        </div>
      ),
    },
    {
      key: "procedureName",
      label: "Procedure",
      headerClassName: "text-left min-w-[250px] whitespace-nowrap",
      render: (row) => (
        <p className="font-semibold text-[#343C6A] whitespace-nowrap">
          {row.procedureName || "—"}
        </p>
      ),
    },

    {
      label: "Indication",
      headerClassName: "text-left pl-4 min-w-[250px] whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-sm text-[#343C6A] max-w-[350px] leading-5">{item.indication || "-"}</p>
      ),
    },
    {
      label: "Complications",
      headerClassName: "text-left min-w-[150px] whitespace-nowrap",
      className: "py-3",
      render: (item) => (
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium ${
            hasComplications(item)
              ? "bg-red-50 text-red-700"
              : "bg-green-50 text-green-700"
          }`}
        >
          {hasComplications(item) ? "Yes" : "No"}
        </span>
      ),
    },

    {
      label: "Added by",
      headerClassName: "text-left whitespace-nowrap",
      render: (row) => (
        <p className="font-semibold text-[#343C6A] whitespace-nowrap">
          {row.recordedByDetails?.name || "—"}
        </p>
      ),
    },

    {
      label: "Action",
      headerClassName: "text-center min-w-[90px] whitespace-nowrap",
      className: "text-center py-3",
      render: (item) => (
        <button
          type="button"
          onClick={() => handleViewProcedure(item)}
          className="inline-flex items-center justify-center w-8 h-8 rounded-md text-[#521785] hover:bg-purple-50 transition"
          title="View Procedure"
        >
          <Eye size={17} />
        </button>
      ),
    },

  ];

  const handleViewProcedure = (procedure) => {
    navigate(`/icu-procedure/${procedure.id}`);
  };

  return (
    <>
      <Section
        title={`Procedures (${procedures.length})`}
        icon={Scissors}
        action={
          <div className="flex flex-row items-center gap-2 w-full">
            <input
              type="date"
              value={selectedDate}
              onChange={(event) => setSelectedDate(event.target.value)}
              className={`${inputClass} w-auto`}
            />

            <button
              type="button"
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-md text-xs sm:text-sm font-medium text-white transition hover:opacity-90"
              style={{ backgroundColor: "#521785" }}
            >
              <Plus size={15} />
              Add <span className="hidden lg:block">Procedure</span>
            </button>
          </div>
        }
      >
        {/* Desktop / Tablet */}
        <div className="hidden lg:block overflow-x-auto">
          <TableComponent
            columns={tableColumns}
            data={paginatedProcedures}
            loading={loading}
          />
        </div>

        {/* Mobile */}
        <div className="lg:hidden flex flex-col gap-4">
          {loading ? (
            <p className="py-8 text-center text-sm text-gray-500">
              Loading investigations...
            </p>
          ) : paginatedProcedures.map((procedure, index) => (
            <div
              key={procedure.id}
              className="border border-[#e5e5e5] rounded-lg bg-[#F8F9FC] overflow-hidden"
            >
              <div className="p-4 bg-white border-b border-[#e5e5e5]">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
                    <Scissors
                      size={18}
                      className="text-[#521785]"
                    />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-[#343C6A] break-words">
                      {procedure.procedureName || "—"}
                    </p>

                    <p className="text-[11px] text-[#8BA3CB] mt-1">
                      Procedure{" "}
                      {((currentPage - 1) * ITEMS_PER_PAGE) +
                        index +
                        1}{" "}
                      · ID: {procedure.id}
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-4 flex flex-col gap-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex items-start gap-2">
                    <Calendar
                      size={15}
                      className="text-[#7C3AED] mt-0.5 shrink-0"
                    />

                    <div>
                      <p className="text-[11px] text-[#8BA3CB]">
                        Procedure Date
                      </p>

                      <p className="text-[13px] font-medium text-[#343C6A] mt-0.5">
                        {procedure.procedureDate || "—"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <Clock
                      size={15}
                      className="text-[#7C3AED] mt-0.5 shrink-0"
                    />

                    <div>
                      <p className="text-[11px] text-[#8BA3CB]">
                        Procedure Time
                      </p>

                      <p className="text-[13px] font-medium text-[#343C6A] mt-0.5">
                        {formatTime(procedure.procedureTime) || "—"}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText
                      size={14}
                      className="text-[#521785]"
                    />

                    <p className="text-[11px] text-[#8BA3CB]">
                      Pre-Procedure Notes
                    </p>
                  </div>

                  <p className="text-[13px] font-medium text-[#343C6A] leading-5 break-words">
                    {procedure.preProcedureNotes || "—"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity
                      size={14}
                      className="text-[#521785]"
                    />

                    <p className="text-[11px] text-[#8BA3CB]">
                      Indication
                    </p>
                  </div>

                  <p className="text-[13px] font-medium text-[#343C6A] leading-5 break-words">
                    {procedure.indication || "—"}
                  </p>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <FileText
                      size={14}
                      className="text-[#521785]"
                    />

                    <p className="text-[11px] text-[#8BA3CB]">
                      Procedure Details
                    </p>
                  </div>

                  <p className="text-[13px] font-medium text-[#343C6A] leading-5 break-words">
                    {procedure.details || "—"}
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex items-center gap-1.5 mb-1">
                      <AlertCircle
                        size={14}
                        className="text-[#521785]"
                      />

                      <p className="text-[11px] text-[#8BA3CB]">
                        Complications
                      </p>
                    </div>

                    <span
                      className={`inline-flex items-center gap-1 text-[12px] font-medium px-2.5 py-1 rounded-full ${hasComplications(procedure)
                        ? "bg-[#FEE2E2] text-[#DC2626]"
                        : "bg-[#DCFCE7] text-[#16A34A]"
                        }`}
                    >
                      {hasComplications(procedure) ? "Yes" : "No"}
                    </span>
                  </div>

                  <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <User
                      size={14}
                      className="text-[#521785]"
                    />

                    <p className="text-[11px] text-[#8BA3CB]">
                      Added by
                    </p>
                  </div>

                  <p className="text-[13px] font-medium text-[#343C6A] leading-5 break-words">
                    {procedure.recordedByDetails?.name || "—"}
                  </p>
                </div>
                </div>

                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <Activity
                      size={14}
                      className="text-[#521785]"
                    />

                    <p className="text-[11px] text-[#8BA3CB]">
                      Post-Procedure Condition
                    </p>
                  </div>

                  <p className="text-[13px] font-medium text-[#343C6A] leading-5 break-words">
                    {procedure.postProcedureCondition || "—"}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {totalPages > 0 && (
          <div className="mt-5 flex justify-end">
            <Pagination
              currentPage={currentPage}
              setCurrentPage={setCurrentPage}
              totalPages={totalPages}
              goToPage={handlePageChange}
            />
          </div>
        )}
      </Section>

      {/* Add Procedure Modal */}
      <ICUProcedureModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSaveProcedure}   
        patientId={patientId}
        icuAdmissionId={icuAdmissionId}
      />
    </>
  );
};

export default ICUProcedure;