import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { useLocation } from "react-router-dom";
import {
  ChevronDown,
  CheckCircle2,
  UserRound,
  Calendar,
  ArrowRightLeft,
  Info,
  Eye,
} from "lucide-react";
import Button from "../../commonComponent/Button";
import { ipdService } from "../../services/ipdService";
import { bedService } from "../../services/bedService";
import { icuService } from "../../services/icuService";

const PRIMARY = "#521785";

const SectionBadge = ({ number }) => (
  <div
    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[13px] font-semibold shrink-0"
    style={{ background: PRIMARY }}
  >
    {number}
  </div>
);

const Dropdown = ({
  label,
  required,
  value,
  onChange,
  options,
  placeholder = "Select",
}) => (
  <div className="flex flex-col gap-1.5 w-full flex-1">
    <label className="text-[13px] text-[#343C6A]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>

    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2.5 text-[14px] text-[#343C6A] bg-white outline-none"
      >
        <option value="">{placeholder}</option>

        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      <ChevronDown
        size={14}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  </div>
);

const statusStyles = {
  Completed: "bg-[#DCFCE7] text-[#16A34A]",
  Cancelled: "bg-[#FEE2E2] text-[#EF4444]",
};

const BedTransfer = () => {
  const location = useLocation();

  const [admissions, setAdmissions] = useState([]);
  const [availableBeds, setAvailableBeds] = useState([]);
  const [recentTransfers, setRecentTransfers] = useState([]);

  const [selectedAdmissionId, setSelectedAdmissionId] = useState("");
  const [newWard, setNewWard] = useState("");
  const [newRoom, setNewRoom] = useState("");
  const [newBed, setNewBed] = useState("");
  const [reason, setReason] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [viewingTransferId, setViewingTransferId] = useState(null);

  const selectedAdmission = admissions.find(
    (admission) =>
      String(admission.id) === String(selectedAdmissionId)
  );

  const viewingTransfer = viewingTransferId
    ? recentTransfers.find((t) => t.id === viewingTransferId)
    : null;

  const selectedNewBed =
    availableBeds.find((bed) => bed.bedCode === newBed) ||
    (viewingTransfer && viewingTransfer.toBed === newBed
      ? {
          bedCode: viewingTransfer.toBed,
          bedType: viewingTransfer.toBedType,
          bedChargePerDay: viewingTransfer.toBedChargePerDay,
          status: viewingTransfer.toBedStatus,
        }
      : null);

  const patientOptions = useMemo(
    () =>
      admissions.map((admission) => ({
        id: String(admission.id),
        label: `${admission.mrn || admission.admissionNumber} - ${
          admission.name
        }`,
      })),
    [admissions]
  );

  const newWardOptions = useMemo(() => {
    const wards = new Set(
      availableBeds.map((bed) => bed.wardName).filter(Boolean)
    );

    if (newWard) wards.add(newWard);

    return Array.from(wards);
  }, [availableBeds, newWard]);

  const newRoomOptions = useMemo(() => {
    const rooms = new Set(
      availableBeds
        .filter(
          (bed) =>
            !newWard ||
            bed.wardName === newWard
        )
        .map((bed) => `Room ${bed.roomNumber}`)
    );

    if (newRoom) rooms.add(newRoom);

    return Array.from(rooms);
  }, [availableBeds, newWard, newRoom]);

  const newBedOptions = useMemo(() => {
    const beds = new Set(
      availableBeds
        .filter(
          (bed) =>
            (!newWard ||
              bed.wardName === newWard) &&
            (!newRoom ||
              `Room ${bed.roomNumber}` === newRoom)
        )
        .map((bed) => bed.bedCode)
    );

    if (newBed) beds.add(newBed);

    return Array.from(beds);
  }, [
    availableBeds,
    newWard,
    newRoom,
    newBed,
  ]);

  const loadTransferData = async () => {
    const [
      optionsData,
      recentData,
      occupiedBedsData,
    ] = await Promise.all([
      ipdService.getTransferOptions(),
      ipdService.getRecentTransfers(),
      bedService.getOccupiedBedPatients(),
    ]);

    const occupiedBeds =
      occupiedBedsData?.beds || [];

    const occupiedAdmissions = occupiedBeds.map(
      (bed) => ({
        id: bed.admissionId,

        mrn:
          bed.patient?.id ||
          bed.patientId ||
          "",
        age: bed.patient?.age || "",
        gender:bed.patient?.gender || "",

        admissionNumber: bed.admissionId,

        name:
          bed.patient?.name ||
          "Unknown Patient",

        ward: bed.wardName || "",

        room: bed.roomNumber
          ? `Room ${bed.roomNumber}`
          : "",

        currentBed: bed.bedCode || "",

        admissionDate:
          bed.admissionDate || "",

        diagnosis:
          bed.diagnosis || "",

        bedChargePerDay: Number(
          bed.pricePerDay || 0
        ),
      })
    );

    setAdmissions(occupiedAdmissions);
    setAvailableBeds(
      optionsData?.availableBeds || []
    );
    setRecentTransfers(
      recentData?.transfers || []
    );
  };

  useEffect(() => {
    let active = true;

    loadTransferData().catch(() => {
      if (active) {
        setAdmissions([]);
        setAvailableBeds([]);
        setRecentTransfers([]);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!admissions.length) return;

    const preferredAdmission =
      admissions.find(
        (a) =>
          String(a.id) ===
          String(location.state?.admissionId)
      ) || null;

    if (preferredAdmission) {
      setSelectedAdmissionId(
        String(preferredAdmission.id)
      );
    }
  }, [
    admissions,
    location.state?.admissionId,
  ]);

  const selectedWardType = useMemo(() => {
    if (!newWard) return "";

    const ward = availableBeds.find(
      (bed) => bed.wardName === newWard
    );

    return ward?.wardType || "";
  }, [availableBeds, newWard]);

  const handleNewWardChange = (value) => {
    setNewWard(value);
    setNewRoom("");
    setNewBed("");
    setViewingTransferId(null);
  };

  const handleNewRoomChange = (value) => {
    setNewRoom(value);
    setNewBed("");
    setViewingTransferId(null);
  };

  const handleTransfer = async () => {
    if (
      !selectedAdmission ||
      !selectedNewBed ||
      !reason.trim()
    )
      return;

    setSubmitting(true);

    try {
      let response;
      if(selectedWardType==="ICU"){
        response=await icuService.tranferIPDToICU({
          admissionId: selectedAdmission.id,
          toBedId: selectedNewBed.id,
          reason: reason.trim(),
        });
        // console.log("admissionId" , selectedAdmission.id, "toBedId", selectedNewBed.id,"reason" , reason.trim(),);
        
      } else{
        response=await ipdService.transferBed({
          admissionId: selectedAdmission.id,
          toBedId: selectedNewBed.id,
          reason: reason.trim(),
        });
      }

      toast.success(response?.message || "Bed transferred successfully.");

      setReason("");
      setNewWard("");
      setNewRoom("");
      setNewBed("");
      setViewingTransferId(null);

      await loadTransferData();
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error?.response?.data?.error ||
          "Failed to transfer bed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const handleViewTransfer = (transfer) => {
    const admission = admissions.find(
      (item) =>
        String(item.id) ===
        String(transfer.admissionId)
    );

    setSelectedAdmissionId(
      admission ? String(admission.id) : ""
    );

    setNewWard(transfer.toWard || "");
    setNewRoom(transfer.toRoom || "");
    setNewBed(transfer.toBed || "");
    setReason(transfer.reason || "");

    setViewingTransferId(transfer.id);
  };

  return (
    <div className="h-full bg-transparent p-1 flex flex-col gap-4">
      {/* Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-semibold text-[#343C6A]">
          Bed Transfer
        </h1>

        <p className="text-[#8BA3CB] text-xs sm:text-sm mt-1">
          Transfer patient to another bed
        </p>
      </div>

      {/* Main Layout */}
      <div className="flex flex-col xl:flex-row gap-4 items-stretch xl:items-start">
        {/* Left Form */}
        <div className="w-full xl:flex-1 min-w-0 flex flex-col gap-4">
          {viewingTransferId && (
            <div className="bg-[#EEF2FF] text-[#4338CA] text-[12px] sm:text-[13px] px-3 sm:px-4 py-3 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
              <span>
                Viewing a completed transfer.
                Fields below are filled in for
                reference.
              </span>

              <button
                onClick={() => {
                  setViewingTransferId(null);
                  setNewWard("");
                  setNewRoom("");
                  setNewBed("");
                }}
                className="text-[12px] font-semibold underline shrink-0"
              >
                Clear
              </button>
            </div>
          )}

          {/* Step 1 */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SectionBadge number={1} />

              <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
                Patient & Current Bed Details
              </h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#343C6A]">
                Select Patient{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <div className="relative">
                <select
                  value={selectedAdmissionId}
                  onChange={(e) => {
                    setSelectedAdmissionId(
                      e.target.value
                    );
                    setViewingTransferId(null);
                  }}
                  className="appearance-none w-full border border-[#d3cccc] rounded-md pl-3 pr-8 py-2.5 text-[14px] text-[#343C6A] bg-white outline-none"
                >
                  <option value="">
                    Select admitted patient
                  </option>

                  {patientOptions.map(
                    (patient) => (
                      <option
                        key={patient.id}
                        value={patient.id}
                      >
                        {patient.label}
                      </option>
                    )
                  )}
                </select>

                <ChevronDown
                  size={14}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                />
              </div>
            </div>

            {/* Current Bed Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {[
                [
                  "Current Ward",
                  selectedAdmission?.ward,
                ],
                [
                  "Current Room",
                  selectedAdmission?.room,
                ],
                [
                  "Current Bed",
                  selectedAdmission?.currentBed,
                ],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex flex-col gap-1.5"
                >
                  <label className="text-[13px] text-[#343C6A]">
                    {label}
                  </label>

                  <input
                    value={value || ""}
                    readOnly
                    className="w-full border border-[#d3cccc] rounded-md px-3 py-2.5 text-[14px] text-[#343C6A] bg-gray-50 outline-none"
                  />
                </div>
              ))}
            </div>

            {/* Patient Information */}
            <div className="bg-[#F8F9FC] rounded-lg p-3 sm:p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                  <UserRound
                    size={18}
                    color={PRIMARY}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-[14px] font-semibold text-[#343C6A] truncate">
                    {selectedAdmission?.name ||
                      "No admitted patient selected"}
                  </p>

                  <p className="text-[12px] text-[#8BA3CB]">
                    MRN:{" "}
                    {selectedAdmission?.mrn || "-"}{" "}
                    &bull;{" "}
                    {selectedAdmission?.gender ||
                      "-"}{" "}
                    &bull;{" "}
                    {selectedAdmission?.age ||
                      "-"}{" "}
                    Years
                  </p>
                </div>
              </div>

              <div>
                <p className="text-[12px] text-[#8BA3CB] flex items-center gap-1">
                  <Calendar size={13} />
                  Admitted On
                </p>

                <p className="text-[13px] font-medium text-[#343C6A]">
                  {selectedAdmission?.admissionDate ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-[12px] text-[#8BA3CB]">
                  Diagnosis
                </p>

                <p className="text-[13px] font-medium text-[#343C6A] break-words">
                  {selectedAdmission?.diagnosis ||
                    "-"}
                </p>
              </div>

              <div>
                <p className="text-[12px] text-[#8BA3CB]">
                  Current Bed Charge
                </p>

                <p className="text-[13px] font-medium text-[#343C6A]">
                  &#8377;{" "}
                  {(
                    selectedAdmission?.bedChargePerDay ||
                    0
                  ).toLocaleString("en-IN")}{" "}
                  / day
                </p>
              </div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SectionBadge number={2} />

              <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
                New Bed Details
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <Dropdown
                label="New Ward"
                required
                value={newWard}
                onChange={handleNewWardChange}
                options={newWardOptions}
                placeholder="Select New Ward"
              />

              <Dropdown
                label="New Room"
                required
                value={newRoom}
                onChange={handleNewRoomChange}
                options={newRoomOptions}
                placeholder={
                  newWard
                    ? "Select New Room"
                    : "Select ward first"
                }
              />

              <div className="sm:col-span-2 lg:col-span-1">
                <Dropdown
                  label="New Bed"
                  required
                  value={newBed}
                  onChange={(value) => {
                    setNewBed(value);
                    setViewingTransferId(null);
                  }}
                  options={newBedOptions}
                  placeholder={
                    newRoom
                      ? "Select New Bed"
                      : "Select room first"
                  }
                />
              </div>
            </div>

            {/* New Bed Info */}
            <div className="bg-[#F0FDF4] border border-[#BBF7D0] rounded-lg p-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-start sm:items-center gap-2">
                <CheckCircle2
                  size={18}
                  color="#16A34A"
                  className="shrink-0 mt-0.5 sm:mt-0"
                />

                <div>
                  <p className="text-[13px] font-medium text-[#166534]">
                    Bed{" "}
                    {selectedNewBed?.bedCode ||
                      newBed ||
                      "-"}{" "}
                    is available
                  </p>

                  <p className="text-[12px] text-[#4B7A57]">
                    Bed Type:{" "}
                    {selectedNewBed?.bedType || "-"}{" "}
                    &bull; Status:{" "}
                    {selectedNewBed?.status || "-"}
                  </p>
                </div>
              </div>

              <div className="sm:text-right">
                <p className="text-[11px] text-[#4B7A57]">
                  New Bed Charge
                </p>

                <p className="text-[13px] font-semibold text-[#166534]">
                  &#8377;{" "}
                  {(
                    selectedNewBed?.bedChargePerDay ||
                    0
                  ).toLocaleString("en-IN")}{" "}
                  / day
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-5 flex flex-col gap-4">
            <div className="flex items-center gap-2">
              <SectionBadge number={3} />

              <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
                Transfer Reason
              </h2>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-[13px] text-[#343C6A]">
                Reason for Transfer{" "}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <textarea
                value={reason}
                onChange={(e) =>
                  setReason(e.target.value)
                }
                rows={4}
                className="w-full border border-[#d3cccc] rounded-md p-3 text-[14px] text-[#343C6A] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleTransfer}
                disabled={
                  submitting ||
                  !selectedAdmission ||
                  !selectedNewBed ||
                  !reason.trim()
                }
                className="text-white flex items-center justify-center gap-2 w-full sm:w-auto px-5 py-2.5 bg-[#521785]"
              >
                <ArrowRightLeft size={16} />

                {submitting
                  ? "Transferring..."
                  : "Transfer Bed"}
              </Button>
            </div>
          </div>
        </div>

        {/* Right: Recent Transfers */}
        <div className="w-full xl:w-[340px] xl:shrink-0 flex flex-col gap-4">
          <div className="bg-white rounded-lg border border-[#e5e5e5] p-3 sm:p-4 md:p-3">
            <div className="flex justify-between items-center mb-3 gap-3">
              <h2 className="text-[16px] font-semibold text-[#343C6A]">
                Recent Transfers
              </h2>

              {/* <button
                className="text-[13px] font-medium shrink-0"
                style={{ color: PRIMARY }}
              >
                View All
              </button> */}
            </div>

            <div className="flex flex-col gap-4">
              {recentTransfers.map((t) => (
                <div
                  key={t.id}
                  className={`flex flex-col gap-2 pb-4 border-b border-[#f1eef7] last:border-0 last:pb-0 rounded-md ${
                    viewingTransferId === t.id
                      ? "bg-[#F8F5FC] -mx-2 px-2 pt-2"
                      : ""
                  }`}
                >
                  <div className="flex flex-col items-start gap-2 sm:gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                        <UserRound
                          size={16}
                          color={PRIMARY}
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="text-[13px] font-semibold text-[#343C6A] truncate">
                          {t.patient}
                        </p>

                        <p className="text-[11px] text-[#8BA3CB]">
                          {t.mrn}
                        </p>
                      </div>

                      <button
                        onClick={() =>
                          handleViewTransfer(t)
                        }
                        className="p-1.5 rounded-md border border-[#d9d0f7] text-[#521785] shrink-0"
                      >
                        <Eye size={14} />
                      </button>
                    </div>

                    <div className="hidden sm:flex text-[12px] text-[#343C6A] items-center gap-1 shrink-0">
                      {t.fromBed}

                      <span
                        style={{
                          color: PRIMARY,
                        }}
                      >
                        &rarr;
                      </span>

                      {t.toBed}
                    </div>

                    
                  </div>

                  {/* Mobile Bed Transfer Route */}
                  <div className="sm:hidden  text-[12px] text-[#343C6A] flex items-center gap-1">
                    {t.fromBed}

                    <span
                      style={{
                        color: PRIMARY,
                      }}
                    >
                      &rarr;
                    </span>

                    {t.toBed}
                  </div>

                  <div className="flex justify-between items-center gap-3 pl-0">
                    <span className="text-[11px] text-[#8BA3CB]">
                      {t.dateTime}
                    </span>

                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded-full shrink-0 ${
                        statusStyles[t.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {t.status}
                    </span>
                  </div>
                </div>
              ))}

              {recentTransfers.length === 0 && (
                <p className="text-[12px] text-[#8BA3CB]">
                  No recent transfers found.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Info Banner */}
      <div className="flex items-start sm:items-center gap-2 bg-[#EEF2FF] text-[#4338CA] text-[12px] sm:text-[13px] p-3 rounded-lg">
        <Info
          size={16}
          className="shrink-0 mt-0.5 sm:mt-0"
        />

        <span>
          <span className="font-semibold">
            Important:
          </span>{" "}
          Please ensure all patient documents
          and medical equipment are transferred
          with the patient.
        </span>
      </div>
    </div>
  );
};

export default BedTransfer;


