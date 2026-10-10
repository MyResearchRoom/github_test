import React, { useEffect, useMemo, useState } from "react";
import {
    ArrowLeft,
    Activity,
    User,
    Phone,
    Plus,
} from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import TableComponent from "../../../commonComponent/TableComponent";
import Pagination from "../../../commonComponent/Pagination";
import { usePagination } from "../../../hooks/usePagination";
import { formatTime } from "../../../utils/formatTime";
import ICURecordVitalModal from "../../../modal/ICU/ICURecordVitals";
import { icuService } from "../../../services/icuService";
import { patientService } from "../../../services/patientService";
import { parseDateTime } from "../../../utils/parseDateTime";
import AddVitalsModal from "../../../modal/IPD/AddVitalsModal";
import { getCurrentDate } from "../../../utils/getCurrentDate";

const PRIMARY = "#521785";
const ITEMS_PER_PAGE = 10;

// --------------------------------------------------
// CLIENT-SIDE STATUS CALCULATION
// --------------------------------------------------

const computeStatus = (vital) => {
    const temp = Number(vital.temperature);
    const pulse = Number(vital.pulse);
    const spo2 = Number(vital.spo2);
    const rr = Number(vital.respiratoryRate);

    let systolic = 0;
    let diastolic = 0;

    if (
        vital.bp &&
        typeof vital.bp === "string" &&
        vital.bp.includes("/")
    ) {
        const [sysParts, diaParts] = vital.bp.split("/");

        systolic = Number(sysParts);
        diastolic = Number(diaParts);
    }

    if (
        temp >= 39.5 ||
        pulse >= 130 ||
        spo2 < 90 ||
        rr >= 30 ||
        systolic >= 180 ||
        systolic <= 90
    ) {
        return "Critical";
    }

    if (
        temp >= 38 ||
        pulse >= 110 ||
        spo2 < 94 ||
        rr >= 24 ||
        systolic >= 140 ||
        diastolic >= 90
    ) {
        return "Abnormal";
    }

    return "Normal";
};


const DetailItem = ({ label, value }) => (
    <div>
        <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
            {label}
        </p>

        <p className="text-sm sm:text-base font-semibold text-zinc-800 mt-1">
            {value || "-"}
        </p>
    </div>
);


const VitalCard = ({ vital, index }) => {
    const isAlternate = index % 2 !== 0;

    return (
        <div
            className={`rounded-xl border border-zinc-200 overflow-hidden hover:border-zinc-300 transition ${isAlternate ? "bg-[#FAF7FF]" : "bg-white"
                }`}
        >
            {/* DATE HEADER */}
            <div
                className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 px-4 py-3 border-b border-zinc-100 ${isAlternate ? "bg-[#F3E8FF]" : "bg-zinc-50"
                    }`}
            >
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-[#521785]" />

                    <p className="text-sm font-semibold text-zinc-800">
                        {vital.date}
                    </p>

                    <span className="text-zinc-300">•</span>

                    <p className="text-sm text-zinc-500">
                        {formatTime(vital.time)}
                    </p>
                </div>

                {vital.recordedByDetails && (
                    <p className="text-xs text-zinc-400">
                        Recorded by{" "}
                        <span className="font-medium text-zinc-600">
                            {vital.recordedByDetails.name}
                        </span>
                    </p>
                )}
            </div>

            {/* VITALS */}
            <div className="p-4">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <DetailItem
                        label="Temperature"
                        value={
                            vital.temperature
                                ? `${Number(vital.temperature)}°C`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Pulse"
                        value={
                            vital.pulse
                                ? `${vital.pulse} bpm`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="RR"
                        value={
                            vital.respiratoryRate
                                ? `${vital.respiratoryRate} breaths/min`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Blood Pressure"
                        value={
                            vital.bp
                                ? `${vital.bp} mmHg`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="SpO2"
                        value={
                            vital.spo2 !== "" &&
                                vital.spo2 !== null &&
                                vital.spo2 !== undefined
                                ? `${Number(vital.spo2)}%`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="BSL"
                        value={
                            vital.bsl
                                ? `${Number(vital.bsl)} mg/dL`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Insulin"
                        value={
                            vital.insulin
                                ? `${Number(vital.insulin)} units`
                                : "-"
                        }
                    />

                    <DetailItem
                        label="Status"
                        value={vital.status}
                    />
                </div>

                {/* REMARKS */}
                <div className="mt-4 pt-4 border-t border-zinc-100">
                    <p className="text-[10px] sm:text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                        Remarks
                    </p>

                    <p className="text-sm text-zinc-600 leading-5 mt-1">
                        {vital.remarks || "-"}
                    </p>
                </div>
            </div>
        </div>
    );
};



const ICUVitalsDetails = () => {
    const navigate = useNavigate();
    const { patientId: paramPatientId } = useParams();
    const { state } = useLocation();

    const patientId = state?.patientId || paramPatientId;
    const icuAdmissionId = state?.icuAdmissionId;
    const patientNameFromState = state?.patientName;

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [vitals, setVitals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [patientDetails, setPatientDetails] = useState(null);
    const [recordedAtDate, setRecordedAtDate] = useState(getCurrentDate());


    const fetchPatientDetails = async () => {
        if (!patientId) return;

        try {
            const response = await patientService.getPatientsById(patientId);

            if (response?.success) {
                setPatientDetails(response.patient || null);
            } else {
                setPatientDetails(null);
            }
        } catch (error) {
            console.error("Error fetching patient details:", error);
            setPatientDetails(null);
        }
    };


    const fetchPatientVitals = async () => {
        if (!patientId) return;

        try {
            setLoading(true);

            const params = {
                patientId,
            };

            if (icuAdmissionId) {
                params.icuAdmissionId = icuAdmissionId;
            }

            if (recordedAtDate) {
                params.recordedAtDate = recordedAtDate;
            }

            const response = await icuService.getVitals(params);

            if (response?.success) {
                setVitals(response?.vitals || []);
            } else {
                setVitals([]);
            }
        } catch (error) {
            console.error("Error fetching patient vitals:", error);
            setVitals([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatientVitals();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId, icuAdmissionId, recordedAtDate]);

    useEffect(() => {
        fetchPatientDetails();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [patientId]);


    const patientVitals = useMemo(() => {
        return vitals
            .map((vital) => ({
                id: vital.id,
                date: vital.recordedAtDate,
                time: vital.recordedAtTime,
                temperature: vital.temperature,
                pulse: vital.pulse,
                respiratoryRate: vital.respiratoryRate,
                bp: vital.bp,
                spo2: vital.spo2,
                bsl: vital.bsl,
                insulin: vital.insulin,
                remarks: vital.notes,
                recordedByDetails: vital.recordedByDetails,
                status: computeStatus(vital),
            }))
            .sort(
                (a, b) =>
                    parseDateTime(b.date, b.time) -
                    parseDateTime(a.date, a.time)
            );
    }, [vitals]);


    const patient = useMemo(() => {
        return {
            name:
                patientDetails?.name ||
                patientNameFromState ||
                "-",

            patientId:
                patientDetails?.patientId ||
                patientId,

            age:
                patientDetails?.age ??
                "-",

            mobileNumber:
                patientDetails?.mobileNumber ||
                "-",
        };
    }, [
        patientDetails,
        patientId,
        patientNameFromState,
    ]);

    const {
        currentPage,
        totalPages,
        goToPage,
        setTotalPages,
    } = usePagination(1);

    useEffect(() => {
        goToPage(1);
    }, [recordedAtDate, goToPage]);

    useEffect(() => {
        setTotalPages(
            Math.max(
                1,
                Math.ceil(
                    patientVitals.length / ITEMS_PER_PAGE
                )
            )
        );
    }, [
        patientVitals.length,
        setTotalPages,
    ]);

    useEffect(() => {
        if (currentPage > totalPages) {
            goToPage(1);
        }
    }, [
        currentPage,
        totalPages,
        goToPage,
    ]);

    const paginatedVitals = useMemo(() => {
        const start =
            (currentPage - 1) * ITEMS_PER_PAGE;

        return patientVitals.slice(
            start,
            start + ITEMS_PER_PAGE
        );
    }, [
        patientVitals,
        currentPage,
    ]);


    const columns = [
        {
            label: "Date",
            headerClassName: "text-left pl-4 whitespace-nowrap",
            className: "pl-4 py-3",
            render: (item) => (
                <span className="text-zinc-700 whitespace-nowrap">
                    {item.date || "-"}
                </span>
            ),
        },
        {
            label: "Time",
            headerClassName: "text-left pl-4 whitespace-nowrap",
            className: "pl-4 py-3",
            render: (item) => (
                <span className="text-zinc-700 whitespace-nowrap">
                    {formatTime(item.time)}
                </span>
            ),
        },

        {
            label: "Temp (°C)",
            headerClassName: "text-left pl-4 whitespace-nowrap",
            className: "pl-4 py-3",
            render: (item) => (
                <span className="text-zinc-700 whitespace-nowrap">
                    {item.temperature !== null &&
                        item.temperature !== undefined &&
                        item.temperature !== ""
                        ? Number(item.temperature)
                        : "-"}
                </span>
            ),
        },
        {
            label: "Pulse (bpm) & RR (breaths/min)",
            headerClassName: "text-left pl-4 max-w-[150px] whitespace-normal",
            className: "pl-4 py-3 whitespace-nowrap",
            render: (item) => (
                <span className="text-zinc-700">
                    {item.pulse || "-"} &{" "}
                    {item.respiratoryRate || "-"}
                </span>
            ),
        },
        {
            label: "Blood Pressure (mmHg)",
            headerClassName: "text-left pl-4 max-w-[150px] whitespace-normal",
            className: "pl-4 py-3 whitespace-nowrap",
            render: (item) => (
                <span className="text-zinc-700">
                    {item.bp || "-"}
                </span>
            ),
        },
        {
            label: "SpO2 (%)",
            headerClassName: "text-left pl-4 whitespace-nowrap",
            className: "pl-4 py-3",
            render: (item) => (
                <span className="text-zinc-700 whitespace-nowrap">
                    {item.spo2 !== "" &&
                        item.spo2 !== null &&
                        item.spo2 !== undefined
                        ? Number(item.spo2)
                        : "-"}
                </span>
            ),
        },
        {
            label: "BSL (mg/dL) & Insulin (units)",
            headerClassName: "text-left pl-4 max-w-[120px] whitespace-normal",
            className: "pl-4 py-3 whitespace-nowrap",
            render: (item) => (
                <span className="text-zinc-700">
                    {item.bsl !== "" &&
                        item.bsl !== null &&
                        item.bsl !== undefined
                        ? Number(item.bsl)
                        : "-"}{" "}
                    &{" "}
                    {item.insulin !== "" &&
                        item.insulin !== null &&
                        item.insulin !== undefined
                        ? Number(item.insulin)
                        : "-"}
                </span>
            ),
        },
        {
            label: "Recorded By",
            headerClassName: "text-left pl-4 whitespace-nowrap",
            className: "pl-4 py-3",
            render: (item) => (
                <span className="text-zinc-700 whitespace-nowrap">
                    {item?.recordedByDetails?.name || "-"}
                </span>
            ),
        },
    ];


    if (!patientId) {
        return (
            <div className="w-full mx-auto p-3 sm:p-4 md:p-6 max-w-[1100px] flex flex-col gap-4">
                <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-1 text-sm font-medium w-fit"
                    style={{ color: PRIMARY }}
                >
                    <ArrowLeft size={16} />
                    Back to Vitals
                </button>

                <div className="bg-white rounded-2xl border border-zinc-200 p-8 text-center text-sm text-zinc-500">
                    This patient could not be found. Please go back and open
                    the patient again from the Vitals list.
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="w-full mx-auto p-1 flex flex-col gap-5 max-w-[1400px] 2xl:max-w-[1800px]">

                {/* BACK + HEADER */}
                <div className="flex items-center gap-3 ">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="w-9 h-9 rounded-md border border-zinc-200 bg-white flex items-center justify-center text-zinc-700 hover:bg-zinc-50 transition shrink-0"
                    >
                        <ArrowLeft size={18} />
                    </button>

                    <div className="min-w-0">
                        <h1 className="text-xl sm:text-2xl font-bold text-zinc-900 tracking-tight">
                            {patient.name}
                        </h1>

                        <p className="text-xs sm:text-sm text-zinc-400 mt-1">
                            Patient Vitals
                        </p>
                    </div>
                </div>

                {/* PATIENT INFORMATION */}
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm p-4 sm:p-5">
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

                        {/* PATIENT */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
                                <User
                                    size={17}
                                    className="text-[#521785]"
                                />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Patient
                                </p>

                                <p className="text-sm font-semibold text-zinc-800 mt-0.5">
                                    {patient.name}
                                </p>
                            </div>
                        </div>

                        {/* AGE */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
                                <User
                                    size={17}
                                    className="text-[#521785]"
                                />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Age
                                </p>

                                <p className="text-sm font-semibold text-zinc-800 mt-0.5">
                                    {patient.age !== "-"
                                        ? `${patient.age} Years`
                                        : "-"}
                                </p>
                            </div>
                        </div>

                        {/* CONTACT */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-lg bg-[#F3E8FF] flex items-center justify-center shrink-0">
                                <Phone
                                    size={17}
                                    className="text-[#521785]"
                                />
                            </div>

                            <div>
                                <p className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                                    Contact
                                </p>

                                <p className="text-sm font-semibold text-zinc-800 mt-0.5">
                                    {patient.mobileNumber}
                                </p>
                            </div>
                        </div>

                    </div>
                </div>

                {/* VITAL HISTORY */}
                <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden">

                    {/* SECTION HEADER */}
                    <div className="px-4 sm:px-5 py-4 border-b border-zinc-100 flex flex-col justify-between sm:flex-row">

                        <div>
                            <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
                                Patient Vitals
                            </p>

                            <p className="text-xs text-zinc-400 mt-1">
                                {patientVitals.length}{" "}
                                {patientVitals.length === 1
                                    ? "vital record"
                                    : "vital records"}{" "}
                                recorded
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-2 w-full sm:w-auto mt-2 sm:mt-0">
                            <input
                                type="date"
                                value={recordedAtDate}
                                onChange={(event) => setRecordedAtDate(event.target.value)}
                                aria-label="Filter vitals by recorded date"
                                className="h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800"
                            />

                            {/* ADD VITALS */}
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(true)}
                                className="flex items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs sm:text-sm font-medium text-white transition-colors hover:opacity-90 whitespace-nowrap"
                                style={{
                                    backgroundColor: PRIMARY,
                                }}
                            >
                                <Plus size={15} />
                                <span>Add Vitals</span>
                            </button>

                        </div>
                    </div>

                    {/* VITAL LIST */}
                    <div className="p-4 sm:p-5">

                        {loading ? (
                            <div className="py-12 text-center">
                                <p className="text-sm text-zinc-500">
                                    Loading vitals...
                                </p>
                            </div>
                        ) : patientVitals.length > 0 ? (
                            <>
                                {/* MOBILE + TABLET */}
                                <div className="flex flex-col gap-4 lg:hidden">
                                    {paginatedVitals.map(
                                        (vital, index) => (
                                            <VitalCard
                                                key={vital.id}
                                                vital={vital}
                                                index={
                                                    (currentPage - 1) *
                                                    ITEMS_PER_PAGE +
                                                    index
                                                }
                                            />
                                        )
                                    )}
                                </div>

                                {/* DESKTOP TABLE */}
                                <div className="hidden lg:block overflow-x-auto">
                                    <TableComponent
                                        columns={columns}
                                        data={paginatedVitals}
                                        loading={loading}
                                    />
                                </div>

                                {/* PAGINATION */}
                                {totalPages > 0 && (
                                    <div className="mt-5">
                                        <Pagination
                                            currentPage={currentPage}
                                            totalPages={totalPages}
                                            goToPage={goToPage}
                                        />
                                    </div>
                                )}
                            </>
                        ) : (
                            <div className="py-12 text-center">
                                <p className="text-sm font-semibold text-zinc-600">
                                    No vitals recorded
                                </p>

                                <p className="text-xs text-zinc-400 mt-1">
                                    No vital records are available for this patient.
                                </p>
                            </div>
                        )}

                    </div>
                </div>
            </div>

            {/* ADD VITALS MODAL */}
            

            <AddVitalsModal
                isOpen={isAddModalOpen}
                onClose={() => setIsAddModalOpen(false)}
                patientId={patientId}
                icuAdmissionId={icuAdmissionId}
                onSuccess={fetchPatientVitals}
                isICU={true}
            />
        </>
    );
};

export default ICUVitalsDetails;