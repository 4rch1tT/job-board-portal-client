import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "@/assets/images/seeker-logo-black.svg"

const Footer = () => {
  const location = useLocation()

  const isAuthPage = location.pathname === "/recruiter/register" || location.pathname==="/recruiter/login" || location.pathname === "/register" || location.pathname==="/login"

  return isAuthPage 
      ? null
      :( <footer>
      <div className="px-16 py-8 flex justify-center gap-32">
        <div>
          <img
            src={logo}
            alt="seeker logo"
            className="h-10"
          />
          <div className="mt-8">
            <p className="text-lg">Connect with us</p>
            <div className="flex gap-3 ">
              <Facebook size={24} />
              <Instagram size={24} />
              <Twitter size={24} />
              <Linkedin size={24} />
            </div>
          </div>
        </div>
        <div className="flex gap-32">
          <div className="flex flex-col gap-3">
            <p>About us</p>
            <p>Careers</p>
            <p>Employer home</p>
            <p>Credits</p>
            <p>Sitemap</p>
          </div>
          <div className="flex flex-col gap-3">
            <p>Help center</p>
            <p>Summons/Notices</p>
            <p>Grievances</p>
            <p>Report issue</p>
          </div>
          <div className="flex flex-col gap-3">
            <p>Privacy policy</p>
            <p>Terms & conditions</p>
            <p>Fraud alert</p>
            <p>Trust & safety</p>
          </div>
        </div>
      </div>
      <hr className="border-2" />
      <div className="p-4">
        <p className="text-center">Copyright &copy; 2025 Seeker</p>
      </div>
    </footer>)
}

export default Footer;