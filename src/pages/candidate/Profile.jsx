import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
  CardDescription,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user } = useSelector((state) => state.isAuthenticated);

  return (
    <div className="min-h-screen flex justify-center items-center bg-muted">
      <Card className="w-[310px]">
        <CardHeader>
          <div className="flex flex-col gap-4 items-center justify-center space-x-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profilePic} alt={user?.name?.[0]} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>Name</Label>
              <p className="text-sm">{user?.name}</p>
            </div>
            <div className="flex flex-col space-y-1.5">
              <Label>Email</Label>
              <p className="text-sm">{user?.email}</p>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Edit Profile</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Profile;
