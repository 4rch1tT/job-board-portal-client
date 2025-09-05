import React, { useState } from "react";
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
import {
  BadgeCheckIcon,
  Briefcase,
  UserRound,
  ChevronDown,
  LogOutIcon,
  BookmarkIcon,
  CircleCheckBig,
} from "lucide-react";
import ThemeToggle from "../candidate/ThemeToggle";
import { useSelector } from "react-redux";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const { user } = useSelector((state) => state.isAuthenticated);
  const navigate = useNavigate();

  const handleLogout = () => {};
  return (
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
                    <span className="truncate font-semibold">{user?.name}</span>
                    <span className="text-muted-foreground truncate text-xs">
                      {user?.email}
                    </span>
                  </div>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("")}>
                  <UserRound />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Briefcase />
                  Jobs
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
  );
};

export default Navbar;
