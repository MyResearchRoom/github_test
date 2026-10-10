import React, { useState } from "react";
import { HeartPulse, Plus, Printer } from "lucide-react";
import ICURecordVitalModal from "../../../modal/ICU/ICURecordVitals";
import { getCurrentDate } from "../../../utils/getCurrentDate";
import TableComponent from "../../../commonComponent/TableComponent";

const PRIMARY = "#521785";

const inputClass =
    "w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300";

const Section = ({ title, icon: Icon, children, action }) => (
    <div className="bg-white rounded-lg border border-[#e5e5e5] overflow-hidden">
        <div className="px-4 sm:px-5 py-3 border-b border-[#f0f0f0] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2 min-w-0">
                <Icon size={17} className="text-[#521785] shrink-0" />
                <h2 className="text-sm sm:text-base font-semibold text-[#343C6A] truncate">
                    {title}
                </h2>
            </div>

            {action && <div className="shrink-0 w-full sm:w-auto">{action}</div>}
        </div>

        <div className="p-4 sm:p-5">{children}</div>
    </div>
);

const ICUPatientVitals = ({ vitals = [], patients = [], patient = null, onSuccess }) => {
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const handleSubmit = (formData) => {
        const { temperature, pulse, spo2, respiratoryRate } = formData;

        const newVital = {
            ...formData,
            recordedby: formData.recordedBy,
        };

        onSuccess?.(newVital);
        setIsAddModalOpen(false);
    };

    return (
        <>
            <Section
                title="Patient Vitals"
                icon={HeartPulse}
                action={
                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
                        <div>
                            <input
                                type="date"
                                defaultValue={getCurrentDate()}
                                className={inputClass}
                            />
                        </div>
                        <button
                            type="button"
                            // onClick={handleDownloadExcel}
                            className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
                            style={{ backgroundColor: "#16a34a" }}
                        >
                            <Printer size={15} />
                            <span>Download Excel</span>
                        </button>

                        <button
                            type="button"
                            onClick={() => setIsAddModalOpen(true)}
                            className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
                            style={{ backgroundColor: PRIMARY }}
                        >
                            <Plus size={15} />
                            <span>Add Vitals</span>
                        </button>
                    </div>
                }
            >
                {/* Mobile + Tablet */}
                <div className="space-y-3 lg:hidden">
                    {vitals.length > 0 ? (
                        vitals.map((item, index) => (
                            <div
                                key={item.id || index}
                                className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                            >
                                {/* Date & Time */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 mb-2">
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Date
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.recordedAtDate || "-"}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Time
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.recordedAtTime || "-"}
                                        </p>
                                    </div>
                                </div>

                                {/* Vital Details */}
                                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                                    {/* Temperature */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Temp (°F)
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.temperature ?? "-"}
                                        </p>
                                    </div>

                                    {/* Pulse */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Pulse (bpm)
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.pulse ?? "-"}
                                        </p>
                                    </div>

                                    {/* Respiratory Rate */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            RR (breaths/min)
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.respiratoryRate ?? "-"}
                                        </p>
                                    </div>

                                    {/* Blood Pressure */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Blood Pressure (mmHg)
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.systolicBP ?? "-"}/{item.diastolicBP ?? "-"}
                                        </p>
                                    </div>

                                    {/* SpO2 */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            SpO2 (%)
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.spo2 ?? "-"}
                                        </p>
                                    </div>

                                    {/* BSL */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            BSL (mg/dL)
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.bsl ?? "-"}
                                        </p>
                                    </div>

                                    {/* Insulin */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Insulin (units)
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.insulin !== null && item.insulin !== undefined
                                                ? item.insulin
                                                : "-"}
                                        </p>
                                    </div>

                                    {/* Recorded By */}
                                    <div className="rounded-lg bg-gray-50 p-3">
                                        <p className="text-[11px] font-medium text-gray-500">
                                            Recorded By
                                        </p>
                                        <p className="mt-1 text-sm font-semibold text-[#343C6A]">
                                            {item.recordedBy || item.recordedby || "-"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="rounded-lg border border-dashed border-gray-300 py-8 text-center text-sm text-gray-500">
                            No vitals recorded for this patient.
                        </div>
                    )}
                </div>

                {/* Desktop */}
                <div className="hidden lg:block bg-white rounded-lg border border-[#e5e5e5] overflow-x-auto">
                    <TableComponent
                        columns={[
                            {
                                label: "Date",
                                headerClassName: "text-left pl-4",
                                className: "pl-4 py-3",
                                render: (item) => (
                                    <p className="text-[#343C6A] font-medium">{item.recordedAtDate}</p>
                                ),
                            },
                            {
                                label: "Time",
                                headerClassName: "text-left pl-4",
                                className: "pl-4 py-3",
                                render: (item) => (
                                    <p className="text-[#343C6A] font-medium">{item.recordedAtTime}</p>
                                ),
                            },
                            {
                                label: "Temp (°F)",
                                headerClassName: "text-left pl-4",
                                className: "pl-4 py-3",
                                render: (item) => <p className="text-[#343C6A]">{item.temperature}</p>,
                            },
                            {
                                label: (
                                    <span className="leading-tight">
                                        Pulse (bpm) &<br />
                                        RR (breaths/min)
                                    </span>
                                ),
                                headerClassName: "text-left pl-4 min-w-[140px] whitespace-normal align-top",
                                className: "pl-4 py-3 whitespace-nowrap",
                                render: (item) => (
                                    <p className="text-[#343C6A]">
                                        {item.pulse} & {item.respiratoryRate}
                                    </p>
                                ),
                            },
                            {
                                label: "Blood Pressure (mmHg)",
                                headerClassName: "text-left pl-4",
                                className: "pl-4 py-3",
                                render: (item) => (
                                    <p className="text-[#343C6A]">
                                        {item.systolicBP}/{item.diastolicBP}
                                    </p>
                                ),
                            },
                            {
                                label: "SpO2 (%)",
                                headerClassName: "text-left pl-4",
                                className: "pl-4 py-3",
                                render: (item) => <p className="text-[#343C6A]">{item.spo2}</p>,
                            },
                            {
                                label: (
                                    <span className="leading-tight">
                                        BSL (mg/dL) &<br />
                                        Insulin (units)
                                    </span>
                                ),
                                headerClassName: "text-left pl-4 min-w-[140px] whitespace-normal align-top",
                                className: "pl-4 py-3 whitespace-nowrap",
                                render: (item) => (
                                    <p className="text-[#343C6A]">
                                        {item.bsl} mg/dL
                                        {item.insulin !== null && item.insulin !== undefined
                                            ? ` / ${item.insulin} units`
                                            : ""}
                                    </p>
                                ),
                            },
                            {
                                label: "Recorded By",
                                headerClassName: "text-left pl-4",
                                className: "pl-4 py-3",
                                render: (item) => (
                                    <p className="text-[#343C6A]">{item.recordedBy || "-"}</p>
                                ),
                            },
                        ]}
                        data={vitals}
                        loading={false}
                    />
                </div>
            </Section>

            <ICURecordVitalModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                onSubmit={handleSubmit}
                patients={patients}
                isDetailsPage={true}
                currentPatient={patient}
            />
        </>
    );
};

export default ICUPatientVitals;