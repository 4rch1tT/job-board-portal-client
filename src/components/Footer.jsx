import React from "react";
import { Facebook, Instagram, Twitter, Linkedin } from "lucide-react";
import { useLocation } from "react-router-dom";
import logo from "@/assets/images/seeker-logo.svg";

const Footer = () => {
  const location = useLocation();

  const isAuthPage =
    location.pathname === "/recruiter/register" ||
    location.pathname === "/recruiter/login" ||
    location.pathname === "/register" ||
    location.pathname === "/login";

  return isAuthPage ? null : (
    <footer>
      <div className="px-4 sm:px-8 lg:px-16 py-8">
        <div className="flex flex-col lg:hidden space-y-8">
          <div className="text-center lg:text-left">
            <img
              src={logo}
              alt="seeker logo"
              className="h-14 sm:h-18 mx-auto lg:mx-0"
            />
            <div className="mt-6">
              <p className="text-base sm:text-lg mb-4">Connect with us</p>
              <div className="flex gap-3 justify-center lg:justify-start">
                <Facebook
                  size={20}
                  className="sm:w-6 sm:h-6 hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
                <Instagram
                  size={20}
                  className="sm:w-6 sm:h-6 hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
                <Twitter
                  size={20}
                  className="sm:w-6 sm:h-6 hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
                <Linkedin
                  size={20}
                  className="sm:w-6 sm:h-6 hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center sm:text-left">
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-800">Company</p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                About us
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Careers
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Employer home
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Credits
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Sitemap
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-800">Support</p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Help center
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Summons/Notices
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Grievances
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Report issue
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-800">Legal</p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Privacy policy
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Terms & conditions
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Fraud alert
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Trust & safety
              </p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex justify-center gap-32">
          <div>
            <img src={logo} alt="seeker logo" className="h-20 mx-auto" />
            <div className="mt-3">
              <p className="text-lg">Connect with us</p>
              <div className="flex gap-3 mt-4">
                <Facebook
                  size={24}
                  className="hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
                <Instagram
                  size={24}
                  className="hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
                <Twitter
                  size={24}
                  className="hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
                <Linkedin
                  size={24}
                  className="hover:text-[#b3ee6d] cursor-pointer transition-colors"
                />
              </div>
            </div>
          </div>
          <div className="flex gap-32">
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-800">About us</p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Careers
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Employer home
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Credits
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Sitemap
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-800">Help center</p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Summons/Notices
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Grievances
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Report issue
              </p>
            </div>
            <div className="flex flex-col gap-3">
              <p className="font-medium text-gray-800">Privacy policy</p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Terms & conditions
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Fraud alert
              </p>
              <p className="text-gray-600 hover:text-[#b3ee6d] cursor-pointer transition-colors">
                Trust & safety
              </p>
            </div>
          </div>
        </div>
      </div>

      <hr className="border-t border-gray-300" />

      <div className="p-4">
        <p className="text-center text-sm sm:text-base text-gray-600">
          Copyright &copy; 2025 Seeker
        </p>
      </div>
    </footer>
  );
};

export default Footer;
