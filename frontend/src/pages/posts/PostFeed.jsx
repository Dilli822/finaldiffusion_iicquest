import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MessageSquare, ThumbsUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ShareButton from "@/components/ShareButton";

function PostFeed({ post }) {
  const postUrl = `${window.location.origin}/post/${post.id}`;

  const renderMedia = () => {
    const fileUrl = post.file?.url;
    if (!fileUrl) return null; // Check first to avoid error

    const isVideo = fileUrl.match(/\.(mp4|webm|ogg)$/i);
    const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);

    if (isVideo) {
      return (
        <video
          controls
          className="rounded-md max-h-[400px] w-full object-cover mb-3"
        >
          
        </video>
      );
    }

    if (isImage) {
      return (
        <img
          src={fileUrl}
          alt="Post"
          className="rounded-md max-h-[400px] w-full object-cover mb-3"
        />
      );
    }

    return null;
  };

  return (
    <Card className="w-full  mb-6 shadow-md">
      <CardContent>
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={post.authorImage || "/default-user.png"} />
            <AvatarFallback>{post.authorName[0]}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Post Text */}
        {post.content && <p className="text-base mb-3">{post.content}</p>}

        {/* Media (if any) */}
        {renderMedia()}

        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {post.tags.map((tag, idx) => (
              <span
                key={idx}
                className="text-sm text-blue-600 font-medium hover:underline cursor-pointer"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex justify-around border-t pt-3 mt-3">
          <Button variant="ghost" className="flex items-center gap-1">
            <ThumbsUp size={18} />
            Like
          </Button>
          <Button variant="ghost" className="flex items-center gap-1">
            <MessageSquare size={18} />
            Comment
          </Button>
          <ShareButton url={postUrl} />
        </div>
      </CardContent>
    </Card>
  );
}

export default PostFeed;
