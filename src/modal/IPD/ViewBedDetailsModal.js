import React from "react";
import { X, BedDouble, UserRound, Tag, CreditCard, Building2, DoorOpen } from "lucide-react";
import Button from "../../commonComponent/Button";

const PRIMARY = "#521785";

const statusBadges = {
  occupied: { label: "Occupied", bg: "#F3E8FF", text: "#7C3AED", dot: "#521785" },
  discharged: { label: "Discharged", bg: "#FEE2E2", text: "#EF4444", dot: "#EF4444" },
  available: { label: "Available", bg: "#DCFCE7", text: "#16A34A", dot: "#22C55E" },
  maintenance: { label: "Maintenance", bg: "#FFEDD5", text: "#EA580C", dot: "#F97316" },
};

const ViewBedDetailsModal = ({ isOpen, onClose, bed, wardGroup }) => {
  if (!isOpen || !bed) return null;

  const badge = statusBadges[bed.status] || statusBadges.occupied;
  const wardName = wardGroup?.wardName || bed.wardName || "Ward";
  const roomNumber = wardGroup?.roomNumber || bed.roomNumber ? `Room ${wardGroup?.roomNumber || bed.roomNumber}` : "Room";
  const price = Number(bed.pricePerDay || bed.price || 0);

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-[2px] p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-[#e5e5e5] p-4 bg-[#F8F9FC]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
              <BedDouble size={18} color={PRIMARY} />
            </div>
            <div>
              <h2 className="text-base font-semibold text-[#343C6A]">
                Bed {bed.bedCode}
              </h2>
              <p className="text-[12px] text-[#8BA3CB]">
                {wardName} &bull; {roomNumber}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex flex-col gap-4">
          {/* Status Badge */}
          <div className="flex justify-between items-center bg-gray-50 rounded-lg p-3 border border-[#f0f0f0]">
            <span className="text-[13px] text-[#8BA3CB] font-medium">Bed Status</span>
            <span
              className="flex items-center gap-1.5 text-[12px] font-semibold px-2.5 py-1 rounded-full"
              style={{ backgroundColor: badge.bg, color: badge.text }}
            >
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: badge.dot }} />
              {badge.label}
            </span>
          </div>

          {/* Patient Details Section */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] font-semibold text-[#8BA3CB] uppercase tracking-wider">
              Assigned Patient Information
            </span>

            <div className="bg-[#F8F9FC] border border-[#e5e5e5] rounded-lg p-3.5 flex flex-col gap-2.5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#521785] text-white flex items-center justify-center shrink-0 text-[13px] font-semibold">
                  {bed.patient?.name ? bed.patient.name.charAt(0).toUpperCase() : "?"}
                </div>
                <div className="flex flex-col">
                  <span className="text-[11px] text-[#8BA3CB]">Current Patient</span>
                  <span className="text-[14px] font-semibold text-[#343C6A]">
                    {bed.patient?.name || "No Patient Assigned"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#e5e5e5] text-[13px]">
                <div>
                  <span className="text-[11px] text-[#8BA3CB] block">Patient ID / MRN</span>
                  <span className="font-semibold text-[#343C6A]">
                    {bed.patient?.mrn || bed.patient?.patientId || "N/A"}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bed Specification Details Section */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] font-semibold text-[#8BA3CB] uppercase tracking-wider">
              Bed Specifications & Rate
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#F8F9FC] border border-[#e5e5e5] rounded-lg p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8BA3CB]">
                  <Tag size={13} color={PRIMARY} />
                  <span>Bed Type</span>
                </div>
                <span className="text-[14px] font-semibold text-[#343C6A]">
                  {bed.bedType || "Standard"}
                </span>
              </div>

              <div className="bg-[#F8F9FC] border border-[#e5e5e5] rounded-lg p-3 flex flex-col gap-1">
                <div className="flex items-center gap-1.5 text-[11px] text-[#8BA3CB]">
                  <CreditCard size={13} color={PRIMARY} />
                  <span>Price Per Day</span>
                </div>
                <span className="text-[14px] font-semibold text-[#16A34A]">
                  &#8377; {price.toLocaleString("en-IN")} / day
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-[#e5e5e5] p-3.5 bg-[#F8F9FC] flex justify-end">
          <Button
            type="button"
            onClick={onClose}
            className="text-white w-auto px-5 py-2 text-[13px]"
            style={{ backgroundColor: PRIMARY }}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewBedDetailsModal;
