import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const RecruiterHome = () => {
  const { user } = useSelector((state) => state.isAuthenticated);
  const navigate = useNavigate();
  return (
    <>
      <div className="bg-muted min-h-screen flex items-center justify-center px-4">
        <section className="w-full max-w-2xl mx-auto text-center space-y-6 py-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
            Welcome Back,{" "}
            <span className="text-2xl sm:text-3xl md:text-4xl text-[#b3ee2d]">
              {user?.name}
            </span>{" "}
            <span role="img" aria-label="wave">
              👋
            </span>
          </h1>
          <p className="text-muted-foreground max-w-xl mx-auto text-base sm:text-lg">
            Manage your job postings, review applications, and find the right
            talent faster.
          </p>
           <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button size="lg" className="w-full sm:w-auto" onClick={() => navigate("/recruiter/post-job")}>
              Post a Job
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-full sm:w-auto"
              onClick={() => navigate("/recruiter/manage-jobs")}
            >
              Manage Jobs
            </Button>
          </div>
        </section>
      </div>
    </>
  );
};

export default RecruiterHome;
