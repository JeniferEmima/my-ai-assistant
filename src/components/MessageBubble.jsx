// src/components/MessageBubble.jsx
import { useState } from "react";

function parseMarkdown(text) {
  return text
    .replace(/```(\w*)\n?([\s\S]*?)```/g, (_, lang, code) =>
      `<pre class="code-block"><div class="code-lang">${lang || "code"}</div><code>${escape(code.trim())}</code></pre>`
    )
    .replace(/`([^`]+)`/g, (_, c) => `<code class="inline-code">${escape(c)}</code>`)
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/\*(.+?)\*/g, "<em>$1</em>")
    .replace(/^### (.+)/gm, "<h3>$1</h3>")
    .replace(/^## (.+)/gm, "<h2>$1</h2>")
    .replace(/^# (.+)/gm, "<h1>$1</h1>")
    .replace(/^[-•] (.+)/gm, "<li>$1</li>")
    .replace(/(<li>[\s\S]+?<\/li>)(?!\s*<li>)/g, "<ul>$1</ul>")
    .replace(/^\d+\. (.+)/gm, "<li>$1</li>")
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}

function escape(s) {
  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
}

export default function MessageBubble({ message, persona }) {
  const [copied, setCopied] = useState(false);
  const isBot = message.role === "assistant";

  const copy = () => {
    navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`msg-row ${isBot ? "bot" : "user"}`}>
      {isBot && (
        <div className="msg-avatar bot-av">
          {persona?.emoji || "🤖"}
        </div>
      )}

      <div className={`msg-bubble ${isBot ? "bot-bubble" : "user-bubble"}`}>
        {isBot ? (
          <>
            <div
              className="md-content"
              dangerouslySetInnerHTML={{ __html: parseMarkdown(message.content) }}
            />
            <button className="copy-btn" onClick={copy}>
              {copied
                ? <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polyline points="20 6 9 17 4 12"/></svg> Copied</>
                : <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg> Copy</>
              }
            </button>
          </>
        ) : (
          <p>{message.content}</p>
        )}
      </div>

      {!isBot && <div className="msg-avatar user-av">You</div>}
    </div>
  );
}
