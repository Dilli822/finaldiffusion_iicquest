import React from "react";
import { Button } from "@/components/ui/button";
import { Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

const PersonalMenu = ({ recipient }) => {
  const navigate = useNavigate();

  const handleVideoCall = () => {
    // Navigate to /video-call/[recipientId] or your preferred route
    navigate(`/video-call/${recipient._id}`);
  };

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" onClick={handleVideoCall}>
        <Video />
      </Button>
    </div>
  );
};

export default PersonalMenu;
