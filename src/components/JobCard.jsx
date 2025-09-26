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
  onViewDetails,
  onToggleWishlist,
  isInWishlist = false,
  className = "",
}) => {
  if (!job) return null;

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

  const handleWishlist = (e) => {
    e.stopPropagation();
    onToggleWishlist?.(job._id || job.id);
  };

  const handleViewDetails = () => {
    onViewDetails?.(job._id || job.id);
  };

  return (
    <>
      <Card
        className={`group hover:shadow-lg transition-all duration-300 cursor-pointer border-0 shadow-sm hover:-translate-y-1  ${className}`}
        onClick={handleViewDetails}
      >
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center space-x-3 flex-1 min-w-0">
              <Avatar className="h-12 w-12  ">
                <AvatarImage
                  src={job.company?.logoUrl.url}
                  alt={job.company?.name || "Company"}
                />
                <AvatarFallback className="bg-gradient-to-br from-[#b3ee6d] to-[rgb(109,152,43)] text-white font-semibold">
                  {(job.company?.name || job.company || "C")
                    .charAt(0)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <CardTitle className="text-lg font-semibold  line-clamp-1 group-hover:text-[#6d982b] transition-colors">
                  {job.title}
                </CardTitle>
                <CardDescription className="flex items-center text-sm text-gray-600 mt-1">
                  <Building2 className="h-3 w-3 mr-1 flex-shrink-0" />
                  <span className="truncate">
                    {job.company?.name || job.company}
                  </span>
                </CardDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={handleWishlist}
              className={`ml-2 p-2 h-auto ${
                isInWishlist
                  ? "text-red-500 hover:text-red-600"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <Heart
                className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
              />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-600">
              <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">{job.location}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <span className="truncate">{formatSalary(job.salary)}</span>
            </div>

            <div className="flex items-center text-gray-600">
              <Briefcase className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate capitalize">
                {job.jobType || job.type}
              </span>
            </div>

            <div className="flex items-center text-gray-600">
              <Calendar className="h-4 w-4 mr-2 flex-shrink-0" />
              <span className="truncate">
                {formatDate(job.createdAt || job.postedDate)}
              </span>
            </div>
          </div>

          {job.description && (
            <p className="text-sm text-gray-700 line-clamp-2 leading-relaxed">
              {job.description}
            </p>
          )}

          {job.skills && job.skills.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {job.skills.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  {skill}
                </Badge>
              ))}
              {job.skills.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{job.skills.length - 3} more
                </Badge>
              )}
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <Badge className={getJobTypeColor(job.jobType || job.type)}>
                {job.jobType || job.type || "Full-time"}
              </Badge>

              {job.category && (
                <Badge variant="outline" className="text-xs">
                  {job.category}
                </Badge>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pt-4 border-t">
          <div className="flex items-center  w-full gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleViewDetails}
              className="flex-1 text-[#b3ee6d] hover:bg-[#b3ee6d] hover:text-white"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Details
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
};

export default JobCard;
