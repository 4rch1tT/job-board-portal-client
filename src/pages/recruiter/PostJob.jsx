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
import { jobCategories, jobLocations, jobTypes } from "@/constants/jobEnums";

export default function PostJob() {
  const { register, handleSubmit, setValue } = useForm();

  const onSubmit = (data) => {};

  return (
    <div className="min-h-screen bg-muted flex flex-col justify-center items-center ">
      <h1 className="text-center mb-8 text-4xl">Post Job</h1>
      <div className="border-2 p-8 rounded-2xl w-[800px]">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("title")} placeholder="Job Title" />
          <Textarea
            {...register("description")}
            placeholder="Job Description"
          />

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

          <Select onValueChange={(val) => setValue("type", val)}>
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

          <Input {...register("salary")} type="number" placeholder="Salary" />
          <Button type="submit">Post Job</Button>
        </form>
      </div>
    </div>
  );
}
