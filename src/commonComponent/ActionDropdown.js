import React, { useState, useRef, useEffect } from "react";

export default function ActionDropdown({
  setOpenAppointmentModal,
  setIsPatientForm,
  openAppointmentModal,
  isPatientForm,
}) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative flex justify-end w-44" ref={dropdownRef}>
      {/* Trigger button */}
      <button
        onClick={() => setOpen(!open)}
        className="bg-[#8659ad] text-white px-4 lg:h-10 h-8 rounded-md flex justify-between items-center gap-2 w-full"
      >
        Actions
        <svg
          className={`w-4 h-4 transform transition-transform ${
            open ? "rotate-180" : "rotate-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Dropdown menu */}
      {open && (
        <div className="absolute right-0 top-10 mt-1  w-full bg-white border border-gray-200 rounded-md shadow-lg z-50">
          <ul className="py-1">
            <li>
              <button
                onClick={() => {
                  setOpenAppointmentModal(!openAppointmentModal);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Book Appointment
              </button>
            </li>
            <li>
              <button
                onClick={() => {
                  setIsPatientForm(!isPatientForm);
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
              >
                Add New Registration
              </button>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
