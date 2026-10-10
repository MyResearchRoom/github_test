import Profile from "../../../commonComponent/Profile";
import Addfees from "./Addfees";
import AddSlot from "./AddSlot";
import AddTime from "./AddTime";
import AuditLogs from "./AuditLogs";
import Password from "./Password";
import Signature from "./Signature";
import Termspolicies from "./Termspolicies";

export  const settingTabs = [
    {
      title: "Your Profile",
      tabName: "yourProfile",
      Component: <Profile />,
      path:''
    },
    {
      title: "Signature & Logo",
      tabName: "signature",
      Component: <Signature />,
      path:'signature'
    },
    {
      title: "Add Fees",
      tabName: "addFees",
      Component: <Addfees />,
      path:'add-fees'
    },
    {
      title: "Set Time",
      tabName: "addTime",
      Component: <AddTime />,
      path:"add-time"
    },
    {
      title: "Set Slots",
      tabName: "addSlot",
      Component: <AddSlot />,
      path:'add-slot'
    },
    {
      title: "Change Password",
      tabName: "changePassword",
      Component: <Password />,
      path:'change-password'
    },
    {
      title: "Audit Logs",
      tabName: "auditLogs",
      Component: <AuditLogs />,
      path:'audit-logs'
    },
    {
      title: "Privacy Policy",
      tabName: "terms",
      Component: <Termspolicies />,
      path:'privacy'
    },
  ];