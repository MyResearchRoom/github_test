import React from "react";
import { Trash2, X } from "lucide-react";
import Button from "../../commonComponent/Button";

const DeleteConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Delete Room",
  message = "Are you sure you want to delete this room?",
  loading = false,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-xl w-[420px] shadow-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
              <Trash2 size={20} className="text-red-500" />
            </div>

            <div>
              <h2 className="text-lg font-semibold text-[#343C6A]">
                {title}
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className="text-sm text-gray-500 mt-4 leading-6">
          {message}
        </p>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <Button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="border border-gray-300 bg-white text-[#343C6A]"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="bg-red-500 text-white hover:bg-red-600"
          >
            {loading ? "Deleting..." : "Delete"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;