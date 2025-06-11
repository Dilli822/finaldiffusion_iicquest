import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ArrowLeftCircle, Loader2 } from "lucide-react";

function CompanySetup() {
  return (
    <div className="max-w-xl mx-auto my-10 border border-gray-300 rounded-md p-8 shadow-xl">
      <div className="flex items-center gap-12 mb-10">
        <Button
          variant="outline"
          className="flex items-center gap-2 text-gray-700 font-semibold"
        >
          <ArrowLeftCircle />
          <span>Back</span>
        </Button>
        <h1 className="font-bold text-xl">Company Setup</h1>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Company Name</Label>
          <Input type="text" placeholder="Enter company name" />
        </div>
        <div>
          <Label>Description</Label>
          <Input type="text" placeholder="Enter description" />
        </div>
        <div>
          <Label>Website</Label>
          <Input type="text" placeholder="https://example.com" />
        </div>
        <div>
          <Label>Location</Label>
          <Input type="text" placeholder="City, Country" />
        </div>
        <div>
          <Label>Logo</Label>
          <Input type="file" accept="image/*" />
        </div>
      </div>

      <Button className="w-full my-4">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Please wait
      </Button>

      {/* Example alternative state */}
      {/* <Button type="submit" className="w-full my-4">
        Update
      </Button> */}
    </div>
  );
}

export default CompanySetup;
