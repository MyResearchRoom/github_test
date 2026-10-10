import React, { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UploadCloud, CheckCircle2, ChevronDown, Search, X, UserRound } from "lucide-react";
import Button from "../../commonComponent/Button";
import { departmentOptions } from "../../data/admittedPatientData";
import apiClient from "../../api/apiClient";
import { ipdService } from "../../services/ipdService";
import { toast } from "react-toastify";
import { icuService } from "../../services/icuService";


const PRIMARY = "#521785";

const GENDER_OPTIONS = ["Male", "Female", "Other"];
const TYPE_OPTIONS = ["NORMAL", "MLC", "Other"];

const ADMISSIONTYPES_OPTIONS = [
          "DIRECT",
          "EMERGENCY",
          "PLANNED",
          "POST_OPERATIVE",
          "TRANSFER_FROM_IPD",
          "TRANSFER_FROM_OTHER_HOSPITAL"
];
const BLOOD_GROUP_OPTIONS = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

const normalizeGender = (value) => {
  if (!value) return "";
  const match = GENDER_OPTIONS.find(
    (option) => option.toLowerCase() === String(value).toLowerCase()
  );
  return match || value;
};

const calculateAgeYears = (dob) => {
  if (!dob) return "";
  const birthDate = new Date(dob);
  if (Number.isNaN(birthDate.getTime())) return "";
  const today = new Date();
  let years = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    years -= 1;
  }
  return years >= 0 ? String(years) : "";
};

const parseAgeYears = (value) => {
  if (value === null || value === undefined || value === "") return "";
  const match = String(value).match(/\d+/);
  return match ? match[0] : "";
};

const Dropdown = ({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select",
  disabled = false,
}) => (
  <div className="flex-1 w-full flex flex-col gap-1.5">
    <label className="text-[14px] font-medium text-[#343C6A]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full border border-[#d3cccc] rounded-md px-3 pr-9 py-2.5 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50 disabled:text-gray-400"
        disabled={disabled || options.length === 0}
      >
        <option value="">{placeholder}</option>

        {options.map((o) => {
          const option =
            typeof o === "string" ? { value: o, label: o } : o;

          return (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          );
        })}
      </select>

      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  </div>
);

const AdmitPatient = () => {
  const navigate = useNavigate();
  const [doctors, setDoctors] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [existingPatientId, setExistingPatientId] = useState(null);
  const [selectedPatientData, setSelectedPatientData] = useState(null);
  const [patientSearchTerm, setPatientSearchTerm] = useState("");
  const [patientResults, setPatientResults] = useState([]);
  const patientDropdownRef = useRef(null);
  const [patientName, setPatientName] = useState("");
  const [mobileNumber, setMobileNumber] = useState("");
  const [address, setAddress] = useState("");
  const [age, setAge] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [bloodGroup, setBloodGroup] = useState("");
  const [gender, setGender] = useState("");
  const [doctor, setDoctor] = useState("");
  const [ward, setWard] = useState("");
  const [room, setRoom] = useState("");
  const [bed, setBed] = useState("");
  const [reason, setReason] = useState("");
  const [admissionDateTime, setAdmissionDateTime] = useState("");
  const [advancePayment, setAdvancePayment] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [submitError, setSubmitError] = useState("");
  const [submitSuccess, setSubmitSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [admissionType, setAdmissionType] = useState("");

  const [type, setType] = useState("NORMAL");

  const selectedDoctor = doctors.find(
    (d) => String(d.id) === String(doctor)
  );

  const doctorOptions = doctors.map((d) => ({
    value: String(d.id),
    label: d.name,
  }));

  const wardOptions = Array.from(
    new Set(availableBeds.map((b) => b.wardName).filter(Boolean))
  );

  const selectedWardType = useMemo(() => {
      if (!ward) return "";
  
      const newward = availableBeds.find(
        (bed) => bed.wardName === ward
      );
  
      return newward?.wardType || "";
  }, [availableBeds, ward]);

  const roomOptions = useMemo(() => {
    if (!ward) return [];

    return Array.from(
      new Set(
        availableBeds
          .filter((b) => b.wardName === ward)
          .map((b) => b.roomNumber)
          .filter(Boolean)
      )
    ).map((roomNumber) => ({
      value: String(roomNumber),
      label: `Room ${roomNumber}`,
    }));
  }, [availableBeds, ward]);

  const bedOptions = useMemo(() => {
    if (!room) return [];

    return availableBeds
      .filter(
        (b) =>
          b.wardName === ward &&
          String(b.roomNumber) === String(room)
      )
      .map((b) => ({
        value: String(b.id),
        label: `${b.bedCode} (${b.bedType})`,
      }));
  }, [availableBeds, room, ward]);

  useEffect(() => {
    let active = true;

    const loadFormData = async () => {
      try {
        const [doctorResponse, transferOptions] = await Promise.all([
          apiClient.get("/api/doctors/list"),
          ipdService.getTransferOptions(),
        ]);

        if (!active) return;

        setDoctors(doctorResponse.data?.doctors || []);
        setAvailableBeds(transferOptions.availableBeds || []);
      } catch (error) {
        if (active)
          setSubmitError("Unable to load admission form data.");
      }
    };

    loadFormData();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!patientSearchTerm) {
      setPatientResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await apiClient.get(
          "/api/patients/patients-for-appointment",
          { params: { searchTerm: patientSearchTerm } }
        );

        setPatientResults(response?.data?.patients || []);
      } catch (error) {
        setPatientResults([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [patientSearchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        patientDropdownRef.current &&
        !patientDropdownRef.current.contains(event.target) &&
        event.target.type !== "search"
      ) {
        setPatientResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
    };
  }, []);

  useEffect(() => {
    if (dateOfBirth) {
      setAge(calculateAgeYears(dateOfBirth));
    } else if (!existingPatientId) {
      setAge("");
    }
  }, [dateOfBirth]);

  const handleSelectPatient = (p) => {
    setExistingPatientId(p.id);
    setSelectedPatientData(p);
    setPatientName(p.name || "");
    setMobileNumber(p.mobileNumber || "");
    setAddress(p.address || "");
    setDateOfBirth(
      p.dateOfBirth
        ? String(p.dateOfBirth).split("T")[0]
        : ""
    );
    setAge(
      calculateAgeYears(p.dateOfBirth) ||
        parseAgeYears(p.age)
    );
    setBloodGroup(p.bloodGroup || "");
    setGender(normalizeGender(p.gender));
    setPatientSearchTerm("");
    setPatientResults([]);
  };

  const handleClearPatient = () => {
    setExistingPatientId(null);
    setSelectedPatientData(null);
    setPatientName("");
    setMobileNumber("");
    setAddress("");
    setAge("");
    setDateOfBirth("");
    setBloodGroup("");
    setGender("");
  };

  const handleWardChange = (value) => {
    setWard(value);
    setRoom("");
    setBed("");
  };

  const handleRoomChange = (value) => {
    setRoom(value);
    setBed("");
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);

    if (!files.length) return;

    setUploadedFiles((prev) => {
      const remainingSlots = 5 - prev.length;

      if (remainingSlots <= 0) {
        toast.error("You can upload a maximum of 5 images.");
        return prev;
      }

      if (files.length > remainingSlots) {
        toast.error(
          `You can upload only ${remainingSlots} more image${
            remainingSlots > 1 ? "s" : ""
          }.`
        );

        return [...prev, ...files.slice(0, remainingSlots)];
      }

      return [...prev, ...files];
    });

    e.target.value = "";
  };

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    const missingFields = [];

    if (!patientName.trim()) missingFields.push("Patient Name");
    if (!mobileNumber.trim()) missingFields.push("Mobile Number");
    if (!address.trim()) missingFields.push("Address");
    if (!age) missingFields.push("Age");
    if (!dateOfBirth) missingFields.push("Date of Birth");
    if (!bloodGroup) missingFields.push("Blood Group");
    if (!gender) missingFields.push("Gender");
    if (!selectedDoctor) missingFields.push("Doctor");
    if (!ward) missingFields.push("Ward");
    if (!room) missingFields.push("Room");
    if (!bed) missingFields.push("Bed");
    if (!reason.trim()) missingFields.push("Admission Reason");
    if (!admissionDateTime)
      missingFields.push("Admission Date & Time");
    if (advancePayment === "")
      missingFields.push("Advance Payment");

    if (missingFields.length > 0) {
      setSubmitError(
        `Please fill: ${missingFields.join(", ")}`
      );
      return;
    }

    if (uploadedFiles.length > 5) {
      setSubmitError("You can upload a maximum of 5 images.");
      return;
    } 

    setSubmitting(true);

    try {

      const formData = new FormData();

      if (existingPatientId) {
        formData.append(
          "existingPatientId",
          existingPatientId
        );
      }

      formData.append(
        "patientName",
        patientName.trim()
      );

      formData.append(
        "mobileNumber",
        mobileNumber.trim()
      );

      formData.append(
        "address",
        address.trim()
      );

      formData.append("age", Number(age));
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("bloodGroup", bloodGroup);
      formData.append("gender", gender);
      formData.append("type",type);

      if(selectedWardType === "ICU"){
         formData.append("admissionType",admissionType);
      }

      formData.append("bedId", Number(bed));

      formData.append(
        "attendingDoctorName",
        selectedDoctor.type
      );

      formData.append(
        "attendingDoctorId",
        selectedDoctor.id
      );

      formData.append(
        "admissionReason",
        reason.trim()
      );

      formData.append(
        "admissionDate",
        admissionDateTime
      );

      formData.append(
        "advancePayment",
        Number(advancePayment || 0)
      );

      formData.append(
        "clinicalStatus",
        "Stable"
      );

      uploadedFiles.forEach((file) => {
        formData.append("documents", file);
      });

      let response;
      if(selectedWardType==="ICU"){
        response=await icuService.Admit(formData)
      } else{
        response= await ipdService.createAdmission(formData);
      }

      setSubmitSuccess(response?.message || "Patient admitted successfully.");


      setTimeout(
        () => navigate("/ipd/admissions"),
        6000
      );
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to admit patient."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();

    const files = Array.from(e.dataTransfer.files || []);

    setUploadedFiles((prev) => [...prev, ...files]);
  };

  return (
    <div className="h-full min-h-full bg-transparent p-1 lg:px-2 flex flex-col gap-4 ">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
          Admit Patient
        </h1>

        <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
          Fill in the details below to admit a new patient.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col gap-5 sm:gap-6 mb-6">
        {/* Existing Patient Search */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-[#343C6A]">
            Find Existing OPD Patient
          </label>

          <div
            className="relative"
            ref={patientDropdownRef}
          >
            <div className="relative">
              <input
                type="search"
                value={patientSearchTerm}
                onChange={(e) =>
                  setPatientSearchTerm(e.target.value)
                }
                placeholder="Search patient by name or mobile number"
                className="outline-none p-2.5 pl-9 w-full text-[14px] text-[#343C6A] placeholder:text-[#8BA3CB] rounded-md border border-[#d3cccc] focus:border-[#c4b2d3] bg-[#f2e2ff]"
              />

              <Search
                size={14}
                className="absolute top-1/2 -translate-y-1/2 left-3 text-[#343c6a]"
              />
            </div>

            {patientSearchTerm &&
              patientResults.length > 0 && (
                <div
                  className="max-h-[180px] h-auto border absolute z-10 top-12 rounded-md w-full text-[14px] bg-white cursor-pointer overflow-y-auto shadow-md"
                  style={{ scrollbarWidth: "none" }}
                >
                  {patientResults.map((p) => (
                    <p
                      key={p.id}
                      onClick={() =>
                        handleSelectPatient(p)
                      }
                      className="p-2 px-3 hover:bg-[#f2e2ff] text-[#343C6A]"
                    >
                      {p.name}, {p.mobileNumber}
                    </p>
                  ))}
                </div>
              )}

            {patientSearchTerm &&
              patientResults.length === 0 && (
                <div className="absolute z-10 top-12 rounded-md w-full text-[13px] bg-white border p-2 text-[#8BA3CB] shadow-md">
                  No patients found.
                </div>
              )}
          </div>

          {existingPatientId && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-2 mt-1 border rounded-md bg-[#f0fdf4] w-full">              <div className="flex items-center gap-3 min-w-0">
                <span className="p-2 bg-[#dbfce7] h-9 w-9 flex justify-center items-center rounded-full shrink-0">
                  <UserRound
                    size={16}
                    className="text-[#00a63e]"
                  />
                </span>

                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#343C6A] break-words">
                    {patientName}
                  </p>

                  <p className="text-[12px] text-gray-600 break-all">
                    {mobileNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleClearPatient}
                className="text-sm text-red-500 hover:underline flex items-center gap-1 shrink-0"
              >
                <X size={14} /> Clear
              </button>
            </div>
          )}
        </div>

        {/* Patient Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#343C6A]">
              Patient Name{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={patientName}
              onChange={(e) =>
                setPatientName(e.target.value)
              }
              placeholder="Enter patient name"
              disabled={
                !!existingPatientId &&
                !!selectedPatientData?.name
              }
              className="border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#343C6A]">
              Mobile Number{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="tel"
              value={mobileNumber}
              onChange={(e) =>
                setMobileNumber(e.target.value)
              }
              placeholder="Enter mobile number"
              disabled={
                !!existingPatientId &&
                !!selectedPatientData?.mobileNumber
              }
              className="border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#343C6A]">
              Admission Date &amp; Time{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="datetime-local"
              value={admissionDateTime}
              onChange={(e) =>
                setAdmissionDateTime(e.target.value)
              }
              className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
            />
          </div>
        </div>

        {/* DOB Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#343C6A]">
              Date of Birth{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="date"
              value={dateOfBirth}
              onChange={(e) =>
                setDateOfBirth(e.target.value)
              }
              max={new Date()
                .toISOString()
                .split("T")[0]}
              disabled={
                !!existingPatientId &&
                !!selectedPatientData?.dateOfBirth
              }
              className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#343C6A]">
              Age{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={age ? `${age} yrs` : ""}
              readOnly
              placeholder="Auto-calculated from DOB"
              className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none bg-gray-50 cursor-not-allowed"
            />
          </div>

          <Dropdown
            label="Gender"
            required
            value={gender}
            onChange={setGender}
            options={GENDER_OPTIONS}
            placeholder="Select Gender"
            disabled={
              !!existingPatientId &&
              !!normalizeGender(
                selectedPatientData?.gender
              )
            }
          />

          <Dropdown
            label="Blood Group"
            required
            value={bloodGroup}
            onChange={setBloodGroup}
            options={BLOOD_GROUP_OPTIONS}
            placeholder="Select Blood Group"
            disabled={
              !!existingPatientId &&
              !!selectedPatientData?.bloodGroup
            }
          />
        </div>

        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {/* Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-[14px] font-medium text-[#343C6A]">
              Address{" "}
              <span className="text-red-500">*</span>
            </label>

            <input
              type="text"
              value={address}
              onChange={(e) =>
                setAddress(e.target.value)
              }
              placeholder="Enter address"
              disabled={
                !!existingPatientId &&
                !!selectedPatientData?.address
              }
              className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none disabled:bg-gray-50 disabled:text-gray-400"
            />
          </div>
          {/* Doctor & Department */}
          <Dropdown
            label="Select Doctor"
            required
            value={doctor}
            onChange={(val) => {
              setDoctor(val);
            }}
            options={doctorOptions}
            placeholder="Select Doctor"
          />
        </div>

        {/* Admission Reason */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-[#343C6A]">
            Admission Reason{" "}
            <span className="text-red-500">*</span>
          </label>

          <textarea
            value={reason}
            onChange={(e) => {
              if (e.target.value.length <= 250)
                setReason(e.target.value);
            }}
            rows={2}
            placeholder="Enter admission reason"
            className="w-full border border-[#d3cccc] rounded-md p-3 text-[14px] text-[#343C6A] outline-none resize-none"
          />

          <span className="text-[12px] text-[#8BA3CB] text-right">
            {reason.length}/250
          </span>
        </div>

        {/* Ward Room Bed */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <Dropdown
            label="Ward Selection"
            required
            value={ward}
            onChange={handleWardChange}
            options={wardOptions}
            placeholder="Select Ward"
          />

          <Dropdown
            label="Room Selection"
            required
            value={room}
            onChange={handleRoomChange}
            options={roomOptions}
            placeholder={
              ward
                ? "Select Room"
                : "Select ward first"
            }
          />

          <div className="sm:col-span-2 lg:col-span-1">
            <Dropdown
              label="Bed Selection"
              required
              value={bed}
              onChange={setBed}
              options={bedOptions}
              placeholder={
                room
                  ? "Select Bed"
                  : "Select room first"
              }
            />
          </div>
        </div>

        {/* Advance Payment */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div className="w-full ">
            <label className="text-[14px] font-medium text-[#343C6A]">
              Advance Payment (&#8377;){" "}
              <span className="text-red-500">*</span>
            </label>

            <div className="relative">
              <input
                type="number"
                value={advancePayment}
                onChange={(e) =>
                  setAdvancePayment(e.target.value)
                }
                placeholder="Enter advance payment amount"
                className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 pr-8 text-[14px] text-[#343C6A] outline-none"
              />

              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                &#8377;
              </span>
            </div>
          </div>
          
          <Dropdown
              label="Admission type"
              required
              value={type}
              onChange={setType}
              options={TYPE_OPTIONS}
              placeholder="Select type"
          />

          {selectedWardType === "ICU" &&
            <Dropdown
                label="ICU Admission type"
                required
                value={admissionType}
                onChange={setAdmissionType}
                options={ADMISSIONTYPES_OPTIONS}
                placeholder="Select admission type"
            />
          }
        </div>
        {/* Upload Documents */}
        <div className="flex flex-col gap-1.5">
          <label className="text-[14px] font-medium text-[#343C6A]">
            Upload Admission Documents{" "}
            {/* <span className="text-red-500">*</span> */}
          </label>

          <div
            onDragOver={(e) =>
              e.preventDefault()
            }
            onDrop={handleDrop}
            className="border-2 border-dashed border-[#d9d0f7] rounded-lg py-8 sm:py-10 px-4 flex flex-col items-center justify-center gap-2 bg-[#FAFAFF] text-center"
          >
            <UploadCloud
              size={30}
              color={PRIMARY}
            />

            <p className="text-[13px] sm:text-[14px] text-[#343C6A]">
              Drag and drop files here, or{" "}
              <label
                htmlFor="admission-doc-upload"
                className="bg-white rounded-md cursor-pointer border p-1 font-bold"
                style={{ color: PRIMARY }}
              >
                click to browse
              </label>
            </p>

            <p className="text-[11px] sm:text-[12px] text-[#8BA3CB]">
              Supported formats: PDF, JPG, PNG
              (Max size: 5MB each) (Max file: 5)
            </p>

            <input
              id="admission-doc-upload"
              type="file"
              multiple
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>

          {uploadedFiles.length > 0 && (
            <div className="flex flex-col gap-1 mt-2">
              {uploadedFiles.map((f, i) => (
                <span
                  key={i}
                  className="text-[12px] text-[#343C6A] break-all"
                >
                  {f.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {(submitError || submitSuccess) && (
          <p
            className={`text-[13px] ${
              submitError
                ? "text-[#EF4444]"
                : "text-[#16A34A]"
            }`}
          >
            {submitError || submitSuccess}
          </p>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
          <Button
            onClick={() =>
              navigate("/ipd/admissions")
            }
            className="border border-[#d3cccc] bg-white text-[#343C6A] w-full sm:w-auto px-6 py-2.5"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-white flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5"
            style={{ backgroundColor: PRIMARY }}
          >
            <CheckCircle2 size={16} />
            {submitting
              ? "Admitting..."
              : "Admit Patient"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdmitPatient;





