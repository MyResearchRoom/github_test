import { BiSolidDashboard } from "react-icons/bi";
import { FaCalendarDays } from "react-icons/fa6";
import { MdOutlineBarChart } from "react-icons/md";
import { LuUserSquare } from "react-icons/lu";
import { SiGoogledocs } from "react-icons/si";
import { ReceiptIndianRupee, Stethoscope } from "lucide-react";
import { DOCTOR, SUB_DOCTOR } from "../Constants";

export const DoctorRoutes=[
    {
        link:'/',
        title:'Dashboard',
        icon: <BiSolidDashboard className='text-lg ' />,
        accessBy:[DOCTOR,SUB_DOCTOR]
    },
    {
        link:'/appointments',
        title:'Appointments',
        icon: <FaCalendarDays className='text-lg ' />,
        accessBy:[DOCTOR,SUB_DOCTOR]
    },
    {
        link:'/patients',
        title:'Patients',
        icon: <LuUserSquare className='text-lg ' />,
        accessBy:[DOCTOR,SUB_DOCTOR]
    },
    {
        link:'/doctor-management',
        title:'Doctors',
        icon: <Stethoscope className='text-lg ' />,
        accessBy:[DOCTOR]
    },
    {
        link:'/receptionist',
        title:'Staff',
        icon: <SiGoogledocs className='text-lg ' />,
        accessBy:[DOCTOR]
    },
    {
        link:'/reports',
        title:'Reports',
        icon: <MdOutlineBarChart className='text-lg ' />,
        accessBy:[DOCTOR]
    },
    // {
    //     link:'/finance',
    //     title:'Finance',
    //     icon: <ReceiptIndianRupee className='text-lg ' />,
    //     accessBy:[DOCTOR]
    // },

]
