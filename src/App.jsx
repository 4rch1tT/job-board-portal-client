import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Home from "./pages/Home";
import CandidateLayout from "./layouts/CandidateLayout";
import { Register } from "./pages/Register";
import { Login } from "./pages/Login";
import useAuthCheck from "./hooks/useAuthCheck";

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
    ],
  },
]);

function App() {
  useAuthCheck();
  return <RouterProvider router={router} />;
}

export default App;
