// src/App.jsx
import { useState } from "react";
import { useChat } from "./hooks/useChat";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import "./App.css";

export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const {
    conversations, activeId, messages, isLoading, error,
    activePersona, sendMessage, newConversation,
    deleteConversation, clearMessages, switchPersona, setActiveId,
  } = useChat();

  return (
    <div className="app">
      <Sidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={newConversation}
        onDelete={deleteConversation}
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />
      <ChatWindow
        messages={messages}
        isLoading={isLoading}
        error={error}
        activePersona={activePersona}
        onSend={sendMessage}
        onClear={clearMessages}
        onMenuOpen={() => setSidebarOpen(true)}
        onSwitchPersona={switchPersona}
      />
    </div>
  );
}
