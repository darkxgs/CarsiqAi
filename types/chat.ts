// Chat message types
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number; // Unix timestamp
}

// Chat session structure
export interface ChatSession {
  id: string; // Unique ID
  title: string; // Default to first user message or "محادثة جديدة"
  messages: ChatMessage[];
  createdAt: number; // Unix timestamp
  updatedAt: number; // Unix timestamp
}

// Overall localStorage structure
export interface ChatStorage {
  sessions: ChatSession[];
  activeSessionId: string | null;
}

// Default empty state for chat storage
export const DEFAULT_CHAT_STORAGE: ChatStorage = {
  sessions: [],
  activeSessionId: null
}; 