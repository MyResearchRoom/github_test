import React from "react";
const Appointment = React.lazy(() => import("./Appointment"));
const Dashboard = React.lazy(() => import("./Dashboard"));
const Scanner = React.lazy(() => import("./Scanner"));
const Settings = React.lazy(() => import("./Settings"));

export { Appointment, Dashboard, Scanner, Settings }