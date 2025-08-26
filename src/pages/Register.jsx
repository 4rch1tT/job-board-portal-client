import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const formSchema = z
  .object({
    fullName: z.string().min(5, {
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
    message: "Password do not match",
    path: ["confirmPassword"],
  });

export function Register() {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = () => {};

  return (
    <div className="grid grid-cols-12 grid-rows-12 gap-8 bg-[#f5f4fa] pt-8">
      <div className="col-span-4 row-span-5 border-2  flex ml-24 bg-white rounded-lg"></div>
      <div className="col-span-8 row-span-8 col-start-5 border-2 p-8 mr-24 rounded-lg bg-white">
        <div className="mb-8">
          <h2 className="text-2xl font-bold">Create your Seeker profile</h2>
          <p>For seekers from 'Seeker'</p>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 w-[600px] h-auto "
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full name</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="What is your name?"
                      {...field}
                      className="w-[600px]"
                    />
                  </FormControl>
                  <FormDescription>
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
                  <FormLabel>Email ID</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Tell us your Email ID"
                      {...field}
                      className="w-[600px]"
                    />
                  </FormControl>
                  <FormDescription>
                    We'll send relevent jobs and updates to this email
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="(Minimum 8 characters)"
                      {...field}
                      className="w-[600px]"
                    />
                  </FormControl>
                  <FormDescription>
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
                  <FormLabel>Confirm password</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Retype the password"
                      {...field}
                      className="w-[600px]"
                    />
                  </FormControl>
                  <FormDescription></FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="py-5">
              Register now
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
