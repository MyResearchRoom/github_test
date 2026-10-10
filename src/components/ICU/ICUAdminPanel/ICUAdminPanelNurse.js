import React, { useEffect, useMemo, useState } from "react";
import { Search, Pencil, Lock, Unlock, Trash2 } from "lucide-react";
import TableComponent from "../../../commonComponent/TableComponent";
import { icuService } from "../../../services/icuService";

const getAvatarLetter = (name) => {
  if (!name) return "U";
  const cleanName = name.replace(/^(Dr\.|SN)\s+/i, "");
  return cleanName.charAt(0).toUpperCase();
};

const formatJoinDate = (value) => {
  if (!value) return "-";

  const [year, month, day] = String(value).slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "-";

  return new Date(year, month - 1, day).toLocaleDateString("en-GB");
};

const ICUAdminPanelNurse = ({
  searchTerm,
  setSearchTerm,
}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    const loadNurses = async () => {
      setLoading(true);
      setError("");

      try {
        const response = await icuService.getNurseData();
        if (!Array.isArray(response?.data)) {
          throw new Error("Unexpected nurse data response.");
        }

        if (active) {
          setUsers(
            response.data.map((nurse) => ({
              id: nurse.id ?? nurse.receptionistId,
              fullName: nurse.name || "",
              qualification: nurse.qualification || "Nurse",
              username:  nurse.receptionistId || "",
              email: nurse.email || "",
              phone: nurse.mobileNumber || "",
              joinDate: nurse.dateOfJoining || "",
              gender:nurse.gender || "",
              address :nurse.address || "",
            }))
          );
        }
      } catch (err) {
        console.error("Failed to load ICU nurses:", err);
        if (active) {
          setUsers([]);
          setError(
            err?.response?.data?.message ||
            "Failed to load the nursing roster."
          );
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadNurses();
    return () => {
      active = false;
    };
  }, []);

  const filteredUsers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();
    let list = users;

    if (!term) return list;

    return list.filter(
      (u) =>
        String(u.fullName || "").toLowerCase().includes(term) ||
        String(u.qualification || "").toLowerCase().includes(term) ||
        String(u.username || "").toLowerCase().includes(term)
    );
  }, [users, searchTerm,]);

  const userColumns = [
    {
      label: "USER",
      headerClassName: "text-left px-5",
      className: "px-5 py-3",
      render: (row) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs select-none bg-emerald-100 text-emerald-700">
            {getAvatarLetter(row.fullName)}
          </div>
          <div>
            <p className="font-semibold text-zinc-900 text-sm leading-none">{row.fullName}</p>
            <p className="text-xs text-zinc-400 mt-1 select-all">{row.email}</p>
          </div>
        </div>
      ),
    },
     {
      label: "Id",
      field: "username",
      headerClassName: "text-left px-5",
      className: "px-5 py-3 text-zinc-600 font-medium text-sm select-all",
    },
    {
      label: "Qualification",
      field: "qualification",
      headerClassName: "text-left px-5",
      className: "px-5 py-3 text-zinc-600 text-sm",
    },
    {
      label: "CONTACT",
      field: "phone",
      headerClassName: "text-left px-5",
      className: "px-5 py-3 text-zinc-600 text-sm select-all",
    },

    {
      label: "GENDER",
      field: "gender",
      headerClassName: "text-left px-5",
      className: "px-5 py-3 text-zinc-600 text-sm select-all",
    },
   
    {
      label: "Join Date",
      field: "joinDate",
      headerClassName: "text-left px-5",
      className: "px-5 py-3 text-zinc-600 font-medium text-sm select-all",
      render: (row) => (
        <p>{formatJoinDate(row.joinDate)}</p>
      ),
    },

    {
      label: "ADDRESS",
      field: "address",
      headerClassName: "text-left px-5",
      className: "px-5 py-3 text-zinc-600 text-sm select-all",
    },
    
  ];

  return (
    <div className="bg-white rounded-2xl border border-zinc-200 shadow-sm overflow-hidden mt-2">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 px-4 sm:px-5 py-4 border-b border-zinc-100">
        <div>
          <p className="text-xs sm:text-sm font-bold text-zinc-500 uppercase tracking-wider">
            Nursing Roster
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search by name, username or qualification..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-9 pl-9 pr-3 rounded-lg border border-zinc-200 outline-none focus:border-blue-500 transition text-sm"
            />
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          </div>

        </div>
      </div>

      {error && (
        <p role="alert" className="px-4 py-3 text-sm text-red-600">
          {error}
        </p>
      )}

      {/* DESKTOP VIEW */}
      <div className="hidden lg:block overflow-x-auto">
        {loading ? (
          <p className="py-8 text-center text-sm text-zinc-500">Loading nursing roster...</p>
        ) : (
          <TableComponent columns={userColumns} data={filteredUsers} actionLabel={null} />
        )}
      </div>

      {/* MOBILE & TABLET VIEW */}
      <div className="block lg:hidden p-4 bg-zinc-50/50 space-y-3">
        {loading ? (
          <p className="text-center py-6 text-zinc-500 text-sm">
            Loading nursing roster...
          </p>
        ) : error ? null : filteredUsers.length === 0 ? (
          <p className="text-center py-6 text-zinc-400 text-sm">
            No staff profiles found mapping current parameters.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredUsers.map((row) => (
              <div key={row.id} className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col gap-3">
                <div className="flex items-start justify-between border-b border-zinc-100 pb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs select-none bg-emerald-100 text-emerald-700">
                      {getAvatarLetter(row.fullName)}
                    </div>

                    <div>
                      <h4 className="font-bold text-zinc-900 text-sm">{row.fullName}</h4>
                    </div>
                  </div>

                  <span className={`text-xs font-bold px-2 py-0.5 rounded border ${row.status === "Active" ? "bg-emerald-50 border-emerald-200 text-emerald-600" : "bg-zinc-50 border-zinc-200 text-zinc-400"}`}>
                    {row.status}
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-zinc-500">
                  <div>
                    qualification: <strong className="text-zinc-700">{row.qualification || "--"}</strong>
                  </div>
                  <div>
                    Department: <strong className="text-zinc-600">{row.department || "--"}</strong>
                  </div>
                  <div className="flex items-center gap-1 col-span-1 sm:col-span-2">
                    <span>
                      Phone: <strong className="text-zinc-700 select-all">{row.phone}</strong>
                    </span>
                  </div>
                  <div className="col-span-1 sm:col-span-2 text-zinc-400 truncate">
                    Email: <span className="select-all text-zinc-600">{row.email}</span>
                  </div>
                  <div className="col-span-1 sm:col-span-2 bg-zinc-50 px-2 py-1 rounded text-zinc-500 flex justify-between font-mono text-[11px]">
                    <span>
                      User: <strong className="text-zinc-700 select-all">{row.username}</strong>
                    </span>
                    <span>Joined: {formatJoinDate(row.joinDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ICUAdminPanelNurse;