import React, { useState } from "react";
import { X } from "lucide-react";

const AddUserModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    fullName: "",
    role: "Doctor",
    designation: "",
    department: "ICU",
    status: "Active",
    username: "",
    password: "",
    email: "",
    phone: "",
    joinDate: new Date().toISOString().split("T")[0],
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName.trim()) return;
    onSubmit(formData);
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-[2px] z-50 flex items-center justify-center p-4">
      {/* Reduced height max-h-[85vh] or max-h-[550px] with full overflow management */}
      <div className="bg-white rounded-xl shadow-xl w-full max-w-xl flex flex-col max-h-[85vh] sm:max-h-[580px] overflow-hidden border border-zinc-100 animate-in fade-in zoom-in-95 duration-150">
        
        {/* FIXED MODAL TITLE HEADER BAR */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-100 shrink-0">
          <h2 className="text-base font-bold text-zinc-800">Add New User</h2>
          <button type="button" onClick={onClose} className="text-zinc-400 hover:text-zinc-600 transition p-1">
            <X size={18} />
          </button>
        </div>

        {/* ACCOUNT PROFILE ASSIGNMENT FORM WITH INTERNAL SCROLL */}
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 flex flex-col gap-4 text-xs scrollbar-thin">
          
          {/* Row 1: Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="font-bold text-zinc-400 uppercase tracking-wide">Full Name</label>
            <input
              type="text" required name="fullName" value={formData.fullName} onChange={handleChange}
              placeholder="e.g. Dr. Arjun Mehta"
              className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300"
            />
          </div>

          {/* Row 2: Role & Designation Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Role</label>
              <select
                name="role" value={formData.role} onChange={handleChange}
                className="w-full h-9 px-2 rounded-md border border-zinc-200 bg-white outline-none focus:border-blue-500 text-sm text-zinc-800"
              >
                <option value="Doctor">Doctor</option>
                <option value="Nurse">Nurse</option>
                <option value="Admin">Admin Staff</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Designation</label>
              <input
                type="text" name="designation" value={formData.designation} onChange={handleChange}
                placeholder="e.g. Senior Intensivist"
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300"
              />
            </div>
          </div>

          {/* Row 3: Department & Status Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Department</label>
              <input
                type="text" name="department" value={formData.department} onChange={handleChange}
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 bg-zinc-50"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Status</label>
              <select
                name="status" value={formData.status} onChange={handleChange}
                className="w-full h-9 px-2 rounded-md border border-zinc-200 bg-white outline-none focus:border-blue-500 text-sm text-zinc-800"
              >
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>
          </div>

          {/* Row 4: Credentials Layer */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-dashed border-zinc-100 pt-3 mt-1">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Username</label>
              <input
                type="text" name="username" value={formData.username} onChange={handleChange}
                placeholder="e.g. dr.mehta"
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Password</label>
              <input
                type="password" name="password" value={formData.password} onChange={handleChange}
                placeholder="Set password"
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300"
              />
            </div>
          </div>

          {/* Row 5: Contact Split */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Email</label>
              <input
                type="email" name="email" value={formData.email} onChange={handleChange}
                placeholder="email@hospital.com"
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="font-bold text-zinc-400 uppercase tracking-wide">Phone</label>
              <input
                type="text" name="phone" value={formData.phone} onChange={handleChange}
                placeholder="10-digit number"
                className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 placeholder-zinc-300"
              />
            </div>
          </div>

          {/* Row 6: Join Date Picker */}
          <div className="flex flex-col gap-1.5 w-1/2 pr-2">
            <label className="font-bold text-zinc-400 uppercase tracking-wide">Join Date</label>
            <input
              type="date" name="joinDate" value={formData.joinDate} onChange={handleChange}
              className="w-full h-9 px-3 rounded-md border border-zinc-200 outline-none focus:border-blue-500 transition text-sm text-zinc-800 cursor-pointer"
            />
          </div>
        </form>

        {/* FIXED ACTION BUTTONS STRIP */}
        <div className="flex items-center gap-2 justify-start px-6 py-4 border-t border-zinc-100 bg-zinc-50 shrink-0">
          <button
            type="submit"
            onClick={(e) => {
              const form = e.target.closest('div').previousSibling;
              if (form && form.reportValidity()) {
                form.requestSubmit();
              }
            }}
            className="bg-[#0052cc] px-4 h-9 rounded-md text-white font-semibold hover:bg-[#0043a8] transition shadow-sm text-xs"
          >
            Add User
          </button>
          <button
            type="button" onClick={onClose}
            className="bg-white border border-zinc-200 px-4 h-9 rounded-md text-zinc-700 font-semibold hover:bg-zinc-50 transition text-xs"
          >
            Cancel
          </button>
        </div>

      </div>
    </div>
  );
};

export default AddUserModal;
