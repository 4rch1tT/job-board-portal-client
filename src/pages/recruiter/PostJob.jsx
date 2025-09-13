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
  } = useForm();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [companies, setCompanies] = useState([]);
  const [showAddCompany, setShowAddCompany] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const selectedCompany = watch("company");

  useEffect(() => {
    axios
      .get(`${api_domain}/api/company/approved`, { withCredentials: true })
      .then((res) => {
        setCompanies(res.data.companies);
      })
      .catch((e) => {
        console.log(e);
        toast.error("Failed to load companies");
      });
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
    <div className="min-h-screen bg-muted flex flex-col justify-center items-center ">
      <div className="border-2 p-5 rounded-2xl w-[800px]">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6 max-w-2xl mx-auto p-6"
        >
          <h2 className="text-center mb-8 text-2xl font-semibold">Post Job</h2>
          <div className="space-y-2">
            <Label htmlFor="title">Job Title</Label>
            <Input
              {...register("title", { required: true })}
              placeholder="Job Title"
            />
            {errors.title && <p className="text-red-500">Title is required</p>}
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Job Description</Label>
            <Textarea
              {...register("description", { required: true })}
              placeholder="Job Description"
            />
            {errors.description && (
              <p className="text-red-500">Description is required</p>
            )}
          </div>
          <div className="flex gap-4">
            <div>
              <Label className="mb-2">Location</Label>
              <Select onValueChange={(val) => setValue("location", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  {jobLocations.map((loc) => (
                    <SelectItem key={loc.value} value={loc.value}>
                      {loc.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Category</Label>
              <Select onValueChange={(val) => setValue("category", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {jobCategories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-2">Type</Label>
              <Select onValueChange={(val) => setValue("jobType", val)}>
                <SelectTrigger>
                  <SelectValue placeholder="Job type" />
                </SelectTrigger>
                <SelectContent>
                  {jobTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div>
            <Label className="mb-2">Company</Label>
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
            <Label className="mb-2">Salary Range</Label>
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
