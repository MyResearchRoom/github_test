import React, { useEffect, useMemo, useState } from "react";
import { X } from "lucide-react";

const initialFormData = {
  patientName: "",
  age: "",
  gender: "",
  uhid: "",
  admissionType: "Direct Admission",
  referringDoctor: "",
  ipdNumber: "",
  icuUnit: "",
  bedNumber: "",
  admissionDate: "",
  admissionTime: "",
  diagnosis: "",
  consultingDoctor: "",
  initialCondition: "Stable",
  isolationRequired: "No",
  isolationType: "",
};

const ICUAdmissionModal = ({
  isOpen,
  onClose,
  onSubmit,
  beds = [],
  admissions = [],
}) => {
  const [formData, setFormData] = useState(initialFormData);

  /*
   * Find beds that are already assigned to current ICU patients.
   */
  const occupiedBedNumbers = useMemo(() => {
    return new Set(admissions.map((patient) => patient.bed).filter(Boolean));
  }, [admissions]);

  /*
   * Only beds that can actually be used for admission.
   */
  const availableBeds = useMemo(() => {
    return beds.filter(
      (bed) =>
        bed.status === "Available" && !occupiedBedNumbers.has(bed.bedNumber)
    );
  }, [beds, occupiedBedNumbers]);

  /*
   * ICU Units are generated from available beds.
   */
  const availableICUUnits = useMemo(() => {
    return [
      ...new Set(availableBeds.map((bed) => bed.icuUnit).filter(Boolean)),
    ];
  }, [availableBeds]);

  /*
   * Beds for selected ICU Unit.
   */
  const filteredBeds = useMemo(() => {
    return availableBeds.filter((bed) => {
      const matchesUnit =
        !formData.icuUnit || bed.icuUnit === formData.icuUnit;

      const matchesIsolation =
        formData.isolationRequired !== "Yes" ||
        bed.isolationCapable === "Yes";

      return matchesUnit && matchesIsolation;
    });
  }, [availableBeds, formData.icuUnit, formData.isolationRequired]);

  useEffect(() => {
    if (!isOpen) return;

    const today = new Date();
    const date = today.toISOString().split("T")[0];
    const time = today.toTimeString().slice(0, 5);

    setFormData({
      ...initialFormData,
      admissionDate: date,
      admissionTime: time,
    });
  }, [isOpen]);

  /*
   * If the selected bed becomes invalid because of a filter change, clear it.
   */
  useEffect(() => {
    const selectedBedStillAvailable = filteredBeds.some(
      (bed) => bed.bedNumber === formData.bedNumber
    );

    if (formData.bedNumber && !selectedBedStillAvailable) {
      setFormData((prev) => ({
        ...prev,
        bedNumber: "",
      }));
    }
  }, [filteredBeds, formData.bedNumber]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    /*
     * When ICU Unit changes, reset the selected bed.
     */
    if (name === "icuUnit") {
      setFormData((prev) => ({
        ...prev,
        icuUnit: value,
        bedNumber: "",
      }));
    }

    /*
     * If isolation is changed back to No, remove isolation type.
     */
    if (name === "isolationRequired" && value === "No") {
      setFormData((prev) => ({
        ...prev,
        isolationRequired: value,
        isolationType: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.patientName.trim()) return;
    if (!formData.icuUnit) return;
    if (!formData.bedNumber) return;

    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm p-3 sm:p-4"
      onMouseDown={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[94vh] overflow-y-auto rounded-2xl bg-white shadow-2xl"
        onMouseDown={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between gap-3 px-4 sm:px-6 py-4 bg-white border-b border-zinc-100">
          <div>
            <h2 className="text-lg sm:text-xl font-bold text-zinc-900">
              New ICU Admission
            </h2>

            <p className="mt-0.5 text-xs sm:text-sm text-zinc-500">
              Admit a patient and assign an available ICU bed.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="shrink-0 h-9 w-9 rounded-lg flex items-center justify-center text-zinc-500 hover:bg-zinc-100 hover:text-zinc-800 transition"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="p-4 sm:p-6 space-y-6">
            {/* Patient Information */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-bold text-zinc-800">
                  Patient Information
                </h3>

                <p className="text-xs text-zinc-400 mt-1">
                  Enter the basic details of the patient.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Admission Type
                  </label>

                  <select
                    name="admissionType"
                    value={formData.admissionType}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400"
                  >
                    <option value="Direct Admission">Direct Admission</option>
                    <option value="Transfer from Ward">
                      Transfer from Ward
                    </option>
                    <option value="Transfer from Emergency">
                      Transfer from Emergency
                    </option>
                    <option value="Transfer from OT">Transfer from OT</option>
                  </select>
                </div>

                <div className="sm:col-span-2 lg:col-span-1">
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Patient Name
                  </label>

                  <input
                    type="text"
                    name="patientName"
                    value={formData.patientName}
                    onChange={handleChange}
                    placeholder="Enter patient name"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Age
                  </label>

                  <input
                    type="number"
                    name="age"
                    value={formData.age}
                    onChange={handleChange}
                    placeholder="Age"
                    min="0"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400 focus:ring-1 focus:ring-zinc-100"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Gender
                  </label>

                  <select
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    UHID
                  </label>

                  <input
                    type="text"
                    name="uhid"
                    value={formData.uhid}
                    onChange={handleChange}
                    placeholder="Enter UHID"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    IPD Number
                  </label>

                  <input
                    type="text"
                    name="ipdNumber"
                    value={formData.ipdNumber}
                    onChange={handleChange}
                    placeholder="Enter IPD number"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            </section>

            {/* Admission Information */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-bold text-zinc-800">
                  Admission Information
                </h3>

                <p className="text-xs text-zinc-400 mt-1">
                  Select the admission source and referring doctor.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Referring Doctor
                  </label>

                  <input
                    type="text"
                    name="referringDoctor"
                    value={formData.referringDoctor}
                    onChange={handleChange}
                    placeholder="Doctor name"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Consulting Doctor
                  </label>

                  <input
                    type="text"
                    name="consultingDoctor"
                    value={formData.consultingDoctor}
                    onChange={handleChange}
                    placeholder="Doctor name"
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Admission Date
                  </label>

                  <input
                    type="date"
                    name="admissionDate"
                    value={formData.admissionDate}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Admission Time
                  </label>

                  <input
                    type="time"
                    name="admissionTime"
                    value={formData.admissionTime}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 text-sm outline-none focus:border-zinc-400"
                  />
                </div>
              </div>
            </section>

            {/* Bed Assignment */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-bold text-zinc-800">
                  ICU Bed Assignment
                </h3>

                <p className="text-xs text-zinc-400 mt-1">
                  Select an available ICU unit and bed.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* ICU Unit */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    ICU Unit
                  </label>

                  <select
                    name="icuUnit"
                    value={formData.icuUnit}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400"
                  >
                    <option value="">Select ICU Unit</option>

                    {availableICUUnits.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Bed */}
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Bed
                  </label>

                  <select
                    name="bedNumber"
                    value={formData.bedNumber}
                    onChange={handleChange}
                    disabled={!formData.icuUnit}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm outline-none 
                    focus:border-zinc-400 disabled:bg-zinc-50 disabled:text-zinc-400 disabled:cursor-not-allowed">
                    <option value="">
                      {formData.icuUnit
                        ? "Select available bed"
                        : "Select ICU Unit first"}
                    </option>

                    {filteredBeds.map((bed) => (
                      <option key={bed.id} value={bed.bedNumber}>
                        {bed.bedNumber} — {bed.room}
                        {bed.bedType ? ` — ${bed.bedType}` : ""}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* No available beds */}
              {formData.icuUnit && filteredBeds.length === 0 && (
                <div className="mt-3 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-xs sm:text-sm text-amber-700">
                  No suitable beds are currently available in{" "}
                  {formData.icuUnit}.
                </div>
              )}
            </section>

            {/* Clinical Information */}
            <section>
              <div className="mb-4">
                <h3 className="text-sm sm:text-base font-bold text-zinc-800">
                  Clinical Information
                </h3>

                <p className="text-xs text-zinc-400 mt-1">
                  Record the patient's initial clinical condition.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Initial Condition
                  </label>

                  <select
                    name="initialCondition"
                    value={formData.initialCondition}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm outline-none focus:border-zinc-400"
                  >
                    <option value="Critical">Critical</option>
                    <option value="Watch">Watch</option>
                    <option value="Stable">Stable</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Isolation Required
                  </label>

                  <select
                    name="isolationRequired"
                    value={formData.isolationRequired}
                    onChange={handleChange}
                    className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm outline-none
                     focus:border-zinc-400"
                  >
                    <option value="No">No</option>
                    <option value="Yes">Yes</option>
                  </select>
                </div>

                {formData.isolationRequired === "Yes" && (
                  <div>
                    <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                      Isolation Type
                    </label>

                    <select
                      name="isolationType"
                      value={formData.isolationType}
                      onChange={handleChange}
                      className="w-full h-10 px-3 rounded-lg border border-zinc-200 bg-white text-sm outline-none 
                      focus:border-zinc-400">
                      <option value="">Select isolation type</option>
                      <option value="Contact">Contact</option>
                      <option value="Droplet">Droplet</option>
                      <option value="Airborne">Airborne</option>
                    </select>
                  </div>
                )}

                <div className="sm:col-span-2 lg:col-span-3">
                  <label className="block text-xs font-semibold text-zinc-600 mb-1.5">
                    Diagnosis
                  </label>

                  <textarea
                    name="diagnosis"
                    value={formData.diagnosis}
                    onChange={handleChange}
                    placeholder="Enter diagnosis / clinical notes"
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 text-sm outline-none resize-none 
                    focus:border-zinc-400 focus:ring-1 focus:ring-zinc-100"
                  />
                </div>
              </div>
            </section>
          </div>

          {/* Footer */}
          <div className="sticky bottom-0 flex flex-col-reverse sm:flex-row justify-end gap-2 sm:gap-3 px-4 sm:px-6 py-4 bg-white border-t border-zinc-100">
            <button type="button"
              onClick={onClose}
              className="h-10 px-5 rounded-lg border border-zinc-200 text-sm font-semibold text-zinc-600 hover:bg-zinc-50 transition">
              Cancel
            </button>

            <button type="submit"
              className="h-10 px-5 rounded-lg bg-[#521785] text-white text-sm font-semibold hover:bg-[#7f2ac9] transition">
              Admit Patient
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ICUAdmissionModal;