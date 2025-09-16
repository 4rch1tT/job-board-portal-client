import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { jobCategories, jobLocations, jobTypes } from "@/constants/jobEnums";
import { AddCompanyModal } from "@/components/AddCompanyModal";
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

export default function PostJob() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const editJobId = searchParams.get("edit");
  const isEditMode = Boolean(editJobId);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      category: "",
      jobType: "",
      company: "",
      title: "",
      description: "",
      requirements: "",
      skills: "",
      salary: {
        min: "",
        max: "",
      },
    },
  });

  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const [companies, setCompanies] = useState([]);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [jobData, setJobData] = useState(null);
  const selectedCompany = watch("company");

  useEffect(() => {
    const fetchJobData = async () => {
      if (!isEditMode) return;

      setIsLoading(true);
      try {
        const response = await axios.get(`${api_domain}/api/job/${editJobId}`, {
          withCredentials: true,
        });

        const job = response.data.job;
        setJobData(job);

        reset({
          title: job.title,
          description: job.description,
          requirements: Array.isArray(job.requirements)
            ? job.requirements.join("\n")
            : job.requirements || "",
          skills: Array.isArray(job.skills)
            ? job.skills.join(", ")
            : job.skills || "",
          location: job.location,
          category: job.category,
          jobType: job.jobType,
          company: job.company._id || job.company,
          salary: {
            min: job.salary?.min || "",
            max: job.salary?.max || "",
          },
        });
      } catch (error) {
        console.error("Failed to fetch job data:", error);
        toast.error("Failed to load job data");
        navigate("/recruiter/manage-jobs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobData();
  }, [editJobId, isEditMode, api_domain, reset, navigate]);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        await axios
          .get(`${api_domain}/api/company/approved`, { withCredentials: true })
          .then((res) => {
            setCompanies(res.data.companies || []);
          });
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        toast.error("Failed to load companies");
        setCompanies([]);
      }
    };
    fetchCompanies();
  }, [api_domain]);

  const handleCompanySelection = async (companyId) => {
    try {
      const res = await axios.patch(
        `${api_domain}/api/company/link`,
        { companyId },
        { withCredentials: true }
      );
      toast.success(res.data.message);
      setValue("company", res.data.company._id);
    } catch (error) {
      console.error("Company linking error:", error);
      toast.error(error.response?.data?.message || "Failed to link company");
    }
  };

  const onSubmit = async (data) => {
    if (!data.location) {
      toast.error("Please select a location");
      return;
    }

    if (!data.category) {
      toast.error("Please select a category");
      return;
    }

    if (!data.jobType) {
      toast.error("Please select a job type");
      return;
    }

    if (!data.company) {
      toast.error("Please select or create a company first");
      return;
    }

    const salaryMin = Number(data.salary.min);
    const salaryMax = Number(data.salary.max);

    if (!salaryMin || !salaryMax) {
      toast.error("Please enter both minimum and maximum salary");
      return;
    }

    if (salaryMin > salaryMax) {
      toast.error("Minimum salary cannot exceed maximum salary");
      return;
    }

    const submitData = {
      ...data,
      requirements: data.requirements.split("\n").filter((req) => req.trim()),
      skills: data.skills
        ? data.skills
            .split(",")
            .map((skill) => skill.trim())
            .filter((skill) => skill)
        : [],
      salary: {
        min: salaryMin,
        max: salaryMax,
      },
    };

    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await axios.put(`${api_domain}/api/job/${editJobId}`, submitData, {
          withCredentials: true,
        });
        toast.success("Job updated successfully!");
        navigate("/recruiter/manage-jobs");
      } else {
        await axios.post(`${api_domain}/api/job/`, submitData, {
          withCredentials: true,
        });
        toast.success("Job posted successfully!");
        reset();
      }
    } catch (error) {
      const errorMessage = isEditMode
        ? "Job update failed"
        : "Job posting failed";
      console.error(error.response);
      toast.error(error.response?.data?.message || errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isEditMode && isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg-px-8 flex flex-col justify-center items-center ">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="tex-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
                {isEditMode ? "Edit Job" : "Post a New Job"}
              </h2>
              <p className="text-sm text-gray-600 mt-1">
                {isEditMode
                  ? "Update your job posting details below"
                  : "Fill out the form below to create your job posting"}
              </p>
            </div>
            {isEditMode && (
              <Button
                variant="outline"
                onClick={() => navigate("/recruiter/manage-jobs")}
                className="text-sm"
              >
                ← Back to Jobs
              </Button>
            )}
          </div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6 max-w-2xl mx-auto p-6"
          >
            <div className="space-y-2">
              <Label
                htmlFor="title"
                className="text-sm font-medium text-gray-700"
              >
                Job Title
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input
                {...register("title", { required: true })}
                placeholder="e.g. Senior Frontend Developer"
                className="w-full pr-3 py-2.5 border rounded-lg text-base transition-colors duration-200 disabled:bg-gray-50 disabled:text-gray-500 focus:outline-none focus:ring-2 focus:ring-opacity-2"
              />
              {errors.title && (
                <p className="text-red-500">Title is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="description"
                className="block text-sm font-medium text-gray-700"
              >
                Job Description
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                {...register("description", { required: true })}
                placeholder="Describe the roles and responsibilities..."
                className="w-full px-3 py-2.5 border rounded-lg"
              />
              {errors.description && (
                <p className="text-red-500">Description is required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="requirements"
                className="block text-sm font-medium text-gray-700"
              >
                Requirements
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <Textarea
                {...register("requirements", { required: true })}
                placeholder="List key qualifications and skills(one per line)..."
                className="w-full px-3 py-2.5 border rounded-lg"
              />
              {errors.requirements && (
                <p className="text-red-500">Requirements are required</p>
              )}
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="skills"
                className="block text-sm font-medium text-gray-700"
              >
                Skills
              </Label>
              <Input
                {...register("skills")}
                placeholder="e.g. React, Node.js, MongoDB (comma separated)"
                className="w-full pr-3 py-2.5 border rounded-lg"
              />
              <p className="text-xs text-gray-500">
                Separate multiple skills with commas
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Location
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(val) => setValue("location", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="e.g. Bengaluru" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobLocations.map((loc) => (
                      <SelectItem key={loc.value} value={loc.value}>
                        {loc.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.location && (
                  <p className="text-red-500">Location is required</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Category
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(val) => setValue("category", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobCategories.map((cat) => (
                      <SelectItem key={cat.value} value={cat.value}>
                        {cat.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && (
                  <p className="text-red-500">Category is required</p>
                )}
              </div>

              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Type
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select onValueChange={(val) => setValue("jobType", val)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a job type" />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.jobType && (
                  <p className="text-red-500">Type is required</p>
                )}
              </div>
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Company
                <span className="text-red-500 ml-1">*</span>
              </Label>
              {companies.length > 0 && (
                <Select
                  value={watch("company")}
                  onValueChange={handleCompanySelection}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((comp) => (
                      <SelectItem key={comp._id} value={comp._id}>
                        {comp.name || comp.displayName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}

              <div className="mt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddCompany(true)}
                >
                  + Create New Company
                </Button>
              </div>

              {selectedCompany && (
                <p className="text-sm text-green-600 mt-2">
                  ✓ Company selected successfully
                </p>
              )}
              {errors.company && (
                <p className="text-red-500 text-sm">
                  Company selection is required
                </p>
              )}
            </div>

            <div>
              <Label className="text-sm font-medium text-gray-700 mb-2">
                Salary Range
                <span className="text-red-500 ml-1">*</span>
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <Input
                  type="number"
                  placeholder="Min"
                  {...register("salary.min", {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  {...register("salary.max", {
                    required: true,
                    valueAsNumber: true,
                    min: 0,
                  })}
                />
              </div>
              {(errors.salary?.min || errors.salary?.max) && (
                <p className="text-red-500 text-sm">
                  Both salary fields are required
                </p>
              )}
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isSubmitting} className="flex-1">
                {isSubmitting
                  ? isEditMode
                    ? "Updating..."
                    : "Posting..."
                  : isEditMode
                  ? "Update Job"
                  : "Post Job"}
              </Button>

              {isEditMode && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => navigate("/recruiter/manage-jobs")}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </div>
        {showAddCompany && (
          <AddCompanyModal
            onClose={() => setShowAddCompany(false)}
            onSuccess={(newCompany) => {
              setCompanies((prev) => [...prev, newCompany]);
              setValue("company", newCompany._id);
              toast.success("Company created and selected successfully!");
              setShowAddCompany(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
