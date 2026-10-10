import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { usePagination } from "../../../hooks/usePagination";
import { icuService } from "../../../services/icuService";
import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import { inputClass } from "../../../pages/ICU/ICUInvestigation";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DetailBlock = ({ label, value, isDate = false }) => (
  <div>
    <p className="text-[10px] sm:text-[11px] font-bold text-black uppercase tracking-wider mb-1.5">
      {label}
    </p>

    <p className="text-xs sm:text-sm text-zinc-700 leading-5 whitespace-pre-line break-words">
      {isDate ? formatDate(value) : value || "-"}
    </p>
  </div>
);

const MedicationCard = ({ medication, index }) => {
  const isAlternate = index % 2 === 1;

  return (
    <div
      className={`border rounded-xl overflow-hidden transition ${isAlternate
          ? "bg-[#F8F3FC] border-[#E5D7F0]"
          : "bg-white border-zinc-200"
        }`}
    >
      <div className="p-4 sm:p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
          <DetailBlock
            label="Medicine"
            value={medication?.medicineName}
          />

          <DetailBlock
            label="Dose"
            value={medication?.dose}
          />

          <DetailBlock
            label="Route"
            value={medication?.route}
          />

          <DetailBlock
            label="Frequency"
            value={medication?.frequency}
          />

          <DetailBlock
            label="Start Date"
            value={medication?.startDate}
            isDate
          />

          <DetailBlock
            label="End Date"
            value={medication?.endDate}
            isDate
          />

          <DetailBlock
            label="Added By"
            value={medication?.recordedByDetails?.name}
          />

          <div className="">
            <DetailBlock
              label="Instructions"
              value={medication?.instructions}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ICUMedicationDetails = () => {
  const navigate = useNavigate();
  const { patientId: paramPatientId } = useParams();
  const { state } = useLocation();

  const patientId = state?.patientId || paramPatientId;
  const icuAdmissionId = state?.icuAdmissionId;

  const patientName = state?.patientName || "Patient";
  const patientUniqueId = state?.patientUniqueId || "";

  const [medications, setMedications] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination(1);

  const [selectedDate, setSelectedDate] = useState();

  const fetchMedications = async () => {
    if (!patientId || !icuAdmissionId) {
      setError("Patient or ICU admission information is missing.");
      setMedications([]);
      return;
    }

    try {
      setIsLoading(true);
      setError("");

      const response = await icuService.getMedications(
        patientId,
        icuAdmissionId,
        selectedDate,
      );

      if (response?.success) {
        setMedications(response?.data || []);
      } else {
        setMedications([]);
        setError(
          response?.message || "Failed to fetch medication records."
        );
      }
    } catch (err) {
      console.error("Error fetching patient medications:", err);

      setMedications([]);

      setError(
        err?.response?.data?.message ||
        err?.message ||
        "Failed to fetch medication records."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMedications();
  }, [patientId, icuAdmissionId, selectedDate]);

  useEffect(() => {
    const pages = Math.max(
      1,
      Math.ceil(medications.length / ITEMS_PER_PAGE)
    );

    setTotalPages(pages);

    if (currentPage > pages) {
      goToPage(1);
    }
  }, [
    medications.length,
    currentPage,
    goToPage,
    setTotalPages,
  ]);

  useEffect(() => {
    goToPage(1);
  }, [patientId, icuAdmissionId, goToPage, selectedDate]);

  const paginatedMedications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;

    return medications.slice(
      start,
      start + ITEMS_PER_PAGE
    );
  }, [medications, currentPage]);

  const columns = [
    {
      label: "Medicine",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 font-medium whitespace-nowrap">
          {item?.medicineName || "-"}
        </p>
      ),
    },
    {
      label: "Dose",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <span className="text-zinc-600 whitespace-nowrap">
          {item?.dose || "-"}
        </span>
      ),
    },
    {
      label: "Route",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <span className="text-zinc-600 whitespace-nowrap">
          {item?.route || "-"}
        </span>
      ),
    },
    {
      label: "Frequency",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <span className="text-zinc-600 whitespace-nowrap">
          {item?.frequency || "-"}
        </span>
      ),
    },
    {
      label: "Start Date",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <span className="font-medium text-zinc-700 whitespace-nowrap">
          {formatDate(item?.startDate)}
        </span>
      ),
    },
    {
      label: "End Date",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <span className="font-medium text-zinc-700 whitespace-nowrap">
          {formatDate(item?.endDate)}
        </span>
      ),
    },

    {
      label: "Added By",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 font-medium whitespace-nowrap">
          {item?.recordedByDetails?.name || "-"}
        </p>
      ),
    },
    {
      label: "Instructions",
      headerClassName:
        "text-left pl-4 whitespace-nowrap min-w-[250px]",
      className: "pl-4 py-3 max-w-[350px]",
      render: (item) => (
        <p className="text-zinc-600 whitespace-normal break-words min-w-[200px]">
          {item?.instructions || "-"}
        </p>
      ),
    },
  ];

  if (!patientId || !icuAdmissionId) {
    return (
      <div className="w-full mx-auto p-3 sm:p-4 md:p-6 max-w-[1100px] flex flex-col gap-4">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-sm font-medium w-fit"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={16} />
          Back to Medication
        </button>

        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500">
          Patient or ICU admission information is missing. Please go
          back and open the medication again from the list.
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-3 justify-between">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition shrink-0"
          >
            <ArrowLeft size={18} />
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight truncate capitalize">
                {patientName}
              </h1>

              {patientUniqueId && (
                <span className="text-xs sm:text-sm font-medium text-zinc-500 bg-zinc-100 px-2.5 py-1 rounded-full whitespace-nowrap">
                  {patientUniqueId}
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-zinc-400 mt-0">
              {medications.length}{" "}
              {medications.length === 1
                ? "medication"
                : "medications"}{" "}
              recorded
            </p>
          </div>
        </div>


        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className={`${inputClass} w-full sm:w-auto`}
        />
      </div>
      {isLoading && (
        <div className="bg-white rounded-xl border border-zinc-200 py-10 text-center">
          <p className="text-sm text-zinc-400">
            Loading medications...
          </p>
        </div>
      )}

      {/* Error */}
      {!isLoading && error && (
        <div className="bg-white rounded-xl border border-red-200 p-6 text-center">
          <p className="text-sm text-red-500">
            {error}
          </p>
        </div>
      )}

      {/* Mobile + Tablet Cards */}
      {!isLoading && !error && medications.length > 0 && (
        <div className="grid grid-cols-1 gap-4 lg:hidden">
          {paginatedMedications.map((medication, index) => (
            <MedicationCard
              key={medication?.id || index}
              medication={medication}
              index={
                (currentPage - 1) * ITEMS_PER_PAGE + index
              }
            />
          ))}
        </div>
      )}

      {/* Desktop Table */}
      {!isLoading && !error && medications.length > 0 && (
        <div className="hidden lg:block overflow-x-auto border rounded-md">
          <TableComponent
            columns={columns}
            data={paginatedMedications}
            loading={isLoading}
          />
        </div>
      )}

      {/* Empty */}
      {!isLoading && !error && medications.length === 0 && (
        <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500">
          No medications recorded for this patient yet.
        </div>
      )}

      {/* Pagination */}
      {!isLoading && !error && totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}
    </div>
  );
};

export default ICUMedicationDetails;