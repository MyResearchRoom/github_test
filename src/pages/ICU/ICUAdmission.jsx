import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Search,
  Filter,
  Calendar,
  ChevronDown,
  Eye,
  MoreVertical,
  BedDouble,
  Phone,
  Info,
  File,
  ArrowRightLeft,
  LogOut,
} from "lucide-react";
import Button from "../../commonComponent/Button";
import Pagination from "../../commonComponent/Pagination";
import { usePagination } from "../../hooks/usePagination";
import { icuService } from "../../services/icuService";
import { DoctorFilterDropdown } from "../IPD/AdmittedPatientsList";
import apiClient from "../../api/apiClient";
import { formatTime } from "../../utils/formatTime";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

export const statusStyles = {
  All: "bg-[#F3F4F6] text-[#374151]",

  ACTIVE: "bg-[#DCFCE7] text-[#16A34A]",

  TRANSFERRED: "bg-[#DBEAFE] text-[#2563EB]",

  DISCHARGED: "bg-[#E0E7FF] text-[#4F46E5]",

  CANCELLED: "bg-[#F3F4F6] text-[#6B7280]",

  TRANSFERRED_TO_IPD: "bg-[#F3E8FF] text-[#9333EA]",

  DISCHARGE_INITIATED: "bg-[#FFEDD5] text-[#EA580C]",
};


const FilterDropdown = ({ options, value, onChange }) => (
  <div className="relative">
    <select value={value} onChange={(e) => onChange(e.target.value)} className="appearance-none border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none w-full">
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>

    <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
  </div>
);

const ActionDropdown = ({ item, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = React.useRef(null);

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="relative flex items-center justify-center" ref={menuRef}>
      {/* Three Dot Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="p-1.5 hover:bg-gray-100 rounded-full text-gray-500 transition-colors focus:outline-none"
      >
        <MoreVertical size={18} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-9 w-40 bg-white rounded-md border border-gray-200 shadow-lg z-50 py-1 text-left">


          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-[13px] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2 font-medium"
          >
            <File size={14} />
            Documents
          </button>

          {/* Transfer */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-[13px] text-[#2563EB] hover:bg-blue-50 flex items-center gap-2 font-medium"
          >
            <ArrowRightLeft size={14} />
            Transfer
          </button>

          {/* Discharge */}
          <button
            type="button"
            onClick={() => {
              setIsOpen(false);
            }}
            className="w-full px-4 py-2 text-[13px] text-[#EF4444] hover:bg-red-50 flex items-center gap-2 font-medium"
          >
            <LogOut size={14} />
            Discharge
          </button>

        </div>
      )}
    </div>
  );
};

const ICUAdmission = () => {
  const navigate = useNavigate();

  const [admissions, setAdmissions] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("ACTIVE");
  const [conditionFilter, setConditionFilter] = useState("All");
  const [admissionDate, setAdmissionDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [doctorFilter, setDoctorFilter] = useState({
    doctorId: "",
    doctorType: "",
  });

  const [doctorFilterOptions, setDoctorFilterOptions] =
      useState(["All Doctors"]);

  const { currentPage, totalPages, goToPage, setTotalPages } = usePagination();

  useEffect(() => {
      let active = true;
  
      const loadFilterOptions = async () => {
        try {
          const doctorResponse=await apiClient.get("/api/doctors/list");
  
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

        } catch (error) {
          if (active) {
            setDoctorFilterOptions([
              {
                label: "All Doctors",
                value: "",
                type: "",
              },
            ]);
  
            
          }
        }
      };
  
      loadFilterOptions();
  
      return () => {
        active = false;
      };
  }, []);

  const fetchAdmissions = async () => {
        setLoading(true);
        try {
          const data =
            await icuService.getAdmissions({
              searchTerm: search,
              doctorId: doctorFilter.doctorId,
              doctorType: doctorFilter.doctorType,
              admissionDate,
              status: statusFilter,
              admissionType: conditionFilter,
            });
 
            setAdmissions(data.admissions || []);
        } catch (error) {
          setAdmissions([]);
          console.log(error);          
        } finally {
            setLoading(false);
        }
  };

  useEffect(() => {
    fetchAdmissions();
  }, [search, doctorFilter.doctorId, doctorFilter.doctorType,goToPage, admissionDate, statusFilter, conditionFilter]);
  
  useEffect(() => {
    setTotalPages(
      Math.ceil(admissions.length / ITEMS_PER_PAGE) || 1
    );
    goToPage(1);
  }, [
    search,
    statusFilter,
    conditionFilter,
    admissionDate,
    setTotalPages,
    goToPage,
  ]);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedData = admissions.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );

  const columns = [
    {
      label: "Patient Details",
      headerClassName: "text-left pl-4",
      className: "pl-4 py-3",
      render: (item) => (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
            <span className="text-[#7C3AED] font-semibold text-[14px]">
              {item?.patient?.name.charAt(0)}
            </span>
          </div>

          <div>
            <p className="font-semibold text-[#343C6A]">
              {item?.patient?.name}
            </p>

            <p className="text-[11px] 2xl:text-[12px] text-[#8BA3CB]">
              MRN: {item?.patient?.patientId}
            </p>

            <p className="text-[11px] 2xl:text-[12px] text-[#8BA3CB] flex items-center gap-1">
              <Phone size={11} />
              {item?.patient?.mobileNumber}
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
        </div>
      ),
    },
    {
      label: "ICU / Bed",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
        <div>
          <p className="font-medium text-[#343C6A]">
            {item.ward} {item.room}
          </p>

          <p className="text-[12px] text-[#8BA3CB] flex items-center gap-1">
            <BedDouble size={12} />
            {item.currentBed}
          </p>
        </div>
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
            {formatTime(item.admissionTime)}
          </p>
        </div>
      ),
    },
    {
      label: "Type",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
        <span className={`text-[12px] font-medium py-1 rounded-full`}>
          {item.admissionType}
        </span>
      ),
    },
    {
      label: "Status",
      headerClassName: "text-left pl-4",
      className: "py-3 pl-4",
      render: (item) => (
        <span className={`text-[12px] font-medium px-2.5 py-1 rounded-full ${statusStyles[item.status]}`}>
          {item.status}
        </span>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-transparent p-1 flex flex-col gap-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
            ICU Admissions
          </h1>

          <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
            View and manage patients currently admitted to the ICU.
          </p>
        </div>

        {/* <Button
          onClick={() => navigate("/icu-admission/new")}
          className="text-white flex items-center justify-center gap-1 w-full sm:w-auto px-4 py-2 text-sm"
          style={{ backgroundColor: PRIMARY }}
        >
          <Plus size={16} />
          Admit Patient
        </Button> */}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row sm:flex-wrap gap-3 items-stretch">
        <div className="flex items-center border border-[#d3cccc] rounded-md px-3 py-2 gap-2 w-full sm:flex-1 sm:min-w-[250px] bg-white">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search patient by name, MRN, UHID, phone..."
            className="outline-none text-[14px] w-full min-w-0"
          />

          <Search size={16} className="text-gray-400 shrink-0" />
        </div>

        <div className="w-full sm:w-[calc(50%-6px)] lg:w-[16%]">
          <DoctorFilterDropdown
            options={doctorFilterOptions}
            value={doctorFilter}
            onChange={setDoctorFilter}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-6px)] lg:w-[17%]">
          <FilterDropdown
            options={[
              "All",
              "ACTIVE",
              "TRANSFERRED",
              "DISCHARGED",
              "CANCELLED",
              "TRANSFERRED_TO_IPD",
              "DISCHARGE_INITIATED",
            ]}
            value={statusFilter}
            onChange={setStatusFilter}
          />
        </div>

        <div className="w-full sm:w-[calc(50%-6px)] lg:w-[17%]">
          <FilterDropdown
            options={[
              "All",
              "DIRECT",
              "EMERGENCY",
              "PLANNED",
              "POST_OPERATIVE",
              "TRANSFER_FROM_IPD",
              "TRANSFER_FROM_OTHER_HOSPITAL"
            ]}
            value={conditionFilter}
            onChange={setConditionFilter}
          />
        </div>

        {/* <div className="w-full sm:w-[calc(50%-6px)] lg:w-[17%]">
          <FilterDropdown
            options={[
              "All ICU Units",
              "ICU - 1",
              "ICU - 2",
            ]}
            value={icuFilter}
            onChange={setIcuFilter}
          />
        </div> */}

        <div className="relative w-full sm:w-[calc(50%-6px)] lg:w-[18%]">
          <input
            type="date"
            value={admissionDate}
            onChange={(e) => setAdmissionDate(e.target.value)}
            className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] outline-none"
          />

          <Calendar
            size={14}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
          />
        </div>

        {/* <Button className="border border-[#d3cccc] flex items-center justify-center gap-1 bg-white text-[#343C6A] w-full sm:w-auto px-4 text-sm">
          <Filter size={14} />
          Filter
        </Button> */}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:flex bg-white rounded-lg border border-[#e5e5e5] flex-col overflow-x-auto">
        <table className="w-full min-w-[1000px]">
          <thead className="bg-[#F8F9FC]">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.label}
                  className={`text-[12px] font-semibold text-[#343C6A] py-3 ${column.headerClassName || "text-left"}`}
                >
                  {column.label}
                </th>
              ))}

              <th className="text-center text-[12px] font-semibold text-[#343C6A] py-3">
                Actions
              </th>
            </tr>
          </thead>

          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length + 1}
                  className="text-center py-10 text-sm text-[#8BA3CB]"
                >
                  No ICU admissions found.
                </td>
              </tr>
            ) : (
              paginatedData.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-[#f0f0f0] hover:bg-[#fafafa]"
                >
                  {columns.map((column) => (
                    <td key={column.label} className={column.className}>
                      {column.render(item)}
                    </td>
                  ))}

                  <td className="py-3">
                    <div className="flex items-center justify-center gap-1">
                      <button
                        type="button"
                        onClick={() => navigate(`/icu-admission/${item.patient.id}`)}
                        className="border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-1 px-2.5 py-1.5 text-[13px] rounded-md hover:bg-purple-50 transition"
                      >
                        <Eye size={14} />
                        View
                      </button>

                      <ActionDropdown
                        item={item}
                        navigate={navigate}
                      />
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

   
      <div className="lg:hidden flex flex-col gap-3">
        {paginatedData.length === 0 ? (
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-6 text-center text-sm text-[#8BA3CB]">
            No ICU admissions found.
          </div>
        ) : (
          paginatedData.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-[#e5e5e5] p-4 sm:p-5 flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                    <span className="text-[#7C3AED] font-semibold text-[14px]">
                      {item?.patient?.name.charAt(0)}
                    </span>
                  </div>

                  <div className="min-w-0">
                    <p className="font-semibold text-[#343C6A] truncate">
                      {item?.patient?.name}
                    </p>

                    <p className="text-[12px] text-[#8BA3CB]">
                      P-Id: {item?.patient?.patientId}
                    </p>

                    <p className="text-[10px] text-[#8BA3CB] flex items-center gap-1">
                      <Phone size={11} />
                      {item?.patient?.mobileNumber}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">

                  <ActionDropdown
                    item={item}
                    navigate={navigate}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 border-t border-[#f0f0f0] pt-4">
                <div>
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    Consulting Doctor
                  </p>

                  <p className="text-sm font-medium text-[#343C6A]">
                    {item.doctor}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    ICU / Bed
                  </p>

                  <p className="text-sm font-medium text-[#343C6A]">
                    {item.ward} {item.room} {item.currentBed}
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
                    {formatTime(item.admissionTime)}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    Admission Type
                  </p>

                  <p className="text-sm text-[#343C6A]">
                    {item.admissionType}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] text-[#8BA3CB] mb-1">
                    Status
                  </p>

                  <span className={`inline-block text-[11px] font-medium px-2.5 py-1 rounded-full ${statusStyles[item.status]}`}>
                    {item.status}
                  </span>
                </div>
              </div>

              <div className="border-t border-[#f0f0f0] pt-3 flex justify-end">
                <Button
                  onClick={() =>
                    navigate(`/icu-admission/${item.patient.id}`)
                  }
                  className="border border-[#d9d0f7] text-[#7C3AED] bg-white flex items-center justify-center gap-1 px-4 py-2 text-[13px]"
                >
                  <Eye size={14} />
                  View Details
                </Button>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 p-2 lg:px-4 bg-white rounded-lg border border-[#e5e5e5]">
        <span className="text-[12px] sm:text-[13px] text-[#8BA3CB]">
          Showing{" "}
          {admissions.length === 0
            ? 0
            : startIndex + 1}{" "}
          to{" "}
          {Math.min(
            startIndex + ITEMS_PER_PAGE,
            admissions.length
          )}{" "}
          of {admissions.length} admissions
        </span>

        {admissions.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            goToPage={goToPage}
          />
        )}
      </div>

      {/* Info */}
      <div className="flex items-start sm:items-center gap-2 bg-[#EEF2FF] text-[#4338CA] text-[12px] sm:text-[13px] p-3 rounded-lg">
        <Info size={16} className="shrink-0 mt-0.5 sm:mt-0" />

        <span>
          Click on <span className="font-semibold">View Details</span>{" "}
          to see complete ICU admission information.
        </span>
      </div>
    </div>
  );
};

export default ICUAdmission;