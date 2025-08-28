import { Input } from "@/components/ui/input";
import React from "react";

const Home = () => {
  return (
    <div className="bg-[#f5f4fa] pt-16 flex flex-col min-h-screen">
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-4xl tracking-tight font-bold">
          Find Your Next Oppertunity
        </h1>
        <h3 className="text-2xl font-semibold tracking-tight mt-2">
          Discover . Apply . Grow
        </h3>
      </div>
      <div>
        <Input></Input>
      </div>
    </div>
  );
};

export default Home;
