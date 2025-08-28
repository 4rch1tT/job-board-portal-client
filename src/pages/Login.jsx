import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios from "axios";
import { useNavigate } from "react-router-dom";
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

export function Login() {
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
        `${api_domain}/api/candidate/login`,
        {
          email: values.email,
          password: values.password,
        },
        { withCredentials: true }
      );
      console.log(res.data);
      dispatch(login({ name: values.name }));
      navigate("/");
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
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email ID</FormLabel>
              <FormControl>
                <Input placeholder="Enter Email ID" {...field} />
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
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input placeholder="Enter Password" {...field} />
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
        <Button type="submit">Login</Button>
      </form>
    </Form>
  );
}
