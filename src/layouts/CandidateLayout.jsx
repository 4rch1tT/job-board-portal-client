import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "@/components/candidate/Navbar";
import Footer from "@/components/candidate/Footer";

const CandidateLayout = () => {
  return (
    <>
      <Navbar />
      <Outlet />
      <Footer />
    </>
  );
};

export default CandidateLayout;
