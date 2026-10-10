import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  Calendar,
  Clock,
  User,
  FileText,
  Activity,
  AlertCircle,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { icuService } from "../../../services/icuService";
import { toast } from "react-toastify";
import { formatTime } from "../../../utils/formateTime";

const ICUProcedureDetails = () => {
  const navigate = useNavigate();
  const { procedureId } = useParams();
  const [procedure, setProcedure] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadProcedure = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await icuService.getProcedureById(procedureId);
        if (active) {
          setProcedure(response?.data || null);
        }
      } catch (err) {
        console.error("Failed to load ICU procedure:", err);
        if (active) {
          setProcedure(null);
          setError(
            err?.response?.data?.message ||
            "Failed to load procedure details."
          );
          toast.error("Failed to load procedure details.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProcedure();

    return () => {
      active = false;
    };
  }, [procedureId]);

  const hasComplications =
    procedure?.complications === true ||
    procedure?.complications === 1 ||
    procedure?.complications === "1" ||
    procedure?.complications === "Yes";

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
          Loading procedure details...
        </div>
      </div>
    );
  }

  if (!procedure || error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
        <div className="mx-auto max-w-7xl">
          <button
            onClick={() => navigate("/icu-procedure")}
            className="mb-6 flex items-center gap-2 text-sm font-medium text-[#521785] hover:underline"
          >
            <ArrowLeft size={18} />
            Back to Procedures
          </button>

          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
            <FileText size={42} className="mx-auto mb-3 text-gray-400" />
            <h2 className="text-lg font-semibold text-gray-800">
              {error ? "Unable to load procedure" : "Procedure record not found"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              {error || "This procedure record could not be found. Please go back and open it again from the list."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-1">
      <div className="mx-auto max-w-7xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-5 flex items-center gap-2 text-sm font-medium text-[#521785] transition hover:underline"
        >
          <ArrowLeft size={18} />
          Back to Procedures
        </button>

        {/* Page Header */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-purple-100">
              <User size={22} className="text-[#521785]" />
            </div>

            <div>
              <h1 className="text-xl font-bold text-gray-800 sm:text-2xl">Procedure Details</h1>
              <p className="mt-1 text-sm text-gray-500">Full record of this procedure</p>
            </div>
          </div>
        </div>

        {/* Patient Information */}
        <div className="mb-6 rounded-xl border border-gray-200 bg-white p-4 shadow-sm sm:p-6">
          <div className="mb-4 flex items-center gap-2">
            <User size={19} className="text-[#521785]" />
            <h2 className="text-base font-semibold text-gray-800">Patient Information</h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div>
              <p className="text-xs font-medium text-gray-500">Patient Name</p>
              <p className="mt-1 text-sm font-semibold text-gray-800 capitalize">{procedure.patient?.name || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Patient ID</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{procedure.patient?.patientId || procedure.patientUniqueId || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Email</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{procedure.patient?.email || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Mobile</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{procedure.patient?.mobileNumber || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Gender</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{procedure.patient?.gender || "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium text-gray-500">Age</p>
              <p className="mt-1 text-sm font-semibold text-gray-800">{procedure.patient?.age ?? "—"}</p>
            </div>

          </div>
        </div>

        {/* Procedure */}
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
          {/* Procedure Header */}
          <div className="border-b border-gray-200 p-4 sm:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-bold text-gray-800 sm:text-xl">{procedure.procedureName}</h2>
                <p className="mt-1 text-xs text-gray-500">Procedure ID: {procedure.id}</p>
              </div>

              <div className="flex items-center gap-2 rounded-lg bg-gray-50 px-3 py-2">
                <AlertCircle
                  size={17}
                  className={hasComplications ? "text-red-600" : "text-emerald-600"}
                />
                <span className="text-sm font-medium text-gray-700">
                  Complications:{" "}
                  <span className={hasComplications ? "text-red-600" : "text-emerald-600"}>
                    {hasComplications ? "Yes" : "No"}
                  </span>
                </span>
              </div>
            </div>
          </div>

          {/* Date / Time / Complications */}
          <div className="grid grid-cols-1 gap-4 border-b border-gray-200 p-4 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <Calendar size={18} className="text-[#521785]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Procedure Date</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">{procedure.procedureDate}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <Clock size={18} className="text-[#521785]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Procedure Time</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">{formatTime(procedure.procedureTime)}</p>
              </div>
            </div>

            <div className="flex items-start gap-3 rounded-lg bg-gray-50 p-4">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-100">
                <Activity size={18} className="text-[#521785]" />
              </div>
              <div>
                <p className="text-xs font-medium text-gray-500">Added By</p>
                <p className="mt-1 text-sm font-semibold text-gray-800">{procedure.recordedByDetails?.name || "—"}</p>
              </div>
            </div>
          </div>

          {/* Procedure Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 p-4 sm:p-6">
            <div>
              <div className="mb-2 flex items-center gap-2">
                <FileText size={17} className="text-[#521785]" />
                <h3 className="text-sm font-semibold text-gray-800">Pre-Procedure Notes</h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-600">{procedure.preProcedureNotes || "—"}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Activity size={17} className="text-[#521785]" />
                <h3 className="text-sm font-semibold text-gray-800">Indication</h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-600">{procedure.indication || "—"}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <FileText size={17} className="text-[#521785]" />
                <h3 className="text-sm font-semibold text-gray-800">Procedure Details</h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-600">{procedure.details || "—"}</p>
              </div>
            </div>

            <div>
              <div className="mb-2 flex items-center gap-2">
                <Activity size={17} className="text-[#521785]" />
                <h3 className="text-sm font-semibold text-gray-800">Post-Procedure Condition</h3>
              </div>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="text-sm leading-6 text-gray-600">{procedure.postProcedureCondition || "—"}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ICUProcedureDetails;