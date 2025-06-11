import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function CompanyCreate() {
  const API_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");

  const registerNewCompany = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/register`,
        {
          companyName,
        },
        {
          withCredentials: true,
        }
      );
      if (res.data.success) {
        toast.success(res.data.message);
        const companyId = res?.data?.company?._id;
        navigate(`/companies/${companyId}`);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };
  return (
    <div className="max-w-5xl mx-auto">
      <div className="my-10">
        <h1 className="font-bold text-2xl">Your Company Name</h1>
        <p className="text-gray-500">
          What would you like to give your company name? You can change it later
        </p>
      </div>
      <Label className="mb-2">Company Name</Label>
      <Input
        type="text"
        placeholder="Google, Microsoft etc."
        onChange={(e) => {
          setCompanyName(e.target.value);
        }}
        required
      />
      <div className="flex items-center gap-2 my-10">
        <Button
          variant="outline"
          onClick={() => {
            navigate("/admin/companies");
          }}
        >
          Cancel
        </Button>
        <Button onClick={registerNewCompany}>Continue</Button>
      </div>
    </div>
  );
}

export default CompanyCreate;
