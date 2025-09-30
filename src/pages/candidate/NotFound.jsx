import React from "react";
import notFound from "@/assets/images/something-went-wrong.svg";
import notFoundDark from "@/assets/images/something-went-wrong-dark.svg";
import { Link } from "react-router-dom";
import useIsDarkMode from "@/hooks/useIsDarkMode";

const NotFound = () => {
  const isDarkMode = useIsDarkMode();
  return (
    <>
      <div className="flex flex-col ">
        <img
          src={isDarkMode ? notFoundDark : notFound}
          alt="404"
          className="h-[500px]"
        />
        <div className="flex justify-center gap-3">
          <h1>The page you are looking for does not exist </h1>
          <Link
            to="/"
            className="text-3xl flex items-center underline hover:scale-110"
          >
            Go back
          </Link>
        </div>
      </div>
    </>
  );
};

export default NotFound;
