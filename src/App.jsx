import { createBrowserRouter, RouterProvider } from "react-router-dom";

import CandidateLayout from "./layouts/CandidateLayout";
import RecruiterLayout from "./layouts/RecruiterLayout";
import AdminLayout from "./layouts/AdminLayout";
import DynamicHome from "./components/DynamicHome";

// * Candidate pages
import Home from "./pages/candidate/Home";
import { Register } from "./pages/candidate/Register";
import { Login } from "./pages/candidate/Login";
import Profile from "./pages/candidate/Profile";
import UpdateProfile from "./pages/candidate/UpdateProfile";

// * Recruiter pages
import RecruiterHome from "./pages/recruiter/RecruiterHome";
import { RecruiterLogin } from "./pages/recruiter/RecruiterLogin";
import { RecruiterRegister } from "./pages/recruiter/RecruiterRegister";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import RecruiterUpdateProfile from "./pages/recruiter/RecruiterUpdateProfile";
import PostJob from "./pages/recruiter/PostJob";

//* Admin pages
import Dashboard from "./pages/admin/Dashboard";

import useAuthCheck from "./hooks/useAuthCheck";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import ManageJobs from "./pages/recruiter/ManageJobs";
import ViewApplications from "./pages/recruiter/ViewApplications";
import Jobs from "./pages/candidate/Jobs";
import JobDetails from "./pages/candidate/JobDetails";
import Wishlist from "./pages/candidate/Wishlist";
import MyApplications from "./pages/candidate/MyApplications";
import ThemeInitializer from "./components/ThemeInitializer";
import UserManagement from "./pages/admin/UserManagement";
import JobManagement from "./pages/admin/JobManagement";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CandidateLayout />,
    children: [
      {
        path: "",
        element: <DynamicHome />,
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
      {
        path: "jobs",
        element: <Jobs />,
      },
      {
        path: "job-details/:jobId",
        element: <JobDetails />,
      },
      {
        path: "wishlist",
        element: <Wishlist />,
      },
      {
        path: "my-applications",
        element: <MyApplications />,
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
      {
        path: "profile",
        element: <RecruiterProfile />,
      },
      {
        path: "update-profile",
        element: <RecruiterUpdateProfile />,
      },
      {
        path: "post-job",
        element: <PostJob />,
      },
      {
        path: "manage-jobs",
        element: <ManageJobs />,
      },
      {
        path: "view-applications/:jobId",
        element: <ViewApplications />,
      },
    ],
  },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      {
        path: "",
        element: <Dashboard />,
      },
      {
        path: "manage-user",
        element: <UserManagement />,
      },
      {
        path: "manage-job",
        element: <JobManagement/>
      }
    ],
  },
]);

function App() {
  useAuthCheck();
  return (
    <>
      <ThemeInitializer />
      <RouterProvider router={router} />
      <ToastContainer />
    </>
  );
}

export default App;
