import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { login } from "@/store/slices/authSlice";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import registerSVG from "@/assets/images/register.svg";
import { CheckCircle2 } from "lucide-react";

const formSchema = z
  .object({
    name: z.string().min(5, {
      message: "Username must be at least 5 characters.",
    }),
    email: z.string().email({
      message: "Invalid email address",
    }),
    password: z
      .string()
      .min(8, {
        message: "Password must be minimum 8 characters long",
      })
      .max(15, {
        message: "Password cannot exceed 15 characters",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[0-9]/, {
        message: "Password must contain at least one number",
      })
      .regex(/[^a-zA-Z0-9]/, {
        message: "Password must contain at least one special character",
      }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      const res = await axios.post(
        `${api_domain}/api/candidate/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );

      console.log(res.data);
      dispatch(login({ name: values.name }));
      navigate("/");
    } catch (error) {
      console.log("Register failed", error.response?.data);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8 pt-8 px-4 lg:px-0">
      <div className="hidden lg:flex lg:w-2/5 xl:w-1/3 shadow-md h-[500px] flex-col ml-0 lg:ml-24 rounded-lg py-6 bg-muted">
        <img src={registerSVG} alt="register" className="h-60 w-full object-contain" />
        <div className="tracking-tight flex flex-col justify-center items-center px-4">
          <p className="text-center text-2xl lg:text-3xl mb-4 font-semibold">
            On registering, you can
          </p>
          <div className="">
            <div className="flex items-center mb-1.5 text-lg lg:text-xl">
              <CheckCircle2 fill="#b3ee6d" className=" text-gray-600 mr-2" />
              <p>Build your profile and recruiters find you</p>
            </div>
            <div className="flex items-center mb-1.5 text-lg lg:text-xl">
              <CheckCircle2 fill="#b3ee6d" className=" text-gray-600 mr-2" />
              <p>Get real time job updates</p>
            </div>
            <div className="flex items-center mb-2 text-lg lg:text-xl">
              <CheckCircle2 fill="#b3ee6d" className=" text-gray-600 mr-2" />
              <p>Find a job and grow your career</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full lg:w-3/5 xl:w-2/3 shadow-md bg-muted p-6 lg:p-16 lg:mr-24 rounded-lg">
        <div className="mb-8 tracking-tight text-center lg:text-left">
          <h2 className="text-2xl lg:text-3xl font-bold">Create your Seeker profile</h2>
          <p className="text-2xl text-gray-400">For seekers from 'Seeker'</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 lg:space-y-8 tracking-tight "
          >
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md lg:text-lg">
                    Full name
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What is your name?"
                      {...field}
                      className="w-full mt-3 text-md lg:text-lg"
                    />
                  </FormControl>
                  <FormDescription className="text-md lg:text-lg">
                    This is your public display name
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md lg:text-lg">Email ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tell us your Email ID"
                      {...field}
                      className="w-full mt-3 text-md lg:text-lg"
                    />
                  </FormControl>
                  <FormDescription className="text-md lg:text-lg">
                    We'll send relevant jobs and updates to this email
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md lg:text-lg">Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(Minimum 8 characters)"
                      {...field}
                      className="w-full mt-3 text-md lg:text-lg"
                      type="password"
                    />
                  </FormControl>
                  <FormDescription className="text-md lg:text-lg">
                    This helps your account stay protected
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-md lg:text-lg">
                    Confirm password
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Retype the password"
                      {...field}
                      className="w-full mt-3 text-md lg:text-lg"
                      type="password"
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="py-5 ">
              Register now
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
