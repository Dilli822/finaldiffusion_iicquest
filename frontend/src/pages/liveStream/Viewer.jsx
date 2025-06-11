import React, { useState, useRef, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { LogOut } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import ShareButton from "@/components/ShareButton";
import { toast } from "sonner";

function Viewer() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const params = useParams();

  const viewerId = user?._id || user?.name || null;
  const broadcasterId = params.broadcasterId;

  const [connected, setConnected] = useState(false);

  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const videoRef = useRef(null);

  useEffect(() => {
    if (!viewerId) {
      toast.error("Please login to view the stream.");
      navigate("/");
    }
  }, [viewerId, navigate]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      leaveStream();
    };
  }, []);

  useEffect(() => {
    if (broadcasterId && !connected) {
      start();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [broadcasterId, connected]);

  const start = () => {
    console.log("Starting viewer connection...");

    // Reset video element before starting
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }

    if (!broadcasterId?.trim()) {
      toast.error("Please enter broadcaster ID");
      return;
    }
    if (!viewerId) {
      toast.error("User not authenticated");
      return;
    }

    // Close old PeerConnection if exists before creating new one
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    // Create WebSocket connection
    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected");

      const viewerName = user?.name || `Viewer-${viewerId.substring(0, 4)}`;

      const tryJoin = () => {
        if (!broadcasterId.trim()) return;

        ws.send(
          JSON.stringify({
            type: "viewer",
            broadcasterId,
            viewerId,
            viewerName,
          })
        );

        createPeerConnection();
        setConnected(true);
      };

      // Give server a little time before join
      setTimeout(tryJoin, 1000);
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      //console.log("WebSocket message:", data);

      if (data.type === "offer") {
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(
            new RTCSessionDescription(data.offer)
          );
          const answer = await pcRef.current.createAnswer();
          await pcRef.current.setLocalDescription(answer);

          ws.send(
            JSON.stringify({
              type: "answer",
              viewerId,
              broadcasterId,
              answer,
            })
          );
        }
      } else if (data.type === "ice-candidate") {
        if (data.candidate && pcRef.current) {
          await pcRef.current.addIceCandidate(
            new RTCIceCandidate(data.candidate)
          );
        }
      } else if (data.type === "broadcaster-disconnected") {
        toast.error("Broadcaster has gone offline.");
        leaveStream();
      } else if (data.type === "error") {
        toast.error(data.message || "An error occurred");
        leaveStream();
      }
    };

    ws.onerror = () => {
      toast.error("WebSocket connection error");
      leaveStream();
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      toast.error("Disconnected from server");
      leaveStream();
    };
  };

  const createPeerConnection = () => {
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    pc.ontrack = (event) => {
      console.log("✅ Track received:", event.track.kind);
      const stream = event.streams[0];

      if (stream && videoRef.current && videoRef.current.srcObject !== stream) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(console.error);
      }
      setTimeout(() => {
        const video = videoRef.current;
        if (video && video.readyState < 2) {
          console.warn("Video not ready yet:", video.readyState);
        }
      }, 1000);
    };

    pc.onaddstream = (event) => {
      console.log("🎥 onaddstream triggered");
      if (videoRef.current) {
        videoRef.current.srcObject = event.stream;
        videoRef.current.play().catch(console.error);
      }
    };

    pc.onicecandidate = (event) => {
      if (event.candidate && wsRef.current?.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            to: "broadcaster",
            broadcasterId,
            candidate: event.candidate,
          })
        );
      }
    };

    pc.onconnectionstatechange = () => {
      if (
        pc.connectionState === "disconnected" ||
        pc.connectionState === "failed"
      ) {
        toast.error("Connection to broadcaster lost.");
        leaveStream();
      }
    };

    pcRef.current = pc;
  };

  const leaveStream = () => {
    console.log("Leaving stream...");

    // Close WebRTC connection and stop video tracks
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (videoRef.current?.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    // Send "leave" message and wait a bit before closing WebSocket
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(
        JSON.stringify({ type: "leave", viewerId, broadcasterId })
      );

      setTimeout(() => {
        wsRef.current.close();
        wsRef.current = null;

        setConnected(false);
        navigate("/");
      }, 100);
    } else {
      wsRef.current = null;
      setConnected(false);
      navigate("/");
    }
  };

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="relative border shadow-lg p-4 rounded-lg">
        <div className="flex items-center justify-between px-4 pb-2">
          <button
            onClick={leaveStream}
            disabled={!connected}
            className={`p-1 rounded ${
              !connected
                ? "disabled cursor-not-allowed"
                : "bg-amber-300 cursor-pointer"
            }`}
          >
            <LogOut />
          </button>

          <ShareButton streamUrl={window.location.href} />
        </div>

        <div className="aspect-video w-full h-[600px] bg-gray-200 rounded-md overflow-hidden">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>
  );
}

export default Viewer;
