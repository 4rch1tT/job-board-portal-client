import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/candidate/Home";
import CandidateLayout from "./layouts/CandidateLayout";
import { Register } from "./pages/candidate/Register";
import { Login } from "./pages/candidate/Login";
import useAuthCheck from "./hooks/useAuthCheck";
import { ToastContainer } from "react-toastify";
import UpdateProfile from "./pages/candidate/UpdateProfile";

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
        path: "update-profile",
        element: <UpdateProfile />,
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
