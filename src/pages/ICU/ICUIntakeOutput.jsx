import React, { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Plus, Eye, Search } from "lucide-react";
import IntakeOutputModal from "../../modal/ICU/ICUIntakeOutputModal";
import TableComponent from "../../commonComponent/TableComponent";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { icuService } from "../../services/icuService";
import AddIntakeOutputModal from "../../modal/IPD/AddIntakeOutputModal";

const ITEMS_PER_PAGE = 5;
const inputClass =
  "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const categoryBadge = (category) =>
  category?.toLowerCase() === "intake"
    ? "bg-blue-100 text-blue-700"
    : "bg-amber-100 text-amber-700";

const formatDate = (value) => {
  if (!value) return "-";
  return new Date(`${value}T00:00:00`).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const ICUIntakeOutput = () => {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("");

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedFilterCategory, setSelectedFilterCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination(1);


  const fetchLatestInputOutput = useCallback(async () => {
    try {
      setLoading(true);

      const response = await icuService.getLatestInputOutput({
        date: selectedDate,
        category: selectedFilterCategory,
        searchTerm: searchTerm.trim(),
      });

      if (response?.success) {
        setEntries(response.data || []);
      } else {
        setEntries([]);
      }

      goToPage(1);
    } catch (error) {
      console.error("Failed to fetch ICU intake/output:", error);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [selectedDate, selectedFilterCategory, searchTerm, goToPage]);

  useEffect(() => {
    fetchLatestInputOutput();
  }, [fetchLatestInputOutput]);

  useEffect(() => {
    setTotalPages(Math.max(1, Math.ceil(entries.length / ITEMS_PER_PAGE)));
  }, [entries.length, setTotalPages]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedEntries = entries.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const handleOpenModal = (category) => {
    setSelectedCategory(category);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCategory("");
  };

  const handleSaveEntry = (formData) => {
    fetchLatestInputOutput();
    handleCloseModal();
  };

  const handleView = (item) => {
    navigate(`/icu-intake-output/${item.patientId}`, {
      state: {
        patientId: item.patientId,
        icuAdmissionId: item.icuAdmissionId,
        patient: {
          ...item.patient,
          bed: item.bed || item.patient?.bed,
        },
      },
    });
  };

  const columns = [
    {
      label: "Patient",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="font-semibold text-zinc-900 whitespace-nowrap">
          {item.patient?.name || "-"}
        </p>
      ),
    },
    {
      label: "Date",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-nowrap">
          {formatDate(item.date)}
        </p>
      ),
    },
    {
      label: "Time",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 whitespace-nowrap">
          {item.time || "-"}
        </p>
      ),
    },
    {
      label: "Category",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => {
        const category = item.category?.toLowerCase();

        return (
          <span
            className={`text-xs font-semibold px-2 py-1 rounded-md whitespace-nowrap ${category === "intake"
                ? "bg-blue-100 text-blue-700"
                : "bg-amber-100 text-amber-700"
              }`}
          >
            {category
              ? category.charAt(0).toUpperCase() + category.slice(1)
              : "-"}
          </span>
        );
      },
    },
    {
      label: "Type",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-700 min-w-[180px]">
          {item.type || "-"}
        </p>
      ),
    },
    {
      label: "Qty (mL)",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="font-semibold text-zinc-800 whitespace-nowrap">
          {item.quantity || "-"}
        </p>
      ),
    },
    {
      label: "Remarks",
      headerClassName: "text-left pl-4 whitespace-nowrap",
      className: "pl-4 py-3",
      render: (item) => (
        <p className="text-zinc-600 min-w-[200px]">
          {item.remarks || "—"}
        </p>
      ),
    },
  ];

  return (
    <div className="w-full mx-auto p-1 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">

      <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
            Intake &amp; Output
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 mt-1">
            Manual fluid balance tracking by shift
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <div>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                goToPage(1);
              }}
              aria-label="Filter intake and output by date"
              className={inputClass}
            />
          </div>

          <div>
            <select
              className={inputClass}
              value={selectedFilterCategory}
              onChange={(e) => {
                setSelectedFilterCategory(e.target.value);
                goToPage(1);
              }}
            >
              <option value="">All Categories</option>
              <option value="intake">Intake</option>
              <option value="output">Output</option>
            </select>
          </div>
          <div className="">
            <input
              type="search"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                goToPage(1);
              }}
              placeholder="Search patient, type, remarks..."
              aria-label="Search intake and output entries"
              className={`${inputClass} pl-9 sm:w-64`}
            />
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>

          <button
            type="button"
            onClick={() => handleOpenModal("intake")}
            className="bg-[#521785] px-1 lg:px-2 xl:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
          >
            <Plus size={16} />
            <span className="hidden xl:block">Add Intake</span>
            <span className="xl:hidden block">Intake</span>
          </button>

          <button
            type="button"
            onClick={() => handleOpenModal("output")}
            className="bg-[#521785] px-1 lg:px-2 xl:px-4 h-9 text-xs sm:text-sm text-white hover:bg-[#45126f] rounded-md transition flex items-center justify-center gap-2 whitespace-nowrap shadow-sm font-medium"
          >
            <Plus size={16} />
            <span className="hidden xl:block">Add Output</span>
            <span className="xl:hidden block">Output </span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-4 sm:p-5">
          {paginatedEntries.length > 0 ? (
            <>

              {/* Mobile / Tablet cards */}
              <div className="flex lg:hidden flex-col gap-3">
                {paginatedEntries.map((entry) => (
                  <div
                    key={entry.id}
                    onClick={() => handleView(entry)}
                    className="border border-zinc-200 rounded-xl p-4 cursor-pointer hover:border-zinc-300 transition"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-semibold text-zinc-900">
                        {entry.patient?.name || "-"}
                      </p>

                      <span
                        className={`text-xs font-semibold px-2 py-1 rounded-md capitalize ${categoryBadge(
                          entry.category
                        )}`}
                      >
                        {entry.category|| "-"}
                      </span>
                    </div>

                    <p className="text-xs text-zinc-400 mb-2">
                      {formatDate(entry.date)} · {entry.time || "-"}
                    </p>

                    <p className="text-sm font-semibold text-zinc-800">
                      {entry.type || "-"}
                    </p>

                    <div className="flex items-center justify-between mt-2">
                      <p className="text-xs text-zinc-500">
                        {entry.remarks || "—"}
                      </p>

                      <p className="text-sm font-bold text-zinc-800">
                        {entry.quantity || "-"}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(entry);
                      }}
                      className="mt-3 w-full flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition"
                    >
                      <Eye size={14} />
                      View Patient
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop table */}
              <div className="hidden lg:block overflow-x-auto">
                <TableComponent
                  columns={columns}
                  data={paginatedEntries}
                  loading={loading}
                  onClick={handleView}
                  actions={(item) => (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleView(item);
                      }}
                      title="View patient intake/output"
                      className="w-8 h-8 rounded-md flex items-center justify-center border border-zinc-200 hover:bg-[#F3E8FF] transition mx-auto"
                    >
                      <Eye size={15} className="text-[#521785]" />
                    </button>
                  )}
                  actionLabel="Action"
                />
              </div>
            </>
          ) : (
            <div className="py-12 text-center">
              <p className="text-sm font-semibold text-zinc-600">No entries recorded</p>
              <p className="text-xs text-zinc-400 mt-1">Add an intake or output entry to get started.</p>
            </div>
          )}
        </div>
      </div>

      {totalPages > 0 && (
        <Pagination currentPage={currentPage} totalPages={totalPages} goToPage={goToPage} />
      )}

      <AddIntakeOutputModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSuccess={handleSaveEntry}
        category={selectedCategory}
        isICU={true}
      />
    </div>
  );
};

export default ICUIntakeOutput;