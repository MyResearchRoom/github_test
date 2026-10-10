import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import Button from "../../commonComponent/Button";

const initialForm = {
  wardName: "",
  wardType:"",
  location: "",
  capacity: "",
};

const AddWardModal = ({ isOpen, onClose, onAdd, onUpdate, editingWard }) => {
  const [form, setForm] = useState(initialForm);
  const [submitError, setSubmitError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(editingWard);

  useEffect(() => {
    if (isOpen && editingWard) {
      setForm({
        wardName: editingWard.wardName || "",
        wardType: editingWard.wardType || "",
        location: editingWard.location || "",
        capacity: editingWard.capacity ?? "",
      });
    } else if (isOpen && !editingWard) {
      setForm(initialForm);
    }
    setSubmitError("");
  }, [isOpen, editingWard]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError("");

    if (!form.wardName.trim() || !form.location.trim() || !form.capacity || !form.wardType) {
      return;
    }

    const payload = {
      wardName: form.wardName.trim(),
      wardType: form.wardType.trim(),
      location: form.location.trim(),
      capacity: Number(form.capacity),
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await onUpdate(editingWard.id, payload);
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
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            {isEditMode ? "Edit Ward" : "Add Ward"}
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
              Ward Name <span className="text-left text-red-500 ">*</span>
            </label>
            <input
              name="wardName"
              value={form.wardName}
              onChange={handleChange}
              placeholder="e.g. General Ward"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Ward Type<span className="text-left text-red-500 ">*</span>
            </label>

            <select
              name="wardType"
              value={form.wardType}
              onChange={handleChange}
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2 bg-white"
              required
            >
              <option value="">Select Ward Type</option>
              <option value="GENERAL">General</option>
              <option value="ICU">ICU</option>
            </select>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Location<span className="text-left text-red-500 ">*</span>
            </label>
            <input
              name="location"
              value={form.location}
              onChange={handleChange}
              placeholder="e.g. First Floor"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              required
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Room Capacity<span className="text-left text-red-500 ">*</span>
            </label>
            <input
              type="number"
              min="1"
              name="capacity"
              value={form.capacity}
              onChange={handleChange}
              placeholder="e.g. 30"
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
              {isSubmitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Ward"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddWardModal;