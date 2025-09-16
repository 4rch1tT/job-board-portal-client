import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Clock,
  Heart,
  ExternalLink,
  Building2,
} from "lucide-react";

const JobCard = ({
  job,
  onApply,
  onViewDetails,
  onToggleWishlist,
  isInWishlist = false,
}) => {
  const formatSalary = (salary) => {
    if (!salary || (!salary.min && !salary.max)) return "Salary not disclosed";
    const { min, max, currency = "₹" } = salary;
    if (min && max) {
      return `${currency}${min.toLocaleString()} - ${currency}${max.toLocaleString()}`;
    }
    if (min) return `${currency}${min.toLocaleString()}+`;
    if (max) return `Up to ${currency}${max.toLocaleString()}`;
    return "Salary not disclosed";
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      "full-time": "bg-blue-100 text-blue-800 hover:bg-blue-200",
      "part-time": "bg-green-100 text-green-800 hover:bg-green-200",
      contract: "bg-orange-100 text-orange-800 hover:bg-orange-200",
      internship: "bg-purple-100 text-purple-800 hover:bg-purple-200",
      remote: "bg-indigo-100 text-indigo-800 hover:bg-indigo-200",
    };
    return (
      colors[jobType?.toLowerCase()] ||
      "bg-gray-100 text-gray-800 hover:bg-gray-200"
    );
  };
  return (
    <>
      <Card>
       
      </Card>
    </>
  );
};

export default JobCard;
