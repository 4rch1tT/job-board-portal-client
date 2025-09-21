import { useSelector, useDispatch } from "react-redux";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  UserRound,
  Briefcase,
  BookmarkIcon,
  CircleCheckBig,
  LogOutIcon,
  ClipboardCheck,
  UserRoundPlus,
  Menu,
  X,
} from "lucide-react";
import axios from "axios";
import logo from "@/assets/images/seeker-logo.svg";
import ThemeToggle from "./ThemeToggle";
import { logout } from "@/store/slices/authSlice";
import { useState } from "react";

const Navbar = () => {
  const { value, user } = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const isRecruiter = user?.role === "recruiter";
  const isRegisterPage =
    location.pathname === "/register" ||
    location.pathname === "/recruiter/register";
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <div className="sticky top-0 z-50 bg-white">
      <div className="flex justify-between items-center px-4 sm:px-8 lg:px-32 h-16 sm:h-20">
        <img
          src={logo}
          alt="seeker logo"
          className="h-12 sm:h-16 cursor-pointer"
          onClick={() => navigate("/")}
        />

        <div className="hidden md:flex gap-4 items-center">
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
                      <AvatarImage
                        src={user?.profilePic}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid text-sm">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
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
                      <DropdownMenuItem
                        onClick={() => navigate("/recruiter/profile")}
                      >
                        <UserRound /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/recruiter/post-job")}
                      >
                        <Briefcase /> Post Job
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/recruiter/manage-jobs")}
                      >
                        <ClipboardCheck /> Manage Jobs
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <UserRound /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                        <BookmarkIcon /> Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/my-applications")}
                      >
                        <CircleCheckBig /> Applied Jobs
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600!"
                  onClick={handleLogout}
                >
                  <LogOutIcon /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isRegisterPage ? (
            <p className="text-[#3c3c3c] text-sm sm:text-lg tracking-tight">
              Already registered?{" "}
              <Link
                to={isRecruiter ? "/recruiter/login" : "/login"}
                className="text-[#b3ee6d] ml-0.5 font-semibold"
              >
                Login
              </Link>
            </p>
          ) : isLoginPage ? null : (
            <div className="flex items-center gap-2 lg:gap-4">
              <div>
                <Button
                  variant="outline"
                  className="mr-2 lg:mr-4 rounded-2xl hover:bg-[#b3ee6d] border-2 border-[#b3ee6d] font-semibold text-xs sm:text-sm px-3 sm:px-4"
                  onClick={() => navigate("/login")}
                >
                  Login
                </Button>
                <Button
                  className="rounded-2xl bg-[#3c3c3c] text-white text-xs sm:text-sm px-3 sm:px-4"
                  onClick={() => navigate("/register")}
                >
                  Register
                </Button>
              </div>
              <Link
                to="/recruiter/login"
                className="-tracking-tight text-xs sm:text-sm hover:text-[#b3ee6d] transition-colors"
              >
                Recruiter login
              </Link>
            </div>
          )}
        </div>

        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          {value && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-1 px-2 rounded-full">
                  <Avatar className="size-5 rounded-lg">
                    <AvatarImage src={user?.profilePic} alt={user?.name} />
                    <AvatarFallback className="rounded-lg text-xs">
                      {user?.name?.[0] || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-56 rounded-lg mr-4"
                sideOffset={4}
              >
                <DropdownMenuLabel className="p-0 font-normal">
                  <div className="flex items-center gap-2 px-1 py-1.5">
                    <Avatar className="rounded-lg">
                      <AvatarImage
                        src={user?.profilePic}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback className="rounded-lg">
                        {user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid text-sm">
                      <span className="truncate font-semibold">
                        {user?.name}
                      </span>
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
                      <DropdownMenuItem
                        onClick={() => navigate("/recruiter/profile")}
                      >
                        <UserRound /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/recruiter/post-job")}
                      >
                        <Briefcase /> Post Job
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/recruiter/manage-jobs")}
                      >
                        <ClipboardCheck /> Manage Jobs
                      </DropdownMenuItem>
                    </>
                  ) : (
                    <>
                      <DropdownMenuItem onClick={() => navigate("/profile")}>
                        <UserRound /> Profile
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => navigate("/wishlist")}>
                        <BookmarkIcon /> Wishlist
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => navigate("/my-applications")}
                      >
                        <CircleCheckBig /> Applied Jobs
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>

                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="text-red-600!"
                  onClick={handleLogout}
                >
                  <LogOutIcon /> Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!value && (
            <button
              onClick={toggleMobileMenu}
              className="p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          )}
        </div>
      </div>

      {isMobileMenuOpen && !value && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-white border-b shadow-lg z-50">
          <div className="px-4 py-4 space-y-4">
            {isRegisterPage ? (
              <div className="text-center">
                <p className="text-[#3c3c3c] text-sm tracking-tight">
                  Already registered?{" "}
                  <Link
                    to={isRecruiter ? "/recruiter/login" : "/login"}
                    className="text-[#b3ee6d] ml-0.5 font-semibold"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Login
                  </Link>
                </p>
              </div>
            ) : isLoginPage ? null : (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="flex-1 rounded-2xl hover:bg-[#b3ee6d] border-2 border-[#b3ee6d] font-semibold"
                    onClick={() => {
                      navigate("/login");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    className="flex-1 rounded-2xl bg-[#3c3c3c] text-white"
                    onClick={() => {
                      navigate("/register");
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    Register
                  </Button>
                </div>
                <div className="text-center">
                  <Link
                    to="/recruiter/login"
                    className="-tracking-tight text-sm hover:text-[#b3ee6d] transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Recruiter login
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
