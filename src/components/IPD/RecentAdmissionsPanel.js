import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Eye,
  ArrowRightLeft,
  LogOut
} from "lucide-react";

const PRIMARY = "#521785";

const statusStyles = {
  Stable: "bg-[#DCFCE7] text-[#16A34A]",
  "Under Treatment": "bg-[#FFEDD5] text-[#EA580C]",
  Critical: "bg-[#FEE2E2] text-[#EF4444]",
};


const RecentAdmissionsPanel = ({ admissions }) => {
  const navigate = useNavigate();

  const recentPatients = useMemo(
    () =>
      [...admissions]
        .sort(
          (a, b) =>
            new Date(b.admissionDateTime || b.admissionDate) -
            new Date(a.admissionDateTime || a.admissionDate)
        )
        .slice(0, 5),
    [admissions]
  );

  return (
    <div className="flex flex-col gap-4">
      {/* ================= RECENT ADMISSIONS ================= */}
      <div className="bg-white border border-[#e5e5e5] rounded-lg p-3 sm:p-4 md:p-5">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <h2 className="text-[15px] sm:text-[16px] font-semibold text-[#343C6A]">
            Recently Admitted Patients
          </h2>

          <button
            onClick={() => navigate("/ipd/admissions")}
            className="
              shrink-0
              text-[12px]
              sm:text-[13px]
              font-medium
              border
              border-[#d9d0f7]
              rounded-md
              px-2.5
              sm:px-3
              py-1.5
              hover:bg-[#F8F5FC]
              transition-colors
            "
            style={{ color: PRIMARY }}
          >
            View All
          </button>
        </div>

        {/* ================= DESKTOP TABLE ================= */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="text-left text-[#8BA3CB] border-b border-[#eee]">
                <th className="font-medium py-2 whitespace-nowrap">
                  Patient Name
                </th>
                <th className="font-medium py-2 whitespace-nowrap">
                  MRN
                </th>
                <th className="font-medium py-2 whitespace-nowrap">
                  Age / Gender
                </th>
                <th className="font-medium py-2 whitespace-nowrap">
                  Ward / Room / Bed
                </th>
                <th className="font-medium py-2 whitespace-nowrap">
                  Admitted On
                </th>
                <th className="font-medium py-2 whitespace-nowrap">
                  Diagnosis
                </th>
                <th className="font-medium py-2 whitespace-nowrap">
                  Status
                </th>
                <th className="font-medium py-2 whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              {recentPatients.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-[#f3f3f3] last:border-b-0"
                >
                  <td className="py-2.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                        <UserRound size={13} color={PRIMARY} />
                      </div>

                      <span className="font-medium text-[#343C6A]">
                        {p.name}
                      </span>
                    </div>
                  </td>

                  <td className="text-[#343C6A]">
                    {p.mrn}
                  </td>

                  <td className="text-[#343C6A] whitespace-nowrap">
                    {p.age} Y / {p.gender}
                  </td>

                  <td className="text-[#343C6A] whitespace-nowrap">
                    {p.ward} /{" "}
                    {p.room?.replace("Room ", "")} /{" "}
                    {p.currentBed}
                  </td>

                  <td className="text-[#343C6A] whitespace-nowrap">
                    <div>{p.admissionDate}</div>
                    <div className="text-[11px] text-[#8BA3CB]">
                      {p.admissionTime}
                    </div>
                  </td>

                  <td className="text-[#343C6A]">
                    {p.diagnosis}
                  </td>

                  <td>
                    <span
                      className={`inline-flex text-[11px] font-medium px-2 py-0.5 rounded-full whitespace-nowrap ${
                        statusStyles[p.status] ||
                        "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  <td>
                    <div className="flex gap-1.5 justify-center">
                      <button
                        onClick={() =>
                          navigate(`/ipd/admissions/${p.mrn}`)
                        }
                        className="p-1.5 rounded-md border border-[#d9d0f7] text-[#7C3AED]"
                      >
                        <Eye size={13} />
                      </button>

                      
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* ================= MOBILE & TABLET CARDS ================= */}
        <div className="xl:hidden flex flex-col gap-3">
          {recentPatients.map((p) => (
            <div
              key={p.id}
              className="
                bg-white
                border
                border-[#E9E6EE]
                rounded-xl
                overflow-hidden
              "
            >
              {/* Patient Header */}
              <div className="p-3.5 sm:p-4">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#F3E8FF] flex items-center justify-center shrink-0">
                      <UserRound
                        size={16}
                        color={PRIMARY}
                      />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] text-[#8BA3CB] mb-0.5">
                        Patient
                      </p>

                      <h3 className="text-[14px] sm:text-[15px] font-semibold text-[#343C6A] truncate">
                        {p.name}
                      </h3>

                      <p className="text-[12px] text-[#8BA3CB] mt-1">
                        MRN:{" "}
                        <span className="font-medium text-[#343C6A]">
                          {p.mrn}
                        </span>
                      </p>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 inline-flex items-center text-[10px] sm:text-[11px] font-medium px-2.5 py-1 rounded-full whitespace-nowrap ${
                      statusStyles[p.status] ||
                      "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.status}
                  </span>
                </div>
              </div>

              {/* Main Information */}
              <div className="border-t border-[#F1EEF4] bg-[#FCFBFD]">
                <div className="grid grid-cols-1 sm:grid-cols-2">
                  {/* Age / Gender */}
                  <div className="px-3.5 sm:px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#F1EEF4]">
                    <p className="text-[10px] uppercase tracking-wide text-[#8BA3CB] mb-1">
                      Age / Gender
                    </p>

                    <p className="text-[13px] font-medium text-[#343C6A]">
                      {p.age} Y / {p.gender}
                    </p>
                  </div>

                  {/* Admission Date */}
                  <div className="px-3.5 sm:px-4 py-3 border-b sm:border-b-0 border-[#F1EEF4]">
                    <p className="text-[10px] uppercase tracking-wide text-[#8BA3CB] mb-1">
                      Admitted On
                    </p>

                    <p className="text-[13px] font-medium text-[#343C6A]">
                      {p.admissionDate}
                    </p>

                    <p className="text-[11px] text-[#8BA3CB] mt-0.5">
                      {p.admissionTime}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 border-t border-[#F1EEF4]">
                  {/* Ward */}
                  <div className="px-3.5 sm:px-4 py-3 border-b sm:border-b-0 sm:border-r border-[#F1EEF4]">
                    <p className="text-[10px] uppercase tracking-wide text-[#8BA3CB] mb-1">
                      Ward / Room / Bed
                    </p>

                    <p className="text-[13px] font-medium text-[#343C6A] break-words">
                      {p.ward} /{" "}
                      {p.room?.replace("Room ", "")} /{" "}
                      {p.currentBed}
                    </p>
                  </div>

                  {/* Diagnosis */}
                  <div className="px-3.5 sm:px-4 py-3">
                    <p className="text-[10px] uppercase tracking-wide text-[#8BA3CB] mb-1">
                      Diagnosis
                    </p>

                    <p className="text-[13px] font-medium text-[#343C6A] break-words">
                      {p.diagnosis || "-"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="border-t border-[#F1EEF4] p-3 sm:p-3.5">
                <div className="grid grid-cols-3 gap-2 sm:gap-3">
                  <button
                    onClick={() =>
                      navigate(`/ipd/admissions/${p.mrn}`)
                    }
                    className="
                      min-h-[40px]
                      flex
                      items-center
                      justify-center
                      gap-1.5
                      border
                      border-[#d9d0f7]
                      text-[#7C3AED]
                      rounded-lg
                      text-[12px]
                      sm:text-[13px]
                      font-medium
                      hover:bg-[#F8F5FC]
                      transition-colors
                    "
                  >
                    <Eye size={14} />
                    <span className="hidden sm:inline">
                      View
                    </span>
                  </button>

                </div>
              </div>
            </div>
          ))}

          {recentPatients.length === 0 && (
            <div className="border border-[#e5e5e5] rounded-lg bg-white py-8 px-4 text-center">
              <p className="text-[13px] text-[#8BA3CB]">
                No recent admissions found.
              </p>
            </div>
          )}
        </div>
      </div>   

    </div>
  );
};

export default RecentAdmissionsPanel;