// import React, { useState } from "react";
// import { useLocation, useNavigate } from "react-router-dom";
// import { ArrowLeft, ChevronDown, CheckCircle2, UploadCloud } from "lucide-react";
// import Button from "../../commonComponent/Button";
// import { ipdService } from "../../services/ipdService"; // add createBirthCertificate here

// const PRIMARY = "#521785";

// const SEX_OPTIONS = ["Male", "Female", "Other"];

// const Dropdown = ({
//   label,
//   required,
//   value,
//   onChange,
//   options,
//   placeholder = "Select",
//   disabled = false,
// }) => (
//   <div className="flex-1 w-full flex flex-col gap-1.5">
//     <label className="text-[14px] font-medium text-[#343C6A]">
//       {label} {required && <span className="text-red-500">*</span>}
//     </label>

//     <div className="relative">
//       <select
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         className="appearance-none w-full border border-[#d3cccc] rounded-md px-3 pr-9 py-2.5 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50 disabled:text-gray-400"
//         disabled={disabled || options.length === 0}
//       >
//         <option value="">{placeholder}</option>
//         {options.map((o) => {
//           const option = typeof o === "string" ? { value: o, label: o } : o;
//           return (
//             <option key={option.value} value={option.value}>
//               {option.label}
//             </option>
//           );
//         })}
//       </select>

//       <ChevronDown
//         size={16}
//         className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
//       />
//     </div>
//   </div>
// );

// const SectionHeader = ({ title }) => (
//   <div className="flex items-center gap-2 pb-1 border-b border-[#F0F0F0]">
//     <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#343C6A]">{title}</h3>
//   </div>
// );

// const BirthCertificateForm = () => {
//   const navigate = useNavigate();
//   const { state } = useLocation();
//   const { admission } = state || {};

//   // Header
//   const [registrationAuthority, setRegistrationAuthority] = useState("");
//   const [registrationNumber, setRegistrationNumber] = useState("");
//   const [certificateIssueDate, setCertificateIssueDate] = useState("");

//   // Child details
//   const [childName, setChildName] = useState("");
//   const [dateOfBirth, setDateOfBirth] = useState("");
//   const [sex, setSex] = useState("");
//   const [placeOfBirth, setPlaceOfBirth] = useState(admission?.hospitalName || "");

//   // Parent details
//   const [fatherName, setFatherName] = useState("");
//   const [motherName, setMotherName] = useState(admission?.name || "");
//   const [parentsAddress, setParentsAddress] = useState(admission?.address || "");

//   // Registration details
//   const [dateOfRegistration, setDateOfRegistration] = useState("");
//   const [registrationUnit, setRegistrationUnit] = useState("");
//   const [district, setDistrict] = useState("");
//   const [stateName, setStateName] = useState("");

//   // Authentication
//   const [dateOfIssue, setDateOfIssue] = useState("");
//   const [registrarName, setRegistrarName] = useState("");
//   const [signatureFile, setSignatureFile] = useState(null);
//   const [sealFile, setSealFile] = useState(null);
//   const [verificationNumber, setVerificationNumber] = useState("");

//   const [submitError, setSubmitError] = useState("");
//   const [submitSuccess, setSubmitSuccess] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const handleSubmit = async () => {
//     setSubmitError("");
//     setSubmitSuccess("");

//     const missingFields = [];

//     if (!childName.trim()) missingFields.push("Name of Child");
//     if (!dateOfBirth) missingFields.push("Date of Birth");
//     if (!sex) missingFields.push("Sex");
//     if (!placeOfBirth.trim()) missingFields.push("Place of Birth");
//     if (!fatherName.trim()) missingFields.push("Father's Name");
//     if (!motherName.trim()) missingFields.push("Mother's Name");
//     if (!parentsAddress.trim()) missingFields.push("Parents' Address");
//     if (!registrationNumber.trim()) missingFields.push("Registration Number");
//     if (!dateOfRegistration) missingFields.push("Date of Registration");
//     if (!registrationUnit.trim()) missingFields.push("Registration Unit / Registrar Office");
//     if (!district.trim()) missingFields.push("District");
//     if (!stateName.trim()) missingFields.push("State");
//     if (!dateOfIssue) missingFields.push("Date of Issue");
//     if (!registrarName.trim()) missingFields.push("Registrar's Name");

//     if (missingFields.length > 0) {
//       setSubmitError(`Please fill: ${missingFields.join(", ")}`);
//       return;
//     }

//     setSubmitting(true);

//     try {
//       const formData = new FormData();

//       formData.append("admissionId", admission?.id || "");
//       formData.append("patientId", admission?.patientId || "");

//       formData.append("registrationAuthority", registrationAuthority.trim());
//       formData.append("registrationNumber", registrationNumber.trim());
//       formData.append("certificateIssueDate", certificateIssueDate);

//       formData.append("childName", childName.trim());
//       formData.append("dateOfBirth", dateOfBirth);
//       formData.append("sex", sex);
//       formData.append("placeOfBirth", placeOfBirth.trim());

//       formData.append("fatherName", fatherName.trim());
//       formData.append("motherName", motherName.trim());
//       formData.append("parentsAddress", parentsAddress.trim());

//       formData.append("dateOfRegistration", dateOfRegistration);
//       formData.append("registrationUnit", registrationUnit.trim());
//       formData.append("district", district.trim());
//       formData.append("state", stateName.trim());

//       formData.append("dateOfIssue", dateOfIssue);
//       formData.append("registrarName", registrarName.trim());
//       formData.append("verificationNumber", verificationNumber.trim());

//       if (signatureFile) formData.append("signature", signatureFile);
//       if (sealFile) formData.append("officialSeal", sealFile);

//       // TODO: point this at your actual endpoint once it exists
//       await ipdService.createBirthCertificate(formData);

//       setSubmitSuccess("Birth certificate saved successfully.");
//       setTimeout(() => navigate(-1), 600);
//     } catch (error) {
//       setSubmitError(
//         error?.response?.data?.message ||
//           error?.response?.data?.error ||
//           "Failed to save birth certificate."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="h-full min-h-full bg-transparent p-1 lg:px-2 flex flex-col gap-4">
//       <div>
//         <button
//           onClick={() => navigate(-1)}
//           className="flex items-center gap-1 text-[13px] sm:text-[14px] font-medium mb-2"
//           style={{ color: PRIMARY }}
//         >
//           <ArrowLeft size={16} />
//           Back
//         </button>

//         <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
//           Birth Certificate
//         </h1>

//         <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
//           Fill in the certificate details for issuing the birth certificate.
//         </p>
//       </div>

//       <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col gap-6 mb-6">

//         {/* Header section */}
//         <div className="flex flex-col gap-4">
//           <SectionHeader title="Header" />

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//             <div className="flex flex-col gap-1.5 sm:col-span-2">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Government / Local Registration Authority
//               </label>
//               <input
//                 type="text"
//                 value={registrationAuthority}
//                 onChange={(e) => setRegistrationAuthority(e.target.value)}
//                 placeholder="e.g. Municipal Corporation of ..."
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Certificate / Issue Date
//               </label>
//               <input
//                 type="date"
//                 value={certificateIssueDate}
//                 onChange={(e) => setCertificateIssueDate(e.target.value)}
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Child details */}
//         <div className="flex flex-col gap-4">
//           <SectionHeader title="Child Details" />

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
//             <div className="flex flex-col gap-1.5 lg:col-span-2">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Name of Child <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={childName}
//                 onChange={(e) => setChildName(e.target.value)}
//                 placeholder="Enter child's name"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Date of Birth <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={dateOfBirth}
//                 onChange={(e) => setDateOfBirth(e.target.value)}
//                 max={new Date().toISOString().split("T")[0]}
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <Dropdown
//               label="Sex"
//               required
//               value={sex}
//               onChange={setSex}
//               options={SEX_OPTIONS}
//               placeholder="Select Sex"
//             />
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-[14px] font-medium text-[#343C6A]">
//               Place of Birth <span className="text-red-500">*</span>
//             </label>
//             <input
//               type="text"
//               value={placeOfBirth}
//               onChange={(e) => setPlaceOfBirth(e.target.value)}
//               placeholder="Hospital / institution name and address"
//               className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//             />
//           </div>
//         </div>

//         {/* Parent details */}
//         <div className="flex flex-col gap-4">
//           <SectionHeader title="Parent Details" />

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Father's Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={fatherName}
//                 onChange={(e) => setFatherName(e.target.value)}
//                 placeholder="Full name as usually written"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Mother's Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={motherName}
//                 onChange={(e) => setMotherName(e.target.value)}
//                 placeholder="Full name as usually written"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>
//           </div>

//           <div className="flex flex-col gap-1.5">
//             <label className="text-[14px] font-medium text-[#343C6A]">
//               Parents' Address <span className="text-red-500">*</span>
//             </label>
//             <textarea
//               value={parentsAddress}
//               onChange={(e) => setParentsAddress(e.target.value)}
//               rows={2}
//               placeholder="Enter parents' address"
//               className="w-full border border-[#d3cccc] rounded-md p-3 text-[14px] text-[#343C6A] outline-none resize-none"
//             />
//           </div>
//         </div>

//         {/* Registration details */}
//         <div className="flex flex-col gap-4">
//           <SectionHeader title="Registration Details" />

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Registration Number <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={registrationNumber}
//                 onChange={(e) => setRegistrationNumber(e.target.value)}
//                 placeholder="Enter registration number"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Date of Registration <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={dateOfRegistration}
//                 onChange={(e) => setDateOfRegistration(e.target.value)}
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Registration Unit / Registrar Office <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={registrationUnit}
//                 onChange={(e) => setRegistrationUnit(e.target.value)}
//                 placeholder="Enter registrar office"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 District <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={district}
//                 onChange={(e) => setDistrict(e.target.value)}
//                 placeholder="Enter district"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 State <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={stateName}
//                 onChange={(e) => setStateName(e.target.value)}
//                 placeholder="Enter state"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>
//           </div>
//         </div>

//         {/* Authentication */}
//         <div className="flex flex-col gap-4">
//           <SectionHeader title="Authentication" />

//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Date of Issue <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="date"
//                 value={dateOfIssue}
//                 onChange={(e) => setDateOfIssue(e.target.value)}
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Registrar's Name <span className="text-red-500">*</span>
//               </label>
//               <input
//                 type="text"
//                 value={registrarName}
//                 onChange={(e) => setRegistrarName(e.target.value)}
//                 placeholder="Enter registrar's name"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>

//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">
//                 Certificate Verification Number{" "}
//                 <span className="text-[#8BA3CB] text-[12px]">(optional)</span>
//               </label>
//               <input
//                 type="text"
//                 value={verificationNumber}
//                 onChange={(e) => setVerificationNumber(e.target.value)}
//                 placeholder="Auto-generated if left blank"
//                 className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none"
//               />
//             </div>
//           </div>

//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
//             {/* Signature upload */}
//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">Signature</label>
//               <label
//                 htmlFor="signature-upload"
//                 className="border-2 border-dashed border-[#d9d0f7] rounded-lg py-5 px-4 flex flex-col items-center justify-center gap-1.5 bg-[#FAFAFF] text-center cursor-pointer"
//               >
//                 <UploadCloud size={22} color={PRIMARY} />
//                 <p className="text-[12px] text-[#343C6A]">
//                   {signatureFile ? signatureFile.name : "Upload signature image"}
//                 </p>
//                 <input
//                   id="signature-upload"
//                   type="file"
//                   accept=".jpg,.jpeg,.png"
//                   onChange={(e) => setSignatureFile(e.target.files?.[0] || null)}
//                   className="hidden"
//                 />
//               </label>
//             </div>

//             {/* Official seal upload */}
//             <div className="flex flex-col gap-1.5">
//               <label className="text-[14px] font-medium text-[#343C6A]">Official Seal</label>
//               <label
//                 htmlFor="seal-upload"
//                 className="border-2 border-dashed border-[#d9d0f7] rounded-lg py-5 px-4 flex flex-col items-center justify-center gap-1.5 bg-[#FAFAFF] text-center cursor-pointer"
//               >
//                 <UploadCloud size={22} color={PRIMARY} />
//                 <p className="text-[12px] text-[#343C6A]">
//                   {sealFile ? sealFile.name : "Upload seal/stamp image"}
//                 </p>
//                 <input
//                   id="seal-upload"
//                   type="file"
//                   accept=".jpg,.jpeg,.png"
//                   onChange={(e) => setSealFile(e.target.files?.[0] || null)}
//                   className="hidden"
//                 />
//               </label>
//             </div>
//           </div>

//           <p className="text-[12px] text-[#8BA3CB]">
//             QR code for certificate verification will be generated automatically on the
//             printed certificate using the verification number above.
//           </p>
//         </div>

//         {(submitError || submitSuccess) && (
//           <p className={`text-[13px] ${submitError ? "text-[#EF4444]" : "text-[#16A34A]"}`}>
//             {submitError || submitSuccess}
//           </p>
//         )}

//         <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">
//           <Button
//             onClick={() => navigate(-1)}
//             className="border border-[#d3cccc] bg-white text-[#343C6A] w-full sm:w-auto px-6 py-2.5"
//           >
//             Cancel
//           </Button>

//           <Button
//             onClick={handleSubmit}
//             disabled={submitting}
//             className="text-white flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5"
//             style={{ backgroundColor: PRIMARY }}
//           >
//             <CheckCircle2 size={16} />
//             {submitting ? "Saving..." : "Save Birth Certificate"}
//           </Button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default BirthCertificateForm;

import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ChevronDown,
  CheckCircle2,
} from "lucide-react";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";
import { patientService } from "../../services/patientService";
import { toast } from "react-toastify";

const PRIMARY = "#521785";

const SEX_OPTIONS = ["Male", "Female", "Other"];

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
      {label}{" "}
      {required && <span className="text-red-500">*</span>}
    </label>

    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled || options.length === 0}
        className="appearance-none w-full border border-[#d3cccc] rounded-md px-3 pr-9 py-2.5 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50 disabled:text-gray-400"
      >
        <option value="">{placeholder}</option>

        {options.map((option) => {
          const item =
            typeof option === "string"
              ? { value: option, label: option }
              : option;

          return (
            <option key={item.value} value={item.value}>
              {item.label}
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

const SectionHeader = ({ title }) => (
  <div className="flex items-center gap-2 pb-1 border-b border-[#F0F0F0]">
    <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#343C6A]">
      {title}
    </h3>
  </div>
);

const BirthCertificateForm = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { admission } = state || {};

  const patient = admission?.patient||{};

  const motherPatientId =
    patient?.id ||
    admission?.patientId ||
    null;

  const [motherName, setMotherName] = useState(patient?.name || "");

  const [motherNationality, setMotherNationality] = useState("");

  const [motherReligion, setMotherReligion] = useState("");

  const [presentAddress, setPresentAddress] = useState(
    patient?.address || ""
  );

  const [permanentAddress, setPermanentAddress] = useState(patient?.address ||"");

  const [fatherName, setFatherName] = useState("");

  const [fatherNationality, setFatherNationality] = useState("");

  const [fatherReligion, setFatherReligion] = useState("");

  const [babyName, setBabyName] = useState("");

  const [babySex, setBabySex] = useState("");

  const [babyBloodGroup, setBabyBloodGroup] = useState("");

  const [babyDateOfBirth, setBabyDateOfBirth] = useState("");

  const [babyTimeOfBirth, setBabyTimeOfBirth] = useState("");

  const [babyWeight, setBabyWeight] = useState("");

  const [submitError, setSubmitError] = useState("");

  const [submitSuccess, setSubmitSuccess] = useState("");

  const [submitting, setSubmitting] = useState(false);

  const [exists, setExists] = useState(false);

  const [certificateId, setCertificateId] = useState(null);

  const inputClass =
    "w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] outline-none focus:border-[#521785]";

  useEffect(() => {
    if (!motherPatientId) return;

    const fetchBirthCertificate = async () => {
      setSubmitError("");

      try {
        const response =
          await patientService.getBirthCertificate(motherPatientId);

        const certificate = response?.data;

        if (!certificate) {
          setSubmitError(
            "Birth certificate data not found."
          );
          return;
        }
        
        setExists(true);

        setCertificateId(certificate.id);

        setMotherName(
          certificate.motherName || ""
        );

        setMotherNationality(
          certificate.motherNationality || ""
        );

        setMotherReligion(
          certificate.motherReligion || ""
        );

        setPresentAddress(
          certificate.presentAddress || ""
        );

        setPermanentAddress(
          certificate.permanentAddress || ""
        );


        setFatherName(
          certificate.fatherName || ""
        );

        setFatherNationality(
          certificate.fatherNationality || ""
        );

        setFatherReligion(
          certificate.fatherReligion || ""
        );


        setBabyName(
          certificate.babyName || ""
        );

        setBabySex(
          certificate.babySex || ""
        );

        setBabyBloodGroup(
          certificate.babyBloodGroup || ""
        );

        setBabyDateOfBirth(
          certificate.babyDateOfBirth
            ? String(certificate.babyDateOfBirth).slice(
                0,
                10
              )
            : ""
        );

        setBabyTimeOfBirth(
          certificate.babyTimeOfBirth
            ? String(certificate.babyTimeOfBirth).slice(
                0,
                5
              )
            : ""
        );

        setBabyWeight(
          certificate.babyWeight !== null &&
          certificate.babyWeight !== undefined
            ? String(certificate.babyWeight)
            : ""
        );
      } catch (error) {
        console.error(
          "Get birth certificate error:",
          error
        );

        setExists(false);
        setCertificateId(null);

        setSubmitError(
          error?.response?.data?.message ||
            "Failed to load birth certificate."
        );
      }
    };

    fetchBirthCertificate();
  }, [motherPatientId]);

  const handleSubmit = async () => {
    setSubmitError("");
    setSubmitSuccess("");

    const missingFields = [];

    if (!motherPatientId) {
      missingFields.push("Mother Patient Id");
    }

    if (!motherName.trim()) {
      missingFields.push("Mother's Name");
    }

    if (!fatherName.trim()) {
      missingFields.push("Father's Name");
    }

    if (!babyName.trim()) {
      missingFields.push("Baby's Name");
    }

    if (!babySex) {
      missingFields.push("Baby's Sex");
    }

    if (!babyDateOfBirth) {
      missingFields.push("Baby's Date of Birth");
    }

    if (!babyTimeOfBirth) {
      missingFields.push("Baby's Time of Birth");
    }

    if (missingFields.length > 0) {
      setSubmitError(
        `Please fill: ${missingFields.join(", ")}`
      );
      return;
    }

    setSubmitting(true);

    try {
      
      const payload = {
        motherPatientId,

        motherName: motherName.trim(),

        fatherName: fatherName.trim(),

        babyName: babyName.trim(),

        babySex,

        babyBloodGroup:
          babyBloodGroup.trim() || null,

        babyDateOfBirth,

        babyTimeOfBirth,

        babyWeight:
          babyWeight !== ""
            ? Number(babyWeight)
            : null,

        motherNationality:
          motherNationality.trim() || null,

        motherReligion:
          motherReligion.trim() || null,

        fatherNationality:
          fatherNationality.trim() || null,

        fatherReligion:
          fatherReligion.trim() || null,

        presentAddress:
          presentAddress.trim() || null,

        permanentAddress:
          permanentAddress.trim() || null,
      };

      console.log(
        "Birth certificate payload:",
        payload
      );

      console.log("certificateId",certificateId);
      

      const res= (exists && certificateId) 
                ? await patientService.updateBirthCertificate(payload,certificateId)
                : await patientService.createBirthCertificate(payload);

      toast.success(res.message || "Birth certificate created successfully.");

      setSubmitSuccess(
        res.message || "Birth certificate created successfully."
      );

      setTimeout(() => {
        navigate(-1);
      }, 6000);
    } catch (error) {
      console.error(
        "Create birth certificate error:",
        error
      );

      setSubmitError(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to create birth certificate."
      );
    } finally {
      setSubmitting(false);
    }
  };

  if (!admission) {
    return (
      <div className="p-4">
        <div className="bg-white border border-red-200 rounded-lg p-5">
          <p className="text-red-500 text-sm">
            Patient admission details are not available.
          </p>

          <Button
            onClick={() => navigate(-1)}
            className="mt-4 border border-[#d3cccc] bg-white text-[#343C6A]"
          >
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full min-h-full bg-transparent p-1 lg:px-2 flex flex-col gap-4">


      <div>
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-[13px] sm:text-[14px] font-medium mb-2"
          style={{ color: PRIMARY }}
        >
          <ArrowLeft size={16} />
          Back
        </button>

        <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
          Birth Certificate
        </h1>

        <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
          Enter the newborn and parent details to create
          the birth certificate.
        </p>
      </div>

      <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 lg:p-6 flex flex-col gap-6 mb-6">


        <div className="flex flex-col gap-4">

          <SectionHeader title="Mother / Patient Details" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">


            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Patient ID
              </label>

              <input
                type="text"
                value={
                  patient?.patientId ||
                  admission?.mrn ||
                  ""
                }
                disabled
                className={`${inputClass} bg-gray-50 text-gray-500`}
              />
            </div>


            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Mother's Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={motherName}
                onChange={(e) =>
                  setMotherName(e.target.value)
                }
                placeholder="Enter mother's name"
                className={inputClass}
              />
            </div>


            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Mother's Nationality
              </label>

              <input
                type="text"
                value={motherNationality}
                onChange={(e) =>
                  setMotherNationality(e.target.value)
                }
                placeholder="Enter nationality"
                className={inputClass}
              />
            </div>


            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Mother's Religion
              </label>

              <input
                type="text"
                value={motherReligion}
                onChange={(e) =>
                  setMotherReligion(e.target.value)
                }
                placeholder="Enter religion"
                className={inputClass}
              />
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-4">

          <SectionHeader title="Father Details" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Father's Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={fatherName}
                onChange={(e) =>
                  setFatherName(e.target.value)
                }
                placeholder="Enter father's name"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Father's Nationality
              </label>

              <input
                type="text"
                value={fatherNationality}
                onChange={(e) =>
                  setFatherNationality(e.target.value)
                }
                placeholder="Enter nationality"
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Father's Religion
              </label>

              <input
                type="text"
                value={fatherReligion}
                onChange={(e) =>
                  setFatherReligion(e.target.value)
                }
                placeholder="Enter religion"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Present Address
              </label>

              <textarea
                value={presentAddress}
                onChange={(e) =>
                  setPresentAddress(e.target.value)
                }
                rows={2}
                placeholder="Enter present address"
                className={`${inputClass} resize-none`}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Permanent Address
              </label>

              <textarea
                value={permanentAddress}
                onChange={(e) =>
                  setPermanentAddress(e.target.value)
                }
                rows={2}
                placeholder="Enter permanent address"
                className={`${inputClass} resize-none`}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">

          <SectionHeader title="Baby Details" />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">

            {/* Baby Name */}

            <div className="flex flex-col gap-1.5 lg:col-span-2">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Baby's Name{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="text"
                value={babyName}
                onChange={(e) =>
                  setBabyName(e.target.value)
                }
                placeholder="Enter baby's name"
                className={inputClass}
              />
            </div>

            {/* Sex */}

            <Dropdown
              label="Baby's Sex"
              required
              value={babySex}
              onChange={setBabySex}
              options={SEX_OPTIONS}
              placeholder="Select Sex"
            />

            {/* Blood Group */}

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Baby's Blood Group
              </label>

              <input
                type="text"
                value={babyBloodGroup}
                onChange={(e) =>
                  setBabyBloodGroup(e.target.value)
                }
                placeholder="e.g. A+"
                className={inputClass}
              />
            </div>

            {/* Date of Birth */}

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Date of Birth{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="date"
                value={babyDateOfBirth}
                onChange={(e) =>
                  setBabyDateOfBirth(e.target.value)
                }
                max={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                className={inputClass}
              />
            </div>

            {/* Time of Birth */}

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Time of Birth{" "}
                <span className="text-red-500">*</span>
              </label>

              <input
                type="time"
                value={babyTimeOfBirth}
                onChange={(e) =>
                  setBabyTimeOfBirth(e.target.value)
                }
                className={inputClass}
              />
            </div>

            {/* Weight */}

            <div className="flex flex-col gap-1.5">
              <label className="text-[14px] font-medium text-[#343C6A]">
                Baby Weight
              </label>

              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={babyWeight}
                  onChange={(e) =>
                    setBabyWeight(e.target.value)
                  }
                  placeholder="e.g. 3.25"
                  className={`${inputClass} pr-14`}
                />

                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[12px] text-gray-400">
                  kg
                </span>
              </div>
            </div>
          </div>
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


        <div className="flex flex-col-reverse sm:flex-row justify-end gap-3">

          <Button
            onClick={() => navigate(-1)}
            disabled={submitting}
            className="border border-[#d3cccc] bg-white text-[#343C6A] w-full sm:w-auto px-6 py-2.5"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={submitting}
            className="text-white flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-2.5"
            style={{
              backgroundColor: PRIMARY,
            }}
          >
            <CheckCircle2 size={16} />

            {submitting
              ? "Saving..."
              : exists ? "Update details" : "Save Birth Certificate"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BirthCertificateForm;
