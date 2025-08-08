'use client';

import { useState } from 'react';
import Image from 'next/image';
import clsx from 'clsx';

// Mock fetch function – replace with actual API calls
const fetchAIResponse = async (model: string, input: string) => {
  return new Promise<string>((resolve) => {
    setTimeout(() => {
      resolve(`[${model}]: This is a simulated response to "${input}".`);
    }, 1000);
  });
};

const MODELS = [
  {
    key: 'chatgpt',
    name: 'ChatGPT',
    logo: '/logos/chatgpt.png',
    bubble: false,
  },
  {
    key: 'claude',
    name: 'Claude',
    logo: '/logos/claude.png',
    bubble: true,
  },
  {
    key: 'gemini',
    name: 'Gemini',
    logo: '/logos/gemini.png',
    bubble: true,
  },
  {
    key: 'metaai',
    name: 'Meta AI',
    logo: '/logos/metaai.png',
    bubble: true,
  },
];

export default function HomePage() {
  const [activeModel, setActiveModel] = useState('chatgpt');
  const [input, setInput] = useState('');
  const [responses, setResponses] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!input.trim()) return;

    setLoading(true);
    const updated = { ...responses };

    await Promise.all(
      MODELS.map(async (model) => {
        const reply = await fetchAIResponse(model.name, input);
        updated[model.key] = [...(updated[model.key] || []), `You: ${input}`, reply];
      })
    );

    setResponses(updated);
    setInput('');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black px-4 py-6 font-sans">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4 border-b border-gray-300 pb-2">
        {MODELS.map((model) => (
          <button
            key={model.key}
            onClick={() => setActiveModel(model.key)}
            className={clsx(
              'flex items-center px-4 py-2 rounded-t-md bg-gray-100 hover:bg-gray-200 transition',
              activeModel === model.key && 'border-b-2 border-black'
            )}
          >
            <Image
              src={model.logo}
              alt={model.name}
              width={20}
              height={20}
              className="mr-2"
            />
            <span className="text-sm font-medium">{model.name}</span>
          </button>
        ))}
      </div>

      {/* Chat Box */}
      <div className="flex flex-col h-[70vh] border rounded-lg p-4 bg-gray-50 overflow-y-auto mb-4 shadow-inner">
        {(responses[activeModel] || []).map((msg, i) => {
          const isUser = msg.startsWith('You:');
          const model = MODELS.find((m) => m.key === activeModel);
          const useBubble = model?.bubble;

          return (
            <div
              key={i}
              className={clsx(
                'mb-2',
                isUser ? 'text-right' : 'text-left'
              )}
            >
              {useBubble ? (
                <span
                  className={clsx(
                    'inline-block px-4 py-2 rounded-lg max-w-[80%]',
                    isUser ? 'bg-blue-100 text-blue-900 self-end' : 'bg-gray-200 text-gray-800'
                  )}
                >
                  {msg}
                </span>
              ) : (
                <p className="text-sm">{msg}</p>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="text-sm text-gray-500 italic">Fetching responses...</div>
        )}
      </div>

      {/* Input Box */}
      <div className="flex items-center border border-gray-300 rounded-full px-4 py-2 shadow-sm">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type your message..."
          className="flex-1 outline-none bg-transparent text-sm"
          onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        />
        <button
          onClick={handleSubmit}
          className="ml-2 p-2 bg-black rounded-full hover:bg-gray-800 transition"
          disabled={loading}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="white"
            viewBox="0 0 24 24"
            width="18"
            height="18"
          >
            <path d="M2 21l21-9L2 3v7l15 2-15 2z" />
          </svg>
        </button>
      </div>
    </div>
  );
}
