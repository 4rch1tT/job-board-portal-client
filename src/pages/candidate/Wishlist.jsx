import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  clearWishlist,
  removeFromWishlist,
  setWishlist,
} from "@/store/slices/wishlistSlice";
import axios from "axios";
import { BookmarkX, Heart, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import JobCard from "@/components/JobCard";
import { toast } from "react-toastify";

const Wishlist = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState(null);

  const wishlistJobs = useSelector((state) => state.wishlist);

  useEffect(() => {
    const fetchWishlist = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${api_domain}/api/candidate/profile`,
          {
            withCredentials: true,
          }
        );

        const wishlistData = response.data.wishlist || [];
        dispatch(setWishlist(wishlistData));
      } catch (error) {
        console.error("Failed to fetch wishlist:", error);
        toast.error("Failed to load wishlist");
        if (error.response?.status === 401) {
          navigate("/login");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [api_domain, navigate, dispatch]);

  const handleRemoveFromWishlist = async (jobId) => {
    if (
      !window.confirm(
        "Are you sure you want to remove this job from your wishlist?"
      )
    ) {
      return;
    }

    setRemoving(jobId);
    try {
      await axios.put(
        `${api_domain}/api/candidate/wishlist/${jobId}`,
        { jobId },
        { withCredentials: true }
      );

      dispatch(removeFromWishlist(jobId));
      toast.success("Job removed from wishlist");
    } catch (error) {
      console.error("Failed to remove from wishlist:", error);
      toast.error("Failed to remove job from wishlist");
    } finally {
      setRemoving(null);
    }
  };

  const handleClearAllWishlist = async () => {
    if (
      !window.confirm(
        "Are you sure you want to clear your entire wishlist? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      for (const job of wishlistJobs) {
        await axios.put(
          `${api_domain}/api/candidate/wishlist/${job._id}`,
          { jobId: job._id },
          { withCredentials: true }
        );
      }

      dispatch(clearWishlist());
      toast.success("Wishlist cleared successfully");
    } catch (error) {
      console.error("Failed to clear wishlist:", error);
      toast.error("Failed to clear wishlist");
    }
  };

  const handleViewJob = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleApply = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <Heart className="h-6 w-6 text-red-500 fill-current" />
                My Wishlist
              </h1>
              <p className="text-gray-600 mt-1">Jobs you've saved for later</p>
            </div>

            {wishlistJobs.length > 0 && (
              <Button
                variant="outline"
                onClick={handleClearAllWishlist}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {wishlistJobs.length === 0 ? (
          <div className="text-center py-16">
            <BookmarkX className="mx-auto h-24 w-24 text-gray-300" />
            <h3 className="mt-4 text-xl font-semibold text-gray-900">
              Your wishlist is empty
            </h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              Start saving jobs you're interested in by clicking the heart icon
              on job listings.
            </p>
            <Button onClick={() => navigate("/jobs")} className="mt-6">
              Browse Jobs
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {wishlistJobs.map((job) => (
              <JobCard
                key={job._id}
                job={job}
                onApply={handleApply}
                onViewDetails={handleViewJob}
                onToggleWishlist={()=>handleRemoveFromWishlist(job._id)}
                isInWishlist={true}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;
