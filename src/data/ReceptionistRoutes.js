import { BiSolidDashboard } from "react-icons/bi";
import { BsQrCodeScan } from "react-icons/bs";
import { FaCalendarDays } from "react-icons/fa6";

export const ReceptionistRoutes=[
    {
        link:'/',
        title:'Dashboard',
        icon: <BiSolidDashboard className='text-lg ' />
    },
    {
        link:'/appointments',
        title:'Appointments',
        icon: <FaCalendarDays className='text-lg ' />
    },
    {
        link:'/scanner',
        title:'QR',
        icon: <BsQrCodeScan className='text-lg ' />
    },
    // {
    //     link:'/setting',
    //     title:'Settings',
    //     icon: <IoMdSettings className='text-xl ' />
    // },
]