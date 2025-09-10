import axios from "axios";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
Textarea
import { Button } from "./ui/button";

export function AddCompanyModal({ onClose, onSuccess }) {
  const { register, handleSubmit } = useForm();

  const onSubmit = async (data) => {
    const res = await axios.post("/api/companies/request", data);
    onSuccess(res.data.company);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md space-y-4">
        <h3 className="text-lg font-semibold">Add Company</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Input {...register("name")} placeholder="Company Name" />
          <Input {...register("logoUrl")} placeholder="Logo URL" />
          <Input {...register("website")} placeholder="Website" />
          <Input {...register("location")} placeholder="Location" />
          <Input {...register("industry")} placeholder="Industry" />
          <Textarea {...register("description")} placeholder="Description" />
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Create</Button>
          </div>
        </form>
      </div>
    </div>
  );
}
