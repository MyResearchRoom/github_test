import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Search,
  BedDouble,
  ChevronDown,
} from "lucide-react";
import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { icuService } from "../../../services/icuService";
import { usePagination } from "../../../hooks/usePagination";

const ITEMS_PER_PAGE = 10;

const bedStatusStyle = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "available":
      return "text-emerald-600";
    case "maintenance":
      return "text-amber-600";
    case "occupied":
      return "text-blue-600";
    case "discharged":
      return "text-red-600";
    default:
      return "text-zinc-500";
  }
};

const bedStatusDot = (status) => {
  switch (String(status || "").toLowerCase()) {
    case "available":
      return "bg-emerald-600";
    case "maintenance":
      return "bg-amber-600";
    case "occupied":
      return "bg-blue-600";
    case "discharged":
      return "bg-red-600";
    default:
      return "bg-zinc-400";
  }
};

const FilterDropdown = ({ value, options, onChange }) => {
  return (
    <div className="relative w-full">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full h-9 border border-zinc-200 rounded-lg pl-3 pr-8 text-sm text-zinc-700 bg-white outline-none focus:border-[#521785] transition"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>

      <ChevronDown
        size={15}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none"
      />
    </div>
  );
};

const ICUAdminPanelBeds = () => {
  const [allBeds, setAllBeds] = useState([]);
  const [beds, setBeds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [filters, setFilters] = useState({
    roomNumber: "All Rooms",
    bedType: "All Bed Types",
    status: "All Status",
    searchTerm: "",
  });

  const {
    currentPage,
    totalPages,
    goToPage,
    setTotalPages,
  } = usePagination(1);

  const paginatedData = useMemo(() => {
    const startIndex =
      (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex =
      startIndex + ITEMS_PER_PAGE;

    return beds.slice(startIndex, endIndex);
  }, [beds, currentPage]);

  useEffect(() => {
    const pages = Math.ceil(
      beds.length / ITEMS_PER_PAGE
    );

    setTotalPages(pages);

    if (pages === 0 && currentPage !== 1) {
      goToPage(1);
    }

    if (pages > 0 && currentPage > pages) {
      goToPage(1);
    }
  }, [
    beds.length,
    currentPage,
    setTotalPages,
    goToPage,
  ]);

  const fetchAllICUBeds = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const response = await icuService.getICUBeds();

      const nextBeds = response?.beds || [];

      setAllBeds(nextBeds);
      setBeds(nextBeds);

      goToPage(1);
    } catch (err) {
      console.error(
        "Failed to fetch ICU beds:",
        err
      );

      setAllBeds([]);
      setBeds([]);

      goToPage(1);

      setError(
        err?.response?.data?.message ||
          "Failed to load ICU beds."
      );
    } finally {
      setLoading(false);
    }
  }, [goToPage]);

  const fetchFilteredICUBeds = useCallback(
    async (nextFilters) => {
      try {
        setLoading(true);
        setError("");

        const params = {
          roomNumber:
            nextFilters.roomNumber === "All Rooms"
              ? ""
              : nextFilters.roomNumber,

          bedType:
            nextFilters.bedType === "All Bed Types"
              ? ""
              : nextFilters.bedType,

          status:
            nextFilters.status === "All Status"
              ? ""
              : nextFilters.status,

          searchTerm:
            nextFilters.searchTerm?.trim() || "",
        };

        const response =
          await icuService.getICUBeds(params);

        setBeds(response?.beds || []);

        goToPage(1);
      } catch (err) {
        console.error(
          "Failed to fetch filtered ICU beds:",
          err
        );

        setBeds([]);

        goToPage(1);

        setError(
          err?.response?.data?.message ||
            "Failed to load ICU beds."
        );
      } finally {
        setLoading(false);
      }
    },
    [goToPage]
  );

  useEffect(() => {
    fetchAllICUBeds();
  }, [fetchAllICUBeds]);

  const handleFilterChange = useCallback(
    (key, value) => {
      const nextFilters = {
        ...filters,
        [key]: value,
      };

      setFilters(nextFilters);

      goToPage(1);

      fetchFilteredICUBeds(nextFilters);
    },
    [
      filters,
      fetchFilteredICUBeds,
      goToPage,
    ]
  );

  const roomOptions = useMemo(() => {
    const rooms = allBeds
      .map(
        (bed) =>
          bed?.room?.roomNumber ||
          bed?.roomNumber ||
          bed?.room
      )
      .filter(Boolean);

    return [
      "All Rooms",
      ...Array.from(new Set(rooms)),
    ];
  }, [allBeds]);

  const bedTypeOptions = useMemo(() => {
    const types = allBeds
      .map((bed) => bed?.bedType)
      .filter(Boolean);

    return [
      "All Bed Types",
      ...Array.from(new Set(types)),
    ];
  }, [allBeds]);

  const statusOptions = useMemo(() => {
    const statuses = allBeds
      .map((bed) => bed?.status)
      .filter(Boolean);

    return [
      "All Status",
      ...Array.from(new Set(statuses)),
    ];
  }, [allBeds]);

  const getPatientIdentifier = (patient) => {
    // if (
    //   patient?.id !== undefined &&
    //   patient?.id !== null &&
    //   patient?.id !== ""
    // ) {
    //   return `ID: ${patient.id}`;
    // }

    if (
      patient?.mrn !== undefined &&
      patient?.mrn !== null &&
      patient?.mrn !== ""
    ) {
      return `MRN: ${patient.mrn}`;
    }

    return null;
  };

  const bedColumns = [
    {
      label: "BED",
      field: "bedNumber",
      headerClassName: "text-left px-5",
      className:
        "px-5 py-3 font-semibold text-[#521785] whitespace-nowrap",
      render: (row) =>
        row?.bedCode ||
        row?.bedNumber ||
        "—",
    },

    {
      label: "PATIENT",
      field: "patient",
      headerClassName: "text-left px-5",
      className:
        "px-5 py-3 whitespace-nowrap",
      render: (row) => {
        const patientName =
          row?.patient?.name || "—";

        const identifier =
          getPatientIdentifier(
            row?.patient
          );

        return (
          <div className="flex flex-col">
            <span className="font-medium text-zinc-800">
              {patientName}
            </span>

            {identifier && (
              <span className="text-xs text-zinc-400 mt-0.5">
                {identifier}
              </span>
            )}
          </div>
        );
      },
    },

    {
      label: "ICU UNIT",
      field: "icuUnit",
      headerClassName: "text-left px-5",
      className:
        "px-5 py-3 text-zinc-700 whitespace-nowrap",
      render: (row) =>
        row?.ward?.wardName ||
        row?.icuUnit ||
        "—",
    },

    {
      label: "WARD NAME",
      field: "wardNo",
      headerClassName: "text-left px-5",
      className:
        "px-5 py-3 text-zinc-700 whitespace-nowrap",
      render: (row) =>
        row?.ward?.wardName ||
        row?.ward?.wardNo ||
        row?.wardNumber ||
        row?.wardNo ||
        "—",
    },

    {
      label: "ROOM NO",
      field: "room",
      headerClassName: "text-left px-5",
      className:
        "px-5 py-3 text-zinc-600 whitespace-nowrap",
      render: (row) =>
        row?.room?.roomNumber ||
        row?.roomNumber ||
        row?.room ||
        "—",
    },

    {
      label: "BED TYPE",
      field: "bedType",
      headerClassName: "text-left px-5",
      className:
        "px-5 py-3 text-zinc-600 whitespace-nowrap",
      render: (row) =>
        row?.bedType || "—",
    },

    {
      label: "STATUS",
      field: "status",
      headerClassName: "text-left px-5",
      className: "px-5 py-3",
      render: (row) => (
        <span
          className={`inline-flex items-center gap-1.5 text-sm font-medium whitespace-nowrap ${bedStatusStyle(
            row?.status
          )}`}
        >
          <span
            className={`h-1.5 w-1.5 rounded-full ${bedStatusDot(
              row?.status
            )}`}
          />

          {row?.status || "—"}
        </span>
      ),
    },
  ];

  const resetFilters = () => {
    const defaultFilters = {
      roomNumber: "All Rooms",
      bedType: "All Bed Types",
      status: "All Status",
      searchTerm: "",
    };

    setFilters(defaultFilters);

    goToPage(1);

    fetchAllICUBeds();
  };

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
      {/* HEADER */}
      <div className="flex flex-col gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">
        <div>
          <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
            ICU Bed Management
          </p>

          <p className="text-xs text-zinc-400 mt-1">
            {loading
              ? "Loading ICU beds..."
              : `${beds.length} ICU bed${
                  beds.length !== 1 ? "s" : ""
                } found`}
          </p>
        </div>

        {/* FILTERS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <FilterDropdown
            value={filters.roomNumber}
            options={roomOptions}
            onChange={(value) =>
              handleFilterChange(
                "roomNumber",
                value
              )
            }
          />

          <FilterDropdown
            value={filters.bedType}
            options={bedTypeOptions}
            onChange={(value) =>
              handleFilterChange(
                "bedType",
                value
              )
            }
          />

          <FilterDropdown
            value={filters.status}
            options={statusOptions}
            onChange={(value) =>
              handleFilterChange(
                "status",
                value
              )
            }
          />

          <div className="relative w-full">
            <input
              type="text"
              placeholder="Search bed number..."
              value={filters.searchTerm}
              onChange={(e) =>
                handleFilterChange(
                  "searchTerm",
                  e.target.value
                )
              }
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-[#521785] transition text-sm"
            />

            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400"
            />
          </div>
        </div>

        {/* RESET */}
        {(filters.roomNumber !== "All Rooms" ||
          filters.bedType !== "All Bed Types" ||
          filters.status !== "All Status" ||
          filters.searchTerm) && (
          <div>
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-semibold text-[#521785] hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* ERROR */}
      {error && (
        <div className="px-5 py-3 border-b border-red-100 bg-red-50 text-sm text-red-600">
          {error}
        </div>
      )}

      {/* LOADING */}
      {loading ? (
        <div className="flex items-center justify-center py-12 text-sm text-zinc-400">
          Loading ICU beds...
        </div>
      ) : beds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
          <BedDouble
            size={40}
            className="text-zinc-300 mb-3"
          />

          <p className="text-sm font-medium text-zinc-600">
            No ICU beds found
          </p>

          <p className="text-xs text-zinc-400 mt-1">
            No beds match the selected filters.
          </p>
        </div>
      ) : (
        <>
          {/* DESKTOP VIEW */}
          <div className="hidden lg:block overflow-x-auto">
            <TableComponent
              columns={bedColumns}
              data={paginatedData}
              actionLabel={null}
            />
          </div>

          {/* MOBILE & TABLET VIEW */}
          <div className="block lg:hidden p-4 bg-zinc-50/50">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {paginatedData.map((row) => {
                const bedNumber =
                  row?.bedCode ||
                  row?.bedNumber ||
                  "—";

                const patientName =
                  row?.patient?.name || "—";

                const patientIdentifier =
                  getPatientIdentifier(
                    row?.patient
                  );

                const room =
                  row?.room?.roomNumber ||
                  row?.roomNumber ||
                  row?.room ||
                  "—";

                const unit =
                  row?.ward?.wardName ||
                  row?.icuUnit ||
                  "—";

                const wardNo =
                  row?.ward?.wardName ||
                  row?.ward?.wardNo ||
                  row?.wardNumber ||
                  row?.wardNo ||
                  "—";

                return (
                  <div
                    key={row?.id}
                    className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col gap-3"
                  >
                    {/* CARD HEADER */}
                    <div className="flex justify-between items-center border-b border-zinc-100 pb-2 gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <BedDouble
                          size={16}
                          className="text-[#521785] shrink-0"
                        />

                        <span className="font-bold text-[#521785] text-sm truncate">
                          {bedNumber}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2 py-0.5 rounded-full ${bedStatusStyle(
                          row?.status
                        )} bg-zinc-50 border border-zinc-100 whitespace-nowrap`}
                      >
                        <span
                          className={`h-1.5 w-1.5 rounded-full ${bedStatusDot(
                            row?.status
                          )}`}
                        />

                        {row?.status || "—"}
                      </span>
                    </div>

                    {/* PATIENT */}
                    <div className="border-b border-zinc-100 pb-2">
                      <p className="text-xs text-zinc-400 mb-0.5">
                        Patient
                      </p>

                      <p className="text-sm font-semibold text-zinc-800">
                        {patientName}
                      </p>

                      {patientIdentifier && (
                        <p className="text-xs text-zinc-400 mt-0.5">
                          {patientIdentifier}
                        </p>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="grid grid-cols-2 gap-y-2 text-xs text-zinc-500">
                      <div>
                        Unit:{" "}
                        <strong className="text-zinc-700">
                          {unit}
                        </strong>
                      </div>

                      <div>
                        Ward No:{" "}
                        <strong className="text-zinc-600">
                          {wardNo}
                        </strong>
                      </div>

                      <div>
                        Room:{" "}
                        <strong className="text-zinc-600">
                          {room}
                        </strong>
                      </div>

                      <div>
                        Type:{" "}
                        <strong className="text-zinc-600">
                          {row?.bedType || "—"}
                        </strong>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* PAGINATION */}
          {totalPages > 0 && (
            <div className="flex justify-end items-center px-4 py-4 border-t border-zinc-100 bg-white">
              <Pagination
                currentPage={currentPage}
                setCurrentPage={goToPage}
                totalPages={totalPages}
                goToPage={goToPage}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ICUAdminPanelBeds;