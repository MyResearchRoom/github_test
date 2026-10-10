import React, { useState } from "react";
import { icuBedData } from "../../data/ICU/dashboardData/dashboardData";


import ICUAdminPanelBeds from "../../components/ICU/ICUAdminPanel/ICUAdminPanelBeds";
import ICUAdminPanelNurse from "../../components/ICU/ICUAdminPanel/ICUAdminPanelNurse";
import ICUAdminPanelOverview from "../../components/ICU/ICUAdminPanel/ICUAdminPanelOverview";
import ConfirmModal from "../../modal/ICU/ConfirmModal";
import AddUserModal from "../../modal/ICU/ICUAddUserModal";

const ICUAdminPanel = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState("All");
  const [deleteTarget, setDeleteTarget] = useState(null);

  const [users, setUsers] = useState([
    {
      id: "1",
      fullName: "Admin User",
      role: "Administrator",
      designation: "System Administrator",
      department: "Administration",
      status: "Active",
      username: "admin",
      email: "admin@hospital.com",
      phone: "9888801111",
      joinDate: "2024-01-01",
    },
    {
      id: "2",
      fullName: "Dr. Arjun Mehta",
      role: "Doctor",
      designation: "Senior Intensivist",
      department: "ICU",
      status: "Active",
      username: "dr.mehta",
      email: "a.mehta@hospital.com",
      phone: "9888802222",
      joinDate: "2024-01-15",
    },
    {
      id: "3",
      fullName: "Dr. Sanjay Kumar",
      role: "Doctor",
      designation: "Intensivist",
      department: "ICU",
      status: "Active",
      username: "dr.kumar",
      email: "s.kumar@hospital.com",
      phone: "9888803333",
      joinDate: "2024-03-20",
    },
    {
      id: "4",
      fullName: "Dr. Rakesh Patel",
      role: "Doctor",
      designation: "Consultant Intensivist",
      department: "ICU",
      status: "Active",
      username: "dr.patel",
      email: "r.patel@hospital.com",
      phone: "9888804444",
      joinDate: "2025-06-10",
    },
    {
      id: "5",
      fullName: "SN Meena Rao",
      role: "Nurse",
      designation: "Staff Nurse",
      department: "ICU",
      status: "Active",
      username: "sn.meena",
      email: "m.rao@hospital.com",
      phone: "9888805555",
      joinDate: "2023-11-01",
    },
    {
      id: "6",
      fullName: "SN Preethi K",
      role: "Nurse",
      designation: "Staff Nurse",
      department: "ICU",
      status: "Active",
      username: "sn.preethi",
      email: "p.k@hospital.com",
      phone: "9888806666",
      joinDate: "2024-05-12",
    },
    {
      id: "7",
      fullName: "SN Anand Nair",
      role: "Nurse",
      designation: "Senior Nurse",
      department: "ICU",
      status: "Active",
      username: "sn.anand",
      email: "a.nair@hospital.com",
      phone: "9888807777",
      joinDate: "2024-08-19",
    },
    {
      id: "8",
      fullName: "SN Divya Pillai",
      role: "Nurse",
      designation: "Staff Nurse",
      department: "ICU",
      status: "Inactive",
      username: "sn.divya",
      email: "d.pillai@hospital.com",
      phone: "9888808888",
      joinDate: "2025-02-02",
    },
  ]);

  const [beds] = useState([
    {
      id: "bed-01",
      bedNumber: "ICU-01",
      icuUnit: "ICU-1",
      room: "Room A",
      bedType: "Standard",
      status: "Available",
      ventilatorAvailable: "Yes",
      isolationCapable: "No",
    },
    {
      id: "bed-02",
      bedNumber: "ICU-02",
      icuUnit: "ICU-1",
      room: "Room A",
      bedType: "Ventilator",
      status: "Available",
      ventilatorAvailable: "Yes",
      isolationCapable: "No",
    },
    {
      id: "bed-03",
      bedNumber: "ICU-03",
      icuUnit: "ICU-1",
      room: "Room A",
      bedType: "Isolation",
      status: "Available",
      ventilatorAvailable: "Yes",
      isolationCapable: "Yes",
    },
    {
      id: "bed-04",
      bedNumber: "ICU-04",
      icuUnit: "ICU-1",
      room: "Room B",
      bedType: "Standard",
      status: "Available",
      ventilatorAvailable: "No",
      isolationCapable: "No",
    },
    {
      id: "bed-05",
      bedNumber: "ICU-05",
      icuUnit: "ICU-1",
      room: "Room B",
      bedType: "Ventilator",
      status: "Available",
      ventilatorAvailable: "Yes",
      isolationCapable: "No",
    },
    {
      id: "bed-06",
      bedNumber: "ICU-06",
      icuUnit: "ICU-1",
      room: "Room B",
      bedType: "Standard",
      status: "Maintenance",
      ventilatorAvailable: "No",
      isolationCapable: "No",
    },
  ]);

  const admissions = icuBedData;

  const handleAddUser = (userData) => {
    const newUser = {
      id: `user-${Date.now()}`,
      ...userData,
    };

    setUsers((prev) => [...prev, newUser]);
    setIsUserModalOpen(false);
  };

  const handleToggleStatus = (id) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "Active" ? "Inactive" : "Active" }
          : u
      )
    );
  };

  const confirmRemoveUser = () => {
    if (!deleteTarget) return;

    setUsers((prev) => prev.filter((u) => u.id !== deleteTarget.id));
    setDeleteTarget(null);
  };

  const handleEditBed = (row) => {
    console.log("Edit bed", row);
  };

  const handleDeleteBed = (row) => {
    console.log("Delete bed", row);
  };

  const tabBadgeCount = (tabKey) => {
    if (tabKey === "nursing") {
      return users.filter((u) => u.role === "Nurse").length;
    }
    if (tabKey === "beds") return beds.length;

    return null;
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setSearchTerm("");
    setStatusFilter("All");
  };


  return (
    <div className="w-full mx-auto p-1 flex flex-col gap-6 max-w-[1440px] 2xl:max-w-[1920px]">
      {/* HEADER */}
      <div className="flex justify-between items-start gap-4">
        <div>
          <h1 className="text-xl font-bold text-zinc-900 tracking-tight">
            Admin Dashboard
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            System administration • City General Hospital ICU
          </p>
        </div>
      </div>

      {/* TABS */}
      <div className="flex flex-wrap items-center gap-2 mt-2">
        {[
          { id: "overview", label: "ICU Overview" },
          { id: "nursing", label: "Nursing Staff" },
          { id: "beds", label: "Bed Management" },
        ].map((tab) => {
          const isActive = activeTab === tab.id;
          const count = tabBadgeCount(tab.id);

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => handleTabChange(tab.id)}
              className={`px-4 h-9 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-2 border shadow-sm ${isActive ? "bg-[#521785] border-[#521785] text-white" : "bg-white border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50"}`}
            >
              <span>{tab.label}</span>

            </button>
          );
        })}
      </div>

      {activeTab === "overview" && (
        <ICUAdminPanelOverview users={users} beds={beds} admissions={admissions} />
      )}

      {activeTab === "nursing" && (
        <ICUAdminPanelNurse
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      )}

      {activeTab === "beds" && (
        <ICUAdminPanelBeds
          beds={beds}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          onEditBed={handleEditBed}
          onDeleteBed={handleDeleteBed}
        />
      )}

      {/* ADD USER MODAL */}
      <AddUserModal
        isOpen={isUserModalOpen}
        onClose={() => setIsUserModalOpen(false)}
        onSubmit={handleAddUser}
        defaultRole="Doctor"
      />

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Remove User"
        message={
          deleteTarget && (
            <>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-slate-800">{deleteTarget.fullName}</span>?
              <br />
              This action cannot be undone.
            </>
          )
        }
        confirmLabel="Yes"
        cancelLabel="No"
        confirmVariant="danger"
        onConfirm={confirmRemoveUser}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
};

export default ICUAdminPanel;