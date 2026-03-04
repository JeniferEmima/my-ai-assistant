// src/hooks/useChat.js
import { useState, useCallback, useEffect } from "react";
import { sendToGemini } from "../utils/gemini";

export const PERSONAS = [
  {
    id: "assistant",
    name: "General Assistant",
    emoji: "🤖",
    prompt: "You are a helpful, friendly, and knowledgeable personal AI assistant. Give clear, accurate, and concise answers. Be conversational but professional.",
  },
  {
    id: "coder",
    name: "Code Expert",
    emoji: "💻",
    prompt: "You are an expert software engineer. Help with coding questions, debugging, code reviews, and architecture. Always include working code examples with explanations.",
  },
  {
    id: "writer",
    name: "Creative Writer",
    emoji: "✍️",
    prompt: "You are a creative writing assistant. Help with essays, stories, emails, blogs, and any writing tasks. Be expressive, clear, and engaging.",
  },
  {
    id: "tutor",
    name: "Personal Tutor",
    emoji: "📚",
    prompt: "You are a patient and encouraging personal tutor. Explain complex topics simply, use analogies and examples. Adapt your teaching style to the student's level.",
  },
];

const makeConv = (id, personaId = "assistant") => ({
  id,
  title: "New Chat",
  personaId,
  messages: [],
  createdAt: Date.now(),
});

const STORAGE_KEY = "my_ai_conversations";
const ACTIVE_KEY = "my_ai_active";

function loadConversations() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [makeConv("conv-1")];
  } catch {
    return [makeConv("conv-1")];
  }
}

function loadActiveId(convs) {
  try {
    return localStorage.getItem(ACTIVE_KEY) || convs[0]?.id;
  } catch {
    return convs[0]?.id;
  }
}

export function useChat() {
  const [conversations, setConversations] = useState(loadConversations);
  const [activeId, setActiveIdState] = useState(() => loadActiveId(loadConversations()));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Persist conversations to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {}
  }, [conversations]);

  const setActiveId = useCallback((id) => {
    setActiveIdState(id);
    try { localStorage.setItem(ACTIVE_KEY, id); } catch {}
  }, []);

  const activeConv = conversations.find((c) => c.id === activeId) || conversations[0];
  const messages = activeConv?.messages || [];
  const activePersona = PERSONAS.find((p) => p.id === activeConv?.personaId) || PERSONAS[0];

  const updateConv = useCallback((id, fn) => {
    setConversations((prev) => prev.map((c) => (c.id === id ? fn(c) : c)));
  }, []);

  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || isLoading) return;
    setError(null);

    const userMsg = { role: "user", content: text.trim(), id: Date.now() };

    updateConv(activeId, (conv) => {
      const updated = { ...conv, messages: [...conv.messages, userMsg] };
      if (conv.messages.length === 0) {
        updated.title = text.trim().slice(0, 42) + (text.length > 42 ? "…" : "");
      }
      return updated;
    });

    setIsLoading(true);

    try {
      const history = [...messages, userMsg];
      const reply = await sendToGemini(history, activePersona.prompt);
      updateConv(activeId, (conv) => ({
        ...conv,
        messages: [...conv.messages, { role: "assistant", content: reply, id: Date.now() + 1 }],
      }));
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [activeId, messages, isLoading, activePersona, updateConv]);

  const newConversation = useCallback((personaId = "assistant") => {
    const id = `conv-${Date.now()}`;
    setConversations((prev) => [makeConv(id, personaId), ...prev]);
    setActiveId(id);
  }, [setActiveId]);

  const deleteConversation = useCallback((id) => {
    setConversations((prev) => {
      const filtered = prev.filter((c) => c.id !== id);
      if (filtered.length === 0) {
        const fresh = makeConv("conv-fresh");
        if (activeId === id) setActiveId(fresh.id);
        return [fresh];
      }
      if (activeId === id) setActiveId(filtered[0].id);
      return filtered;
    });
  }, [activeId, setActiveId]);

  const clearMessages = useCallback(() => {
    updateConv(activeId, (c) => ({ ...c, messages: [], title: "New Chat" }));
  }, [activeId, updateConv]);

  const switchPersona = useCallback((personaId) => {
    updateConv(activeId, (c) => ({ ...c, personaId }));
  }, [activeId, updateConv]);

  return {
    conversations, activeId, messages, isLoading, error,
    activePersona, sendMessage, newConversation,
    deleteConversation, clearMessages, switchPersona, setActiveId,
  };
}
