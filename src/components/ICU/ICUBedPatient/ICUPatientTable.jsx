import React from "react";
import {
  BedDouble,
  UserRound,
  Wrench,
  Eye,
  ArrowRightLeft,
  UserPlus,
} from "lucide-react";

const conditionStyle = (condition) => {
  switch (condition) {
    case "Critical":
      return "bg-red-50 text-red-700 border-red-100";

    case "Watch":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "Stable":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    default:
      return "bg-zinc-50 text-zinc-600 border-zinc-100";
  }
};

const statusStyle = (status) => {
  switch (status) {
    case "Isolation":
      return "bg-purple-50 text-purple-700 border-purple-100";

    case "Occupied":
      return "bg-blue-50 text-blue-700 border-blue-100";

    case "Available":
      return "bg-emerald-50 text-emerald-700 border-emerald-100";

    case "Cleaning":
      return "bg-amber-50 text-amber-700 border-amber-100";

    case "Maintenance":
      return "bg-red-50 text-red-700 border-red-100";

    default:
      return "bg-zinc-50 text-zinc-600 border-zinc-100";
  }
};

const ICUPatientTable = ({
  data = [],
  onView,
  onTransfer,
  onAssign,
}) => {
  if (!data.length) {
    return (
      <div className="px-5 py-12 text-center">
        <div
          className="
            mx-auto
            h-12
            w-12
            rounded-full
            bg-zinc-100
            flex
            items-center
            justify-center
          "
        >
          <BedDouble
            size={21}
            className="text-zinc-400"
          />
        </div>

        <p className="mt-3 text-sm font-semibold text-zinc-700">
          No records found
        </p>

        <p className="text-xs text-zinc-400 mt-1">
          Try changing the selected tab or search term.
        </p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-zinc-100">
      {data.map((row) => {
        const isBed = row.rowType === "bed";

        return (
          <div
            key={row.id}
            className="
              p-4
              sm:p-5
              hover:bg-zinc-50/50
              transition
            "
          >
            {/* TOP */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div
                  className="
                    h-10
                    w-10
                    rounded-xl
                    bg-zinc-100
                    flex
                    items-center
                    justify-center
                    shrink-0
                  "
                >
                  {isBed ? (
                    row.status === "Maintenance" ? (
                      <Wrench
                        size={18}
                        className="text-red-500"
                      />
                    ) : (
                      <BedDouble
                        size={18}
                        className="text-zinc-500"
                      />
                    )
                  ) : (
                    <UserRound
                      size={18}
                      className="text-blue-600"
                    />
                  )}
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      font-semibold
                      text-zinc-900
                      text-sm
                      sm:text-base
                      truncate
                    "
                  >
                    {isBed
                      ? "No Patient"
                      : row.patient}
                  </p>

                  <p className="text-xs text-zinc-400 mt-0.5">
                    {isBed
                      ? row.icuUnit
                      : `${row.age}/${row.gender}`}
                  </p>
                </div>
              </div>

              {/* BED */}
              <span
                className="
                  shrink-0
                  text-sm
                  font-semibold
                  text-zinc-800
                  bg-zinc-100
                  px-2.5
                  py-1
                  rounded-md
                "
              >
                {row.bed}
              </span>
            </div>

            {/* DETAILS */}
            <div
              className="
                grid
                grid-cols-2
                sm:grid-cols-3
                gap-x-4
                gap-y-3
                mt-4
                pt-4
                border-t
                border-zinc-100
              "
            >
              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  UHID
                </p>

                <p className="text-xs sm:text-sm text-zinc-700 mt-1">
                  {row.uhid || "—"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  Doctor
                </p>

                <p className="text-xs sm:text-sm text-zinc-700 mt-1 truncate">
                  {row.doctor || "—"}
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                  ICU Unit
                </p>

                <p className="text-xs sm:text-sm text-zinc-700 mt-1">
                  {row.icuUnit || "—"}
                </p>
              </div>

              {!isBed && (
                <>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                      Admission
                    </p>

                    <p className="text-xs sm:text-sm text-zinc-700 mt-1">
                      {row.admission || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                      Type
                    </p>

                    <p className="text-xs sm:text-sm text-zinc-700 mt-1">
                      {row.admissionType || "—"}
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                      Condition
                    </p>

                    <div className="mt-1">
                      <span
                        className={`
                          inline-flex
                          items-center
                          px-2
                          py-1
                          rounded-md
                          border
                          text-[11px]
                          font-medium
                          ${conditionStyle(row.condition)}
                        `}
                      >
                        {row.condition || "—"}
                      </span>
                    </div>
                  </div>
                </>
              )}

              {isBed && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-bold text-zinc-400">
                    Status
                  </p>

                  <div className="mt-1">
                    <span
                      className={`
                        inline-flex
                        items-center
                        px-2
                        py-1
                        rounded-md
                        border
                        text-[11px]
                        font-medium
                        ${statusStyle(row.status)}
                      `}
                    >
                      {row.status}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* ACTIONS */}
            <div
              className="
                flex
                items-center
                justify-end
                gap-2
                mt-4
                pt-3
                border-t
                border-zinc-100
              "
            >
              {isBed ? (
                row.status === "Available" && (
                  <button
                    type="button"
                    onClick={() => onAssign?.(row)}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-3
                      py-2
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      text-xs
                      sm:text-sm
                      font-medium
                      hover:bg-blue-100
                      transition
                    "
                  >
                    <UserPlus size={15} />
                    Assign Patient
                  </button>
                )
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onView?.(row)}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-3
                      py-2
                      rounded-lg
                      bg-blue-50
                      text-blue-600
                      text-xs
                      sm:text-sm
                      font-medium
                      hover:bg-blue-100
                      transition
                    "
                  >
                    <Eye size={15} />
                    View
                  </button>

                  <button
                    type="button"
                    onClick={() => onTransfer?.(row)}
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      px-3
                      py-2
                      rounded-lg
                      bg-zinc-100
                      text-zinc-600
                      text-xs
                      sm:text-sm
                      font-medium
                      hover:bg-zinc-200
                      transition
                    "
                  >
                    <ArrowRightLeft size={15} />
                    Transfer
                  </button>
                </>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ICUPatientTable;