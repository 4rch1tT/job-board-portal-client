import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useDispatch, useSelector } from "react-redux";
import { updateUser } from "@/store/slices/authSlice";

const UpdateProfile = () => {
  const { user } = useSelector((state) => state.isAuthenticated);
  const dispatch = useDispatch();
  const api_domain = import.meta.env.VITE_API_DOMAIN;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleUploadProfilePic = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profile_pic", file);

    try {
      const res = await axios.post(
        `${api_domain}/api/candidate/upload-profile-pic`,
        formData,
        {
          withCredentials: true,
          headers: {},
        }
      );

      dispatch(updateUser(res.data.candidate));
      toast.success(res.data.message || "Profile picture updated!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    }
  };

  const handleSubmit = async () => {
    if (!formData.name) {
      toast.error("Name is required");
      return;
    }
    if (!formData.email) {
      toast.error("Email is required");
      return;
    }

    const isChangingPassword =
      formData.currentPassword ||
      formData.newPassword ||
      formData.confirmPassword;

    if (isChangingPassword) {
      if (!formData.currentPassword) {
        toast.error("Current password is required to change your password");
        return;
      }
      if (!formData.newPassword) {
        toast.error("New password is required");
        return;
      }
      if (!formData.confirmPassword) {
        toast.error("Please confirm your new password");
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
    }
    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        ...(isChangingPassword && {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
          confirmPassword: formData.confirmPassword,
        }),
      };
      const res = await axios.put(
        `${api_domain}/api/candidate/profile`,
        payload,
        { withCredentials: true }
      );

      dispatch(updateUser(res.data.candidate));

      toast.success(res.data.message || "Profile updated successfully");
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }

    setFormData({
      ...formData,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      email: "",
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted tracking-tight py-6">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Edit Profile</CardTitle>
          <CardDescription>Update your personal information</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6">
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-20 w-20 border-2 border-primary">
              <AvatarImage src={user?.profilePic} alt="Profile Picture" />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <Button
              variant="outline"
              size="sm"
              onClick={() => document.getElementById("profilePicInput").click()}
            >
              <UploadIcon className="mr-2 h-4 w-4" />
              Change Photo
            </Button>
            <input
              type="file"
              id="profilePicInput"
              accept="image/*"
              className="hidden"
              onChange={handleUploadProfilePic}
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="currentPassword">Current Password</Label>
            <Input
              id="currentPassword"
              type="password"
              value={formData.currentPassword}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmPassword">Confirm New Password</Label>
            <Input
              id="confirmPassword"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
          </div>
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>Save Changes</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

function UploadIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
      <polyline points="17 8 12 3 7 8" />
      <line x1="12" x2="12" y1="3" y2="15" />
    </svg>
  );
}

export default UpdateProfile;
