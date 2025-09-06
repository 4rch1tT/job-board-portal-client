import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CandidateLayout from "./layouts/CandidateLayout";

// * Candidate pages
import Home from "./pages/candidate/Home";
import { Register } from "./pages/candidate/Register";
import { Login } from "./pages/candidate/Login";
import Profile from "./pages/candidate/Profile";
import UpdateProfile from "./pages/candidate/UpdateProfile";

import RecruiterLayout from "./layouts/RecruiterLayout";

// * Recruiter pages
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import { RecruiterLogin } from "./pages/recruiter/RecruiterLogin";
import { RecruiterRegister } from "./pages/recruiter/RecruiterRegister";

import useAuthCheck from "./hooks/useAuthCheck";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CandidateLayout />,
    children: [
      {
        path: "",
        element: <Home />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "update-profile",
        element: <UpdateProfile />,
      },
    ],
  },
  {
    path: "/recruiter",
    element: <RecruiterLayout />,
    children: [
      {
        path: "",
        element: <RecruiterHome />,
      },
      {
        path: "register",
        element: <RecruiterRegister />,
      },
      {
        path: "login",
        element: <RecruiterLogin />,
      },
    ],
  },
]);

function App() {
  useAuthCheck();
  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
