import React from "react";

const Addfees = React.lazy(() => import("./Addfees"));
const AddTime = React.lazy(() => import("./AddTime"));
const AddSlot = React.lazy(() => import("./AddSlot"));
const Help = React.lazy(() => import("./Help"));
const Password = React.lazy(() => import("./Password"));
const Signature = React.lazy(() => import("./Signature"));
const Termspolicies = React.lazy(() => import("./Termspolicies"));
const AuditLogs=React.lazy(()=>import("./AuditLogs"));
export { AddTime, AddSlot, Addfees, Help, Password, Signature, Termspolicies,AuditLogs };
