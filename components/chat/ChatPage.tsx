"use client"

import { useState, useEffect, useRef } from "react"
import { useChat } from "@ai-sdk/react"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ChatHeader } from "@/components/chat/ChatHeader"
import { ChatMessages } from "@/components/chat/ChatMessages"
import { ChatInput } from "@/components/chat/ChatInput"
import { ChatSidebar } from "@/components/chat/ChatSidebar"
import { QuickActions } from "@/components/chat/QuickActions"
import { Settings } from "@/components/chat/Settings"
import { ChatMessage, ChatSession } from "@/types/chat"
import {
  getChatStorage,
  setActiveSession,
  createAndSetActiveSession,
  addMessageToActiveSession
} from "@/utils/chatStorage"

export default function ChatPage() {
  // State
  const [showSettings, setShowSettings] = useState(false)
  const [darkMode, setDarkMode] = useState(true)
  const [searchHistory, setSearchHistory] = useState<string[]>([])
  const [scale, setScale] = useState(1)
  const [keyboardVisible, setKeyboardVisible] = useState(false)
  const [viewportHeight, setViewportHeight] = useState(0)
  const [isFaqExpanded, setIsFaqExpanded] = useState(true)
  const [textareaHeight, setTextareaHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const messagesContainerRef = useRef<HTMLDivElement>(null)

  // Chat history state
  const [sessions, setSessions] = useState<ChatSession[]>([])
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)

  // Car suggestions data specific to Iraq
  const iraqiCarSuggestions = [
    "تويوتا كورولا 2020",
    "هيونداي النترا 2022",
    "كيا سيراتو 2021",
    "نيسان صني 2019",
    "تويوتا كامري 2023",
    "هوندا سيفيك 2020",
    "شيفروليه كروز 2021",
    "فورد فوكس 2019",
    "مازدا 3 2022",
    "ميتسوبيشي لانسر 2018",
  ]

  // AI Chat setup
  const chatHookResult = useChat({
    api: "/api/chat",
    initialMessages: [],
    onError: (error) => {
      console.error("Chat error:", error)
    },
    onFinish: (message) => {
      // Save assistant message to local storage
      if (message.content && typeof message.content === 'string') {
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: message.content,
          timestamp: Date.now()
        }
        addMessageToActiveSession(assistantMessage);
      }
      loadChatSessions(); // Refresh sessions

      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  })
  
  const {
    messages,
    error,
    setMessages,
    stop: stopGenerating,
    status
  } = chatHookResult;
  
  // Check if we're loading based on status
  const isLoading = status === 'streaming';
  
  // Loading state for API calls
  const [isApiLoading, setIsApiLoading] = useState(false);

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Fallback input state if AI SDK doesn't provide handleInputChange
  const [fallbackInput, setFallbackInput] = useState('');
  
  // Fallback API call function
  const sendMessageToAPI = async (message: string) => {
    setIsApiLoading(true);
    
    try {
      // Get only valid messages for the API call
      const validMessages = messages.filter(msg => 
        msg.content && typeof msg.content === 'string'
      );
      
      // Update the AI SDK messages to show user message
      const newMessages = [...validMessages, { 
        id: Date.now().toString(), 
        role: 'user' as const, 
        content: message 
      }];
      setMessages(newMessages);
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [
            ...validMessages,
            { role: 'user', content: message }
          ]
        })
      });
      
      if (response.ok) {
        // Check content type to handle different response formats
        const contentType = response.headers.get('content-type');
        
        let data: string = '';
        
        if (contentType?.includes('text/plain')) {
          // Handle streaming or plain text responses
          const reader = response.body?.getReader();
          const decoder = new TextDecoder();
          
          if (reader) {
            let fullResponse = '';
            
            try {
              while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                
                // Parse AI SDK streaming format
                const lines = chunk.split('\n');
                for (const line of lines) {
                  if (line.startsWith('0:"')) {
                    // Extract content from AI SDK streaming format: 0:"content"
                    const match = line.match(/0:"(.+?)"/);
                    if (match) {
                      fullResponse += match[1];
                    }
                  } else if (line.trim() && !line.startsWith('f:') && !line.startsWith('e:') && !line.startsWith('d:')) {
                    // Handle plain text content
                    fullResponse += line;
                  }
                }
              }
            } catch (streamError) {
              console.error('Error reading stream:', streamError);
            }
            
            data = fullResponse;
          } else {
            // Fallback to regular text reading
            data = await response.text();
          }
        } else if (contentType?.includes('application/json')) {
          // Handle JSON error responses
          const jsonData = await response.json();
          data = jsonData.error || JSON.stringify(jsonData);
        } else {
          // Handle other response types
          data = await response.text();
        }
        
        if (data.trim()) {
          // Add assistant message to UI
          const assistantMsg = { 
            id: (Date.now() + 1).toString(), 
            role: 'assistant' as const, 
            content: data.trim() 
          };
          
          setMessages([...newMessages, assistantMsg]);
          
          // Also save to local storage
          const assistantStorageMsg: ChatMessage = {
            role: 'assistant',
            content: data.trim(),
            timestamp: Date.now()
          };
          addMessageToActiveSession(assistantStorageMsg);
          loadChatSessions();
        }
      } else {
        console.error('API response not ok:', response.status, response.statusText);
        const errorText = await response.text();
        console.error('Error response body:', errorText);
      }
    } catch (error) {
      console.error('API Error:', error);
    } finally {
      setIsApiLoading(false);
    }
  };
  
  // Custom input handler to support both input and textarea elements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    // Always use our fallback input since AI SDK doesn't provide input state
    setFallbackInput(e.target.value);

    // Update textarea height for layout calculations
    if (e.target instanceof HTMLTextAreaElement) {
      setTextareaHeight(e.target.scrollHeight);
    }
  };

  // Load chat history from localStorage
  const loadChatSessions = () => {
    const storage = getChatStorage();
    setSessions(storage.sessions);
    setActiveSessionId(storage.activeSessionId);

    // If there's an active session, load its messages
    if (storage.activeSessionId) {
      const activeSession = storage.sessions.find(s => s.id === storage.activeSessionId);
      if (activeSession) {
        // Clean up any messages with undefined content
        const validMessages = activeSession.messages.filter(msg => 
          msg.content && 
          typeof msg.content === 'string' && 
          msg.content.trim().length > 0
        );
        
        const aiMessages = validMessages.map(msg => ({
          id: msg.timestamp.toString(),
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }));

        // Only update if there are actual changes to avoid infinite loops
        if (aiMessages.length !== messages.length ||
          aiMessages.some((msg, i) => messages[i]?.content !== msg.content)) {
          setMessages(aiMessages);

          // Scroll to bottom after messages are loaded
          setTimeout(() => {
            scrollToBottom();
          }, 100);
        }
      }
    }
  };

  // Detect keyboard visibility changes on mobile
  const detectKeyboardVisibility = () => {
    if (typeof window !== 'undefined') {
      const currentViewportHeight = window.visualViewport?.height || window.innerHeight;

      // If we have no previous reading, just set it
      if (viewportHeight === 0) {
        setViewportHeight(currentViewportHeight);
        return;
      }

      // If viewport height decreased significantly (> 20%), keyboard is likely visible
      const heightDecrease = viewportHeight - currentViewportHeight;
      const decreasePercentage = heightDecrease / viewportHeight;

      if (decreasePercentage > 0.2) {
        if (!keyboardVisible) {
          setKeyboardVisible(true);
          // Scroll to bottom when keyboard appears
          setTimeout(scrollToBottom, 300);
        }
      } else {
        if (keyboardVisible) {
          setKeyboardVisible(false);
        }
      }

      // Update viewport height
      setViewportHeight(currentViewportHeight);
    }
  };

  // Adjust scale to fit screen
  const adjustScale = () => {
    if (!containerRef.current) return;

    const containerHeight = containerRef.current.scrollHeight;
    const windowHeight = window.innerHeight;

    // Set a minimum scale to prevent excessive zooming
    const minScale = 0.85;

    if (containerHeight > windowHeight) {
      // Calculate the scale needed to fit, but don't go below minScale
      const calculatedScale = (windowHeight / containerHeight) * 0.95;
      const newScale = Math.max(minScale, calculatedScale);

      // Only update scale if the change is significant to prevent constant small adjustments
      if (Math.abs(scale - newScale) > 0.01) {
        setScale(newScale);
      }
    } else {
      // If we don't need to scale down, maintain a scale of 1
      if (scale !== 1) {
        setScale(1);
      }
    }
  };

  // Setup viewport and resize listeners
  useEffect(() => {
    if (typeof window !== 'undefined' && window.visualViewport) {
      // Initial viewport height
      setViewportHeight(window.visualViewport.height || window.innerHeight);

      // Add resize listeners
      const handleResize = () => {
        if (window.visualViewport) {
          detectKeyboardVisibility();
          scrollToBottom();
        }
      };

      const handleScroll = () => {
        if (window.visualViewport) {
          detectKeyboardVisibility();
        }
      };

      window.visualViewport.addEventListener('resize', handleResize);
      window.visualViewport.addEventListener('scroll', handleScroll);

      // Cleanup
      return () => {
        if (window.visualViewport) {
          window.visualViewport.removeEventListener('resize', handleResize);
          window.visualViewport.removeEventListener('scroll', handleScroll);
        }
      };
    }
  }, []);

  // Effect to handle textarea resizing
  useEffect(() => {
    if (textareaHeight > 0) {
      scrollToBottom();
    }
  }, [textareaHeight]);

  // Load preferences and chat sessions
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode") === "true"
    const savedHistory = JSON.parse(localStorage.getItem("searchHistory") || "[]")
    setDarkMode(savedDarkMode)
    setSearchHistory(savedHistory)

    // Set dark mode class
    if (savedDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }

    // Load chat sessions
    loadChatSessions();

    // Initial scroll to bottom
    setTimeout(scrollToBottom, 300);
  }, [])

  // Add resize listener for responsive scaling
  useEffect(() => {
    adjustScale();
    window.addEventListener('resize', adjustScale);
    return () => window.removeEventListener('resize', adjustScale);
  }, [messages]);

  // Save dark mode preference
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode.toString())
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  // Handle messages and errors
  useEffect(() => {
    if (error) console.error("Chat error detected:", error)

    // Re-adjust scale when messages change
    adjustScale();

    // Handle initial session setup
    if (messages.length === 0 && !activeSessionId) {
      handleNewSession()
    }

    // Scroll to bottom when messages change
    scrollToBottom();
  }, [messages, error])

  // Handle session selection
  const handleSessionSelect = (sessionId: string) => {
    setActiveSession(sessionId);
    loadChatSessions();
    setSidebarOpen(false);

    // Scroll to bottom after session change
    setTimeout(scrollToBottom, 300);
  };

  // Handle new session creation
  const handleNewSession = () => {
    createAndSetActiveSession();
    setMessages([]);
    loadChatSessions();
    setSidebarOpen(false);
  };

  // Toggle sidebar
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // Handle quick action selection
  const handleQuickAction = (message: string) => {
    setFallbackInput(message || '');
  }

  // Handle form submission with history saving
  const handleFormSubmitWithHistory = () => {
    const currentInput = fallbackInput;
    if ((currentInput?.trim?.() || '')) {
      // Save to quick search history
      const trimmedInput = currentInput?.trim?.() || '';
      if (trimmedInput && !searchHistory.includes(trimmedInput)) {
        const newHistory = [trimmedInput, ...searchHistory.slice(0, 4)]
        setSearchHistory(newHistory)
        if (typeof localStorage !== 'undefined') {
          localStorage.setItem("searchHistory", JSON.stringify(newHistory))
        }
      }

      // Create or ensure there's an active session
      if (!activeSessionId) {
        createAndSetActiveSession();
        loadChatSessions();
      }

      // Save user message to local storage
      if (currentInput && currentInput.trim()) {
        const userMessage: ChatMessage = {
          role: 'user',
          content: currentInput.trim(),
          timestamp: Date.now()
        }
        addMessageToActiveSession(userMessage);
      }

      // Use direct API call as primary method
      sendMessageToAPI(currentInput);
      setFallbackInput('');

      // Reset textarea height
      setTextareaHeight(0);

      // Scroll to bottom after sending
      setTimeout(scrollToBottom, 100);
    }
  }

  // Calculate content width based on sidebar state
  const getContentStyles = () => {
    const baseStyles = {
      transform: `scale(${scale})`,
      transformOrigin: 'top center',
      height: `${100 / scale}%`,
      width: '100%',
      maxHeight: `${100 / scale}%`,
      paddingBottom: 0
    };

    // For desktop, adjust based on sidebar state
    if (typeof window !== 'undefined' && window.innerWidth >= 768) {
      return {
        ...baseStyles,
        marginRight: sidebarOpen ? '18rem' : '0', // Push content away from sidebar (RTL layout)
        width: sidebarOpen ? 'calc(100% - 18rem)' : '100%',
        transition: 'margin-right 0.3s ease-in-out, width 0.3s ease-in-out'
      };
    }

    // For mobile, use full width
    return baseStyles;
  };

  // Add effect to set the --vh custom property for mobile browsers
  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty('--vh', `${vh}px`);
    };

    // Set on initial load
    setVh();

    // Update on resize and orientation change
    window.addEventListener('resize', setVh);
    window.addEventListener('orientationchange', () => {
      // Slight delay for orientation changes
      setTimeout(setVh, 100);
    });

    return () => {
      window.removeEventListener('resize', setVh);
      window.removeEventListener('orientationchange', setVh);
    };
  }, []);



  // Handle FAQ expansion state change
  const handleFaqExpandChange = (isExpanded: boolean) => {
    setIsFaqExpanded(isExpanded);
  }

  return (
    <TooltipProvider>
      <div
        className={`min-h-[100svh] transition-colors duration-300 ${darkMode ? 'dark bg-[#1a1f2c]' : 'bg-gray-50'} flex flex-col m-0 p-0 mobile-safe-container relative`}
        style={{ margin: 0, padding: 0 }}
      >
        {/* Chat Sidebar */}
        <ChatSidebar
          isOpen={sidebarOpen}
          onClose={toggleSidebar}
          sessions={sessions}
          activeSessionId={activeSessionId}
          onSessionSelect={handleSessionSelect}
          onNewSession={handleNewSession}
        />

        <div
          ref={containerRef}
          className="flex-grow flex flex-col overflow-hidden"
          dir="rtl"
          style={{
            ...getContentStyles(),
            height: keyboardVisible ? `calc(${viewportHeight}px - 1px)` : undefined
          }}
        >
          {/* Header */}
          <ChatHeader
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            showSettings={showSettings}
            setShowSettings={setShowSettings}
            toggleSidebar={toggleSidebar}
          />

          {/* Messages */}
          <div
            ref={messagesContainerRef}
            className="flex-1 overflow-y-auto chat-container flex flex-col w-full bg-gradient-to-b from-transparent to-gray-50/30 dark:to-gray-900/30"
            id="chat-wrapper"
            style={{
              height: keyboardVisible ? `calc(100% - ${Math.min(textareaHeight + 80, 250)}px)` : 'auto',
              paddingBottom: keyboardVisible ? '8px' : '16px'
            }}
          >
            <ChatMessages
              messages={messages}
              isLoading={isLoading || isApiLoading}
              keyboardVisible={keyboardVisible}
              isFaqExpanded={isFaqExpanded}
            />

            {/* Settings Panel */}
            <Settings
              showSettings={showSettings}
              onClose={() => setShowSettings(false)}
              darkMode={darkMode}
            />

            {/* Quick Actions */}
            {messages.length === 0 && (
              <QuickActions
                onActionSelected={handleQuickAction}
                onFaqExpandChange={handleFaqExpandChange}
              />
            )}
          </div>

          {/* Input Area */}
          <div className={`${keyboardVisible ? 'sticky bottom-0 z-40 bg-white dark:bg-gray-900' : ''} border-t border-gray-100 dark:border-gray-800`}>
            <ChatInput
              input={fallbackInput}
              handleInputChange={handleInputChange}
              handleSubmit={handleFormSubmitWithHistory}
              isLoading={isLoading || isApiLoading}
              iraqiCarSuggestions={iraqiCarSuggestions}
              onStopGeneration={stopGenerating}
              keyboardVisible={keyboardVisible}
            />
          </div>
        </div>



        {/* Footer with Admin Link */}
        <div className="absolute bottom-0 left-0 right-0 py-1 text-center text-xs text-muted-foreground hidden md:block">
          <p>
            {new Date().getFullYear()} © جميع الحقوق محفوظة{' '}
            <span className="font-medium">Car Service Chat</span>{' '}
            <a
              href="/admin/login"
              className="text-xs text-muted-foreground hover:underline hover:text-foreground transition-colors mx-1"
            >
              إدارة
            </a>
          </p>
        </div>
      </div>
    </TooltipProvider>
  )
} 