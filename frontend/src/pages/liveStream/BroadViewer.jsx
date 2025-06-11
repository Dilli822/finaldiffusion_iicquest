import React, { useState, useRef } from "react";

export default function BroadViewer() {
  const [broadcasterId, setBroadcasterId] = useState("");
  const [viewerId, setViewerId] = useState(null);
  const [connected, setConnected] = useState(false);

  const wsRef = useRef(null);
  const pcRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const remoteStreamRef = useRef(null);

  const connect = () => {
    if (!broadcasterId.trim()) {
      alert("Please enter broadcaster ID");
      return;
    }
    start();
  };

  const leave = () => {
    cleanup();
  };

  async function start() {
    wsRef.current = new WebSocket("ws://localhost:8080");

    wsRef.current.onopen = () => {
      console.log("WebSocket connected");
      // Register as viewer and specify which broadcaster to watch
      wsRef.current.send(
        JSON.stringify({ type: "viewer", broadcasterId: broadcasterId.trim() })
      );
    };

    wsRef.current.onmessage = async (event) => {
      const data = JSON.parse(event.data);
      console.log("Received message:", data);

      switch (data.type) {
        case "viewer-id":
          setViewerId(data.viewerId);
          createPeerConnection();
          setConnected(true);
          break;

        case "offer":
          if (!pcRef.current) createPeerConnection();

          try {
            await pcRef.current.setRemoteDescription(
              new RTCSessionDescription(data.offer)
            );
            const answer = await pcRef.current.createAnswer();
            await pcRef.current.setLocalDescription(answer);

            const idToSend = data.viewerId || viewerId;

            wsRef.current.send(
              JSON.stringify({
                type: "answer",
                viewerId: idToSend,
                broadcasterId,
                answer,
              })
            );
          } catch (err) {
            console.error("Error handling offer:", err);
          }
          break;

        case "ice-candidate":
          if (data.candidate && pcRef.current) {
            try {
              await pcRef.current.addIceCandidate(new RTCIceCandidate(data.candidate));
              console.log("Added ICE candidate");
            } catch (err) {
              console.error("Error adding ICE candidate:", err);
            }
          }
          break;

        case "broadcaster-disconnected":
          alert("Broadcaster disconnected.");
          cleanup();
          break;

        case "error":
          alert(data.message || "An error occurred");
          cleanup();
          break;

        default:
          console.warn("Unknown message type:", data.type);
      }
    };

    wsRef.current.onerror = (err) => {
      console.error("WebSocket error:", err);
      alert("WebSocket error");
      cleanup();
    };

    wsRef.current.onclose = () => {
      console.log("WebSocket closed");
      alert("Disconnected from signaling server");
      cleanup();
    };
  }

  function createPeerConnection() {
    console.log("Creating RTCPeerConnection");

    pcRef.current = new RTCPeerConnection({
      iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
    });

    remoteStreamRef.current = new MediaStream();
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = remoteStreamRef.current;
    }

    pcRef.current.ontrack = (event) => {
      console.log("Received remote track:", event.track.kind);
      remoteStreamRef.current.addTrack(event.track);
    };

    pcRef.current.onicecandidate = (event) => {
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

    pcRef.current.onconnectionstatechange = () => {
      console.log("Connection state:", pcRef.current.connectionState);
      if (
        pcRef.current.connectionState === "disconnected" ||
        pcRef.current.connectionState === "failed"
      ) {
        alert("Connection to broadcaster lost.");
        cleanup();
      }
    };
  }

  function cleanup() {
    console.log("Cleaning up connection");

    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }

    if (remoteStreamRef.current) {
      remoteStreamRef.current.getTracks().forEach((track) => track.stop());
      remoteStreamRef.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    if (wsRef.current) {
      if (wsRef.current.readyState === WebSocket.OPEN) {
        wsRef.current.send(
          JSON.stringify({ type: "leave", viewerId, broadcasterId })
        );
      }
      wsRef.current.close();
      wsRef.current = null;
    }

    setConnected(false);
    setViewerId(null);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Viewer</h1>
      <input
        placeholder="Enter Broadcaster ID"
        value={broadcasterId}
        onChange={(e) => setBroadcasterId(e.target.value)}
        disabled={connected}
      />
      <button onClick={connect} disabled={connected}>
        Connect
      </button>
      <button onClick={leave} disabled={!connected}>
        Leave
      </button>

      <br />
      <br />
      <video
        ref={remoteVideoRef}
        autoPlay
        playsInline
        style={{ width: 600, border: "1px solid black" }}
      />
    </div>
  );
}
