import { useState } from "react";
import { Button } from "./ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import FeedPage from "@/pages/posts/FeedPage";

function Content() {
  const [activeTab, setActiveTab] = useState("videos");
  const [clicked, setClicked] = useState("video");

  return (
    <div className="p-4 flex items-center justify-center">
      <Card className="w-full rounded-2xl shadow-xl">
        <CardHeader>
          <CardTitle>
            <div className="flex gap-2 p-1 rounded-md">
              <Button
                variant={activeTab === "videos" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("videos");
                  setClicked("video");
                }}
                className="flex-1"
              >
                My Videos
              </Button>
              <Button
                variant={activeTab === "posts" ? "default" : "ghost"}
                onClick={() => {
                  setActiveTab("posts");
                  setClicked("post");
                }}
                className="flex-1"
              >
                My Posts
              </Button>
            </div>
          </CardTitle>
          <CardDescription>
            Click a tab to switch between content.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <FeedPage clicked={clicked} />
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          {/* Optional: footer actions here */}
        </CardFooter>
      </Card>
    </div>
  );
}

export default Content;
