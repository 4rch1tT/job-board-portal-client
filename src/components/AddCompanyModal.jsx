import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Label } from "./ui/label";
import { toast } from "react-toastify";
import { useState } from "react";

export function AddCompanyModal({ onClose, onSuccess }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [logoUrl, setLogoUrl] = useState("");
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [submittingForm, setSubmittingForm] = useState(false);

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("company_logo", file);

    setUploadingLogo(true);
    try {
      const res = await axios.post(
        `${api_domain}/api/company/upload-company_logo`,
        formData,
        {
          withCredentials: true,
        }
      );
      setLogoUrl({
        url: res.data.url,
        publicId: res.data.publicId,
        uploadedAt: new Date(),
      });
      toast.success(res.data.message || "Company logo uploaded!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploadingLogo(false);
    }
  };

  const onSubmit = async (data) => {
    if (!logoUrl) {
      toast.error("Please upload a company logo before submitting");
      return;
    }

    setSubmittingForm(true);
    try {
      const payload = { ...data, logoUrl };
      const res = await axios.post(`${api_domain}/api/company/`, payload, {
        withCredentials: true,
      });
      onSuccess(res.data.company);
      toast.success("Company created successfully!");
      reset();
      onClose();
      setLogoUrl("");
    } catch (error) {
      toast.error(error.response?.data?.message || "Company creation failed");
    } finally {
      setSubmittingForm(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4 mt-20">
        <h3 className="text-lg font-semibold">Add Company</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label className="mb-2">Company Name</Label>
            <Input
              {...register("name", { required: "Company name is required" })}
              placeholder="e.g. Google"
            />
            {errors.name && (
              <p className="text-red-500 text-sm">{errors.name.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Company Logo</Label>
            <Input
              type="file"
              placeholder="Logo URL"
              onChange={handleLogoUpload}
            />
            {uploadingLogo && (
              <p className="text-sm text-muted">Uploading...</p>
            )}
            {logoUrl && (
              <img
                src={logoUrl}
                alt="Company Logo"
                className="h-16 mt-2 rounded"
              />
            )}
          </div>

          <div>
            <Label className="mb-2">Website</Label>
            <Input
              {...register("website", { required: "Website is required" })}
              placeholder="https://about.google"
            />
            {errors.website && (
              <p className="text-red-500 text-sm">{errors.website.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Location</Label>
            <Input
              {...register("location", { required: "Location is required" })}
              placeholder=" Mountain View, California"
            />
            {errors.location && (
              <p className="text-red-500 text-sm">{errors.location.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Industry</Label>
            <Input
              {...register("industry", { required: "Industry is required" })}
              placeholder="Technology"
            />
            {errors.industry && (
              <p className="text-red-500 text-sm">{errors.industry.message}</p>
            )}
          </div>

          <div>
            <Label className="mb-2">Description</Label>
            <Textarea
              {...register("description", {
                required: "Description is required",
              })}
              placeholder="Brief company overview"
            />
            {errors.description && (
              <p className="text-red-500 text-sm">
                {errors.description.message}
              </p>
            )}
          </div>
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={submittingForm || uploadingLogo}>
              {submittingForm ? "Creating..." : "Create"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
