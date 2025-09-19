import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  Building2,
  Users,
  Clock,
  Share2,
  Heart,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Upload,
  File,
  Bookmark,
  Eye,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "react-toastify";
import { useSelector, useDispatch } from "react-redux";
import { setWishlist } from "@/store/slices/wishlistSlice";
import { toggleWishlist } from "@/store/thunks/wishlistThunks";

const ApplicationModal = ({ job, isOpen, onClose, onSubmit }) => {
  const [resumeFile, setResumeFile] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const allowedTypes = [
        "application/pdf",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!allowedTypes.includes(file.type)) {
        toast.error("Please upload a PDF or Word document");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setResumeFile(file);
    }
  };

  const uploadResume = async () => {
    if (!resumeFile) return null;

    setUploading(true);
    const formData = new FormData();
    formData.append("resume", resumeFile);

    try {
      const response = await axios.post(
        `${api_domain}/api/candidate/upload-resume`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const { url, uploadedAt } = response.data;
      setResumeUrl(url);

      return {
        url,
        fileName: resumeFile.name,
        fileType: resumeFile.type,
        uploadedAt,
      };
    } catch (error) {
      console.error("Resume upload failed:", error);
      toast.error("Failed to upload resume");
      throw error;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!resumeFile) {
      toast.error("Please upload your resume");
      return;
    }

    try {
      const resumeData = await uploadResume();
      if (resumeData) {
        await onSubmit({
          resume: resumeData,
          coverLetter: coverLetter.trim(),
        });
        onClose();
        setResumeFile(null);
        setCoverLetter("");
        setResumeUrl("");
      }
    } catch (error) {}
  };
  const removeFile = () => {
    setResumeFile(null);
    setResumeUrl("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-scroll [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Apply for {job.title}
              </h2>
              <p className="text-gray-600 mt-1">at {job.company?.name}</p>
            </div>
            <Button variant="ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label className="text-base font-medium">
                Resume <span className="text-red-500">*</span>
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Upload your resume tailored for this position (PDF or Word, max
                5MB)
              </p>

              {!resumeFile ? (
                <div>
                  <label className="block cursor-pointer border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-gray-500">
                        PDF, DOC, DOCX up to 5MB
                      </p>
                    </div>
                    <Input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                  </label>
                </div>
              ) : (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <File className="h-8 w-8 text-blue-600" />
                      <div>
                        <p className="font-medium text-gray-900">
                          {resumeFile.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {(resumeFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>

            <div>
              <Label htmlFor="coverLetter" className="text-base font-medium">
                Cover Letter (Optional)
              </Label>
              <p className="text-sm text-gray-600 mb-3">
                Tell the employer why you're perfect for this role
              </p>
              <Textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write a brief cover letter explaining why you're interested in this position and what makes you a good fit..."
                className="min-h-[120px] resize-none"
                maxLength={1000}
              />
              <p className="text-xs text-gray-500 mt-1">
                {coverLetter.length}/1000 characters
              </p>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                By applying, you agree to share your resume and cover letter
                with the employer. Once submitted, you cannot modify or withdraw
                your application.
              </AlertDescription>
            </Alert>

            <div className="flex space-x-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={uploading || !resumeFile}
                className="flex-1"
              >
                {uploading ? "Uploading..." : "Submit Application"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

const JobDetails = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [userProfile, setUserProfile] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);

  const wishlist = useSelector((state) => state.wishlist);
  const isInWishlist = wishlist.includes(jobId);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${api_domain}/api/job/${jobId}`, {
          withCredentials: true,
        });
        setJob(response.data.job);
      } catch (error) {
        console.error("Failed to fetch job details:", error);
        setError("Failed to load job details");
        if (error.response?.status === 404) {
          navigate("/jobs", { replace: true });
        }
      } finally {
        setLoading(false);
      }
    };

    if (jobId) {
      fetchJobDetails();
    }
  }, [jobId, navigate, api_domain]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const profileResponse = await axios.get(
          `${api_domain}/api/candidate/profile`,
          { withCredentials: true }
        );
        setUserProfile(profileResponse.data);

        const wishlistData = profileResponse.data.wishlist || [];
        dispatch(
          setWishlist(
            wishlistData.map((item) =>
              typeof item === "object" ? item._id : item
            )
          )
        );

        const applicationsResponse = await axios.get(
          `${api_domain}/api/application/user`,
          { withCredentials: true }
        );
        const applications = applicationsResponse.data.applications || [];
        setHasApplied(
          applications.some(
            (app) =>
              (typeof app.job === "object" ? app.job._id : app.job) === jobId
          )
        );
      } catch (error) {
        console.error("Failed to fetch user data:", error);
      }
    };

    fetchUserData();
  }, [jobId, api_domain, dispatch]);

  const handleWishlistToggle = (jobId) => {
    if (!userProfile) {
      toast.error("Please log in to save jobs");
      navigate("/login");
      return;
    }
    dispatch(toggleWishlist(jobId));
  };

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
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  };

  const getJobTypeColor = (jobType) => {
    const colors = {
      "full-time": "bg-blue-100 text-blue-800",
      "part-time": "bg-green-100 text-green-800",
      contract: "bg-orange-100 text-orange-800",
      internship: "bg-purple-100 text-purple-800",
      remote: "bg-indigo-100 text-indigo-800",
    };
    return colors[jobType?.toLowerCase()] || "bg-gray-100 text-gray-800";
  };

  const handleApply = () => {
    if (!userProfile) {
      toast.error("Please log in to apply for this job");
      navigate("/login");
      return;
    }
    setShowApplicationModal(true);
  };

  const handleApplicationSubmit = async (applicationData) => {
    try {
      await axios.post(
        `${api_domain}/api/application/${jobId}`,
        applicationData,
        {
          withCredentials: true,
        }
      );

      setHasApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.error("Application failed:", error);
      toast.error(
        error.response?.data?.message || "Failed to submit application"
      );
      throw error;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-4 text-lg font-semibold text-gray-900">
            Job Not Found
          </h3>
          <p className="mt-2 text-gray-500">
            The job you're looking for doesn't exist or has been removed.
          </p>
          <Button onClick={() => navigate("/jobs")} className="mt-4">
            Browse All Jobs
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex items-center justify-between">
              <Button
                variant="ghost"
                onClick={() => navigate(-1)}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={() => handleWishlistToggle(jobId)}
                className={isInWishlist ? "text-red-500 border-red-200" : ""}
              >
                <Heart
                  className={`h-4 w-4 ${isInWishlist ? "fill-current" : ""}`}
                />
              </Button>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage
                        src={job.company?.logoUrl}
                        alt={job.company?.name}
                      />
                      <AvatarFallback className="bg-gradient-to-br from-[#b3ee6d] to-[rgb(109,152,43)] text-white text-lg font-bold">
                        {job.company?.name?.charAt(0) || "C"}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1">
                      <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
                        {job.title}
                      </CardTitle>

                      <div className="flex items-center gap-2 text-lg text-gray-600 mb-4">
                        <Building2 className="h-5 w-5" />
                        <span className="font-medium">{job.company?.name}</span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          <span>{job.location}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <span>Posted {formatDate(job.createdAt)}</span>
                        </div>

                        <div className="flex items-center gap-1">
                          <span>{formatSalary(job.salary)}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-4">
                        <Badge className={getJobTypeColor(job.jobType)}>
                          {job.jobType}
                        </Badge>
                        {job.category && (
                          <Badge variant="outline">{job.category}</Badge>
                        )}
                        {job.isVerified && (
                          <Badge className="bg-green-100 text-green-800">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {hasApplied && (
                <Alert>
                  <CheckCircle className="h-4 w-4" />
                  <AlertDescription>
                    You have already applied for this position. Check your
                    applications to track the status.
                  </AlertDescription>
                </Alert>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>Job Description</CardTitle>
                </CardHeader>
                <CardContent className="prose max-w-none">
                  <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {job.description}
                  </p>
                </CardContent>
              </Card>

              {job.requirements && job.requirements.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {job.requirements.map((requirement, index) => (
                        <li
                          key={index}
                          className="flex items-start gap-2 text-gray-700"
                        >
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                          <span>{requirement}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              )}

              {job.skills && job.skills.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Required Skills</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {job.skills.map((skill, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="text-sm"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              <Card>
                <CardHeader>
                  <CardTitle>About {job.company?.name}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {job.company?.description && (
                      <p className="text-gray-700">{job.company.description}</p>
                    )}

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      {job.company?.industry && (
                        <div>
                          <span className="font-medium text-gray-900">
                            Industry:
                          </span>
                          <p className="text-gray-600">
                            {job.company.industry}
                          </p>
                        </div>
                      )}

                      {job.company?.location && (
                        <div>
                          <span className="font-medium text-gray-900">
                            Location:
                          </span>
                          <p className="text-gray-600">
                            {job.company.location}
                          </p>
                        </div>
                      )}
                    </div>

                    {job.company?.website && (
                      <div className="pt-2">
                        <a
                          href={job.company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Visit Company Website
                        </a>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle>Apply for this Job</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {!userProfile ? (
                    <div className="text-center">
                      <p className="text-gray-600 mb-4">
                        Log in to apply for this position
                      </p>
                      <Button
                        onClick={() => navigate("/login")}
                        className="w-full"
                      >
                        Log In to Apply
                      </Button>
                    </div>
                  ) : hasApplied ? (
                    <div className="text-center">
                      <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                      <p className="text-gray-900 font-medium mb-2">
                        Already Applied
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        You submitted your application for this position.
                      </p>
                      <Button
                        variant="outline"
                        onClick={() => navigate("/applications")}
                        className="w-full"
                      >
                        View My Applications
                      </Button>
                    </div>
                  ) : (
                    <div>
                      <Button
                        onClick={handleApply}
                        className="w-full mb-4"
                        size="lg"
                      >
                        Apply Now
                      </Button>

                      <div className="text-xs text-gray-500 space-y-1">
                        <p>• Upload your tailored resume</p>
                        <p>• Add a cover letter (optional)</p>
                        <p>• Application can't be withdrawn</p>
                        <p>• Employer will be notified</p>
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Job Type:</span>
                      <span className="font-medium capitalize">
                        {job.jobType}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Location:</span>
                      <span className="font-medium">{job.location}</span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-gray-600">Posted:</span>
                      <span className="font-medium">
                        {formatDate(job.createdAt)}
                      </span>
                    </div>

                    {job.salary && (
                      <div className="flex justify-between">
                        <span className="text-gray-600">Salary:</span>
                        <span className="font-medium">
                          {formatSalary(job.salary)}
                        </span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Similar Jobs</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 text-sm">
                    Explore more opportunities in {job.category || "this field"}
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/jobs?category=${job.category}`)}
                    className="w-full mt-4"
                  >
                    View Similar Jobs
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <ApplicationModal
        job={job}
        isOpen={showApplicationModal}
        onClose={() => setShowApplicationModal(false)}
        onSubmit={handleApplicationSubmit}
      />
    </>
  );
};

export default JobDetails;
