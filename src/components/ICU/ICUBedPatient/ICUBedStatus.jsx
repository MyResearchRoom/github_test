// src/components/ICU/ICUBedStatus.jsx

import React from "react";
import {
  BedDouble,
  CheckCircle2,
  CircleAlert,
  LoaderCircle,
  Wrench,
} from "lucide-react";

const statusStyles = {
  Available: {
    wrapper: "bg-emerald-50 border-emerald-100",
    icon: "text-emerald-600",
    badge: "bg-emerald-50 text-emerald-600",
    dot: "bg-emerald-500",
  },

  Occupied: {
    wrapper: "bg-blue-50 border-blue-100",
    icon: "text-blue-600",
    badge: "bg-blue-50 text-blue-600",
    dot: "bg-blue-500",
  },

  Isolation: {
    wrapper: "bg-purple-50 border-purple-100",
    icon: "text-purple-600",
    badge: "bg-purple-50 text-purple-600",
    dot: "bg-purple-500",
  },

  Cleaning: {
    wrapper: "bg-amber-50 border-amber-100",
    icon: "text-amber-600",
    badge: "bg-amber-50 text-amber-600",
    dot: "bg-amber-500",
  },

  Maintenance: {
    wrapper: "bg-red-50 border-red-100",
    icon: "text-red-600",
    badge: "bg-red-50 text-red-600",
    dot: "bg-red-500",
  },
};

const statusIcons = {
  Available: CheckCircle2,
  Occupied: BedDouble,
  Isolation: CircleAlert,
  Cleaning: LoaderCircle,
  Maintenance: Wrench,
};

const ICUBedStatus = ({ beds = [] }) => {
  const getStatusStyle = (status) => {
    return (
      statusStyles[status] || {
        wrapper: "bg-zinc-50 border-zinc-100",
        icon: "text-zinc-500",
        badge: "bg-zinc-50 text-zinc-600",
        dot: "bg-zinc-400",
      }
    );
  };

  return (
    <div className="w-full">
      {/* ================= DESKTOP TABLE ================= */}
      <div className="hidden md:block">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse">
            <thead>
              <tr className="border-b border-zinc-200">
                <th className="px-5 py-4 text-left text-xs xl:text-sm font-semibold text-zinc-500">
                  Bed
                </th>

                <th className="px-5 py-4 text-left text-xs xl:text-sm font-semibold text-zinc-500">
                  ICU Unit
                </th>

                <th className="px-5 py-4 text-left text-xs xl:text-sm font-semibold text-zinc-500">
                  Patient
                </th>

                <th className="px-5 py-4 text-left text-xs xl:text-sm font-semibold text-zinc-500">
                  UHID
                </th>

                <th className="px-5 py-4 text-left text-xs xl:text-sm font-semibold text-zinc-500">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              {beds.map((bed) => {
                const style = getStatusStyle(bed.status);
                const StatusIcon =
                  statusIcons[bed.status] || BedDouble;

                return (
                  <tr
                    key={bed.id}
                    className="border-b border-zinc-100 last:border-0 hover:bg-zinc-50/70 transition-colors"
                  >
                    {/* Bed */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`
                            flex
                            h-9
                            w-9
                            items-center
                            justify-center
                            rounded-lg
                            border
                            ${style.wrapper}
                          `}
                        >
                          <BedDouble
                            size={17}
                            className={style.icon}
                          />
                        </div>

                        <span className="text-sm xl:text-[15px] font-semibold text-zinc-800">
                          {bed.bed}
                        </span>
                      </div>
                    </td>

                    {/* Unit */}
                    <td className="px-5 py-4">
                      <span className="text-sm xl:text-[15px] text-zinc-600">
                        {bed.icuUnit}
                      </span>
                    </td>

                    {/* Patient */}
                    <td className="px-5 py-4">
                      {bed.patient ? (
                        <span className="text-sm xl:text-[15px] font-medium text-zinc-700">
                          {bed.patient}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* UHID */}
                    <td className="px-5 py-4">
                      {bed.uhid ? (
                        <span className="text-sm xl:text-[15px] text-zinc-600">
                          {bed.uhid}
                        </span>
                      ) : (
                        <span className="text-sm text-zinc-400">
                          —
                        </span>
                      )}
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4">
                      <span
                        className={`
                          inline-flex
                          items-center
                          gap-2
                          rounded-full
                          px-3
                          py-1.5
                          text-xs
                          xl:text-sm
                          font-medium
                          ${style.badge}
                        `}
                      >
                        <StatusIcon
                          size={14}
                          className={
                            bed.status === "Cleaning"
                              ? "animate-spin"
                              : ""
                          }
                        />

                        {bed.status}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= MOBILE / TABLET ================= */}
      <div className="grid grid-cols-1 gap-3 md:hidden">
        {beds.map((bed) => {
          const style = getStatusStyle(bed.status);
          const StatusIcon =
            statusIcons[bed.status] || BedDouble;

          return (
            <div
              key={bed.id}
              className="rounded-xl border border-zinc-200 bg-white p-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div
                    className={`
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-lg
                      border
                      ${style.wrapper}
                    `}
                  >
                    <BedDouble
                      size={18}
                      className={style.icon}
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-zinc-800">
                      {bed.bed}
                    </p>

                    <p className="mt-0.5 text-xs text-zinc-500">
                      {bed.icuUnit}
                    </p>
                  </div>
                </div>

                <span
                  className={`
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    px-2.5
                    py-1
                    text-[11px]
                    font-medium
                    ${style.badge}
                  `}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${style.dot}`}
                  />

                  {bed.status}
                </span>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4 border-t border-zinc-100 pt-3">
                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                    Patient
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-700">
                    {bed.patient || "No patient assigned"}
                  </p>
                </div>

                <div>
                  <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-400">
                    UHID
                  </p>

                  <p className="mt-1 text-xs font-medium text-zinc-700">
                    {bed.uhid || "—"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ICUBedStatus;