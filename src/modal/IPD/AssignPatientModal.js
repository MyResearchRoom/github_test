import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { X, UserRound } from "lucide-react";
import { FaMagnifyingGlass } from "react-icons/fa6";
import Button from "../../commonComponent/Button";
import apiClient from "../../api/apiClient";
import { toast } from "react-toastify";
import { bedService } from "../../services/bedService";

const AssignPatientModal = ({ isOpen, onClose, onAssign, bed }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [patients, setPatients] = useState([]);
  const [patient, setPatient] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setSearchTerm("");
      setPatients([]);
      setPatient({});
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchTerm) {
      setPatients([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const response = await apiClient.get(
          "/api/patients/patients-for-appointment",
          { params: { searchTerm } }
        );
        setPatients(response?.data?.patients || []);
      } catch (error) {
        setPatients([]);
      }
    }, 400);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        event.target.type !== "search"
      ) {
        setPatients([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!patient?.id) return;

    setSubmitting(true);
    // try {
    //   await onAssign(bed, patient.id);
    //   onClose();
    // } finally {
    //   setSubmitting(false);
    // }
    try {
      const response=await bedService.assignPatient(bed.id, patient.id);
      toast.success(response?.message || "Patient assign succesfullyy");
    
      await onAssign();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          "Failed to assign patient to bed."
      );

    }
    finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            Assign Patient to {bed?.bedCode}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Patient
            </label>

            <div className="relative" ref={dropdownRef}>
              <div className="relative">
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search patient by name or mobile"
                  className="outline-none p-2 pl-8 w-full text-[14px] text-[#343C6A] placeholder:text-[#8BA3CB] rounded-md border border-[#d3cccc] focus:border-[#c4b2d3] bg-[#f2e2ff]"
                />
                <FaMagnifyingGlass
                  size={14}
                  color="#343c6a"
                  className="absolute top-1/2 -translate-y-1/2 left-3"
                />
              </div>

              {searchTerm && patients.length > 0 && (
                <div
                  className="max-h-[180px] h-auto border absolute z-10 top-11 rounded-md w-full text-[14px] bg-white cursor-pointer overflow-y-auto shadow-md"
                  style={{ scrollbarWidth: "none" }}
                >
                  {patients.map((p) => (
                    <p
                      key={p.id}
                      onClick={() => {
                        setPatient(p);
                        setSearchTerm("");
                        setPatients([]);
                      }}
                      className="p-2 px-3 hover:bg-[#f2e2ff] text-[#343C6A]"
                    >
                      {p.name}, {p.mobileNumber}
                    </p>
                  ))}
                </div>
              )}

              {searchTerm && patients.length === 0 && (
                <div className="absolute z-10 top-11 rounded-md w-full text-[13px] bg-white border p-2 text-[#8BA3CB] shadow-md">
                  No patients found.
                </div>
              )}
            </div>

            {Object.keys(patient).length > 0 && (
              <div className="flex items-center justify-between p-2 mt-2 border rounded-md bg-[#f0fdf4] w-full">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-[#dbfce7] h-9 w-9 flex justify-center items-center rounded-full">
                    <UserRound size={16} className="text-[#00a63e]" />
                  </span>
                  <div>
                    <p className="text-[14px] font-semibold text-[#343C6A]">
                      {patient.name}
                    </p>
                    <p className="text-[12px] text-gray-600">
                      {patient.mobileNumber}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPatient({})}
                  className="text-sm text-red-500 hover:underline"
                >
                  ✕
                </button>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={onClose}
              className="border border-[#d3cccc] bg-white text-[#343C6A] w-auto px-4 py-2"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!patient?.id || submitting}
              className="bg-[#521785] text-white w-auto px-4 py-2 disabled:opacity-50"
            >
              {submitting ? "Assigning..." : "Assign"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AssignPatientModal;