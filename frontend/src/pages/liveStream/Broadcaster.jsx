import React, { useEffect, useRef, useState } from 'react';

export default function Broadcaster() {
  const [broadcasterId, setBroadcasterId] = useState('');
  const [ws, setWs] = useState(null);
  const [viewers, setViewers] = useState(new Map());
  const [viewerCount, setViewerCount] = useState(0);
  const [streamUrl, setStreamUrl] = useState('');
  const localVideoRef = useRef(null);
  const localStreamRef = useRef(null);
  const peerConnectionsRef = useRef({});

  // Prompt for broadcasterId once on mount
  useEffect(() => {
    const id = prompt('Enter broadcaster ID:', 'dilli');
    setBroadcasterId(id);
  }, []);

  // Setup WebSocket and streaming once broadcasterId is set
  useEffect(() => {
    if (!broadcasterId) return;

    const socket = new WebSocket('ws://localhost:8080');
    setWs(socket);

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'broadcaster', broadcasterId: broadcasterId }));
      startLocalStream();

      setStreamUrl(`ws://localhost:8080/viewer?broadcasterId=${broadcasterId}`);
    };

    socket.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.type === 'viewer') {
        const { viewerId, viewerName = `Viewer-${viewerId.substring(0, 4)}` } = data;
        setViewers((prev) => new Map(prev).set(viewerId, viewerName));
        setViewerCount((prevCount) => prevCount + 1);
        await handleViewer(viewerId);
      } else if (data.type === 'answer') {
        const pc = peerConnectionsRef.current[data.viewerId];
        if (pc) await pc.setRemoteDescription(new RTCSessionDescription(data.answer));
      } else if (data.type === 'ice-candidate') {
        const pc = peerConnectionsRef.current[data.viewerId];
        if (pc && data.candidate) await pc.addIceCandidate(new RTCIceCandidate(data.candidate));
      } else if (data.type === 'viewer-left') {
        setViewers((prev) => {
          const newViewers = new Map(prev);
          newViewers.delete(data.viewerId);
          setViewerCount(newViewers.size);
          return newViewers;
        });

        if (peerConnectionsRef.current[data.viewerId]) {
          peerConnectionsRef.current[data.viewerId].close();
          delete peerConnectionsRef.current[data.viewerId];
        }
      }
    };

    socket.onclose = () => {
      // Optionally handle socket close
    };

    return () => {
      stopStreaming();
    };
  }, [broadcasterId]);

  async function startLocalStream() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      localStreamRef.current = stream;
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
    } catch (err) {
      alert('Could not get local media: ' + err.message);
    }
  }

  async function handleViewer(viewerId) {
    if (!localStreamRef.current || !ws) return;

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    });
    peerConnectionsRef.current[viewerId] = pc;

    localStreamRef.current.getTracks().forEach(track => pc.addTrack(track, localStreamRef.current));

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        ws.send(JSON.stringify({
          type: 'ice-candidate',
          to: 'viewer',
          viewerId,
          candidate: event.candidate
        }));
      }
    };

    const offer = await pc.createOffer();
    await pc.setLocalDescription(offer);

    ws.send(JSON.stringify({
      type: 'offer',
      viewerId,
      broadcasterId,
      offer
    }));
  }

  function stopStreaming() {
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
    }
    Object.values(peerConnectionsRef.current).forEach(pc => pc.close());
    peerConnectionsRef.current = {};
    if (ws) ws.close();
    alert('Streaming stopped');
    window.location.reload(); // reload page optionally
  }

  return (
    <div style={{ fontFamily: 'Arial', padding: 20 }}>
      <h1>Broadcaster</h1>

      <video
        id="localVideo"
        ref={localVideoRef}
        autoPlay
        muted
        playsInline
        style={{ width: 600, border: '1px solid black' }}
      ></video>

      <div id="controls" style={{ marginTop: 20 }}>
        <button onClick={stopStreaming}>Stop Streaming</button>
        <p><strong>Share this stream:</strong> <span>{streamUrl}</span></p>
      </div>

      <h3>Connected Viewers (<span>{viewerCount}</span>):</h3>
      <div
        id="viewerList"
        style={{ marginTop: 10, border: '1px solid #aaa', padding: 10, width: 300 }}
      >
        {[...viewers.entries()].map(([id, name]) => (
          <div key={id}>👤 {name} (ID: {id})</div>
        ))}
      </div>
    </div>
  );
}
