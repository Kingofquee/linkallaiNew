"use client";

export type ModelKey = "chatgpt" | "claude" | "gemini" | "meta";

export default function Sidebar({
  active,
  onSelect,
}: {
  active: ModelKey;
  onSelect: (m: ModelKey) => void;
}) {
  const items: { key: ModelKey; label: string }[] = [
    { key: "chatgpt", label: "ChatGPT" },
    { key: "claude",  label: "Claude"  },
    { key: "gemini",  label: "Gemini"  },
    { key: "meta",    label: "Meta AI" }
  ];

  return (
    <aside className="sidebar">
      <h2>AI MODELS</h2>
      <nav>
        {items.map((item) => (
          <button
            key={item.key}
            onClick={() => onSelect(item.key)}
            className={active === item.key ? "active" : ""}
          >
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  );
}
