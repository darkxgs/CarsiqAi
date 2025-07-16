"use client"

import { useState, useEffect, useRef, useCallback } from "react"
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
  addMessageToActiveSession,
  getActiveSession
} from "@/utils/chatStorage"
import { Button } from "@/components/ui/button"
import { PlusCircle, MessageSquare } from "lucide-react"

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
  const {
    messages,
    input,
    handleInputChange: aiHandleInputChange,
    handleSubmit,
    isLoading,
    error,
    setMessages,
    stop: stopGenerating
  } = useChat({
    api: "/api/chat",
    initialMessages: [],
    onResponse: (response) => {
      console.log("AI Response received:", response.status)
    },
    onError: (error) => {
      console.error("Chat error:", error)
    },
    onFinish: (message) => {
      console.log("AI Message completed:", message)
      
      // Save assistant message to local storage
      const assistantMessage: ChatMessage = {
        role: 'assistant',
        content: message.content,
        timestamp: Date.now()
      }
      addMessageToActiveSession(assistantMessage);
      loadChatSessions(); // Refresh sessions
      
      // Scroll to bottom after message is added
      setTimeout(() => {
        scrollToBottom();
      }, 100);
    }
  })

  // Scroll to bottom of messages
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  };

  // Custom input handler to support both input and textarea elements
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    aiHandleInputChange(e as React.ChangeEvent<HTMLInputElement>);
    
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
        const aiMessages = activeSession.messages.map(msg => ({
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

  // Debugging
  useEffect(() => {
    // Remove excessive logging that causes performance issues
    // if (messages.length > 0) console.log("Messages updated:", messages)
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
    handleInputChange({ target: { value: message } } as any)
  }

  // Handle form submission with history saving
  const handleFormSubmitWithHistory = (e: React.FormEvent) => {
    if (input.trim()) {
      console.log("Submitting form with input:", input)
      
      // Save to quick search history
      if (!searchHistory.includes(input.trim())) {
        const newHistory = [input.trim(), ...searchHistory.slice(0, 4)]
        setSearchHistory(newHistory)
        localStorage.setItem("searchHistory", JSON.stringify(newHistory))
      }
      
      // Create or ensure there's an active session
      if (!activeSessionId) {
        createAndSetActiveSession();
        loadChatSessions();
      }
      
      // Save user message to local storage
      const userMessage: ChatMessage = {
        role: 'user',
        content: input,
        timestamp: Date.now()
      }
      addMessageToActiveSession(userMessage);
      
      // Handle the actual form submission
      handleSubmit(e)
      
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
        width: sidebarOpen ? 'calc(100% - 18rem)' : '100%', // 18rem = 72px * 4 (sidebar width)
        right: sidebarOpen ? '18rem' : 0,
        transition: 'width 0.3s, right 0.3s',
        marginRight: 0,
        paddingRight: 0
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

  // Update messages state with new message (reduces console spam)
  const updateMessages = useCallback((newMessages: typeof messages) => {
    setMessages(newMessages);
    // Disable excessive logging
    // console.log("Messages updated:", newMessages);
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
          className="flex-grow flex flex-col overflow-hidden md:mr-72"
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
              isLoading={isLoading} 
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
            input={input}
            handleInputChange={handleInputChange}
            handleSubmit={handleFormSubmitWithHistory}
            isLoading={isLoading}
            iraqiCarSuggestions={iraqiCarSuggestions}
              onStopGeneration={stopGenerating}
              keyboardVisible={keyboardVisible}
          />
          </div>
        </div>
        
        {/* Mobile Sidebar Toggle Button */}
        <Button
          variant="default"
          size="icon"
          className="fixed bottom-20 right-4 z-30 rounded-full shadow-lg bg-blue-500 hover:bg-blue-600 text-white border-0 h-12 w-12 flex items-center justify-center md:hidden"
          onClick={toggleSidebar}
          aria-label="فتح قائمة المحادثات"
        >
          <MessageSquare className="h-5 w-5" />
        </Button>
        
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