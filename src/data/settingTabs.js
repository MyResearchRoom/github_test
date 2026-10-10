import { CalendarClock, CircleUser, Clock4, History, Lock, Logs, Signature } from "lucide-react";
import { HiOutlinePower } from "react-icons/hi2";
import { MdOutlinePrivacyTip } from "react-icons/md";
import { RiMoneyRupeeCircleLine } from "react-icons/ri";
import { IoHelp } from "react-icons/io5";
export const doctorMenu = [
  { label: "Profile", icon: <CircleUser size={18} />,path:'/profile' },
  { label: "Signature & Logo", icon: <Signature size={18} /> ,path:'/signature'},
  { label: "Add Fees", icon: <RiMoneyRupeeCircleLine size={18} />,path:'/add-fees' },
  { label: "Set Time", icon: <Clock4 size={18} />,path:'/add-time' },
  { label: "Set Slots", icon: <CalendarClock size={18} />,path:'/add-slot' },
  { type: "divider" },
  { label: "Change Password", icon: <Lock size={18} />,path:'/change-password' },
  { label: "Audit Logs", icon: <Logs size={18} /> ,path:'/audit-logs'},
  { label: "Privacy Policy", icon: <MdOutlinePrivacyTip size={18} />,path:'/privacy' },
  { type: "divider" },
  { label: "Log Out", icon: <HiOutlinePower size={18} />, danger: true,action: "logout"  },
];

export const subDoctorMenu = [
  { label: "Profile", icon: <CircleUser size={18} />,path:'/profile' },
  { label: "Signature", icon: <Signature size={18} /> ,path:'/signature'},
  { type: "divider" },
  { label: "Change Password", icon: <Lock size={18} />,path:'/change-password' },
  { label: "Privacy Policy", icon: <MdOutlinePrivacyTip size={18} />,path:'/privacy' },
  { type: "divider" },
  { label: "Log Out", icon: <HiOutlinePower size={18} />, danger: true,action: "logout"  },
];


export const receptionistMenu = [
  { label: "Profile", icon: <CircleUser size={18} />,path:'/profile' },
  { label: "Attendance History", icon: <History size={18} /> ,path:'/attendence' },
  { label: "Help", icon: <IoHelp size={18} />,path:'/help' },
  { label: "Privacy Policy", icon: <MdOutlinePrivacyTip size={18} />,path:'/privacy' },
  { type: "divider" },
  { label: "Log Out", icon: <HiOutlinePower size={18} />, danger: true,action: "logout" },
];
