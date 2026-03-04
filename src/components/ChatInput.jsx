// src/components/ChatInput.jsx
import { useState, useRef } from "react";

export default function ChatInput({ onSend, isLoading, onClear }) {
  const [val, setVal] = useState("");
  const ref = useRef(null);

  const send = () => {
    if (!val.trim() || isLoading) return;
    onSend(val);
    setVal("");
    if (ref.current) ref.current.style.height = "auto";
  };

  const onKey = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); send(); }
  };

  const onChange = (e) => {
    setVal(e.target.value);
    const el = ref.current;
    if (el) { el.style.height = "auto"; el.style.height = Math.min(el.scrollHeight, 150) + "px"; }
  };

  return (
    <div className="input-wrap">
      <div className={`input-box ${isLoading ? "disabled" : ""}`}>
        <textarea
          ref={ref} rows={1} value={val}
          onChange={onChange} onKeyDown={onKey}
          placeholder="Message MyAI..."
          disabled={isLoading}
        />
        <div className="input-btns">
          <button className="clear-btn" onClick={onClear} title="New chat">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <polyline points="1 4 1 10 7 10"/>
              <path d="M3.51 15a9 9 0 1 0 .49-4.5"/>
            </svg>
          </button>
          <button className="send-btn" onClick={send} disabled={!val.trim() || isLoading}>
            {isLoading
              ? <div className="spin" />
              : <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"/>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"/>
                </svg>
            }
          </button>
        </div>
      </div>
      <p className="hint"><kbd>Enter</kbd> send · <kbd>Shift+Enter</kbd> new line</p>
    </div>
  );
}
