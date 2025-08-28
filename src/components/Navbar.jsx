import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import logo from "@/assets/images/seeker-logo-black.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Navbar = () => {
  const { value, user } = useSelector((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  const isRegisterPage = location.pathname === "/register";

  return (
    <div className="flex justify-between items-center mx-16 h-20 ">
      <div>
        <img
          src={logo}
          alt="seeker logo"
          className="h-8"
          onClick={() => navigate("/")}
        />
      </div>
      {value ? (
        <div className="flex gap-2 items-center">
          <p>{user?.name}</p>
          <Avatar className="mr-8">
            <AvatarImage src="https://github.com/shadcn.png" alt={user?.name} />
            <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
          </Avatar>
        </div>
      ) : isRegisterPage ? (
        <Link to="/login" className="hover:underline">
          Already registered? Login
        </Link>
      ) : (
        <Button onClick={() => navigate("/register")}>Register</Button>
      )}
    </div>
  );
};

export default Navbar;
