import React, { useEffect, useRef, useState } from "react";
import { myImg } from "../assets/Images";
import { FaRegBell } from "react-icons/fa";
import { IoMenu } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import PopUpModal from "./PopUpModal";
import {
  BookAppointmentModal,
  PatientRegistrationForm,
} from "../modal/ReceptionistModal";
import Notifications from "./Notifications";
import { useSelector } from "react-redux";
import { capitalizeWords } from "../utils/capitalizeWords";
import { useAuth } from "../context/AuthContext";
import { IoIosSearch, IoMdSettings } from "react-icons/io";
import { useSearch } from "../context/SearchContext";
import { doctorMenu, receptionistMenu, subDoctorMenu } from "../data/settingTabs";
import { CalendarPlus, UserPlus } from "lucide-react";
import { DOCTOR, SUB_DOCTOR } from "../Constants";

const Header = ({ toggleSidebar, clinicName, activeModule }) => {
  const notifyCount = useSelector((state) => state.notify.notifyCount);
  const menu =
    localStorage.getItem("role") === DOCTOR
      ? doctorMenu
      : localStorage.getItem("role") === SUB_DOCTOR
      ? subDoctorMenu
      : receptionistMenu;
  const settingRef = useRef(null);
  const registerRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const { searchTerm, setSearchTerm } = useSearch();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPatient, setIsPatient] = useState(false);
  const [isBookAppointment, setIsBookAppointment] = useState(false);
  const [isNotification, setIsNotification] = useState(false);
  const [isSetting, setIsSetting] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useAuth();
  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    logout();
    navigate("/");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClick = (item) => {
    if (item.action === "logout") {
      setIsModalOpen(true);
    } else {
      navigate(item.path);
    }

    setIsSetting(false);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (settingRef.current && !settingRef.current.contains(e.target)) {
        setIsSetting(false);
      }
      if (registerRef.current && !registerRef.current.contains(e.target)) {
        setIsRegister(false);
      }
      if (
        mobileSearchRef.current &&
        !mobileSearchRef.current.contains(e.target)
      ) {
        setIsMobileSearchOpen(false);
      }
    };
    if (isSetting || isRegister || isMobileSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSetting, isRegister, isMobileSearchOpen]);

  useEffect(() => {
    if (activeModule === "IPD") {
      setIsRegister(false);
      setIsPatient(false);
      setIsBookAppointment(false);
    }
  }, [activeModule]);

  return (
    <>
      <div className="relative w-full z-30">
        <div className="flex items-center justify-between w-full h-14 md:h-[50px] bg-white border-b border-gray-300 px-2 sm:px-4 gap-2">
          {/* Sidebar Toggle */}
          <IoMenu
            className="lg:hidden text-2xl text-[#343C6A] cursor-pointer shrink-0"
            onClick={toggleSidebar}
          />

          {/* Logo + Clinic name */}
          <div className="flex items-center gap-1 min-w-0 flex-1 lg:flex-none">
            <img
              src={myImg.logo}
              alt="header"
              className="w-9 h-9 md:w-11 md:h-11 rounded-md object-contain border border-gray-200 shrink-0"
            />
            <p className="font-semibold text-sm sm:text-base md:text-lg text-[#343C6A] truncate">
              {capitalizeWords(clinicName)}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-2 md:gap-3 shrink-0">
            {/* Search - inline on tablet/desktop */}
            <div className="relative hidden md:block">
              <input
                type="search"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-[180px] lg:w-[280px] h-9 pl-10 pr-4 rounded-md border border-gray-200 bg-white focus:border-gray-300 outline-none transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IoIosSearch size={20} />
              </span>
            </div>

            {/* Search icon - mobile only, opens overlay input below header */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen((prev) => !prev)}
              className="md:hidden text-[#343C6A] cursor-pointer p-1"
              aria-label="Search"
            >
              <IoIosSearch size={22} />
            </button>

            {localStorage.getItem("role") === DOCTOR && (
              <div className="relative">
                {/* 🔔 Bell icon */}
                <FaRegBell
                  size={20}
                  onClick={() => setIsNotification(true)}
                  className="sm:hidden text-[#343C6A] cursor-pointer hover:text-blue-600 transition-colors duration-200"
                />
                <FaRegBell
                  size={24}
                  onClick={() => setIsNotification(true)}
                  className="hidden sm:block text-[#343C6A] cursor-pointer hover:text-blue-600 transition-colors duration-200"
                />

                {/* 🔴 Notification badge */}
                {notifyCount !== 0 && (
                  <span className="absolute -top-2 -right-1 h-4 w-4 sm:h-5 sm:w-5 text-[9px] sm:text-[10px] bg-red-500 text-white font-medium rounded-full flex justify-center items-center shadow">
                    {notifyCount}
                  </span>
                )}
              </div>
            )}

            <div ref={settingRef} className="relative">
              <IoMdSettings
                onClick={() => setIsSetting(!isSetting)}
                size={20}
                className="sm:hidden text-[#343c6a] cursor-pointer hover:rotate-90 transition-transform"
              />
              <IoMdSettings
                onClick={() => setIsSetting(!isSetting)}
                size={22}
                className="hidden sm:block text-[#343c6a] cursor-pointer hover:rotate-90 transition-transform"
              />

              {isSetting && (
                <div className="absolute top-9 sm:top-10 right-0 w-56 max-w-[85vw] bg-white rounded-xl shadow-lg border border-gray-200 z-50">
                  <ul className="py-2 text-sm text-gray-700">
                    {menu.map((item, idx) =>
                      item.type === "divider" ? (
                        <hr key={idx} className="my-2 border-gray-200" />
                      ) : (
                        <li key={idx}>
                          <button
                            onClick={() => handleClick(item)}
                            className={`w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md ${
                              item.danger ? "text-red-600 hover:bg-red-50" : ""
                            }`}
                          >
                            {item.icon}
                            {item.label}
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>
              )}
            </div>

            {activeModule === "IPD" ? (
              <button
                onClick={() => navigate("/ipd/admit-patient")}
                className="bg-purple-50 px-2 sm:px-3 h-9 text-xs sm:text-sm md:text-base rounded-md border border-purple-100 transition flex items-center gap-1 sm:gap-2 whitespace-nowrap"
              >
                <UserPlus size={16} className="shrink-0" />
                <span className="hidden xs:inline sm:inline">
                  Admit Patient
                </span>
                <span className="inline xs:hidden sm:hidden">Admit</span>
              </button>
            ) : (
              <div ref={registerRef} className="relative">
                {/* Trigger button */}
                <button
                  onClick={() => setIsRegister(!isRegister)}
                  className="bg-purple-50 px-2 sm:px-3 h-9 text-xs sm:text-sm md:text-base rounded-md border border-purple-100 transition flex items-center gap-1 sm:gap-2 whitespace-nowrap"
                >
                  <span className="sm:hidden">Register</span>
                  <span className="hidden sm:inline">Register / Book</span>
                </button>

                {/* Dropdown */}
                {isRegister && (
                  <div className="absolute top-11 sm:top-12 right-0 w-56 max-w-[85vw] bg-white rounded-xl shadow-lg border border-gray-200 z-50 animate-fadeIn">
                    <ul className="py-2 text-sm text-gray-700">
                      <li>
                        <button
                          onClick={() => {
                            setIsPatient(true);
                            setIsRegister(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
                        >
                          <UserPlus size={18} /> New Patient
                        </button>
                      </li>
                      <li>
                        <button
                          onClick={() => {
                            setIsBookAppointment(true);
                            setIsRegister(false);
                          }}
                          className="w-full flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-md"
                        >
                          <CalendarPlus size={18} /> Book Appointment
                        </button>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile search overlay - slides under header on small screens */}
        {isMobileSearchOpen && (
          <div
            ref={mobileSearchRef}
            className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-300 px-3 py-2 shadow-md z-40"
          >
            <div className="relative">
              <input
                autoFocus
                type="search"
                placeholder="Search here..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full h-9 pl-10 pr-4 rounded-md border border-gray-200 bg-white focus:border-gray-300 outline-none transition"
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <IoIosSearch size={20} />
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Logout Modal */}
      {isModalOpen && (
        <PopUpModal
          title="Are you sure you want to Logout?"
          closeModal={closeModal}
          doneModal={handleLogout}
        />
      )}

      {isPatient && (
        <PatientRegistrationForm
          isPatientForm={isPatient}
          setIsPatientForm={setIsPatient}
        />
      )}
      {isBookAppointment && (
        <BookAppointmentModal
          openAppointmentModal={isBookAppointment}
          setOpenAppointmentModal={setIsBookAppointment}
        />
      )}
      {isNotification && (
        <Notifications setIsNotification={setIsNotification} />
      )}
    </>
  );
};

export default Header;