import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Calendar, Loader2 } from "lucide-react";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";
import { useAuth } from "../../context/AuthContext";

const formatAdmissionDate = (dateString) => {
  if (!dateString) return "";

  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
    return dateString;
  }


  const parts = String(dateString).trim().split(/\s+/);

  if (parts.length === 3) {
    const [day, month, year] = parts;

    const months = {
      Jan: "01",
      Feb: "02",
      Mar: "03",
      Apr: "04",
      May: "05",
      Jun: "06",
      Jul: "07",
      Aug: "08",
      Sep: "09",
      Oct: "10",
      Nov: "11",
      Dec: "12",
    };

    if (months[month]) {
      return `${year}-${months[month]}-${day.padStart(2, "0")}`;
    }
  }

  const date = new Date(dateString);

  if (!isNaN(date.getTime())) {
    return date.toISOString().split("T")[0];
  }

  return "";
};

const statusOptions = ["Stable", "Under Treatment", "Critical"];

const initialForm = {
  status: "Stable",
  heading: "",
  description: "",
  doctorKey: "",
  date: "",
};

const makeDoctorKey = (doctor) => `${doctor.type}:${doctor.id}`;

// Decode JWT payload without requiring an additional package
const getUserFromToken = (token) => {
  try {
    if (!token) return null;

    const payload = token.split(".")[1];
    if (!payload) return null;

    const decodedPayload = JSON.parse(
      atob(payload.replace(/-/g, "+").replace(/_/g, "/"))
    );

    return decodedPayload;
  } catch (error) {
    console.error("Failed to decode authentication token:", error);
    return null;
  }
};

// editingSection: pass the existing section object to edit it, or null to add a new one.
const AddSectionModal = ({ isOpen, onClose, onSave, editingSection ,admissionDate}) => {
  console.log("admissionDate",admissionDate);
  
  const { role, token } = useAuth();

  const [form, setForm] = useState(initialForm);
  const [doctors, setDoctors] = useState([]);
  const [doctorsLoading, setDoctorsLoading] = useState(false);
  const [doctorsError, setDoctorsError] = useState("");

  const isSubDoctor = role === "subDoctor";

  useEffect(() => {
    if (!isOpen) return;

   const initializeForm = async () => {
  setDoctorsError("");
  setDoctorsLoading(true);

  try {
    // ==========================================
    // SUBDOCTOR
    // ==========================================
    if (isSubDoctor) {
      const loggedInUser = getUserFromToken(token);

      if (!loggedInUser?.id) {
        setDoctorsError("Unable to identify the logged-in SubDoctor.");
        return;
      }

      const res = await ipdService.getSubDoctorById(loggedInUser.id);

      const subDoctor = {
        id: res?.data?.id,
        name: res?.data?.name,
        specialization: res?.data?.specialization,
        type: "subDoctor",
      };

      setDoctors([subDoctor]);

      // EDIT MODE
      if (editingSection) {
        setForm({
          status: editingSection.status,
          heading: editingSection.heading,
          description: editingSection.description,
          doctorKey: `subDoctor:${res.data.id}`,
          date: editingSection.date || "",
        });
      } 
      // ADD MODE
      else {
        setForm({
          ...initialForm,
          doctorKey: `subDoctor:${res.data.id}`,
        });
      }

      return;
    }

    // ==========================================
    // DOCTOR / ADMIN DOCTOR
    // ==========================================
    const res = await ipdService.getDoctors();
    setDoctors(res?.doctors || []);

    // EDIT MODE
    if (editingSection) {
      setForm({
        status: editingSection.status,
        heading: editingSection.heading,
        description: editingSection.description,
        doctorKey:
          editingSection.doctorId && editingSection.doctorType
            ? `${editingSection.doctorType}:${editingSection.doctorId}`
            : "",
        date: editingSection.date || "",
      });
    } 
    // ADD MODE
    else {
      setForm(initialForm);
    }
  } catch (err) {
    setDoctorsError(
      err?.response?.data?.message ||
        err?.response?.data?.error ||
        (isSubDoctor
          ? "Failed to load your profile."
          : "Failed to load doctors.")
    );
  } finally {
    setDoctorsLoading(false);
  }
    };

    initializeForm();
  }, [isOpen, editingSection, isSubDoctor, token]);

  if (!isOpen) return null;

  const selectedDoctor = doctors.find(
    (d) => makeDoctorKey(d) === form.doctorKey
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (
      !form.heading.trim() ||
      !form.description.trim() ||
      !form.doctorKey ||
      !form.date
    ) {
      return;
    }

    const [doctorType, doctorId] = form.doctorKey.split(":");

    onSave({
      status: form.status,
      heading: form.heading.trim(),
      description: form.description.trim(),
      doctorId,
      doctorType,
      doctorName: selectedDoctor?.name || "",
      date: form.date,
    });

    setForm(initialForm);
    onClose();
  };

  const handleClose = () => {
    setForm(initialForm);
    setDoctors([]);
    setDoctorsError("");
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            {editingSection ? "Edit Clinical Notes" : "Add Clinical Notes"}
          </h2>

          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {doctorsError && (
            <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-3 py-2">
              {doctorsError}
            </div>
          )}

          {/* Doctor */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Doctor
            </label>

            <div className="relative">
              <select
                name="doctorKey"
                value={form.doctorKey}
                onChange={handleChange}
                className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50 disabled:cursor-not-allowed"
                required
                disabled={doctorsLoading || isSubDoctor}
              >
                <option value="" disabled>
                  {doctorsLoading
                    ? "Loading doctors..."
                    : isSubDoctor
                    ? "SubDoctor"
                    : "Select doctor"}
                </option>

                {doctors.map((d) => (
                  <option key={makeDoctorKey(d)} value={makeDoctorKey(d)}>
                    {d.name}
                    {d.specialization ? ` (${d.specialization})` : ""}
                  </option>
                ))}
              </select>

              {doctorsLoading ? (
                <Loader2
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin"
                />
              ) : (
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              )}
            </div>

            {/* Only show this message for normal Doctor login */}
            {!isSubDoctor &&
              !doctorsLoading &&
              doctors.length === 0 &&
              !doctorsError && (
                <p className="text-[12px] text-[#8BA3CB]">
                  No doctors found.
                </p>
              )}
          </div>

          {/* Date */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Date
            </label>

            <div className="relative">
              <input
                type="date"
                name="date"
                // min={formatAdmissionDate(admissionDate)}
                value={form.date}
                onChange={handleChange}
                className="w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] outline-none"
                required
              />

              <Calendar
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Status */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Status
            </label>

            <div className="relative">
              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                required
              >
                {statusOptions.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          {/* Heading */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Heading
            </label>

            <input
              name="heading"
              value={form.heading}
              onChange={handleChange}
              placeholder="e.g. Initial Diagnosis"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          {/* Description */}
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Description
            </label>

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Write the detailed summary here..."
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md p-3 resize-none"
              required
            />
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="border border-[#d3cccc] bg-white text-[#343C6A] w-auto px-4 py-2"
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-[#521785] text-white w-auto px-4 py-2"
            >
              {editingSection ? "Save Changes" : "Add Clinical Notes"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddSectionModal;
