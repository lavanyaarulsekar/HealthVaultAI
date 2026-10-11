import { Link } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import "./assistant.css";


function Assistant() {
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);



  const [messages, setMessages] = useState(() => {
    const savedMessages = localStorage.getItem("healthAssistantMessages");
    return savedMessages
    ? JSON.parse(savedMessages)
    : [
        {
          type: "ai",
          text: "Hi! 👋 How can I help you today?"
        }
      ];
  });
  useEffect(() => {
    localStorage.setItem(
      "healthAssistantMessages",
      JSON.stringify(messages)
    );
  }, [messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });
  }, [messages, isTyping]);


const sendToAI = async (text) => {
  const userMessage = text.trim();

  if (!userMessage || isTyping) return;

  const previousMessages = messages;

  setMessages((prev) => [
    ...prev,
    { type: "user", text: userMessage },
  ]);

  setMessage("");
  setIsTyping(true);

  try {
    const history = previousMessages
      .filter((item) => item.type === "user" || item.type === "ai")
      .slice(-10)
      .map((item) => ({
        role: item.type === "ai" ? "assistant" : "user",
        content: item.text,
      }));

    const response = await fetch("http://localhost:5000/api/assistant", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: userMessage,
        history,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Unable to get an AI response.");
    }

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: data.reply || "I couldn't generate a response. Please try again.",
      },
    ]);
  } catch (error) {
    console.error("AI Assistant Error:", error);

    setMessages((prev) => [
      ...prev,
      {
        type: "ai",
        text: error.message || "Unable to connect to HealthVault AI. Please check whether the backend server is running.",
      },
    ]);
  } finally {
    setIsTyping(false);
  }
};

const handleSend = () => {
  sendToAI(message);
};

const handleSuggestion = (text) => {
  sendToAI(text);
};

const handleClearChat = () => {
  setMessages([
    {
      type: "ai",
      text: "Hi! 👋 How can I help you today?"
    }
  ]);

  setMessage("");
};

  return (
    <div className="assistant-page">

      <aside className="assistant-sidebar">

        <Link to="/dashboard" className="assistant-brand">
          <div className="assistant-brand-icon">🛡️</div>

          <span>
            Health<span>Vault</span>
          </span>
        </Link>

        <nav className="assistant-nav">

          <p className="assistant-nav-title">
            MAIN MENU
          </p>

          <Link to="/dashboard" className="assistant-nav-item">
            <span>⌂</span>
            Dashboard
          </Link>

          <Link to="/healthprofile" className="assistant-nav-item">
            <span>♡</span>
            Health Profile
          </Link>

          <Link to="/medicalrecords" className="assistant-nav-item">
            <span>▣</span>
            Medical Records
          </Link>

          <Link to="/medicine" className="assistant-nav-item">
            <span>✚</span>
            Medicines
          </Link>

          <Link to="/appoinment" className="assistant-nav-item">
            <span>◷</span>
            Appointments
          </Link>

          <p className="assistant-nav-title assistant-tools-title">
            TOOLS
          </p>

          <Link
            to="/assistant"
            className="assistant-nav-item active"
          >
            <span>✦</span>
            AI Health Assistant
          </Link>

          <Link to="/setting" className="assistant-nav-item">
            <span>⚙</span>
            Settings
          </Link>

        </nav>

        <div className="assistant-sidebar-bottom">
          <Link to="/" className="assistant-home-link">
            <span>↪</span>
            Back to Home
          </Link>
        </div>

      </aside>


      <main className="assistant-main">

        <header className="assistant-header">

          <div>
            <p className="assistant-label">
              HEALTHVAULT AI
            </p>

            <h1>
              AI Health Assistant
            </h1>

            <p>
              Ask questions and get helpful health information.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="assistant-dashboard-button"
          >
            ← Dashboard
          </Link>

        </header>


        <section className="assistant-intro">

          <div className="assistant-avatar">
            ✦
          </div>

          <div>

            <span className="assistant-online">
              ● ONLINE
            </span>

            <h2>
              Hello! I'm your HealthVault Assistant.
            </h2>

            <p>
              I can help you understand general health information,
              organize your health records, and answer common health questions.
            </p>

          </div>

        </section>


        <section className="assistant-chat-card">

          <div className="assistant-chat-header">

            <div>
              <h2>
                Health Assistant
              </h2>

              <p>
                Your conversation is private.
              </p>
            </div>

            <button
              type="button"
              className="assistant-clear"
              onClick={handleClearChat}
            >
              Clear Chat
            </button>

          </div>


          <div className="assistant-messages">

            {messages.map((msg, index) => (

              <div
                key={index}
                className={
                  msg.type === "ai"
                    ? "assistant-message assistant-message-ai"
                    : "assistant-message assistant-message-user"
                }
              >

                {msg.type === "ai" && (
                  <div className="message-avatar">
                    ✦
                  </div>
                )}

                <div className="message-content">

                  {msg.type === "ai" && (
                    <span className="message-name">
                      HealthVault AI
                    </span>
                  )}

                  <div className="message-bubble">
                    {msg.text}
                  </div>

                </div>

              </div>

            ))}
            <div ref={messagesEndRef} />

          </div>
          


          <div className="assistant-suggestions">

            <p>
              TRY ASKING
            </p>

            <div className="suggestion-list">

              <button
                type="button"
                onClick={() =>
                  handleSuggestion(
                    "What should I know before a health checkup?"
                  )
                }
              >
                What should I know before a health checkup?
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSuggestion(
                    "How can I maintain a healthy lifestyle?"
                  )
                }
              >
                How can I maintain a healthy lifestyle?
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSuggestion(
                    "What information should I keep in my medical records?"
                  )
                }
              >
                What information should I keep in my medical records?
              </button>

              <button
                type="button"
                onClick={() =>
                  handleSuggestion(
                    "How can I remember my medicines?"
                  )
                }
              >
                How can I remember my medicines?
              </button>

            </div>

          </div>


          <div className="assistant-input-area">

            <input
              type="text"
              placeholder="Ask your health question..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSend();
                }
              }}
            />

            <button 
               type="button" 
               className="assistant-send" 
               onClick={handleSend}
               disabled={isTyping}
            >
              →
            </button>

          </div>


          <div className="assistant-disclaimer">

            <span>
              🛡️
            </span>

            <p>
              HealthVault AI provides general information and is not a
              substitute for professional medical advice, diagnosis, or treatment.
            </p>

          </div>

        </section>


        <section className="assistant-quick-actions">

          <div className="quick-action-card">

            <div className="quick-icon">
              ♡
            </div>

            <div>
              <h3>Health Profile</h3>
              <p>Review your health information.</p>
            </div>

            <Link to="/healthprofile">
              →
            </Link>

          </div>


          <div className="quick-action-card">

            <div className="quick-icon">
              ▣
            </div>

            <div>
              <h3>Medical Records</h3>
              <p>View your stored medical records.</p>
            </div>

            <Link to="/medicalrecords">
              →
            </Link>

          </div>


          <div className="quick-action-card">

            <div className="quick-icon">
              ✚
            </div>

            <div>
              <h3>Medicines</h3>
              <p>Check your medicine information.</p>
            </div>

            <Link to="/medicine">
              →
            </Link>

          </div>

        </section>

      </main>

    </div>
  );
}

export default Assistant;