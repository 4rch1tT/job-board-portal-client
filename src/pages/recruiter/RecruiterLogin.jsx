import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";

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
import { login } from "@/store/slices/authSlice";
import loginSVG from "@/assets/images/searching.svg";

const formSchema = z.object({
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
});

export function RecruiterLogin() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const api_domain = import.meta.env.VITE_API_DOMAIN;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onSubmit = async (values) => {
    try {
      const res = await axios.post(
        `${api_domain}/api/recruiter/login`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );
      if (res.data.recruiter.role !== "recruiter") {
        form.setError("root", {
          type: "manual",
          message: "Only recruiters can log in here.",
        });
        return;
      }
      dispatch(login(res.data.recruiter));
      navigate("/recruiter");
    } catch (error) {
      console.log("Login failed", error.response?.data);

      if (error.response?.status === 404) {
        form.setError("email", {
          type: "manual",
          message: "Email not found",
        });
      } else if (error.response?.status === 401) {
        form.setError("password", {
          type: "manual",
          message: "Incorrect password",
        });
      } else {
        form.setError("root", {
          type: "manual",
          message: "Something went wrong. Please try again.",
        });
      }
    }
  };

  return (
    <div className="min-h-screen bg-muted">
      <div className="grid grid-cols-1 md:grid-cols-9 grid-rows-8">
        <div className="col-span-1 md:col-span-3 row-span-8 tracking-tight text-[#3c3c3c] h-screen bg-[#b3ee6d] p-8 flex flex-col justify-evenly">
          <h2 className="mb-8 text-3xl font-semibold">
            Login and find the right candidates
          </h2>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8 tracking-tight"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Your Email ID</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#3c3c3c] rounded-none focus-visible:ring-0 focus-visible:bg-[#b3ee6d]"
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-lg">Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-t-0 border-l-0 border-r-0 border-b-1 border-[#3c3c3c] rounded-none focus-visible:ring-0"
                      />
                    </FormControl>
                    <FormDescription></FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.formState.errors.root && (
                <p className="text-red-500 text-sm">
                  {form.formState.errors.root.message}
                </p>
              )}
              <Button
                type="submit"
                className="min-w-full bg-[#3c3c3c] p-8 text-lg text-white hover:text-[#3c3c3c] font-semibold"
              >
                Login Now
              </Button>
            </form>
          </Form>
          <p className="text-xl tracking-tight text-center">
            New user?{" "}
            <Link to="/recruiter/register" className="font-bold underline">
              Register
            </Link>
          </p>
        </div>
        <div className="hidden md:flex col-span-5 row-span-8 col-start-5 rounded-lg justify-center items-center">
          <img src={loginSVG} alt="login" className="h-[600px]" />
        </div>
      </div>
    </div>
  );
}
