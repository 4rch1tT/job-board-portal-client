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
import axios from "axios";
import { toast } from "react-toastify";

export default function PostJob() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      location: "",
      category: "",
      jobType: "",
      company: "",
    },
  });
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [companies, setCompanies] = useState([]);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedCompany = watch("company");

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
  }, []);

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
    if (
      typeof data.salary.min !== "number" ||
      typeof data.salary.max !== "number"
    ) {
      toast.error("Please enter both minimum and maximum salary");
      return;
    }

    if (data.salary.min > data.salary.max) {
      toast.error("Minimum salary cannot exceed maximum salary");
      return;
    }

    setIsSubmitting(true);
    try {
      await axios.post(`${api_domain}/api/job/`, data, {
        withCredentials: true,
      });
      toast.success("Job posted successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Job posting failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/20 py-8 px-4 sm:px-6 lg-px-8 flex flex-col justify-center items-center ">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white shadow-xl rounded-2xl p-6">
          <h2 className="tex-xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Post a new Job
          </h2>
          <p className="text-sm text-gray-600 mt-1">
            Fill out the form below to create your job posting
          </p>
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
                placeholder="List key qualifications and skills..."
                className="w-full px-3 py-2.5 border rounded-lg"
              />
              {errors.description && (
                <p className="text-red-500">Description is required</p>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm font-medium text-gray-700 mb-2">
                  Location
                  <span className="text-red-500 ml-1">*</span>
                </Label>
                <Select
                  onValueChange={(val) => setValue("location", val)}
                  className="w-full pr-10 py-2.5"
                >
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
                {errors.location && (
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
                {errors.location && (
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
                <Select onValueChange={handleCompanySelection}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select company" />
                  </SelectTrigger>
                  <SelectContent>
                    {companies.map((comp) => (
                      <SelectItem key={comp._id} value={comp._id}>
                        {comp.name}
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
                  ✓ Linked to company successfully
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
                  {...register("salary.min", { valueAsNumber: true })}
                />
                <Input
                  type="number"
                  placeholder="Max"
                  {...register("salary.max", { valueAsNumber: true })}
                />
              </div>
            </div>

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Posting..." : "Post Job"}
            </Button>
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
