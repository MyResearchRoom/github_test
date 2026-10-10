import React, { useState, useEffect } from "react";
import { X, ChevronDown } from "lucide-react";
import Button from "../../commonComponent/Button";

const initialForm = {
  roomNumber: "",
  wardName: "",
  roomType: "",
  capacity: "",
};

const AddRoomModal = ({
  isOpen,
  onClose,
  onAdd,
  onUpdate,
  editingRoom,
  wardChoices = [],
}) => {
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(editingRoom);

  useEffect(() => {
    if (isOpen && editingRoom) {
      setForm({
        roomNumber: editingRoom.roomNumber || "",
        wardName: editingRoom.wardName || wardChoices[0] || "",
        roomType: editingRoom.roomType || "",
        capacity: editingRoom.capacity ?? "",
      });
    } else if (isOpen && !editingRoom) {
      setForm({ ...initialForm, wardName: wardChoices[0] || "" });
    }
    setSubmitError("");
  }, [isOpen, editingRoom, wardChoices]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (
      !form.roomNumber.trim() ||
      !form.wardName ||
      !form.roomType.trim() ||
      !form.capacity
    ) {
      return;
    }

    const payload = {
      roomNumber: form.roomNumber.trim(),
      wardName: form.wardName,
      roomType: form.roomType.trim(),
      capacity: Number(form.capacity),
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await onUpdate(editingRoom.id, payload);
      } else {
        await onAdd(payload);
      }
      setForm({ ...initialForm, wardName: wardChoices[0] || "" });
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
    setForm({ ...initialForm, wardName: wardChoices[0] || "" });
    setSubmitError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            {isEditMode ? "Edit Room" : "Add Room"}
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Room Number
            </label>
            <input
              name="roomNumber"
              value={form.roomNumber}
              onChange={handleChange}
              placeholder="e.g. 104"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Ward
            </label>
            <div className="relative">
              <select
                name="wardName"
                value={form.wardName}
                onChange={handleChange}
                className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                required
              >
                {wardChoices.map((w) => (
                  <option key={w} value={w}>
                    {w}
                  </option>
                ))}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Room Type
            </label>
            <input
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
              placeholder="e.g. Single, Double, Triple"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Number of Beds
            </label>
            <input
              type="number"
              min="1"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 2"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          {submitError && (
            <p className="text-[13px] text-[#EF4444]">{submitError}</p>
          )}

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
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Room"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddRoomModal;