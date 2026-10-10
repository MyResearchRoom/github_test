import { BiSolidDashboard } from "react-icons/bi";
import {
  ArrowRightLeft,
  BedDouble,
  Building2,
  DoorOpen,
  FileText,
  Receipt, 
  UserPlus,
  Wallet,
} from "lucide-react";

export const IPDRoutes = [
  {
    link: "/ipd",
    title: "Dashboard",
    icon: <BiSolidDashboard className="text-lg" />,
  },
  {
    link: "/ipd/admissions",
    title: "Admissions",
    icon: <UserPlus className="text-lg" />,
  },
  {
    link: "/ipd/wards",
    title: "Wards",
    icon: <Building2 className="text-lg" />,
  },
  {
    link: "/ipd/rooms",
    title: "Rooms",
    icon: <DoorOpen className="text-lg" />,
  },
  {
    link: "/ipd/beds",
    title: "Beds",
    icon: <BedDouble className="text-lg" />,
  },
  {
    link: "/ipd/bed-transfer",
    title: "Bed Transfer",
    icon: <ArrowRightLeft className="text-lg" />,
  },
   {
    link: "/ipd/accounts",
    title: "Accounts",
    icon: <Wallet className="text-lg" />,
  },
   {
    link: "/ipd/payments",
    title: "Payments",
    icon: < Receipt className="text-lg" />, 
  },
  {
    link: "/ipd/discharge",
    title: "Discharge",
    icon: <FileText className="text-lg" />,
  },
 

];
