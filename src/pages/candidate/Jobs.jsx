import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/store/slices/wishlistSlice";
import axios from "axios";
import {
  Search,
  Filter,
  SlidersHorizontal,
  MapPin,
  Briefcase,
  Building2,
  X,
  ChevronDown,
  ArrowUpDown,
  Heart,
  ExternalLink,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import JobCard from "@/components/JobCard";
JobCard;
import { jobLocations, jobCategories, jobTypes } from "@/constants/jobEnums";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalJobs, setTotalJobs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || ""
  );
  const [selectedLocation, setSelectedLocation] = useState(
    searchParams.get("location") || ""
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || ""
  );
  const [selectedJobType, setSelectedJobType] = useState(
    searchParams.get("jobType") || ""
  );
  const [selectedCompany, setSelectedCompany] = useState(
    searchParams.get("company") || ""
  );
  const [salaryMin, setSalaryMin] = useState(
    searchParams.get("salaryMin") || ""
  );
  const [salaryMax, setSalaryMax] = useState(
    searchParams.get("salaryMax") || ""
  );
  const [sortBy, setSortBy] = useState(
    searchParams.get("sortBy") || "createdAt"
  );
  const [sortOrder, setSortOrder] = useState(
    searchParams.get("sortOrder") || "desc"
  );

  const [companies, setCompanies] = useState([]);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();

    if (searchTerm) params.set("search", searchTerm);
    if (selectedLocation) params.set("location", selectedLocation);
    if (selectedCategory) params.set("category", selectedCategory);
    if (selectedJobType) params.set("jobType", selectedJobType);
    if (selectedCompany) params.set("company", selectedCompany);
    if (salaryMin) params.set("salaryMin", salaryMin);
    if (salaryMax) params.set("salaryMax", salaryMax);
    if (sortBy !== "createdAt") params.set("sortBy", sortBy);
    if (sortOrder !== "desc") params.set("sortOrder", sortOrder);
    if (currentPage > 1) params.set("page", currentPage.toString());

    setSearchParams(params);
  }, [
    searchTerm,
    selectedLocation,
    selectedCategory,
    selectedJobType,
    selectedCompany,
    salaryMin,
    salaryMax,
    sortBy,
    sortOrder,
    currentPage,
    setSearchParams,
  ]);

  useEffect(() => {
    const count = [
      searchTerm,
      selectedLocation,
      selectedCategory,
      selectedJobType,
      selectedCompany,
      salaryMin,
      salaryMax,
    ].filter(Boolean).length;
    setActiveFiltersCount(count);
  }, [
    searchTerm,
    selectedLocation,
    selectedCategory,
    selectedJobType,
    selectedCompany,
    salaryMin,
    salaryMax,
  ]);

  return <div>Jobs</div>;
};

export default Jobs;
