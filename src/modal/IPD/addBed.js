import React, { useState, useMemo, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import Button from "../../commonComponent/Button";
import { bedTypeFilterOptions, statusFilterOptions } from "../../data/bedData";

const bedTypeChoices = bedTypeFilterOptions.filter(
  (t) => t !== "All Bed Types"
);
const statusChoices = statusFilterOptions.filter((s) => s !== "All Status");

const initialForm = {
  wardId: "",
  roomNumber: "",
  bedCode: "",
  bedType: bedTypeChoices[0] || "",
  pricePerDay: "",
  status: "available",
  patientId: "",
};

const AddBedModal = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editingBed,
  editingGroup,
  wardRoomOptions = [],
  admittedPatients = [],
}) => {
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(editingBed);

  const wardChoices = useMemo(() => {
    const seen = new Map();
    (wardRoomOptions || []).forEach((w) => {
      if (w.wardId != null && !seen.has(String(w.wardId))) {
        seen.set(String(w.wardId), w.wardName);
      }
    });
    return Array.from(seen, ([wardId, wardName]) => ({
      wardId: String(wardId),
      wardName,
    }));
  }, [wardRoomOptions]);

  const roomChoices = useMemo(
    () =>
      (wardRoomOptions || []).filter(
        (w) => String(w.wardId) === String(form.wardId)
      ),
    [wardRoomOptions, form.wardId]
  );

  useEffect(() => {
    if (isOpen && isEditMode && editingGroup) {
      setForm({
        wardId: String(editingGroup.wardId),
        roomNumber: String(editingGroup.roomNumber),
        bedCode: editingBed.bedCode || "",
        bedType: editingBed.bedType || bedTypeChoices[0] || "",
        pricePerDay: editingBed.pricePerDay ?? "",
        status: editingBed.status || "available",
        patientId: editingBed.patient?.id ? String(editingBed.patient.id) : "",
      });
    } else if (isOpen && !isEditMode) {
      setForm(initialForm);
    }
    setSubmitError("");
  }, [isOpen, isEditMode, editingGroup, editingBed]);

  useEffect(() => {
    if (isOpen && !isEditMode && wardChoices.length) {
      const isCurrentWardValid = wardChoices.some(
        (w) => String(w.wardId) === String(form.wardId)
      );
      if (!form.wardId || !isCurrentWardValid) {
        setForm((prev) => ({
          ...prev,
          wardId: String(wardChoices[0].wardId),
          roomNumber: "",
        }));
      }
    }
  }, [isOpen, isEditMode, wardChoices, form.wardId]);

  useEffect(() => {
    if (isOpen && !isEditMode && roomChoices.length) {
      const isCurrentRoomValid = roomChoices.some(
        (r) => String(r.roomNumber) === String(form.roomNumber)
      );
      if (!form.roomNumber || !isCurrentRoomValid) {
        setForm((prev) => ({
          ...prev,
          roomNumber: String(roomChoices[0].roomNumber),
        }));
      }
    }
  }, [isOpen, isEditMode, roomChoices, form.roomNumber]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "wardId" ? { roomNumber: "" } : {}),
      ...(name === "status" && value !== "occupied" ? { patientId: "" } : {}),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (
      !form.wardId ||
      !form.roomNumber ||
      !form.bedCode.trim() ||
      !form.bedType ||
      !form.pricePerDay ||
      (form.status === "occupied" && !form.patientId)
    ) {
      setSubmitError("Please fill all required fields.");
      return;
    }

    const selectedRoom = (wardRoomOptions || []).find(
      (w) =>
        String(w.wardId) === String(form.wardId) &&
        String(w.roomNumber) === String(form.roomNumber)
    );

    if (!selectedRoom) {
      setSubmitError("Selected room is invalid.");
      return;
    }

    const payload = {
      roomId: selectedRoom.roomId,
      bedCode: form.bedCode.trim(),
      bedType: form.bedType,
      pricePerDay: Number(form.pricePerDay),
      status: form.status,
      patientId: form.status === "occupied" ? Number(form.patientId) : null,
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await onUpdate(editingBed.id, payload);
      } else {
        await onAdd(payload);
      }
      setForm(initialForm);
      onClose();
    } catch (error) {
      setSubmitError(
        error?.response?.data?.message ||
          "Something went wrong. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleClose = () => {
    setForm(initialForm);
    setSubmitError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            {isEditMode ? "Edit Bed" : "Add Bed"}
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
          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Ward
              </label>
              <div className="relative">
                <select
                  name="wardId"
                  value={form.wardId}
                  onChange={handleChange}
                  className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                  required
                >
                  {wardChoices.map((w) => (
                    <option key={w.wardId} value={w.wardId}>
                      {w.wardName}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Room
              </label>
              <div className="relative">
                <select
                  name="roomNumber"
                  value={form.roomNumber}
                  onChange={handleChange}
                  className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                  required
                  disabled={!roomChoices.length}
                >
                  {roomChoices.length === 0 ? (
                    <option value="">No rooms available</option>
                  ) : (
                    roomChoices.map((r) => (
                      <option key={r.roomId} value={String(r.roomNumber)}>
                        Room {r.roomNumber}
                      </option>
                    ))
                  )}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Bed Number
            </label>
            <input
              name="bedCode"
              value={form.bedCode}
              onChange={handleChange}
              placeholder="e.g. 101-07"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Price per Day (&#8377;)
            </label>
            <input
              type="number"
              min="0"
              name="pricePerDay"
              value={form.pricePerDay}
              onChange={handleChange}
              placeholder="e.g. 1500"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Bed Type
              </label>
              <div className="relative">
                <select
                  name="bedType"
                  value={form.bedType}
                  onChange={handleChange}
                  className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                  required
                >
                  {bedTypeChoices.map((t) => (
                    <option key={t} value={t}>
                      {t}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1 flex-1">
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
                  {statusChoices.map((s) => (
                    <option key={s} value={s.toLowerCase()}>
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
          </div>

          {form.status === "occupied" && (
            <div className="flex flex-col gap-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Patient
              </label>
              <div className="relative">
                <select
                  name="patientId"
                  value={form.patientId}
                  onChange={handleChange}
                  className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                  required
                >
                  <option value="">Select admitted patient</option>
                  {admittedPatients.map((patient) => (
                    <option key={patient.id} value={patient.patientId}>
                      {patient.mrn} - {patient.name}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>
          )}

          {submitError && (
            <p className="text-[13px] text-[#EF4444]">{submitError}</p>
          )}

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
              disabled={isSubmitting}
              className="bg-[#521785] text-white w-auto px-4 py-2"
            >
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Bed"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddBedModal;
