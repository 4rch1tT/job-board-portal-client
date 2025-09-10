import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuGroup,
  DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  UserRound, Briefcase, BookmarkIcon, CircleCheckBig,
  LogOutIcon,
} from "lucide-react";
import axios from "axios";
import logo from "@/assets/images/seeker-logo-black.svg";
import ThemeToggle from "./ThemeToggle";
import { logout } from "@/store/slices/authSlice";

const Navbar = () => {
  const { value, user } = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const isRecruiter = user?.role === "recruiter";
  const isRegisterPage =
    location.pathname === "/register" || location.pathname === "/recruiter/register";
  const isLoginPage =
    location.pathname === "/login" || location.pathname === "/recruiter/login";

  const handleLogout = async () => {
    try {
      const endpoint = isRecruiter
        ? `${api_domain}/api/recruiter/logout`
        : `${api_domain}/api/candidate/logout`;

      await axios.post(endpoint, {}, { withCredentials: true });
      dispatch(logout());
      navigate("/");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="flex justify-between items-center mx-32 h-20">
      <img
        src={logo}
        alt="seeker logo"
        className="h-8 cursor-pointer"
        onClick={() => navigate("/")}
      />

      <div className="flex gap-4 items-center">
        <ThemeToggle />
        {value ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="gap-2 px-2 rounded-full">
                <Avatar className="size-6 rounded-lg">
                  <AvatarImage src={user?.profilePic} alt={user?.name} />
                  <AvatarFallback className="rounded-lg">
                    {user?.name?.[0] || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
              sideOffset={4}
            >
              <DropdownMenuLabel className="p-0 font-normal">
                <div className="flex items-center gap-2 px-1 py-1.5">
                  <Avatar className="rounded-lg">
                    <AvatarImage src={user?.profilePic} alt={user?.name || "User"} />
                    <AvatarFallback className="rounded-lg">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid text-sm">
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                {isRecruiter ? (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/recruiter/profile")}>
                      <UserRound /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => navigate("/recruiter/post-job")}>
                      <Briefcase /> Post Job
                    </DropdownMenuItem>
                  </>
                ) : (
                  <>
                    <DropdownMenuItem onClick={() => navigate("/profile")}>
                      <UserRound /> Profile
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <BookmarkIcon /> Wishlist
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <CircleCheckBig /> Applied Jobs
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuGroup>

              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600!" onClick={handleLogout}>
                <LogOutIcon /> Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : isRegisterPage ? (
          <p className="text-[#3c3c3c] text-lg tracking-tight">
            Already registered?{" "}
            <Link
              to={isRecruiter ? "/recruiter/login" : "/login"}
              className="text-[#b3ee6d] ml-0.5 font-semibold"
            >
              Login
            </Link>
          </p>
        ) : isLoginPage ? null : (
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
                className="rounded-2xl bg-[#3c3c3c] text-white"
                onClick={() => navigate("/register")}
              >
                Register
              </Button>
            </div>
            <Link to="/recruiter/login" className="-tracking-tight">
              Recruiter login
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Navbar;
