import React, { useState, useEffect, useRef } from "react";
import socket from "@/lib/socket";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import PersonalMenu from "./PersonalMenu";
import { Paperclip } from "lucide-react";

function PersonalChat({ recipient }) {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  const chatContainerRef = useRef(null);
  const fileInputRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;
  const user = JSON.parse(localStorage.getItem("user"));
  const roomId = [user._id, recipient._id].sort().join("_");

  useEffect(() => {
    if (!recipient?._id) return;

    socket.emit("joinRoom", roomId);
    fetchMessages();

    return () => {
      socket.emit("leaveRoom", roomId);
    };
  }, [roomId]);

  useEffect(() => {
    const handleIncoming = (msg) => {
      const formatted = formatMessage(msg);
      setMessages((prev) => {
        const exists = prev.some((m) => m.id === formatted.id);
        if (exists) return prev;

        // Refetch if image or file to get full/updated message from DB
        if (formatted.type === "image" || formatted.type === "file") {
          fetchMessages(); // 💡 Refetch to ensure file URL is accurate, etc.
        }

        return [...prev, formatted];
      });
    };

    socket.on("messageReceived", handleIncoming);
    return () => socket.off("messageReceived", handleIncoming);
  }, []);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const fetchMessages = async () => {
    try {
      const res = await axios.get(`${API_URL}/chat/messages/${recipient._id}`, {
        withCredentials: true,
      });
      const formatted = res.data.map(formatMessage);
      setMessages(formatted);
    } catch (error) {
      console.log(error);
      toast.error("Failed to load messages.");
    }
  };

  const formatMessage = (msg) => ({
    id: msg._id || msg.tempId, // ADD THIS
    ...msg,
    senderId: msg.sender._id,
    name: msg.sender.name,
    imageUrl: msg.sender.imageUrl,
    content: msg.message,
    type: msg.type || "text",
    time: dayjs(msg.createdAt).format("MMM D, YYYY • h:mm A"),
  });

  const handleSend = async () => {
    if (selectedFile) {
      await uploadAndSendFile(selectedFile);
      return;
    }

    const trimmed = newMessage.trim();
    if (!trimmed) return;

    try {
      const res = await axios.post(
        `${API_URL}/chat/send`,
        {
          recipientId: recipient._id,
          content: trimmed,
        },
        { withCredentials: true }
      );

      const fullMessage = {
        ...res.data,
        sender: user,
      };

      socket.emit("newMessage", fullMessage, roomId);

      // Update local messages instantly
      // setMessages((prev) => [...prev, formatMessage(fullMessage)]);
      setNewMessage("");
    } catch (error) {
      console.log(error);
      toast.error("Message failed to send.");
    }
  };

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const uploadAndSendFile = async (file) => {
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("recipientId", recipient._id);

    try {
      const res = await axios.post(`${API_URL}/chat/upload`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      const fileUrl = res.data.url;

      const fullMessage = {
        sender: user,
        message: fileUrl,
        type: file.type.startsWith("image/") ? "image" : "file",
        createdAt: new Date().toISOString(), // to keep consistent timestamp
      };

      socket.emit("newMessage", fullMessage, roomId);

      // Update local messages instantly
      setMessages((prev) => [...prev, formatMessage(fullMessage)]);
      setTimeout(() => {
        fetchMessages();
      }, 500);
    } catch (error) {
      console.error(error);
      toast.error("Failed to upload file.");
    } finally {
      setUploading(false);
      setSelectedFile(null);
      setPreviewUrl(null);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setSelectedFile(file);

    if (file.type.startsWith("image/")) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
    } else {
      setPreviewUrl(null);
    }

    e.target.value = null;
  };

  return (
    <Card className="flex flex-col h-full p-6 bg-sky-50">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src={recipient.imageUrl} className="object-cover" />
            <AvatarFallback>{recipient.name?.[0] || "U"}</AvatarFallback>
          </Avatar>
          <h2 className="text-2xl font-bold">{recipient.name}</h2>
        </div>
        <PersonalMenu recipient={recipient} />
      </div>

      {/* Messages */}
      <div
        ref={chatContainerRef}
        className="flex-1 border rounded-md p-4 overflow-y-auto bg-[url('/chat-bg.jpg')] bg-no-repeat bg-cover"
      >
        {messages.map((msg, idx) => {
          const isYou = msg.senderId === user._id;
          return (
            <div
              key={idx}
              className={`flex items-end gap-3 mb-4 ${
                isYou ? "justify-end" : "justify-start"
              }`}
            >
              {!isYou && (
                <Avatar>
                  <AvatarImage src={msg.imageUrl} className="object-cover" />
                  <AvatarFallback>{msg.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}

              <div className={isYou ? "text-right" : "text-left"}>
                <div
                  className={`rounded-xl px-4 py-2 max-w-xs ${
                    isYou ? "bg-blue-500 text-white" : "bg-muted"
                  }`}
                >
                  {!isYou && <p className="font-semibold mb-1">{msg.name}</p>}

                  {msg.type === "text" && (
                    <p className="text-sm">{msg.content}</p>
                  )}

                  {msg.type === "image" && (
                    <img
                      src={msg.content}
                      alt="sent"
                      className="rounded-md cursor-pointer max-w-full max-h-64 object-cover"
                      onClick={() => window.open(msg.content, "_blank")}
                    />
                  )}

                  {msg.type === "file" && (
                    <a
                      href={msg.content}
                      download
                      className="flex items-center gap-2 text-sm underline"
                    >
                      <Paperclip /> {msg.fileName || "Download file"}
                    </a>
                  )}
                </div>
                <div className={"text-xs mt-1 text-gray-700"}>{msg.time}</div>
              </div>

              {isYou && (
                <Avatar>
                  <AvatarImage src={user.imageUrl} className="object-cover" />
                  <AvatarFallback>{user.name?.[0] || "U"}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>

      {/* Preview above input */}
      {selectedFile && (
        <div className="my-2 p-2 border rounded-md bg-white shadow-sm max-w-md relative">
          <button
            onClick={() => {
              setSelectedFile(null);
              setPreviewUrl(null);
            }}
            className="absolute top-1 right-2 text-gray-500 hover:text-red-500 text-lg"
            aria-label="Remove preview"
          >
            ×
          </button>

          {previewUrl ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="max-w-full max-h-64 object-cover rounded-md"
            />
          ) : (
            <div className="text-sm text-gray-700">
              {selectedFile.name} ({Math.round(selectedFile.size / 1024)} KB)
            </div>
          )}
        </div>
      )}

      {/* Loading indicator */}
      {uploading && (
        <div className="text-sm text-gray-500 mb-2 animate-pulse">
          Uploading...
        </div>
      )}

      {/* Input + Attach Button */}
      <div className="flex gap-2 items-center mt-2">
        <button
          type="button"
          onClick={openFilePicker}
          className="text-gray-500 hover:text-gray-700 text-2xl px-2"
          aria-label="Attach file"
          disabled={uploading}
        >
          <Paperclip />
        </button>
        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleFileChange}
          disabled={uploading}
        />

        <Input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={uploading}
          className="flex-1"
        />
        <Button onClick={handleSend} disabled={uploading}>
          Send
        </Button>
      </div>
    </Card>
  );
}

export default PersonalChat;
