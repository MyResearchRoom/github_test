import React, { useEffect, useMemo, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Eye,
  ArrowRightLeft,
  LogOut,
  BedDouble,
  Phone,
  Info,
  MoreVertical,
  File,
} from "lucide-react";
import TableComponent from "../../commonComponent/TableComponent";
import Button from "../../commonComponent/Button";
import apiClient from "../../api/apiClient";
import { ipdService } from "../../services/ipdService";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";
import NewDischargeModal from "../../modal/IPD/newDischarge";
import { toast } from "react-toastify";
import AddSectionModal from "../../modal/IPD/AddSectionModal";
import AddPatientDocumentModal from "../../modal/IPD/addPatientDocuments";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

const statusStyles = {
  Stable: "bg-[#DCFCE7] text-[#16A34A]",
  "Under Treatment": "bg-[#FFEDD5] text-[#EA580C]",
  Critical: "bg-[#FEE2E2] text-[#EF4444]",
};

export const FilterDropdown = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="appearance-none border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none w-full"
    >
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
    <ChevronDown
      size={14}
      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);

export const DoctorFilterDropdown = ({ options, value, onChange }) => (
  <div className="relative">
    <select
      value={`${value.doctorType}-${value.doctorId}`}
      onChange={(e) => {
        const selected = options.find(
          (option) =>
            `${option.type}-${option.value}` === e.target.value
        );

        onChange({
          doctorId: selected?.value || "",
          doctorType: selected?.type || "",
        });
      }}
      className="appearance-none border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none w-full"
    >
      {options.map((option) => (
        <option
          key={`${option.type}-${option.value}`}
          value={`${option.type}-${option.value}`}
        >
          {option.label}
        </option>
      ))}
    </select>

    <ChevronDown
      size={14}
      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
    />
  </div>
);

const statusFilterOptions = [
  "All",
  "admitted",
  "discharged",
  "cancelled",
  "transfer to ICU",
  "discharge Initiated",
  "absconded",
];

// Reusable Action Dropdown Component for Active/Admitted Patients
const ActionDropdown = ({
  item,
  navigate,
  setIsNewDischargeOpen,
  setAdmissionId,
  openAddModal,
  openAddDocumentModal,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  return (
    <div className="relative flex justify-center" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors focus:outline-none"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-9 w-40 bg-white rounded-md border border-gray-200 shadow-lg z-50 py-1 text-left animate-in fade-in slide-in-from-top-3 duration-100">

          {/* Add Document */}
          <button
            onClick={() => {
              setIsOpen(false);
              openAddDocumentModal(
                item.patientId,
                item.id
              );
            }}
            className="w-full px-4 py-2 text-[13px] text-[#7C3AED] hover:bg-purple-50 flex items-center gap-2 font-medium"
          >
            <Plus size={14} />
            Add Document
          </button>

          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/ipd/admission-doc", {
                state: { admission: item },
              });
            }}
            className="w-full px-4 py-2 text-[13px] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2 font-medium"
          >
            <File size={14} />
            Documents
          </button>


          {/* Transfer */}
          <button
            onClick={() => {
              setIsOpen(false);
              navigate("/ipd/bed-transfer", {
                state: { admissionId: item.id },
              });
            }}
            className="w-full px-4 py-2 text-[13px] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2 font-medium"
          >
            <ArrowRightLeft size={14} />
            Transfer
          </button>

          {/* Discharge */}
          <button
            disabled={item?.discharge?.id}
            onClick={() => {
              setIsOpen(false);
              setIsNewDischargeOpen(true);
              setAdmissionId(item.id);
            }}
            className="w-full px-4 py-2 text-[13px] text-[#EF4444] hover:bg-red-50 flex items-center gap-2 font-medium disabled:opacity-50 disabled:hover:bg-transparent disabled:cursor-not-allowed"
          >
            <LogOut size={14} />
            {item?.discharge?.id ? "DC Initiated" : "Discharge"}
          </button>

          {/* Note */}
          <button
            onClick={() => {
              setIsOpen(false);
              openAddModal(
                item.id,
                item.admissionDate
              );
            }}
            className="w-full px-4 py-2 text-[13px] text-[#7C3AED] hover:bg-purple-50 flex items-center gap-2 font-medium"
          >
            <Plus size={14} />
            Note
          </button>
        </div>
      )}
    </div>
  );
};

const AdmittedPatientsList = () => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const [doctorFilter, setDoctorFilter] = useState({
    doctorId: "",
    doctorType: "",
  });

  const [wardFilter, setWardFilter] = useState("All Wards");
  const [admissionDate, setAdmissionDate] = useState("");
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(false);

  const [doctorFilterOptions, setDoctorFilterOptions] =
    useState(["All Doctors"]);

  const [wardFilterOptions, setWardFilterOptions] =
    useState(["All Wards"]);

  const {
    currentPage,
    totalPages,
    goToPage,
    setTotalPages,
  } = usePagination();

  const [isNewDischargeOpen, setIsNewDischargeOpen] =
    useState(false);

  const [admissionId, setAdmissionId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [noteAddPatientId, setNoteAddPatientId] =
    useState(null);

  const [admissionDateToPass, setAdmissionDateToPass] =
    useState(null);

  const [statusFilter, setStatusFilter] =
    useState("admitted");

  // Document modal state
  const [showAddDocumentModal, setShowAddDocumentModal] =
    useState(false);

  const [documentPatientId, setDocumentPatientId] =
    useState(null);

  const [documentAdmissionId, setDocumentAdmissionId] =
    useState(null);

  useEffect(() => {
    setTotalPages(
      Math.ceil(patients.length / ITEMS_PER_PAGE) || 1
    );
  }, [patients, setTotalPages]);

  useEffect(() => {
    goToPage(1);
  }, [
    search,
    doctorFilter.doctorId,
    doctorFilter.doctorType,
    wardFilter,
    admissionDate,
    goToPage,
    statusFilter,
  ]);

  useEffect(() => {
    let active = true;

    const loadFilterOptions = async () => {
      try {
        const [doctorResponse, wardResponse] =
          await Promise.all([
            apiClient.get("/api/doctors/list"),
            ipdService.getWards(),
          ]);

        if (!active) return;

        const doctors =
          doctorResponse.data?.doctors || [];

        const doctorOptions = doctors
          .filter(
            (d) =>
              d.type === "doctor" && d.name
          )
          .map((d) => ({
            label: d.name,
            value: d.id,
            type: "doctor",
          }));

        const subDoctorOptions = doctors
          .filter(
            (d) =>
              d.type === "subDoctor" && d.name
          )
          .map((d) => ({
            label: d.name,
            value: d.id,
            type: "subdoctor",
          }));

        setDoctorFilterOptions([
          {
            label: "All Doctors",
            value: "",
            type: "",
          },
          ...doctorOptions,
          ...subDoctorOptions,
        ]);

        const wardNames = (
          wardResponse.wards || []
        )
          .map((w) => w.wardName)
          .filter(Boolean);

        setWardFilterOptions([
          "All Wards",
          ...Array.from(new Set(wardNames)),
        ]);
      } catch (error) {
        if (active) {
          setDoctorFilterOptions([
            {
              label: "All Doctors",
              value: "",
              type: "",
            },
          ]);

          setWardFilterOptions([
            "All Wards",
          ]);
        }
      }
    };

    loadFilterOptions();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    let active = true;

    const fetchAdmissions = async () => {
      setLoading(true);

      try {
        const data =
          await ipdService.getAdmissions({
            searchTerm: search,
            doctorId: doctorFilter.doctorId,
            doctorType: doctorFilter.doctorType,
            ward: wardFilter,
            admissionDate,
            ...(!search && { status: statusFilter }),
          });

        if (active) {
          setPatients(data.admissions || []);
        }
      } catch (error) {
        if (active) {
          setPatients([]);
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    fetchAdmissions();

    return () => {
      active = false;
    };
  }, [
    search,
    doctorFilter.doctorId,
    doctorFilter.doctorType,
    wardFilter,
    admissionDate,
    statusFilter,
  ]);

  const columns = [
    {
      label: "Patient Details",
      headerClassName: "text-left pl-4",
      className: "pl-4 py-3",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
            <span className="text-[#7C3AED] font-semibold text-[14px]">
              {item.name.charAt(0)}
            </span>
          </div>

          <div>
            <p className="font-semibold text-[#343C6A]">
              {item.name}
            </p>

            <p className="text-[11px] 2xl:text-[12px] text-[#8BA3CB]">
              P-ID: {item.mrn}
            </p>

            <p className="text-[11px] 2xl:text-[12px] text-[#8BA3CB] flex items-center gap-1">
              <Phone size={11} />
              {item.phone}
            </p>
          </div>
        </div>
      ),
    },

    {
      label: "Doctor",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
        <div>
          <p className="font-medium text-[#343C6A]">
            {item.doctor}
          </p>

          <p className="text-[12px] text-[#8BA3CB]">
            {item.doctorRole}
          </p>
        </div>
      ),
    },

    {
      label: "Ward / Room ",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
        <div>
          <p className="font-medium text-[#343C6A]">
            {item.ward}
          </p>

          <p className="text-[12px] text-[#8BA3CB]">
            {item.room}
          </p>
        </div>
      ),
    },

    {
      label: "Current Bed",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
        <span
          className="flex items-center gap-1.5 font-semibold"
          style={{ color: PRIMARY }}
        >
          <BedDouble size={15} />
          {item.currentBed}
        </span>
      ),
    },

    {
      label: "Admission Date",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
        <div>
          <p className="text-[#343C6A]">
            {item.admissionDate}
          </p>

          <p className="text-[12px] text-[#8BA3CB]">
            {item.admissionTime}
          </p>
        </div>
      ),
    },

    {
      label: "Admission Status",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
      <div className="flex flex-col gap-2 items-start">
        <span
          className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${
            statusStyles[item.status]
          }`}
        >
          {item.status}
        </span>

        {item.status !== "Discharged" &&
          <p className="text-[12px] capitalize"> 
            {item.admissionStatus}
          </p>
        }
      </div>
      ),
    },
  ];

  const openAddModal = (
    patientId,
    admissionDate
  ) => {
    setNoteAddPatientId(patientId);
    setAdmissionDateToPass(admissionDate);
    setIsModalOpen(true);
  };

  // Document modal handler
  const openAddDocumentModal = (
    patientId,
    admissionId
  ) => {
    setDocumentPatientId(patientId);
    setDocumentAdmissionId(admissionId);
    setShowAddDocumentModal(true);
  };

  const handleSaveSection = async (data) => {
    if (!noteAddPatientId) {
      toast.error("Patient not found");
    }

    try {
      const res =
        await ipdService.addClinicalSummarySection(
          noteAddPatientId,
          data
        );

      toast.success(
        res?.message ||
          "Added successfully.."
      );

      setIsModalOpen(false);
      setNoteAddPatientId(null);
      setAdmissionDateToPass(null);
    } catch (err) {
      console.error(
        "Failed to save section:",
        err?.response?.data ||
          err.message
      );

      toast.error(
        err?.response?.data?.message ||
          "Failed to save section."
      );
    }
  };

  const startIndex =
    (currentPage - 1) *
    ITEMS_PER_PAGE;

  const paginatedData = patients.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  return (
    <div className="min-h-screen bg-transparent p-2 lg:p-1 flex flex-col gap-4">

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
            Admitted Patients List
          </h1>

          <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
            View and manage all currently admitted patients.
          </p>
        </div>

        <Button
          onClick={() =>
            navigate("/ipd/admit-patient")
          }
          className="text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 text-sm"
          style={{
            backgroundColor: PRIMARY,
          }}
        >
          <Plus size={16} />
          Admit Patient
        </Button>
      </div>

      {/* Filters */}

      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-stretch">
        <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-2 gap-2 w-full sm:flex-1 sm:min-w-[250px] bg-white">
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Search patient by name, MRN, phone..."
            className="outline-none text-[14px] w-full min-w-0"
          />

          <Search
            size={16}
            className="text-gray-400 shrink-0"
          />
        </div>

        <div className="w-full sm:w-[calc(50%-6px)] lg:w-[16%]">
          <DoctorFilterDropdown
            options={doctorFilterOptions}
            value={doctorFilter}
            onChange={setDoctorFilter}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-6px)] lg:w-[16%]">
          <FilterDropdown
            options={wardFilterOptions}
            value={wardFilter}
            onChange={setWardFilter}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-6px)] lg:w-[16%]">
          <FilterDropdown
            options={statusFilterOptions}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        <div className="relative w-full sm:w-[calc(50%-6px)] lg:w-[18%]">
          <input
            type="date"
            value={admissionDate}
            onChange={(e) =>
              setAdmissionDate(e.target.value)
            }
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] outline-none"
          />

          <Calendar
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        <div className="flex gap-2 w-full sm:w-auto">
          <Button className="border border-[#d3cccc] flex-1 sm:flex-none flex items-center justify-center gap-1 bg-white text-[#343C6A] w-auto px-4 text-sm">
            <Filter size={14} />
            Filter
          </Button>
        </div>
      </div>

      {/* Desktop and Laptop Table */}

      <div className="hidden lg:flex bg-white rounded-lg border border-[#e5e5e5] flex-col overflow-x-auto">
        <TableComponent
          columns={columns}
          data={paginatedData}
          loading={loading}
          headerBg="bg-[#F8F9FC]"
          actions={(item) => {
            return (
              <div className="flex justify-center py-1">

                {/* View */}

                <Button
                  onClick={() =>
                    navigate(
                      `/ipd/admissions/${item.mrn}`,
                      {state: { status: item.admissionStatus }}
                    )
 
                  }
                  className="border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-1 w-auto px-2 py-1.5 text-[13px]"
                >
                  <Eye size={14} />
                  View
                </Button>
                
                {!["discharged", "cancelled","absconded"].includes(item.admissionStatus) && 
                  <ActionDropdown
                    item={item}
                    navigate={navigate}
                    setIsNewDischargeOpen={
                      setIsNewDischargeOpen
                    }
                    setAdmissionId={
                      setAdmissionId
                    }
                    openAddModal={openAddModal}
                    openAddDocumentModal={
                      openAddDocumentModal
                    }
                  />
                }
              </div>
            );
          }}
          actionLabel="Actions"
        />
      </div>

      {/* Mobile and Tablet Cards */}

      <div className="lg:hidden flex flex-col gap-3">
        {loading ? (
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 text-center text-sm text-[#8BA3CB]">
            Loading...
          </div>
        ) : paginatedData.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 text-center text-sm text-[#8BA3CB]">
            No patients found.
          </div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={item.id || item.mrn}
              className="bg-white rounded-lg border border-[#e5e5e5] p-2 sm:p-5 flex flex-col gap-4 relative"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                    <span className="text-[#7C3AED] font-semibold text-[14px]">
                      {item.name.charAt(0)}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#343C6A] truncate">
                      {item.name}
                    </p>

                    <p className="text-[12px] text-[#8BA3CB]">
                      MRN: {item.mrn}
                    </p>

                    <p className="text-[12px] text-[#8BA3CB] flex items-center gap-1">
                      <Phone
                        size={11}
                        className="shrink-0"
                      />
                      {item.phone}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2 shrink-0">

                  {![
                    "discharged",
                    "cancelled",
                    "absconded",
                  ].includes(
                    item.admissionStatus
                  ) && (
                    <ActionDropdown
                      item={item}
                      navigate={navigate}
                      setIsNewDischargeOpen={
                        setIsNewDischargeOpen
                      }
                      setAdmissionId={
                        setAdmissionId
                      }
                      openAddModal={
                        openAddModal
                      }
                      openAddDocumentModal={
                        openAddDocumentModal
                      }
                    />
                  )}

                  <span
                    className={`text-[11px] sm:text-[12px] font-medium px-1 py-1 rounded-full ${
                      statusStyles[item.status]
                    }`}
                  >
                    {item.status}
                  </span>

                  {item.status !== "Discharged" &&
                    <p className="text-[11px] capitalize"> 
                      {item.admissionStatus}
                    </p>
                  }
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 border-t border-[#f0f0f0] pt-4 px-2">
                <div>
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    Doctor
                  </p>

                  <p className="text-sm font-medium text-[#343C6A]">
                    {item.doctor}
                  </p>

                  <p className="text-[11px] text-[#8BA3CB]">
                    {item.doctorRole}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    Ward / Room
                  </p>

                  <p className="text-sm font-medium text-[#343C6A]">
                    {item.ward}
                  </p>

                  <p className="text-[11px] text-[#8BA3CB]">
                    {item.room}
                  </p>
                </div>

                <div className="min-w-0">
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    Current Bed
                  </p>

                  <p
                    className="flex items-center gap-1.5 text-sm font-semibold min-w-0"
                    style={{ color: PRIMARY }}
                  >
                    <BedDouble
                      size={15}
                      className="shrink-0"
                    />

                    <span className="min-w-0 break-words whitespace-normal">
                      {item.currentBed || "-"}
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    Admission Date
                  </p>

                  <p className="text-sm text-[#343C6A]">
                    {item.admissionDate}
                  </p>

                  <p className="text-[11px] text-[#8BA3CB]">
                    {item.admissionTime}
                  </p>
                </div>
              </div>

              {/* Direct View Button for Mobile / Tablet */}

              <div className="pt-2 border-t border-[#f0f0f0] flex justify-end">
                <Button
                  onClick={() =>
                    navigate(
                      `/ipd/admissions/${item.mrn}`
                    )
                  }
                  className="border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-1 px-4 py-2 text-[13px] rounded-md"
                >
                  <Eye size={14} />
                  View
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}

      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-center gap-1 lg:gap-3 p-1 lg:px-4 bg-white rounded-lg border border-[#e5e5e5]">
        <span className="text-[12px] sm:text-[13px] text-[#8BA3CB]">
          Showing{" "}
          {patients.length === 0
            ? 0
            : startIndex + 1}{" "}
          to{" "}
          {Math.min(
            startIndex + ITEMS_PER_PAGE,
            patients.length
          )}{" "}
          of {patients.length} patients
        </span>

        {patients.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        )}
      </div>

      {/* Info Banner */}

      <div className="flex items-start sm:items-center gap-2 bg-[#EEF2FF] text-[#4338CA] text-[12px] sm:text-[13px] p-3 rounded-lg">
        <Info
          size={16}
          className="shrink-0 mt-0.5 sm:mt-0"
        />

        <span>
          Click on{" "}
          <span className="font-semibold">
            View Details
          </span>{" "}
          to see full patient admission information.
        </span>
      </div>

      {/* Discharge Modal */}

      <NewDischargeModal
        isOpen={isNewDischargeOpen}
        onClose={() =>
          setIsNewDischargeOpen(false)
        }
        admissionId={admissionId}
      />

      {/* Note Modal */}

      <AddSectionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setNoteAddPatientId(null);
          setAdmissionDateToPass(null);
        }}
        onSave={handleSaveSection}
        admissionDate={admissionDateToPass}
      />

      {/* Add Patient Document Modal */}

      <AddPatientDocumentModal
        isOpen={showAddDocumentModal}
        onClose={() =>
          setShowAddDocumentModal(false)
        }
        patientId={documentPatientId}
        admissionId={documentAdmissionId}
        onSuccess={() => {
          setShowAddDocumentModal(false);
        }}
      />
    </div>
  );
};

export default AdmittedPatientsList;







