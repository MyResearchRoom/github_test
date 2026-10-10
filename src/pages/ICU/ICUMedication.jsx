import React, { useEffect, useState } from "react";
import { Plus, Search, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { usePagination } from "../../hooks/usePagination";
import { icuService } from "../../services/icuService";
import { getCurrentDate } from "../../utils/getCurrentDate";
import TableComponent from "../../commonComponent/TableComponent";
import Pagination from "../../commonComponent/Pagination";
import ICUMedicationModal from "../../modal/ICU/ICUMedicationModal";

const ITEMS_PER_PAGE = 10;

const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-[#521785] focus:ring-1 focus:ring-[#521785] transition text-sm text-zinc-800 placeholder-zinc-300";

const formatDate = (value) => {
  if (!value) return "-";

  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ICUMedication = () => {
  const [medications, setMedications] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");

  const navigate = useNavigate();

  const { currentPage, totalPages, goToPage, setTotalPages } =
    usePagination(1);

  const fetchLatestMedications = async (search = "", selectedDate) => {
    try {
      setIsLoading(true);

      const response = await icuService.getLatestMedications({
        searchTerm: search,
        startDate: selectedDate
      });

      if (response?.success) {
        setMedications(response?.data || []);
      } else {
        setMedications([]);
      }
    } catch (error) {
      console.error("Error fetching latest ICU medications:", error);
      setMedications([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLatestMedications(searchTerm, selectedDate);
  }, [searchTerm, selectedDate]);

  useEffect(() => {
    const pages = Math.max(
      1,
      Math.ceil(medications.length / ITEMS_PER_PAGE)
    );

    setTotalPages(pages);

    if (currentPage > pages) {
      goToPage(1);
    }
  }, [medications.length, currentPage, goToPage, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [searchTerm, goToPage]);

  const paginatedMedications = medications.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleView = (medication) => {
    const patientId = medication?.patient?.id || medication?.patientId;
    const icuAdmissionId =
      medication?.icuAdmissionId || medication?.icuAdmission?.id;

    if (!patientId || !icuAdmissionId) {
      console.error("Patient ID or ICU Admission ID is missing:", medication);
      return;
    }

    navigate(`/icu-medication/${patientId}`, {
      state: {
        patientId,
        icuAdmissionId,
        patientName: medication?.patient?.name || "",
        patientUniqueId: medication?.patient?.patientId || "",
      },
    });
  };

  const handleMedicationSuccess = async () => {
    setIsModalOpen(false);
    await fetchLatestMedications(searchTerm);
    goToPage(1);
  };

  const MedicationAction = ({ medication }) => (
    <div className="flex items-center justify-center gap-2">
      <button
        type="button"
        onClick={() => handleView(medication)}
        title="View medication"
        className="w-8 h-8 rounded-md flex items-center justify-center border border-zinc-200 hover:bg-[#F3E8FF] transition shrink-0"
      >
        <Eye size={14} className="text-[#521785]" />
      </button>
    </div>
  );

  const columns = [
    {
      label: "Patient",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <div>
          <p className="text-zinc-700 whitespace-nowrap">
            {item?.patient?.name || "-"}
          </p>
          <p className="text-[11px] text-zinc-400 whitespace-nowrap">
            {item?.patient?.patientId || "-"}
          </p>
        </div>
      ),
    },
    {
      label: "Medicine",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-nowrap">
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
  ];

  return (
    <div className="w-full mx-auto p-1 py-0 flex flex-col gap-5 max-w-[1440px] 2xl:max-w-[1920px]">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-zinc-800">
            Medication
          </h1>

          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manage medications for ICU patients
          </p>
        </div>

        <div className="flex flex-col gap-3 md:flex-row">
          <button
            type="button"
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 bg-[#521785] hover:bg-[#43116d] text-white px-4 h-9 rounded-lg text-xs sm:text-sm font-semibold transition shadow-sm w-full sm:w-auto"
          >
            <Plus size={16} />
            <span>New Medication</span>
          </button>
        </div>
      </div>

      <div className="flex flex-row items-center gap-2 ml-auto justify-end">
        <input
          type="date"
          value={selectedDate}
          onChange={(event) => setSelectedDate(event.target.value)}
          className={`${inputClass} w-full sm:w-auto`}
        />
        <div className="relative w-full sm:max-w-sm">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
          />

          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search patient..."
            className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 bg-white text-xs sm:text-sm outline-none focus:border-[#521785] focus:ring-1 focus:ring-[#521785]"
          />
        </div>
      </div>

      {/* Mobile + Tablet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 lg:hidden">
        {isLoading ? (
          <div className="md:col-span-2 bg-white border border-zinc-200 rounded-xl py-10 text-center">
            <p className="text-sm text-zinc-400">
              Loading medications...
            </p>
          </div>
        ) : paginatedMedications.length > 0 ? (
          paginatedMedications.map((medication) => (
            <div
              key={medication.id}
              className="bg-white border border-zinc-200 rounded-xl p-4 shadow-sm"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-zinc-800">
                    {medication?.patient?.name || "-"}
                  </h3>

                  <p className="text-xs text-zinc-400 mt-0.5">
                    {medication?.patient?.patientId || "-"}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                  Medicine
                </p>

                <p className="text-sm font-semibold text-zinc-700 mt-1">
                  {medication?.medicineName || "-"}
                </p>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-3 gap-3 mt-4">
                <div>
                  <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                    Dose
                  </p>

                  <p className="text-xs font-medium text-zinc-700 mt-1">
                    {medication?.dose || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                    Route
                  </p>

                  <p className="text-xs font-medium text-zinc-700 mt-1">
                    {medication?.route || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                    Frequency
                  </p>

                  <p className="text-xs font-medium text-zinc-700 mt-1">
                    {medication?.frequency || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                    Start Date
                  </p>

                  <p className="text-xs font-medium text-zinc-700 mt-1">
                    {formatDate(medication?.startDate)}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] uppercase tracking-wide font-bold text-zinc-400">
                    End Date
                  </p>

                  <p className="text-xs font-medium text-zinc-700 mt-1">
                    {formatDate(medication?.endDate)}
                  </p>
                </div>
              </div>

              <div className="flex justify-end mt-4 pt-3 border-t border-zinc-100">
                <MedicationAction medication={medication} />
              </div>
            </div>
          ))
        ) : (
          <div className="md:col-span-2 bg-white border border-zinc-200 rounded-xl py-10 text-center">
            <p className="text-sm font-semibold text-zinc-600">
              No medications found
            </p>

            <p className="text-xs text-zinc-400 mt-1">
              Try changing your search.
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block overflow-x-auto border rounded-md">
        <TableComponent
          columns={columns}
          data={paginatedMedications}
          loading={isLoading}
          actions={(item) => <MedicationAction medication={item} />}
          actionLabel="Action"
        />
      </div>

      {totalPages > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          goToPage={goToPage}
        />
      )}

      <ICUMedicationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleMedicationSuccess}
      />
    </div>
  );
};

export default ICUMedication;