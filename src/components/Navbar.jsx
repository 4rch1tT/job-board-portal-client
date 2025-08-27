import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";


const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated.value);
  return (
    <div className="flex justify-between items-center mx-16 h-20 ">
      <div>
        <img
          src="../src/assets/images/seeker-logo-black.svg"
          alt="seeker logo"
          className="h-8"
        />
      </div>
      {isAuthenticated ? (
        <div className="flex gap-2 items-center">
          <p>Archit</p>
          <Avatar className="mr-8">
            <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      ) : (
        <Button>Register</Button>
      )}
    </div>
  );
};

export default Navbar;
