import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { X, ChevronDown, Loader2 } from "lucide-react";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";
import { toast } from "react-toastify";

const initialForm = {
  admissionId: "",
};

const AddDiscountModal = ({ isOpen, onClose, accountId }) => {
  const [form, setForm] = useState(initialForm);
  const [admissions, setAdmissions] = useState([]);
  const [admissionsLoading, setAdmissionsLoading] = useState(false);

  const [discountInput, setDiscountInput] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    const loadAdmissions = async () => {
      setAdmissionsLoading(true);
      setError("");

      try {
        const res = await ipdService.getPatientsWithAccount();

        setAdmissions(res?.data);
      } catch (err) {
        setAdmissions([]);
        setError(
          err?.response?.data?.message ||
            err?.response?.data?.error ||
            "Failed to load admitted patients."
        );
      } finally {
        setAdmissionsLoading(false);
      }
    };

    loadAdmissions();
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && accountId) {
      setForm((prev) => ({ ...prev, admissionId: accountId }));
    }
  }, [isOpen, accountId]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleClose = () => {
    setForm(initialForm);
    setDiscountInput("");
    setError("");
    onClose();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.admissionId) {
      setError("Please select a patient.");
      return;
    }

    if (discountInput === "" || isNaN(Number(discountInput)) || Number(discountInput) < 0) {
      setError("Please enter a valid discount amount.");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        discount: Number(discountInput),
      };
      console.log("Add Discount payload:", payload);
      const res = await ipdService.addPatientAccountCharges(payload, form.admissionId);
      toast.success(res?.message || "Discount added successfully...");
      setForm(initialForm);
      setDiscountInput("");
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to add discount. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">Add Discount</h2>
          <button onClick={handleClose} className="text-gray-400 hover:text-gray-600">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4 flex flex-col gap-4">
          {error && (
            <div className="bg-[#FEE2E2] text-[#B91C1C] text-[13px] rounded-md px-3 py-2">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">Patient</label>

            <div className="relative">
              <select
                name="admissionId"
                value={form.admissionId}
                onChange={handleChange}
                className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none disabled:bg-gray-50"
                required
                disabled={admissionsLoading || accountId}
              >
                <option value="" disabled>
                  {admissionsLoading ? "Loading patients..." : "Select patient"}
                </option>
                {admissions.map((a) => (
                  <option key={a.patientId} value={a.accountId}>
                    {a.patientName} ({a.patientUniqueId}) ({a.accountNumber})
                  </option>
                ))}
              </select>
              {admissionsLoading ? (
                <Loader2 size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 animate-spin" />
              ) : (
                <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              )}
            </div>
            {!admissionsLoading && admissions.length === 0 && (
              <p className="text-[12px] text-[#8BA3CB]">No currently admitted patients found.</p>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Discount (&#8377;)
            </label>
            <input
              type="number"
              min="0"
              value={discountInput}
              onChange={(e) => setDiscountInput(e.target.value)}
              placeholder="e.g. 200"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button
              type="button"
              onClick={handleClose}
              className="border border-[#d3cccc] bg-white text-[#343C6A] w-auto px-4 py-2"
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#521785] text-white w-auto px-4 py-2 flex items-center justify-center gap-1.5"
              disabled={submitting}
            >
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {submitting ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default AddDiscountModal;