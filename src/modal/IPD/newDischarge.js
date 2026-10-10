import React, { useEffect,useState } from "react";
import { X, ChevronDown } from "lucide-react";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";
import { bedService } from "../../services/bedService";
import { toast } from "react-toastify";

// const initialForm = {
//   patientId: "",
//   dischargeDate: "",
//   dischargeTime: "",
//   summaryNotes: "",
// };
const initialForm = {
  patientId: "",
  dischargeType: "Normal",
  dischargeCondition: "Stable",
  followUpDate: "",
  followUpInstructions: "",
  dischargeNote: "",
  dischargeDate: "",
  dischargeTime: "",
};

const NewDischargeModal = ({ isOpen, onClose, onAdd ,admissionId}) => {
  const [form, setForm] = useState(initialForm);
  const [occupiedBeds, setOccupiedBeds] = useState([]);
  const [bedsLoading, setBedsLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [selectedAdmision, setSelectedAdmission]=useState({});

  
  useEffect(() => {
    if (!isOpen) return;

    let active = true;

    const loadOccupiedBeds = async () => {
      setBedsLoading(true);

      try {
        const data = await bedService.getOccupiedBedPatients();
        const beds = data?.beds || [];

        if (active) {
          setOccupiedBeds(beds);

          if (admissionId) {
            const selectedAdmission = beds.find(
              (b) => String(b.admissionId) === String(admissionId)
            );

            if (selectedAdmission) {
              setSelectedAdmission(selectedAdmission);
            }

            setForm((prev) => ({
              ...prev,
              patientId: selectedAdmission?.admissionId ||"",
            }));
          }
        }
      } catch (err) {
        if (active) {
          setOccupiedBeds([]);
          setSelectedAdmission(null);
        }
      } finally {
        if (active) {
          setBedsLoading(false);
        }
      }
    };

    loadOccupiedBeds();

    return () => {
      active = false;
    };
  }, [isOpen, admissionId]);
  // console.log("selected admission",selectedAdmision);
  

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePatientChange = async (e) => {
    const selectedAdmissionId = e.target.value;

    const selectedBed = occupiedBeds.find(
      (b) => String(b.admissionId) === String(selectedAdmissionId)
    );

    setForm((prev) => ({
      ...prev,
      patientId: selectedAdmissionId,
    }));

    if (!selectedBed) {
      setError("Selected patient information not found.");
      return;
    }

    if (!selectedBed.admissionId) {
      setError(
        "This patient does not have an active IPD admission."
      );
      return;
    }
    setError("");
  };

  const handleSubmit = async (e) => {
      e.preventDefault();
      setError("");

      if (!admissionId) {
        setError("Admission not found.");
        return;
      }

      if (!form.dischargeType) {
        setError("Discharge type is required.");
        return;
      }

      if (!form.dischargeCondition) {
        setError("Discharge condition is required.");
        return;
      }

      if (!form.dischargeDate) {
        setError("Discharge date is required.");
        return;
      }

      setSubmitting(true);

      try {
        const data = await ipdService.createDischarge({
          admissionId: Number(admissionId),

          dischargeType: form.dischargeType,

          dischargeCondition: form.dischargeCondition,

          followUpDate: form.followUpDate || null,

          followUpInstructions:
            form.followUpInstructions?.trim() || null,

          dischargeNote:
            form.dischargeNote?.trim() || null,

          dischargeDate: form.dischargeDate,

          dischargeTime: form.dischargeTime || null,
        });
        toast.success(data?.message || "Patient discharge initiated..")

        setForm(initialForm);
        setSelectedAdmission(null);
        onClose();
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Failed to initiate discharge. Please try again."
        );
      } finally {
        setSubmitting(false);
      }
  };

  const handleClose = () => {
    setForm(initialForm);
    setError("");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4">
          <h2 className="text-lg font-semibold text-[#343C6A]">
            New Discharge
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
          {error && (
            <div className="bg-[#FEE2E2] text-[#EF4444] text-[13px] p-2.5 rounded-md">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Patient
            </label>
            <div className="relative">
              <select
                name="patientId"
                value={form.patientId}
                onChange={handlePatientChange}
                className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                required
                disabled={!!admissionId || bedsLoading}
              >
               <option value="" disabled>
                  {bedsLoading
                    ? "Loading patients..."
                    : occupiedBeds.length === 0
                    ? "No occupied beds"
                    : "Select patient"}
                </option>
                {occupiedBeds.map((b) => {
                  const patientName = b.patient?.name || "Unknown Patient";
                  const patientCode = b.patient?.patientId || b.patient?.id || "";
                  const bedInfo = `Bed ${b.bedCode}${b.roomNumber ? ` (Room ${b.roomNumber})` : ""}`;
                  return (
                    <option key={b.admissionId} value={b.admissionId}>
                      {patientName} (ID: {patientCode}) - {bedInfo}
                    </option>
                  );
                })}
              </select>
              <ChevronDown
                size={14}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Discharge Date
              </label>
              <input
                type="date"
                name="dischargeDate"
                value={form.dischargeDate}
                onChange={handleChange}
                className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
                required
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Discharge Time
              </label>
              <input
                type="time"
                name="dischargeTime"
                value={form.dischargeTime}
                onChange={handleChange}
                className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
              />
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Discharge Type
              </label>

              <select
                name="dischargeType"
                value={form.dischargeType}
                onChange={handleChange}
                className="appearance-none w-full border border-[#d3cccc] rounded-md px-3 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                required
              >
                <option value="Normal">Normal</option>
                <option value="LAMA">LAMA</option>
                <option value="DAMA">DAMA</option>
                <option value="Transfer">Transfer</option>
                <option value="Death">Death</option>
                <option value="Other">Other</option>
              </select>
            </div>

            <div className="flex flex-col gap-1 flex-1">
              <label className="text-[13px] font-medium text-[#343C6A]">
                Discharge Condition
              </label>

              <select
                name="dischargeCondition"
                value={form.dischargeCondition}
                onChange={handleChange}
                className="appearance-none w-full border border-[#d3cccc] rounded-md px-3 py-2 text-[14px] text-[#343C6A] bg-white outline-none"
                required
              >
                <option value="Stable">Stable</option>
                <option value="Improved">Improved</option>
                <option value="Unchanged">Unchanged</option>
                <option value="Critical">Critical</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Follow-up Date
            </label>

            <input
              type="date"
              name="followUpDate"
              value={form.followUpDate}
              onChange={handleChange}
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Follow-up Instructions
            </label>

            <textarea
              name="followUpInstructions"
              value={form.followUpInstructions}
              onChange={handleChange}
              rows={2}
              placeholder="Enter follow-up instructions"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2 resize-none"
            />
          </div>


          <div className="flex flex-col gap-1">
            <label className="text-[13px] font-medium text-[#343C6A]">
              Discharge Note
            </label>

            <textarea
              name="dischargeNote"
              value={form.dischargeNote}
              onChange={handleChange}
              rows={3}
              placeholder="Enter discharge note"
              className="outline-none text-[14px] border border-[#d3cccc] rounded-md px-3 py-2 resize-none"
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
              disabled={submitting}
              className="bg-[#521785] text-white w-auto px-4 py-2"
            >
              {submitting ? "Saving..." : "Initiate Discharge"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDischargeModal;