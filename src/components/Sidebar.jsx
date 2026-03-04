// src/components/Sidebar.jsx
import { PERSONAS } from "../hooks/useChat";

export default function Sidebar({
  conversations, activeId, onSelect, onNew, onDelete, isOpen, onClose,
}) {
  return (
    <>
      {isOpen && <div className="overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>

        <div className="sidebar-top">
          <div className="brand">
            <div className="brand-icon">✦</div>
            <span>MyAI</span>
          </div>
          <button className="icon-btn" onClick={onClose} title="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        {/* Persona quick-start */}
        <div className="sidebar-section">
          <div className="section-label">Start new chat as</div>
          <div className="persona-grid">
            {PERSONAS.map((p) => (
              <button key={p.id} className="persona-btn" onClick={() => { onNew(p.id); onClose(); }}>
                <span className="persona-emoji">{p.emoji}</span>
                <span className="persona-name">{p.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Conversations */}
        <div className="sidebar-section" style={{ flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
          <div className="section-label">History</div>
          <nav className="conv-list">
            {conversations.map((conv) => {
              const persona = PERSONAS.find((p) => p.id === conv.personaId) || PERSONAS[0];
              return (
                <div
                  key={conv.id}
                  className={`conv-item ${conv.id === activeId ? "active" : ""}`}
                  onClick={() => { onSelect(conv.id); onClose(); }}
                >
                  <span className="conv-emoji">{persona.emoji}</span>
                  <span className="conv-title">{conv.title}</span>
                  <button className="del-btn" onClick={(e) => { e.stopPropagation(); onDelete(conv.id); }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                  </button>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="sidebar-footer">
          <div className="powered-by">
            <div className="gemini-dot" />
            Powered by Gemini 2.0 Flash · Free
          </div>
        </div>
      </aside>
    </>
  );
}
