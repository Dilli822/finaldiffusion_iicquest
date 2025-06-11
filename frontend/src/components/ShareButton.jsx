import React, { useState } from "react";
import { Copy, Share2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

function ShareButton({ url }) {
  const [copied, setCopied] = useState(false); // State for copy status

  // Function to copy the URL to the clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url); // Copy URL to clipboard
      setCopied(true); // Set copied state to true
      setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
    } catch (error) {
      console.error("Failed to copy text: ", error);
    }
  };

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost">
            <Share2 /> Share
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Share link</DialogTitle>
          </DialogHeader>
          <div className="flex items-center space-x-2">
            <div className="grid flex-1 gap-2">
              <Label htmlFor="link" className="sr-only">
                Link
              </Label>
              <Input
                id="link"
                value={url} // Display the dynamic URL
                readOnly
              />
            </div>
            <Button
              type="button"
              size="sm"
              className="px-3"
              onClick={handleCopy} // Trigger the copy action
            >
              <span className="sr-only">Copy</span>
              <Copy />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
      {copied && (
        <div className="fixed top-[30%] left-1/2 transform -translate-x-1/2 mt-2 text-green-500 bg-white px-4 py-2 rounded shadow-lg z-100">
          Copied!
        </div>
      )}
    </>
  );
}

export default ShareButton;
