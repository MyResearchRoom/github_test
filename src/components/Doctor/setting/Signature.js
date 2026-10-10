//final code with responsive
import React, { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Button from "../../../commonComponent/Button";
import { IoMdCloudUpload } from "react-icons/io";
import { useFetch } from "../../../hooks/useFetch";
import apiClient from "../../../api/apiClient";
import { DOCTOR, SUB_DOCTOR } from "../../../Constants";

export const FileUpload = ({ label, value, onChange, }) => {
  const inputRef = useRef();
  return (
    <div className="flex flex-col md:w-[50%] w-[100%] items-center border rounded-lg p-6 shadow hover:shadow-lg transition-shadow duration-200 cursor-pointer">
      <input
        type="file"
        ref={inputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => onChange(e.target.files[0])}
      />

      {/* Upload Box */}
      
        <div
          onClick={() => inputRef.current.click()}
          className="flex flex-col items-center justify-center gap-3 w-40 aspect-[4/3] bg-[#f0f4ff] rounded-lg border-2 border-dashed border-[#c0c7e1] hover:bg-[#e2e8ff] transition-colors duration-200"
        >
          <IoMdCloudUpload size={28} className="text-[#343C6A]" />
          <p className="text-[#343C6A] font-semibold text-sm text-center">
            Upload {label}
          </p>
          <p className="text-gray-500 text-xs">Click Here</p>
        </div>
      

      {/* Preview */}
      {value && (
        <div className="relative mt-4">
          <img
            src={value}
            alt={label}
            className="h-24 object-contain rounded shadow-sm transition-transform duration-200 hover:scale-105"
          />
        </div>
      )}
    </div>
  );
};
const Signature = () => {
  // ******************* add signature *************************


  const role = localStorage.getItem("role");
  const [signature, setSignature] = useState(null);
  const [logo, setLogo] = useState(null);

  const handleFileChange = async (file, type) => {
    if (!file) return;

    // event.target.value = "";

    const allowedTypes = ["image/jpeg"];

    if (!allowedTypes.includes(file.type)) {
      toast.error("Only JPG and JPEG images are allowed");
      return;
    }

    // size check
    if (file.size > 2 * 1024 * 1024) {
      toast.error("File size should be less than 2MB");
      return;
    }

    const formData = new FormData();
    formData.append(type, file);

    try {
      const response = await apiClient.post(
        `/api/doctors/add-${type}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        if (type === "signature") {
          setSignature(response.data?.signature);
        } else {
          setLogo(response.data?.logo);
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occurred");
    }
  };

  const { data: signatureData } = useFetch("/api/doctors/get-signature");
  useEffect(() => {
    if (signatureData?.signature) {
      setSignature(signatureData?.signature);
    }
  }, [signatureData]);

  const { data: logoData } = useFetch((role !== SUB_DOCTOR) && "/api/doctors/get-logo");
  useEffect(() => {
    if (logoData?.logo) {
      setLogo(logoData?.logo);
    }
  }, [logoData]);

  return (
    <>


      <div className="w-full bg-white shadow-md rounded-xl p-6 min-h-full h-auto">
  <div className="text-center mb-6">
    <h2 className="text-2xl font-semibold text-[#343C6A]">
      Upload Signature {role === DOCTOR && '& Logo'}
    </h2>
    <p className="text-sm text-[#343C6A] mt-2">
      Please upload your {role === DOCTOR && 'clinic logo and'} signature to generate valid
      prescriptions.
    </p>
  </div>

  <div className="flex md:flex-row flex-col justify-center   gap-6 mx-auto">
    {/* Signature Upload */}
    <FileUpload
      label="Signature"
      value={signature}
      onChange={(file) => handleFileChange(file, "signature")}
      onRemove={() => setSignature(null)}
    />

    {/* Logo Upload (Doctor only) */}
    {role === DOCTOR && (
      <FileUpload
        label="Logo"
        value={logo}
        onChange={(file) => handleFileChange(file, "logo")}
        onRemove={() => setLogo(null)}
      />
    )}
  </div>
</div>
    </>
  );
};

export default Signature;
