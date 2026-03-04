// src/components/ChatWindow.jsx
import { useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import ChatInput from "./ChatInput";
import { PERSONAS } from "../hooks/useChat";

const SUGGESTIONS = {
  assistant: ["What can you help me with?", "Explain quantum computing simply", "Give me a productivity tip"],
  coder:     ["Review my React component", "Explain useEffect hook", "How do I use async/await?"],
  writer:    ["Help me write a cover letter", "Give me blog post ideas", "Improve this paragraph"],
  tutor:     ["Teach me about machine learning", "Explain the stock market", "Help me understand calculus"],
};

export default function ChatWindow({
  messages, isLoading, error, activePersona,
  onSend, onClear, onMenuOpen, onSwitchPersona,
}) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isLoading]);

  const isEmpty = messages.length === 0;
  const tips = SUGGESTIONS[activePersona?.id] || SUGGESTIONS.assistant;

  return (
    <main className="chat-main">
      {/* Top bar */}
      <header className="topbar">
        <button className="icon-btn" onClick={onMenuOpen}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <div className="topbar-center">
          <span className="persona-tag">{activePersona?.emoji} {activePersona?.name}</span>
        </div>

        {/* Persona switcher */}
        <div className="persona-switch">
          {PERSONAS.map((p) => (
            <button
              key={p.id}
              className={`ps-btn ${p.id === activePersona?.id ? "active" : ""}`}
              onClick={() => onSwitchPersona(p.id)}
              title={p.name}
            >
              {p.emoji}
            </button>
          ))}
        </div>
      </header>

      {/* Messages area */}
      <div className="msgs-area">
        {isEmpty ? (
          <div className="welcome">
            <div className="welcome-emoji">{activePersona?.emoji}</div>
            <h1>Hi, I'm your {activePersona?.name}</h1>
            <p>Ask me anything — I'm here to help.</p>
            <div className="chips">
              {tips.map((t) => (
                <button key={t} className="chip" onClick={() => onSend(t)}>{t}</button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((m) => (
              <MessageBubble key={m.id} message={m} persona={activePersona} />
            ))}
            {isLoading && (
              <div className="msg-row bot">
                <div className="msg-avatar bot-av">{activePersona?.emoji}</div>
                <div className="msg-bubble bot-bubble typing">
                  <span className="dot" style={{ animationDelay: "0ms" }} />
                  <span className="dot" style={{ animationDelay: "150ms" }} />
                  <span className="dot" style={{ animationDelay: "300ms" }} />
                </div>
              </div>
            )}
            {error && <div className="error-bar">⚠️ {error}</div>}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      <ChatInput onSend={onSend} isLoading={isLoading} onClear={onClear} />
    </main>
  );
}
