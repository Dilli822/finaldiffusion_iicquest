import React, { useState, useEffect, useRef, useCallback } from "react";

const WebRTCVideoChat = () => {
  // State management
  const [localUsername, setLocalUsername] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [status, setStatus] = useState({ message: "Connecting...", type: "" });
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [isInCall, setIsInCall] = useState(false);
  const [currentCallTarget, setCurrentCallTarget] = useState(null);

  // Refs for video elements and WebRTC objects
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const websocketRef = useRef(null);
  const peerConnectionRef = useRef(null);
  const localStreamRef = useRef(null);
  const remoteStreamRef = useRef(null);

  // WebRTC configuration
  const configuration = {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
    ],
  };

  // Status update function
  const updateStatus = (message, type = "") => {
    setStatus({ message, type });
  };

  const getCookie = (name) => {
    const match = document.cookie.match(
      new RegExp("(^| )" + name + "=([^;]+)")
    );
    if (match) return match[2];
    return null;
  };

  const setCookie = (name, value, days = 7) => {
    const expires = new Date(Date.now() + days * 864e5).toUTCString();
    document.cookie = name + "=" + value + "; expires=" + expires + "; path=/";
  };

  const setDemoCookie = () => {
    const demoUsers = [
      "Alice",
      "Bob",
      "Charlie",
      "Diana",
      "Eve",
      "Frank",
      "Grace",
    ];

    // Check if username exists in cookie or localStorage
    let username = getCookie("username") || localStorage.getItem("username");

    if (!username) {
      // If not present, pick a random demo user and save to cookie and localStorage
      username = demoUsers[Math.floor(Math.random() * demoUsers.length)];
      setCookie("username", username);
      localStorage.setItem("username", username);

      updateStatus(
        `Demo cookie set for user "${username}". Refreshing...`,
        "success"
      );

      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } else {
      // Username exists
      updateStatus(`Using existing username "${username}".`, "info");
    }
  };
  // Send signaling message
  const sendSignalingMessage = useCallback(
    (message) => {
      if (
        websocketRef.current &&
        websocketRef.current.readyState === WebSocket.OPEN
      ) {
        message.sender = localUsername;
        websocketRef.current.send(JSON.stringify(message));
      } else {
        updateStatus("Connection lost. Trying to reconnect...", "error");
      }
    },
    [localUsername]
  );

  // Start local video stream
  const startLocalStream = () => {
    return new Promise((resolve, reject) => {
      updateStatus("Accessing camera and microphone...", "");

      navigator.mediaDevices
        .getUserMedia({
          video: { width: 320, height: 240 },
          audio: true,
        })
        .then((stream) => {
          localStreamRef.current = stream;
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          updateStatus("Camera and microphone ready", "success");
          resolve(stream);
        })
        .catch((error) => {
          console.error("Error accessing media devices:", error);
          updateStatus(
            "Error accessing camera/microphone. Please check permissions.",
            "error"
          );
          reject(error);
        });
    });
  };

  // Initiate call
  const initiateCall = (remoteUsername) => {
    if (isInCall) {
      updateStatus("Already in a call", "error");
      return;
    }

    setCurrentCallTarget(remoteUsername);

    if (!localStreamRef.current) {
      startLocalStream()
        .then(() => {
          updateStatus(`Calling ${remoteUsername}...`, "");
          sendSignalingMessage({
            type: "call-request",
            target: remoteUsername,
          });
        })
        .catch(() => {
          updateStatus(
            "Cannot make call without camera/microphone access",
            "error"
          );
          setCurrentCallTarget(null);
        });
    } else {
      updateStatus(`Calling ${remoteUsername}...`, "");
      sendSignalingMessage({
        type: "call-request",
        target: remoteUsername,
      });
    }
  };

  // Create call
  const createCall = (remoteUsername) => {
    if (isInCall) return;

    const proceedWithCall = () => {
      setIsInCall(true);
      setCurrentCallTarget(remoteUsername);
      peerConnectionRef.current = new RTCPeerConnection(configuration);

      localStreamRef.current.getTracks().forEach((track) => {
        peerConnectionRef.current.addTrack(track, localStreamRef.current);
      });

      peerConnectionRef.current.ontrack = (event) => {
        console.log("Received remote stream");
        if (remoteVideoRef.current) {
          remoteVideoRef.current.srcObject = event.streams[0];
        }
        remoteStreamRef.current = event.streams[0];
        updateStatus(`Connected with ${remoteUsername}`, "success");
      };

      peerConnectionRef.current.onicecandidate = (event) => {
        if (event.candidate) {
          sendSignalingMessage({
            type: "ice-candidate",
            candidate: event.candidate,
            target: remoteUsername,
          });
        }
      };

      peerConnectionRef.current.onconnectionstatechange = () => {
        console.log(
          "Connection state:",
          peerConnectionRef.current.connectionState
        );
        if (peerConnectionRef.current.connectionState === "connected") {
          updateStatus(`Connected with ${remoteUsername}`, "success");
        } else if (
          peerConnectionRef.current.connectionState === "disconnected"
        ) {
          updateStatus("Call disconnected", "error");
          handleHangup();
        }
      };

      peerConnectionRef.current
        .createOffer()
        .then((offer) => peerConnectionRef.current.setLocalDescription(offer))
        .then(() => {
          sendSignalingMessage({
            type: "offer",
            offer: peerConnectionRef.current.localDescription,
            target: remoteUsername,
          });
        })
        .catch((error) => {
          console.error("Error creating offer:", error);
          updateStatus("Error creating call", "error");
          setIsInCall(false);
          setCurrentCallTarget(null);
        });
    };

    if (!localStreamRef.current) {
      startLocalStream()
        .then(proceedWithCall)
        .catch((error) => {
          updateStatus(
            "Cannot start call without camera/microphone access",
            "error"
          );
          setCurrentCallTarget(null);
        });
    } else {
      proceedWithCall();
    }
  };

  // Handle hangup
  const handleHangup = () => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
    remoteStreamRef.current = null;
    setIsInCall(false);

    updateStatus("Call ended", "");

    if (currentCallTarget) {
      sendSignalingMessage({
        type: "hangup",
        target: currentCallTarget,
      });
      setCurrentCallTarget(null);
    }
  };

  // Handle signaling messages
  const handleSignalingMessage = useCallback(
    (event) => {
      const message = JSON.parse(event.data);
      console.log("Received message:", message);

      switch (message.type) {
        case "user-list":
          setOnlineUsers(
            message.users.filter((user) => user !== localUsername)
          );
          break;
        case "call-request":
          handleCallRequest(message.sender);
          break;
        case "offer":
          handleOffer(message.offer, message.sender);
          break;
        case "answer":
          handleAnswer(message.answer);
          break;
        case "ice-candidate":
          handleIceCandidate(message.candidate);
          break;
        case "hangup":
          handleRemoteHangup();
          break;
        case "user-disconnected":
          handleUserDisconnected(message.username);
          break;
      }
    },
    [localUsername]
  );

  const handleCallRequest = (sender) => {
    if (isInCall) {
      sendSignalingMessage({
        type: "busy",
        target: sender,
      });
      return;
    }

    updateStatus(`Incoming call from ${sender}`, "");

    if (
      window.confirm(`📞 Incoming call from ${sender}. Do you want to answer?`)
    ) {
      if (!localStreamRef.current) {
        startLocalStream()
          .then(() => {
            createCall(sender);
          })
          .catch(() => {
            updateStatus(
              "Cannot answer call without camera/microphone access",
              "error"
            );
            sendSignalingMessage({
              type: "call-rejected",
              target: sender,
            });
          });
      } else {
        createCall(sender);
      }
    } else {
      sendSignalingMessage({
        type: "call-rejected",
        target: sender,
      });
    }
  };

  const handleOffer = (offer, sender) => {
    if (isInCall) return;

    setIsInCall(true);
    setCurrentCallTarget(sender);
    peerConnectionRef.current = new RTCPeerConnection(configuration);

    localStreamRef.current.getTracks().forEach((track) => {
      peerConnectionRef.current.addTrack(track, localStreamRef.current);
    });

    peerConnectionRef.current.ontrack = (event) => {
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
      remoteStreamRef.current = event.streams[0];
      updateStatus(`Connected with ${sender}`, "success");
    };

    peerConnectionRef.current.onicecandidate = (event) => {
      if (event.candidate) {
        sendSignalingMessage({
          type: "ice-candidate",
          candidate: event.candidate,
          target: sender,
        });
      }
    };

    peerConnectionRef.current
      .setRemoteDescription(new RTCSessionDescription(offer))
      .then(() => peerConnectionRef.current.createAnswer())
      .then((answer) => peerConnectionRef.current.setLocalDescription(answer))
      .then(() => {
        sendSignalingMessage({
          type: "answer",
          answer: peerConnectionRef.current.localDescription,
          target: sender,
        });
      })
      .catch((error) => {
        console.error("Error handling offer:", error);
        updateStatus("Error handling incoming call", "error");
        setIsInCall(false);
        setCurrentCallTarget(null);
      });
  };

  const handleAnswer = (answer) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current
        .setRemoteDescription(new RTCSessionDescription(answer))
        .catch((error) => {
          console.error("Error handling answer:", error);
          updateStatus("Error connecting call", "error");
        });
    }
  };

  const handleIceCandidate = (candidate) => {
    if (peerConnectionRef.current) {
      peerConnectionRef.current
        .addIceCandidate(new RTCIceCandidate(candidate))
        .catch((error) => {
          console.error("Error adding ICE candidate:", error);
        });
    }
  };

  const handleRemoteHangup = () => {
    handleHangup();
    updateStatus("Remote user ended the call", "");
  };

  const handleUserDisconnected = (username) => {
    if (isInCall && currentCallTarget === username) {
      handleHangup();
      updateStatus(`${username} disconnected`, "error");
    }
  };

  // Connect to WebSocket server
  const connectToServer = useCallback(() => {
    updateStatus("Connecting to server...", "");

    const wsUrl =
      window.location.protocol === "https:"
        ? "wss://localhost:8080"
        : "ws://localhost:8080";
    websocketRef.current = new WebSocket(wsUrl);

    websocketRef.current.onopen = () => {
      console.log("WebSocket connected");
      updateStatus("Connected to server", "success");
      sendSignalingMessage({ type: "login", username: localUsername });
      updateStatus("Ready to make calls", "success");
    };

    websocketRef.current.onmessage = handleSignalingMessage;

    websocketRef.current.onclose = () => {
      updateStatus("Disconnected from server", "error");
      setTimeout(() => {
        if (
          !websocketRef.current ||
          websocketRef.current.readyState === WebSocket.CLOSED
        ) {
          updateStatus("Attempting to reconnect...", "");
          connectToServer();
        }
      }, 3000);
    };

    websocketRef.current.onerror = (error) => {
      console.error("WebSocket error:", error);
      updateStatus("Connection error. Please try again.", "error");
    };
  }, [localUsername, handleSignalingMessage, sendSignalingMessage]);

  // Check for username cookie on mount
  useEffect(() => {
    const savedUsername = getCookie("username");
    if (savedUsername) {
      setLocalUsername(savedUsername);
      setIsLoggedIn(true);
    }
  }, []);

  // Connect to server when logged in
  useEffect(() => {
    if (isLoggedIn && localUsername) {
      connectToServer();
    }

    return () => {
      if (websocketRef.current) {
        websocketRef.current.close();
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isLoggedIn, localUsername, connectToServer]);

  // Render error area (no username)
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6 flex items-center justify-center">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20 p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-8 text-center">
            🎥 WebRTC Video Chat
          </h1>

          <div className="text-center">
            <h2 className="text-xl font-semibold text-red-300 mb-4">
              ❌ No Username Cookie Found
            </h2>
            <p className="text-white/80 mb-6">
              Please set a username cookie to access the video chat.
            </p>
            <button
              onClick={setDemoCookie}
              className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
            >
              Set Demo Cookie
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Main chat interface
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          🎥 WebRTC Video Chat
        </h1>

        {/* User info */}
        <div className="bg-white/10 backdrop-blur-lg rounded-lg p-4 mb-6 border border-white/20">
          <span className="text-white">
            Logged in as:{" "}
            <strong className="text-green-300">{localUsername}</strong>
          </span>
        </div>

        {/* Status */}
        <div
          className={`p-4 rounded-lg mb-6 text-center font-semibold ${
            status.type === "success"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : status.type === "error"
              ? "bg-red-500/20 text-red-300 border border-red-500/30"
              : "bg-blue-500/20 text-blue-300 border border-blue-500/30"
          }`}
        >
          {status.message}
        </div>

        {/* Video container */}
        <div className="grid md:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Your Video</h3>
            <video
              ref={localVideoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-48 bg-black rounded-lg object-cover"
            />
          </div>
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
            <h3 className="text-white font-semibold mb-4">Remote Video</h3>
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-48 bg-black rounded-lg object-cover"
            />
          </div>
        </div>

        {/* Hangup button */}
        <div className="text-center mb-6">
          <button
            onClick={handleHangup}
            disabled={!isInCall}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200"
          >
            📵 Hang Up
          </button>
        </div>

        {/* Online users */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
          <h3 className="text-white font-semibold mb-4">👥 Online Users</h3>
          {onlineUsers.length === 0 ? (
            <div className="text-white/60 text-center py-4">
              No other users online
            </div>
          ) : (
            <div className="space-y-3">
              {onlineUsers.map((user) => (
                <div
                  key={user}
                  className="flex items-center justify-between bg-white/5 rounded-lg p-3"
                >
                  <div>
                    <span className="text-white font-semibold">{user}</span>
                    <span className="text-green-300 text-sm ml-2">Online</span>
                  </div>
                  <button
                    onClick={() => initiateCall(user)}
                    disabled={isInCall}
                    className="bg-green-500 hover:bg-green-600 disabled:bg-gray-500 disabled:cursor-not-allowed text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200"
                  >
                    📞 Call
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default WebRTCVideoChat;
