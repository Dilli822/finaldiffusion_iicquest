import { useState } from "react";
import axios from "axios";
import "./aitalks.css";

function GeminiChatBotApp() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isOpen, setIsOpen] = useState(false); // 👈 Collapsed by default


  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", parts: [{ text: input }] };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyDxBUM_2ILGrVwPJKxwYqxvlctOWLf5DU4`,
        {
          contents: updatedMessages,
        }
      );

      const botText = response.data.candidates[0]?.content?.parts[0]?.text || "No response";
      const botMessage = {
        role: "model",
        parts: [{ text: botText }],
      };

      setMessages([...updatedMessages, botMessage]);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div className="chat-container" style={{}}>
  <button
    className="toggle-button"
    onClick={() => setIsOpen(!isOpen)}
  >
    {isOpen ? "Collapse Chat" : "Open Chat"}
  </button>

  {isOpen && (
    <>
      <h1 className="title">Gemini Chatbot</h1>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.role}`}>
            {msg.parts[0].text}
          </div>
        ))}
      </div>
      <div className="input-section">
        <input
          className="chat-input"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Ask something..."
        />
        <button className="send-button" onClick={sendMessage}>Send</button>
      </div>
    </>
  )}
</div>


  );
}

export default GeminiChatBotApp;
