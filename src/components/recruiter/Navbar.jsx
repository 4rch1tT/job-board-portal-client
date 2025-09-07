import React, { useState } from "react";
import axios from "axios";
import logo from "@/assets/images/seeker-logo-black.svg";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { logout } from "@/store/slices/authSlice";
import {
  BadgeCheckIcon,
  Briefcase,
  UserRound,
  ChevronDown,
  LogOutIcon,
  BookmarkIcon,
  CircleCheckBig,
} from "lucide-react";
import ThemeToggle from "../recruiter/ThemeToggle";
import { useDispatch, useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { value, user } = useSelector((state) => state.isAuthenticated);
  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  const isRegisterPage = location.pathname === "/recruiter/register";
  const isLoginPage = location.pathname === "/recruiter/login";

  const handleLogout = async () => {
    try {
      await axios.post(
        `${api_domain}/api/recruiter/logout`,
        {},
        { withCredentials: true }
      );
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };
  return (
    <>
      {isLoginPage ? null : isRegisterPage ? (
        <div className="flex justify-between items-center mx-32 h-20 ">
          <div>
            <img
              src={logo}
              alt="seeker logo"
              className="h-8"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex gap-4">
            <ThemeToggle />
            <p className="text-[#3c3c3c] text-lg tracking-tight">
              Already registered?
              <Link to="/recruiter/login" className="text-[#b3ee6d] ml-0.5 font-semibold">
                Login
              </Link>
            </p>
          </div>
        </div>
      ) : value ? (
        <div className="flex justify-between items-center mx-32 h-20 ">
          <div>
            <img
              src={logo}
              alt="seeker logo"
              className="h-8"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex gap-4">
            <ThemeToggle />
            <div className="flex gap-4 items-center">
              <DropdownMenu open={open} onOpenChange={setOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="gap-2 px-2 rounded-full">
                    <Avatar className="size-6 rounded-lg">
                      <AvatarImage src={user?.profilePic} alt={user?.name} />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    {/* <div className="truncate">{user.name}</div>
                <ChevronDown /> */}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="p-0 font-normal">
                    <div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                      <Avatar className="rounded-lg">
                        <AvatarImage
                          src={user?.profilePic}
                          alt={user?.name || "User"}
                        />
                        <AvatarFallback className="rounded-lg">
                          {user?.name?.[0] || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="grid flex-1 text-left text-sm leading-tight">
                        <span className="truncate font-semibold">
                          {user?.name}
                        </span>
                        <span className="text-muted-foreground truncate text-xs">
                          {user?.email}
                        </span>
                      </div>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem onClick={() => navigate("/recruiter/profile")}>
                      <UserRound />
                      Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Briefcase />
                      Post Job
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-red-600!"
                    onClick={handleLogout}
                  >
                    <LogOutIcon className="text-red-600!" />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex justify-between items-center mx-32 h-20 ">
          <div>
            <img
              src={logo}
              alt="seeker logo"
              className="h-8"
              onClick={() => navigate("/")}
            />
          </div>
          <div className="flex gap-4">
            <ThemeToggle />
            <div className="flex items-center gap-4">
              <div>
                <Button
                  variant="outline"
                  className="mr-4 rounded-2xl hover:bg-[#b3ee6d] border-2 border-[#b3ee6d] font-semibold"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className="rounded-2xl bg-[#3c3c3c]"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
              <Link to="/recruiter/login" className="-tracking-tight">
                Recruiter login
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
