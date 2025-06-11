import ShareButton from "@/components/ShareButton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MessageSquare, ThumbsUp, Edit2 } from "lucide-react";

function PostFeed({ post, onEdit }) {
  const postUrl = `${window.location.origin}/post/${post.id}`;

  // Assume you have access to the authenticated user's ID
  // Replace with actual logic to get the current user's ID (e.g., from context or auth state)
  const currentUserId = "your-user-id"; // Replace with actual user ID from auth
  const isAuthor = post.author?._id === currentUserId; // Adjust based on your post data structure

  const renderMedia = () => {
    const fileUrl = post.file?.url;
    if (!fileUrl) return null;

    const isVideo = fileUrl.match(/\.(mp4|webm|ogg)$/i);
    const isImage = fileUrl.match(/\.(jpg|jpeg|png|gif|bmp|webp)$/i);

    if (isVideo) {
      return (
        <video
          controls
          className="rounded-md max-h-[400px] w-full object-cover mb-3"
        >
          <source src={fileUrl} type="video/mp4" />
          Your browser does not support the video tag.
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
    <Card className="w-full mb-6 shadow-md">
      <CardContent>
        {/* User Info */}
        <div className="flex items-center gap-3 mb-3">
          <Avatar>
            <AvatarImage src={post?.authorImage || "/default-user.png"} />
            <AvatarFallback>{post?.authorName}</AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{post.authorName}</p>
            <p className="text-xs text-muted-foreground">
              {new Date(post.createdAt).toLocaleString()}
            </p>
          </div>
        </div>

        {/* Post Title */}
        {post.title && <h2 className="text-lg font-semibold mb-2">{post.title}</h2>}

        {/* Post Content */}
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
          {isAuthor && (
            <Button
              variant="ghost"
              className="flex items-center gap-1"
              onClick={() => onEdit(post)}
            >
              <Edit2 size={18} />
              Edit
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default PostFeed;