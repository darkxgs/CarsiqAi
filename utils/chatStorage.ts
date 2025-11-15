import { ChatMessage, ChatSession, ChatStorage, DEFAULT_CHAT_STORAGE } from "@/types/chat";

// Storage key in localStorage
const STORAGE_KEY = 'chat_history_storage';

// Generate a unique ID
export const generateId = (): string => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

// Get all chat sessions from localStorage
export const getChatStorage = (): ChatStorage => {
  if (typeof window === 'undefined') return DEFAULT_CHAT_STORAGE;
  
  try {
    const storage = localStorage.getItem(STORAGE_KEY);
    if (!storage) return DEFAULT_CHAT_STORAGE;
    
    return JSON.parse(storage) as ChatStorage;
  } catch (error) {
    console.error('Failed to parse chat storage:', error);
    return DEFAULT_CHAT_STORAGE;
  }
};

// Save chat storage to localStorage
export const saveChatStorage = (storage: ChatStorage): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(storage));
};

// Create a new chat session
export const createChatSession = (): ChatSession => {
  const newSession: ChatSession = {
    id: generateId(),
    title: 'محادثة جديدة',
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
  
  return newSession;
};

// Set active chat session
export const setActiveSession = (sessionId: string): void => {
  const storage = getChatStorage();
  storage.activeSessionId = sessionId;
  saveChatStorage(storage);
};

// Get active chat session
export const getActiveSession = (): ChatSession | null => {
  const storage = getChatStorage();
  if (!storage.activeSessionId) return null;
  
  const session = storage.sessions.find(s => s.id === storage.activeSessionId);
  return session || null;
};

// Create and set a new active session
export const createAndSetActiveSession = (): ChatSession => {
  const storage = getChatStorage();
  const newSession = createChatSession();
  
  storage.sessions.push(newSession);
  storage.activeSessionId = newSession.id;
  
  saveChatStorage(storage);
  return newSession;
};

// Add message to active session
export const addMessageToActiveSession = (message: ChatMessage): void => {
  const storage = getChatStorage();
  if (!storage.activeSessionId) {
    // Create new session if none is active
    const newSession = createChatSession();
    newSession.messages.push(message);
    
    // Update title if it's a user message
    if (message.role === 'user') {
      const title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
      newSession.title = title;
    }
    
    newSession.updatedAt = Date.now();
    
    storage.sessions.push(newSession);
    storage.activeSessionId = newSession.id;
  } else {
    // Add to existing session
    const sessionIndex = storage.sessions.findIndex(s => s.id === storage.activeSessionId);
    if (sessionIndex === -1) {
      console.error('Active session not found');
      return;
    }
    
    storage.sessions[sessionIndex].messages.push(message);
    storage.sessions[sessionIndex].updatedAt = Date.now();
    
    // Update title if it's the first user message and title is still default
    if (
      message.role === 'user' && 
      storage.sessions[sessionIndex].messages.filter(m => m.role === 'user').length === 1 &&
      storage.sessions[sessionIndex].title === 'محادثة جديدة'
    ) {
      const title = message.content.slice(0, 30) + (message.content.length > 30 ? '...' : '');
      storage.sessions[sessionIndex].title = title;
    }
  }
  
  saveChatStorage(storage);
};

// Delete a chat session
export const deleteChatSession = (sessionId: string): void => {
  const storage = getChatStorage();
  
  console.log('Deleting session:', sessionId);
  const sessionExists = storage.sessions.find(s => s.id === sessionId);
  if (!sessionExists) {
    console.error('Session not found for deletion:', sessionId);
    return;
  }
  
  // Remove the session
  storage.sessions = storage.sessions.filter(s => s.id !== sessionId);
  
  // If we deleted the active session, set a new active session or null
  if (storage.activeSessionId === sessionId) {
    storage.activeSessionId = storage.sessions.length > 0 ? storage.sessions[0].id : null;
    console.log('Active session changed to:', storage.activeSessionId);
  }
  
  saveChatStorage(storage);
  console.log('Session deleted successfully');
};

// Rename a chat session
export const renameChatSession = (sessionId: string, newTitle: string): void => {
  const storage = getChatStorage();
  
  const sessionIndex = storage.sessions.findIndex(s => s.id === sessionId);
  if (sessionIndex === -1) {
    console.error('Session not found for rename:', sessionId);
    return;
  }
  
  console.log('Renaming session:', sessionId, 'to:', newTitle);
  storage.sessions[sessionIndex].title = newTitle;
  storage.sessions[sessionIndex].updatedAt = Date.now();
  saveChatStorage(storage);
  console.log('Session renamed successfully');
}; 