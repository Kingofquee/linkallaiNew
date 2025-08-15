import { create } from "zustand";

export type Role = "user" | "assistant";
export type Message = { role: Role; content: string };
export type ModelKey = "chatgpt" | "claude" | "gemini" | "meta";

type ModelState = { messages: Message[]; busy: boolean };

type Store = {
  chatgpt: ModelState;
  claude:  ModelState;
  gemini:  ModelState;
  meta:    ModelState;
  addUserMessageAll: (content: string) => void;
  addAssistantMessage: (model: ModelKey, content: string) => void;
  setBusyAll: (busy: boolean) => void;
  getState: () => Store;
};

export const useChatStore = create<Store>((set, get) => ({
  chatgpt: { messages: [], busy: false },
  claude:  { messages: [], busy: false },
  gemini:  { messages: [], busy: false },
  meta:    { messages: [], busy: false },

  addUserMessageAll: (content: string) =>
    set((state) => {
      const add = (m: ModelState) => ({
        messages: [...m.messages, { role: "user", content }],
        busy: m.busy
      });
      return {
        chatgpt: add(state.chatgpt),
        claude:  add(state.claude),
        gemini:  add(state.gemini),
        meta:    add(state.meta),
      };
    }),

  addAssistantMessage: (model, content) =>
    set((state) => ({
      ...state,
      [model]: { ...state[model], messages: [...state[model].messages, { role: "assistant", content }] }
    })),

  setBusyAll: (busy) =>
    set((state) => ({
      chatgpt: { ...state.chatgpt, busy },
      claude:  { ...state.claude,  busy },
      gemini:  { ...state.gemini,  busy },
      meta:    { ...state.meta,    busy },
    })),

  getState: () => get(),
}));
