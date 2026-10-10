import React from "react";

// const LoginPage = React.lazy(() => import("./LoginPage"));
// const RegisterPage = React.lazy(() => import("./RegisterPage"));
// const CreatePassword = React.lazy(() => import("./CreatePassword"));
// const ForgotPassword = React.lazy(() => import("./ForgotPassword"));
// const ResetPassword = React.lazy(() => import("./ResetPassword"));
// const VerifyOtp = React.lazy(() => import("./VerifyOtp"));
// const VerifyEmail=React.lazy(()=>import("../components/VerifyEmail"));

import LoginPage from "./LoginPage"
import RegisterPage from "./RegisterPage";
import CreatePassword from "./CreatePassword";
import ForgotPassword from "./ForgotPassword";
import ResetPassword from "./ResetPassword";
import VerifyOtp from "./VerifyOtp";
import VerifyEmail from "./VerifyEmail"
export {
  LoginPage,
  RegisterPage,
  CreatePassword,
  ForgotPassword,
  ResetPassword,
  VerifyOtp,
  VerifyEmail
};
