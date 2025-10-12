import React, { useState, useEffect, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { toggleWishlist } from "@/store/thunks/wishlistThunks";
import axios from "axios";
import { debounce } from "lodash-es";
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Card, CardContent } from "@/components/ui/card";
import JobCard from "@/components/JobCard";
JobCard;
import { jobLocations, jobCategories, jobTypes } from "@/constants/jobEnums";

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const wishlist = useSelector((state) => state.wishlist);
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

  const debouncedSearch = useCallback(
    debounce((term) => {
      setSearchTerm(term);
      setCurrentPage(1);
    }, 300),
    []
  );

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

  const fetchJobs = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: currentPage,
        limit: 12,
        search: searchTerm,
        location: selectedLocation,
        category: selectedCategory,
        jobType: selectedJobType,
        company: selectedCompany,
        salaryMin: salaryMin,
        salaryMax: salaryMax,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      Object.keys(params).forEach((key) => {
        if (!params[key] && params[key] !== 0) delete params[key];
      });

      const response = await axios.get(`${api_domain}/api/job/all`, {
        params,
        withCredentials: true,
      });

      setJobs(response.data.jobs || []);
      setTotalJobs(response.data.count || 0);
    } catch (error) {
      console.error("Failed to fetch jobs:", error);
      setJobs([]);
      setTotalJobs(0);
    } finally {
      setLoading(false);
    }
  }, [
    api_domain,
    currentPage,
    searchTerm,
    selectedLocation,
    selectedCategory,
    selectedJobType,
    selectedCompany,
    salaryMin,
    salaryMax,
    sortBy,
    sortOrder,
  ]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axios.get(`${api_domain}/api/company/approved`, {
          withCredentials: true,
        });
        setCompanies(response.data.companies || []);
      } catch (error) {
        console.error("Failed to fetch companies:", error);
      }
    };
    fetchCompanies();
  }, [api_domain]);

  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  const handleViewDetails = (jobId) => {
    navigate(`/job-details/${jobId}`);
  };

  const handleToggleWishlist = (jobId) => {
    dispatch(toggleWishlist(jobId));
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedLocation("");
    setSelectedCategory("");
    setSelectedJobType("");
    setSelectedCompany("");
    setSalaryMin("");
    setSalaryMax("");
    setSortBy("createdAt");
    setSortOrder("desc");
    setCurrentPage(1);
  };

  const removeFilter = (filterType) => {
    switch (filterType) {
      case "search":
        setSearchTerm("");
        break;
      case "location":
        setSelectedLocation("");
        break;
      case "category":
        setSelectedCategory("");
        break;
      case "jobType":
        setSelectedJobType("");
        break;
      case "company":
        setSelectedCompany("");
        break;
      case "salary":
        setSalaryMin("");
        setSalaryMax("");
        break;
      default:
        break;
    }
  };

  const totalPages = Math.ceil(totalJobs / 12);
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen">
      <div className=" border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2  h-4 w-4" />
              <Input
                placeholder="Search jobs, companies, keywords..."
                className="pl-10 h-12 text-base"
                defaultValue={searchTerm}
                onChange={(e) => debouncedSearch(e.target.value)}
              />
            </div>

            <div className="flex items-center gap-2 flex-wrap lg:flex-nowrap">
              <Select
                value={selectedLocation}
                onValueChange={setSelectedLocation}
              >
                <SelectTrigger className="w-full lg:w-[180px]">
                  <MapPin className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {jobLocations.map((location) => (
                    <SelectItem key={location.value} value={location.value}>
                      {location.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={selectedJobType}
                onValueChange={setSelectedJobType}
              >
                <SelectTrigger className="w-full lg:w-[150px]">
                  <Briefcase className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Job Type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filters
                    {activeFiltersCount > 0 && (
                      <Badge className="ml-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                        {activeFiltersCount}
                      </Badge>
                    )}
                  </Button>
                </SheetTrigger>
                <SheetContent className="w-[300px] sm:w-[400px]">
                  <SheetHeader>
                    <SheetTitle>Advanced Filters</SheetTitle>
                    <SheetDescription>
                      Narrow down your job search with these filters
                    </SheetDescription>
                  </SheetHeader>

                  <div className="space-y-6 mt-6 px-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <Select
                        value={selectedCategory}
                        onValueChange={setSelectedCategory}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {jobCategories.map((category) => (
                            <SelectItem
                              key={category.value}
                              value={category.value}
                            >
                              {category.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Company
                      </label>
                      <Select
                        value={selectedCompany}
                        onValueChange={setSelectedCompany}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select company" />
                        </SelectTrigger>
                        <SelectContent>
                          {companies.map((company) => (
                            <SelectItem key={company._id} value={company._id}>
                              {company.name || company.displayName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Salary Range
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          type="number"
                          placeholder="Min"
                          value={salaryMin}
                          onChange={(e) => setSalaryMin(e.target.value)}
                        />
                        <Input
                          type="number"
                          placeholder="Max"
                          value={salaryMax}
                          onChange={(e) => setSalaryMax(e.target.value)}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Sort By
                      </label>
                      <Select
                        value={`${sortBy}-${sortOrder}`}
                        onValueChange={(value) => {
                          const [field, order] = value.split("-");
                          setSortBy(field);
                          setSortOrder(order);
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="createdAt-desc">
                            Newest First
                          </SelectItem>
                          <SelectItem value="createdAt-asc">
                            Oldest First
                          </SelectItem>
                          <SelectItem value="salary-desc">
                            Highest Salary
                          </SelectItem>
                          <SelectItem value="salary-asc">
                            Lowest Salary
                          </SelectItem>
                          <SelectItem value="title-asc">A-Z</SelectItem>
                          <SelectItem value="title-desc">Z-A</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {activeFiltersCount > 0 && (
                      <Button
                        variant="outline"
                        onClick={clearAllFilters}
                        className="w-full"
                      >
                        Clear All Filters
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>

              <Select
                value={`${sortBy}-${sortOrder}`}
                onValueChange={(value) => {
                  const [field, order] = value.split("-");
                  setSortBy(field);
                  setSortOrder(order);
                }}
              >
                <SelectTrigger className="w-full lg:w-[130px] lg:hidden">
                  <ArrowUpDown className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="createdAt-desc">Newest</SelectItem>
                  <SelectItem value="createdAt-asc">Oldest</SelectItem>
                  <SelectItem value="salary-desc">High Pay</SelectItem>
                  <SelectItem value="salary-asc">Low Pay</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {activeFiltersCount > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {searchTerm && (
                <Badge variant="secondary" className="pl-2 pr-1">
                  Search: {searchTerm}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-1"
                    onClick={() => removeFilter("search")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedLocation && (
                <Badge variant="secondary" className="pl-2 pr-1">
                  Location:{" "}
                  {
                    jobLocations.find((l) => l.value === selectedLocation)
                      ?.label
                  }
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-1"
                    onClick={() => removeFilter("location")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
              {selectedJobType && (
                <Badge variant="secondary" className="pl-2 pr-1">
                  Type:{" "}
                  {jobTypes.find((t) => t.value === selectedJobType)?.label}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-1 ml-1"
                    onClick={() => removeFilter("jobType")}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </Badge>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold">
              {searchTerm ? `Search results for "${searchTerm}"` : "All Jobs"}
            </h1>
            <p className="text-gray-600 mt-1">
              {loading
                ? "Loading..."
                : `${totalJobs} ${
                    totalJobs.length === 1 ? "job" : "jobs"
                  } found`}
            </p>
          </div>

          <div className="hidden lg:block">
            <Select
              value={`${sortBy}-${sortOrder}`}
              onValueChange={(value) => {
                const [field, order] = value.split("-");
                setSortBy(field);
                setSortOrder(order);
              }}
            >
              <SelectTrigger className="w-[200px]">
                <ArrowUpDown className="h-4 w-4 mr-2" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="createdAt-desc">Newest First</SelectItem>
                <SelectItem value="createdAt-asc">Oldest First</SelectItem>
                <SelectItem value="salary-desc">Highest Salary</SelectItem>
                <SelectItem value="salary-asc">Lowest Salary</SelectItem>
                <SelectItem value="title-asc">A-Z</SelectItem>
                <SelectItem value="title-desc">Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="h-4 rounded w-3/4 mb-4"></div>
                  <div className="h-3 rounded w-1/2 mb-4"></div>
                  <div className="h-3 rounded w-full mb-2"></div>
                  <div className="h-3 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : jobs.length === 0 ? (
          <div className="text-center py-16">
            <Building2 className="mx-auto h-24 w-24 text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold ">No jobs found</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              {searchTerm || activeFiltersCount > 0
                ? "Try adjusting your search criteria or filters to find more jobs."
                : "No jobs are currently available. Please check back later."}
            </p>
            {activeFiltersCount > 0 && (
              <Button onClick={clearAllFilters} className="mt-4">
                Clear All Filters
              </Button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {jobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onViewDetails={handleViewDetails}
                onToggleWishlist={handleToggleWishlist}
                isInWishlist={wishlist.includes(job._id)}
                className="h-full"
              />
            ))}
          </div>
        )}

        {totalPages > 1 && (
          <div className="flex justify-center items-center gap-2 mt-12">
            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </Button>

            {[...Array(Math.min(totalPages, 5))].map((_, index) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = index + 1;
              } else if (currentPage <= 3) {
                pageNum = index + 1;
              } else if (currentPage >= totalPages - 2) {
                pageNum = totalPages - 4 + index;
              } else {
                pageNum = currentPage - 2 + index;
              }

              return (
                <Button
                  key={pageNum}
                  variant={currentPage === pageNum ? "default" : "outline"}
                  onClick={() => handlePageChange(pageNum)}
                  className="w-10"
                >
                  {pageNum}
                </Button>
              );
            })}

            <Button
              variant="outline"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Jobs;
