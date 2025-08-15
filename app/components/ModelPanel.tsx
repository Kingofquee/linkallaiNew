"use client";

import { useState } from "react";
import { useChatStore, ModelKey, Message } from "@/lib/useChatStore";

const presets: Record<ModelKey, {
  root: string;
  bot: string;
  user: string;
  input: string;
  placeholder: string;
  title: string;
}> = {
  chatgpt: {
    root: "gpt-bg", bot: "gpt-msg-bot", user: "gpt-msg-user", input: "gpt-input",
    placeholder: "Ask ChatGPT…", title: "ChatGPT"
  },
  claude: {
    root: "claude-bg", bot: "claude-msg-bot", user: "claude-msg-user", input: "claude-input",
    placeholder: "Ask Claude…", title: "Claude"
  },
  gemini: {
    root: "gemini-bg", bot: "gemini-msg-bot", user: "gemini-msg-user", input: "gemini-input",
    placeholder: "Ask Gemini…", title: "Gemini"
  },
  meta: {
    root: "meta-bg", bot: "meta-msg-bot", user: "meta-msg-user", input: "meta-input",
    placeholder: "Ask Meta AI…", title: "Meta AI"
  }
};

export default function ModelPanel({ model }: { model: ModelKey }) {
  const [text, setText] = useState("");
  const store = useChatStore();
  const state = useChatStore((s) => s[model]);
  const p = presets[model];

  const onSend = async () => {
    const t = text.trim();
    if (!t) return;

    // add user message to ALL models, set busy all
    store.addUserMessageAll(t);
    store.setBusyAll(true);
    setText("");

    // send to backend fanout
    try {
      const res = await fetch("/api/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: t }),
      });
      const data = await res.json();

      const map: Record<string, ModelKey> = {
        ChatGPT: "chatgpt",
        Claude:  "claude",
        Gemini:  "gemini",
        MetaAI:  "meta",
      };

      (Object.keys(map) as Array<keyof typeof map>).forEach((k) => {
        const key = map[k];
        const out = typeof (data as any)[k] === "string" ? (data as any)[k] : "No response.";
        store.addAssistantMessage(key, out);
      });
    } catch {
      (["chatgpt","claude","gemini","meta"] as ModelKey[]).forEach((k) =>
        store.addAssistantMessage(k, "Error contacting server.")
      );
    } finally {
      store.setBusyAll(false);
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSend();
    }
  };

  return (
    <div className={`panel ${p.root}`}>
      <div className="header">{p.title}</div>

      <div className="messages">
        {state.messages.length === 0 && (
          <div style={{ opacity: .6, fontSize: 14 }}>
            Type a prompt. It will be sent to all models in the background.
          </div>
        )}
        {state.messages.map((m: Message, i: number) => (
          <div
            key={i}
            className={`bubble ${m.role === "user" ? `user ${p.user}` : `bot ${p.bot}`}`}
          >
            {m.content}
          </div>
        ))}
        {state.busy && (
          <div className={`bubble bot ${p.bot}`} style={{ opacity: .7 }}>
            Thinking…
          </div>
        )}
      </div>

      <div className="input-wrap">
        <div className={`input-inner ${p.input}`}>
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder={p.placeholder}
            aria-label="Prompt"
          />
          {/* native-style send: black circle with white upward arrow */}
          <button className="send-btn" onClick={onSend} disabled={state.busy} title="Send">↑</button>
        </div>
      </div>
    </div>
  );
}
