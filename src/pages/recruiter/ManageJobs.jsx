import React, { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { toast } from "react-toastify";

const ManageJobs = () => {
  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await axios.get(`${api_domain}/api/job/all`, {
          withCredentials: true,
        });
        setJobs(res.data.jobs||[]);
      } catch (error) {
        console.error("Failed to fetch jobs:", error);
        toast.error("Failed to load jobs");
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);
  return (
    <div className="min-h-screen bg-muted p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex flex-row items-center justify-between">
            <div className="mb-4 sm:mb-0">
              <h1 className="text-xl md:text-2xl font-semibold">
                Job Management
              </h1>
              <p className="text-sm mt-1">
                Manage your jobs and track your applications
              </p>
            </div>
            <Button
              className="inline-flex items-center px-6 py-3 "
              variant="outline"
            >
              <Plus className="w-5 h-5 mr-2" />
              Add New Job
            </Button>
          </div>
        </div>
        <div className="rounded-2xl shadow-xl shadow-black/5 border border-white/20 p-6 mb-8">
          <div className="flex flex-col gap-4">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <Input
                type="text"
                placeholder="Search jobs..."
                className="block w-full pl-10 pr-4 py-2 text-sm border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#b3ee6d] focus:border-[#b3ee6d] outline-0 transition-all duration-200  bg-gray-50/50 placeholder-gray-400"
              />
            </div>
            <div>
              <p>Showing {} of {jobs.length}{""} jobs</p>
            </div>
            <div></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageJobs;
