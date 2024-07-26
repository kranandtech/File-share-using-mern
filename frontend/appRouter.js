import React from "react";
import LoginPage from "./src/pages/loginPage";
import {
  Navigate,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import SignupPage from "./src/pages/signupPage";
import HomePage from "./src/pages/homePage";
import { useSelector } from "react-redux";
import OtpPage from "./src/pages/otpPage";
const AppRouter = () => {
  const { isAuthorized,isEmailVerified } = useSelector((e) => e.auth);
  const router = createBrowserRouter([
    {
      path: "/",
      element: isAuthorized?(
      <>{isEmailVerified?<HomePage />:<Navigate to="/otp" />}</> ) :( <Navigate to="/login" />),
    },
    {
      path: "/login",
      element: isAuthorized ? <Navigate to="/" /> : <LoginPage />,
    },
    {
      path: "/signup",
      element: isAuthorized ? <Navigate to="/" /> : <SignupPage />,
    },
    {
      path: "/otp",
      element: isAuthorized && !isEmailVerified? <OtpPage /> : <Navigate to="/" />
    }
  ]);
  return <RouterProvider router={router} />;
};

export default AppRouter;
