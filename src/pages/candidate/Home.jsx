import { Input } from "@/components/ui/input";
import React from "react";
import { SearchIcon, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/candidate/JobCard";

const Home = () => {
  return (
    <div className=" pt-16 flex flex-col min-h-screen bg-muted">
      <div className="flex flex-col justify-center items-center text-[#3c3c3c]">
        <h1 className="text-5xl tracking-tight font-bold ">
          Find Your Next Opportunity
        </h1>
        <h3 className="text-3xl font-semibold tracking-tight mt-2">
          Discover . Apply . Grow
        </h3>
      </div>
      <div className="flex justify-center mt-8">
        <div className="flex border-1 shadow-lg p-4 rounded-4xl w-9/12 gap-4">
          <div className="flex items-center flex-1">
            <SearchIcon />
            <Input
              placeholder="Enter job title"
              className="border-0 focus-visible:ring-0 w-full text-lg lg:text-xl"
            />
          </div>
          <div className="flex items-center flex-1">
            <MapPin />
            <Input
              placeholder="Enter location"
              className="border-0 focus-visible:ring-0 w-full text-lg lg:text-xl"
            />
          </div>
          <Button className="rounded-2xl bg-[#3c3c3c] px-8 py-3">Search</Button>
        </div>
      </div>
      <JobCard />
    </div>
  );
};

export default Home;
