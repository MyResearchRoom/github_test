import Profile from "../../commonComponent/Profile";
import AttendenceHistory from "../Doctor/AttendenceHistory";
import Help from "../Doctor/setting/Help";
import Termspolicies from "../Doctor/setting/Termspolicies";

export const settingTabs = [
    {
      title: "Your Profile",
      tabName: "profile",
      Component: <Profile />,
      path:""
    },
    {
      title: "Attendance History",
      tabName: "attendence",
      Component: <AttendenceHistory />,
      path:"attendence"
    },
    {
      title: "Help",
      tabName: "help",
      Component: <Help />,
      path:"help"
    },
    {
      title: "Privacy Policy",
      tabName: "policy",
      Component: <Termspolicies />,
      path:"privacy"
    },
  ];