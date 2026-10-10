import { Link, useLocation } from "react-router-dom";
import { myImg } from "../assets/Images";
import {
  MdLocalHospital,
  MdHotel,
  MdFavorite,
} from "react-icons/md";

import { AiOutlineClose } from "react-icons/ai";
import { ReceptionistRoutes } from "../data/ReceptionistRoutes";
import { DoctorRoutes } from "../data/DoctorRoutes";
import { IPDRoutes } from "../data/IPDRoutes";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { Button } from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { useAppointmentsStats } from "../context/AppointmentStats";
import { DOCTOR, RECEPTIONIST, SUB_DOCTOR } from "../Constants";
import { ICURoutes } from "../data/ICU/ICURoute";

const Sidebar = ({
  isOpen,
  toggleSidebar,
  name,
  profile,
  attendences,
  activeModule,
  onModuleChange,
}) => {

const [isModuleMenuOpen, setIsModuleMenuOpen] = useState(false);


  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  const location = useLocation();
  const modalRef = useRef(null);
  const { getUser } = useAppointmentsStats();

  const checkIn = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/receptionists/check-in`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Check-in successful");
        getUser();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  const checkOut = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/receptionists/check-out`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      if (response.status === 200) {
        toast.success("Check-Out successful");
        getUser();
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "An error occured");
    }
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!isOpen) return;
      if (modalRef.current && !modalRef.current.contains(e.target)) {
        toggleSidebar();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, toggleSidebar]);

  // Lock background scroll while the mobile/tablet drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      {/* Backdrop - mobile/tablet only, purely visual (outside-click handler above closes it) */}
      {isOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" aria-hidden="true" />
      )}

      <div
        ref={modalRef}
        className={`h-full bg-white border-r border-gray-300 overflow-y-auto overflow-x-hidden flex flex-col items-center transition-transform duration-300 ease-in-out
        fixed inset-y-0 left-0 z-40 w-64 sm:w-72 shadow-xl
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        lg:static lg:translate-x-0 lg:shadow-none lg:z-0 lg:w-[12%]
      `}
        style={{ scrollbarWidth: "none" }}
      >
        {/* Close Icon (Mobile/Tablet) */}
        {isOpen && (
          <AiOutlineClose
            className="absolute top-4 right-4 text-2xl text-gray-600 cursor-pointer lg:hidden"
            onClick={toggleSidebar}
          />
        )}

        {/* Profile Section */}
        <div
          className="w-full flex flex-col justify-start gap-2 items-center border-b border-gray-300 py-4 px-2 cursor-pointer"
          onClick={() => navigate("/profile")}
        >
          <div className="h-14 w-14 rounded-full overflow-hidden shadow-md p-1  bg-gray-100">
            {profile ? (
              <div className="h-full w-full bg-white rounded-full">
                <img
                  src={profile}
                  alt="profile"
                  className="h-full w-full object-cover rounded-full"
                />
              </div>
            ) : (
              <div className="h-full w-full bg-white rounded-full">
                <img
                  src={myImg.userIcon}
                  className="h-full w-full object-cover rounded-full"
                  alt="default user"
                />
              </div>
            )}
          </div>

          <p className="text-left truncate  text-zinc-700 underline font-semibold text-sm sm:text-base">
            {name}
          </p>
        </div>

        {/* {new block } */}
       <div className="relative w-full px-4 pt-4">
        <button
          type="button"
          onClick={() => setIsModuleMenuOpen((prev) => !prev)}
          className="w-full flex items-center justify-between gap-2 rounded-lg border border-[#dbbef3] bg-[#f2e2ff] px-3 py-2.5 text-sm font-semibold text-[#521785] transition hover:bg-[#ead6fa]"
        >
          <div className="flex items-center gap-2 min-w-0">
            {activeModule === "OPD" && (
              <MdLocalHospital className="text-lg shrink-0" />
            )}

            {activeModule === "IPD" && (
              <MdHotel className="text-lg shrink-0" />
            )}

            {activeModule === "ICU" && (
              <MdFavorite className="text-lg shrink-0" />
            )}

            <span className="truncate">{activeModule}</span>
          </div>

          <span
            className={`text-xs transition-transform ${
              isModuleMenuOpen ? "rotate-180" : ""
            }`}
          >
            ▼
          </span>
        </button>

        {isModuleMenuOpen && (
          <div className="absolute left-4 right-4 top-full z-50 mt-2 overflow-hidden rounded-lg border border-gray-200 bg-white shadow-lg">
            {[
              {
                name: "OPD",
                icon: <MdLocalHospital className="text-lg" />,
              },
              {
                name: "IPD",
                icon: <MdHotel className="text-lg" />,
              },
              {
                name: "ICU",
                icon: <MdFavorite className="text-lg" />,
              },
            ].map((module) => (
              <button
                key={module.name}
                type="button"
                onClick={() => {
                  onModuleChange(module.name);
                  setIsModuleMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-semibold transition ${
                  activeModule === module.name
                    ? "bg-[#f2e2ff] text-[#521785]"
                    : "text-zinc-700 hover:bg-gray-50"
                }`}
              >
                {module.icon}
                <span>{module.name}</span>
              </button>
            ))}
          </div>
        )}
      </div>

        {role === RECEPTIONIST && (
          <div className="flex gap-2 mt-4 w-full px-4">
            {!attendences?.[0]?.checkInTime && (
              <Button
                onClick={checkIn}
                variant="outlined"
                className={`!flex-1 !text-sm !font-medium  ${
                  attendences?.[0]?.checkInTime && !attendences?.[0]?.checkOutTime
                    ? "!btn_bg !text-white"
                    : "!bg-[#f2e2ff] !border-[#dbbef3] !text-[#6C4AB6]"
                }`}
              >
                Check In
              </Button>
            )}
            {attendences?.[0]?.checkInTime && !attendences?.[0]?.checkOutTime && (
              <Button
                onClick={checkOut}
                variant="outlined"
                disabled={attendences?.[0]?.checkOutTime}
                className={`!flex-1 !text-sm !font-medium  ${
                  attendences?.[0]?.checkOutTime
                    ? "!btn_bg !text-white"
                    : "!bg-[#f2e2ff] !border-[#dbbef3] !text-[#6C4AB6]"
                }`}
              >
                Check Out
              </Button>
            )}
          </div>
        )}

        <nav className="mt-6 w-full px-2">
          <ul className="flex flex-col gap-1">
            {activeModule === "IPD" &&
              IPDRoutes.map((route) => {
                const isActive =
                  location.pathname === route.link ||
                  (route.link === "/ipd/admissions" &&
                    location.pathname === "/ipd/admit-patient");

                return (
                  <Link key={route.link} to={route.link}>
                    <li
                      onClick={() => {
                        isOpen && toggleSidebar();
                      }}
                      className={`flex flex-row gap-2 items-center p-3 rounded-lg text-sm  font-semibold transition-all ${
                        isActive
                          ? "bg-[#521785] text-white shadow-md"
                          : "text-zinc-700"
                      }`}
                    >
                      <span className="">{route.icon}</span>
                      <span className="truncate">{route.title}</span>
                    </li>
                  </Link>
                );
              })}

              {activeModule === "ICU" &&
              ICURoutes.map((route) => {
              const isActive = location.pathname === route.link;

              return (
                <Link key={route.link} to={route.link}>
                  <li
                    onClick={() => {
                      isOpen && toggleSidebar();
                    }}
                    className={`flex flex-row gap-2 items-center p-3 rounded-lg text-sm font-semibold transition-all ${
                      isActive
                        ? "bg-[#521785] text-white shadow-md"
                        : "text-zinc-700"
                    }`}
                  >
                    <span>{route.icon}</span>
                    <span className="truncate">{route.title}</span>
                  </li>
                </Link>
              );
            })}

            {activeModule === "OPD" &&
              role === RECEPTIONIST &&
              ReceptionistRoutes.map((route) => (
                <Link key={route.link} to={route.link}>
                  <li
                    onClick={() => {
                      isOpen && toggleSidebar();
                    }}
                    className={`flex flex-row gap-2 items-center p-3 rounded-lg text-sm  font-semibold transition-all ${
                      location.pathname === route.link
                        ? "bg-[#521785] text-white shadow-md"
                        : "text-zinc-700"
                    }`}
                  >
                    <span className="">{route.icon}</span>
                    <span className="truncate">{route.title}</span>
                  </li>
                </Link>
              ))}

            {activeModule === "OPD" &&
              (role === DOCTOR || role === SUB_DOCTOR) &&
              DoctorRoutes.map((route) =>
              route.accessBy.includes(role) && 
               (
                <Link key={route.link} to={route.link}>
                  <li
                    onClick={() => {
                      isOpen && toggleSidebar();
                    }}
                    className={`flex  flex-row   items-center gap-2 p-3 rounded-lg text-sm  font-semibold   transition-all ${
                      location.pathname === route.link
                        ? "bg-[#521785] text-white shadow-md"
                        : "text-zinc-700"
                    }`}
                  >
                    <span className="">{route.icon}</span>
                    <span className="truncate">{route.title}</span>
                  </li>
                </Link>
              ))}
          </ul>
        </nav>
      </div>
    </>
  );
};

export default Sidebar;