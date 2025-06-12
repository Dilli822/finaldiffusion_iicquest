import React, { useEffect, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000");  // Adjust URL if deployed

function ChatRoom() {
  const [room, setRoom] = useState("");
  const [joined, setJoined] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on("message", (msg) => {
      setChat((prev) => [...prev, msg]);
    });

    return () => socket.off("message");
  }, []);

  const joinRoom = () => {
    if (room.trim()) {
      socket.emit("joinRoom", room);
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("chatMessage", { room, message });
      setMessage("");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      {!joined ? (
        <>
          <input
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join Room</button>
        </>
      ) : (
        <>
          <div style={{ maxHeight: "300px", overflowY: "auto", border: "1px solid #ccc", padding: "10px" }}>
            {chat.map((msg, i) => (
              <div key={i} style={{ margin: "5px 0" }}>
                {typeof msg === "string" ? (
                  <i>{msg}</i>
                ) : (
                  <b>{msg.user}: </b>
                )}
                {typeof msg === "object" ? msg.text : null}
              </div>
            ))}
          </div>

          <input
            placeholder="Enter message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") sendMessage(); }}
          />
          <button onClick={sendMessage}>Send</button>
        </>
      )}
    </div>
  );
}

export default ChatRoom;
