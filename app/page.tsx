'use client';

import { useState } from 'react';

const models = ['ChatGPT', 'Claude', 'Gemini', 'Meta AI'];

export default function Home() {
  const [activeTab, setActiveTab] = useState(models[0]);
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setResponse(`Simulated response from ${activeTab}:\n\n"${input}"`);
  };

  const getModelStyles = () => {
    switch (activeTab) {
      case 'ChatGPT':
        return {
          container: 'bg-gray-900 text-white',
          input: 'bg-gray-800 border border-gray-600 text-white',
          bubble: 'bg-green-700 text-white px-4 py-3 rounded-lg max-w-xl',
          button: 'bg-green-600 hover:bg-green-700 text-white',
          font: 'font-mono',
        };
      case 'Claude':
        return {
          container: 'bg-white text-gray-800',
          input: 'bg-white border border-gray-300 text-black',
          bubble: 'bg-gray-100 border border-gray-300 text-gray-800 px-4 py-3 rounded-lg max-w-xl',
          button: 'bg-blue-600 hover:bg-blue-700 text-white',
          font: 'font-sans',
        };
      case 'Gemini':
        return {
          container: 'bg-blue-50 text-gray-900',
          input: 'bg-white shadow-md border border-gray-200 text-black rounded-full px-6',
          bubble: 'bg-white text-black shadow-lg rounded-xl p-4 max-w-xl',
          button: 'bg-indigo-600 hover:bg-indigo-700 text-white rounded-full px-6',
          font: 'font-sans',
        };
      case 'Meta AI':
        return {
          container: 'bg-white text-black',
          input: 'bg-gray-100 border border-gray-300 text-black rounded-full px-5',
          bubble: 'bg-blue-100 text-black rounded-full px-6 py-3 max-w-xl',
          button: 'bg-blue-600 hover:bg-blue-700 text-white rounded-full px-5',
          font: 'font-sans',
        };
      default:
        return {};
    }
  };

  const styles = getModelStyles();

  return (
    <main className={`min-h-screen ${styles.container} ${styles.font} py-6 px-4`}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl sm:text-4xl font-bold mb-6 text-center">LinkAllAI</h1>

        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {models.map((model) => (
            <button
              key={model}
              onClick={() => {
                setActiveTab(model);
                setResponse('');
              }}
              className={`px-4 py-2 rounded-full font-semibold ${
                activeTab === model
                  ? 'bg-black text-white'
                  : 'bg-gray-200 hover:bg-gray-300 text-black'
              }`}
            >
              {model}
            </button>
          ))}
        </div>

        <div className="mb-4">
          <form onSubmit={handleSubmit} className="flex gap-2 items-center">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`Ask ${activeTab} something...`}
              className={`flex-1 py-2 ${styles.input}`}
            />
            <button
              type="submit"
              className={`py-2 px-4 ${styles.button}`}
            >
              Send
            </button>
          </form>
        </div>

        <div className="mt-6">
          <div className={`${styles.bubble}`}>
            {response || `Enter a query and press send to view ${activeTab} response.`}
          </div>
        </div>
      </div>
    </main>
  );
}
