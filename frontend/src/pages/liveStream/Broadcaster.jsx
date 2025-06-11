import ShareButton from "@/components/ShareButton";
import { useAuth } from "@/context/AuthContext";
import { Dot, Loader2, Play, Square } from "lucide-react";
import React, { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

function Broadcaster() {
  const { user } = useAuth();
  const broadcasterId = user?._id || user?.name;

  const [viewerCount, setViewerCount] = useState(0);
  const [viewerList, setViewerList] = useState([]);
  const [streamUrl, setStreamUrl] = useState("");
  const streamingRef = useRef(false);
  const [streaming, setStreaming] = useState(false);
  const [endingStream, setEndingStream] = useState(false); // NEW

  const [wsConnected, setWsConnected] = useState(false);

  const videoRef = useRef(null);
  const wsRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});
  const viewersRef = useRef(new Map());

  useEffect(() => {
    if (!broadcasterId) return;

    const ws = new WebSocket("ws://localhost:8080");
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "broadcaster", broadcasterId }));
      setWsConnected(true);
      setStreamUrl(`http://localhost:5173/view/${broadcasterId}`);
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === "viewer") {
        const { viewerId, viewerName = `Viewer-${viewerId.substring(0, 4)}` } =
          data;
        viewersRef.current.set(viewerId, viewerName);
        updateViewerList();
        await handleViewer(viewerId);
      } else if (data.type === "answer") {
        const pc = peerConnectionsRef.current[data.viewerId];
        if (pc)
          await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === "ice-candidate") {
        const pc = peerConnectionsRef.current[data.viewerId];
        if (pc && data.candidate)
          await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else if (data.type === "viewer-left") {
        viewersRef.current.delete(data.viewerId);
        updateViewerList();
        if (peerConnectionsRef.current[data.viewerId]) {
          peerConnectionsRef.current[data.viewerId].close();
          delete peerConnectionsRef.current[data.viewerId];
        }
      }
    };

    ws.onerror = (err) => {
      console.error("WebSocket error:", err);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
      setWsConnected(false);
    };

    return () => {
      ws.close();
    };
  }, [broadcasterId]);

  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      localStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      streamingRef.current = true;
      setStreaming(true);
    } catch (err) {
      toast.error("Could not get local media: " + err.message);
    }
  };

  const handleViewer = async (viewerId) => {
    if (!streamingRef.current || !localStreamRef.current) {
      setTimeout(() => handleViewer(viewerId), 1000);
      return;
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });
    peerConnectionsRef.current[viewerId] = pc;

    localStreamRef.current.getTracks().forEach((track) => {
      pc.addTrack(track, localStreamRef.current);
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        wsRef.current.send(
          JSON.stringify({
            type: "ice-candidate",
            to: "viewer",
            viewerId,
            candidate: event.candidate,
          })
        );
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    wsRef.current.send(
      JSON.stringify({
        type: "offer",
        viewerId,
        broadcasterId,
        offer,
      })
    );
  };

  const updateViewerList = () => {
    const updatedViewers = Array.from(viewersRef.current.entries()).map(
      ([id, name]) => ({
        id,
        name,
      })
    );
    setViewerList(updatedViewers);
    setViewerCount(updatedViewers.length);
  };

  const stopStreaming = () => {
    if (!streamingRef.current || !localStreamRef.current) return;

    setEndingStream(true); // Show spinner

    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach((track) => track.stop());
      localStreamRef.current = null;
    }

    Object.values(peerConnectionsRef.current).forEach((pc) => pc.close());
    peerConnectionsRef.current = {};
    viewersRef.current.clear();

    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    streamingRef.current = false;
    setStreaming(false);

    toast.error("Streaming stopped");

    setTimeout(() => {
      window.location.reload(); // Page refresh
    }, 2000);
  };

  if (!broadcasterId) {
    return (
      <div className="p-6 text-red-600 font-semibold">Loading user...</div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Live Streaming</h1>
      <div className="flex justify-between gap-6">
        {/* Streaming */}
        <div className="w-3/4">
          <div className="relative border shadow-lg p-4 rounded-lg">
            {streaming && (
              <Dot className="h-8 w-8 absolute right-4 top-4 text-red-600 animate-ping" />
            )}
            <div className="aspect-video w-full bg-gray-200 rounded-md overflow-hidden">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Control button */}
          <div className="flex items-center justify-between border shadow-lg p-4 rounded-lg mt-4 space-y-3">
            <button
              onClick={streaming ? stopStreaming : startLocalStream}
              disabled={streaming ? false : !wsConnected}
              className={`px-4 py-2 cursor-pointer rounded transition duration-300 ease-in-out transform ${
                streaming
                  ? "bg-red-600 hover:bg-red-700 text-white"
                  : !wsConnected
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700 text-white hover:scale-105"
              }`}
            >
              {streaming ? (
                <div className="flex gap-2">
                  <Square />
                  Stop Streaming
                </div>
              ) : (
                <div className="flex gap-2">
                  <Play />
                  Start Streaming
                </div>
              )}
            </button>

            {streaming && <ShareButton url={streamUrl} />}
          </div>
        </div>

        <div className="w-1/4 flex flex-col gap-4">
          {/* Top viewer list - take more height */}
          <div className="flex-[1]  shadow-lg p-4 rounded-lg overflow-auto">
            <h3 className="text-lg font-semibold mb-2">Other Info</h3>
            <p className="text-sm text-gray-500">
              Optional content or stats here.
            </p>
          </div>

          {/* Bottom section (optional) */}
          <div className="flex-[2] min-h-[100px] shadow-lg p-4 rounded-lg overflow-auto">
            <h3 className="text-xl font-semibold mb-2">
              Viewers (<span>{viewerCount}</span>):
            </h3>
            <div className="bg-white space-y-2">
              {viewerList.length === 0 ? (
                <p className="text-sm text-gray-500">No viewers connected.</p>
              ) : (
                viewerList.map(({ id, name }) => (
                  <div key={id} className="flex items-center text-gray-800">
                    👤{name}{" "}
                    <span className="ml-2 text-xs text-gray-500">
                      (ID: {id})
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Spinner Overlay */}
      {endingStream && (
        <div className="fixed inset-0 bg-white/80 z-50 flex items-center justify-center">
          <div className="flex items-center gap-2 text-center">
            <p className="text-xl font-semibold text-gray-700">
              Ending Live Stream...
            </p>
            <Loader2 className="h-5 w-5 animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
}

export default Broadcaster;
