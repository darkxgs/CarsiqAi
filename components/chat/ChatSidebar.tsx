"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Edit, Clock, X, ChevronLeft, MessageSquare } from "lucide-react"
import { ChatSession } from "@/types/chat"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { deleteChatSession, renameChatSession } from "@/utils/chatStorage"
import { cn } from "@/lib/utils"

interface ChatSidebarProps {
  isOpen: boolean
  onClose: () => void
  sessions: ChatSession[]
  activeSessionId: string | null
  onSessionSelect: (sessionId: string) => void
  onNewSession: () => void
  onSessionsUpdate?: () => void
}

export function ChatSidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession,
  onSessionsUpdate
}: ChatSidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null)

  // Handle session click
  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId)
    
    // On mobile, close the sidebar after selection
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      onClose()
    }
  }

  // Format date for display
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp)
    
    // Get today and yesterday dates for comparison
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Check if the date is today or yesterday
    if (date >= today) {
      // Today - show only time
      return `اليوم ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    } else if (date >= yesterday) {
      // Yesterday - show "Yesterday" with time
      return `أمس ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    } else {
      // Other dates - show date and time in a simpler format
      const day = date.getDate()
      const month = date.getMonth() + 1 // Months are 0-indexed
      const year = date.getFullYear()
      return `${day}/${month}/${year} - ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
    }
  }

  // Handle rename
  const handleRename = (session: ChatSession) => {
    setSessionToRename(session)
    setNewTitle(session.title)
    setDialogOpen(true)
  }

  // Handle delete
  const handleDelete = (session: ChatSession) => {
    setSessionToDelete(session)
  }

  // Confirm rename
  const confirmRename = () => {
    console.log('Confirm rename called:', { sessionToRename, newTitle });
    if (sessionToRename && newTitle && newTitle.trim().length > 0) {
      console.log('Renaming session:', sessionToRename.id, 'to:', newTitle.trim());
      renameChatSession(sessionToRename.id, newTitle.trim())
      setDialogOpen(false)
      setSessionToRename(null)
      setNewTitle("")
      // Refresh sessions list
      if (onSessionsUpdate) {
        console.log('Calling onSessionsUpdate');
        onSessionsUpdate()
      }
    } else {
      console.log('Rename validation failed');
    }
  }

  // Confirm delete
  const confirmDelete = () => {
    console.log('Confirm delete called:', { sessionToDelete });
    if (sessionToDelete) {
      const wasActiveSession = sessionToDelete.id === activeSessionId
      console.log('Deleting session:', sessionToDelete.id, 'wasActive:', wasActiveSession);
      deleteChatSession(sessionToDelete.id)
      setSessionToDelete(null)
      
      // If we deleted the active session, we need to handle the UI update
      if (wasActiveSession) {
        // The deleteChatSession function will set a new active session or null
        // We need to refresh the parent component's state
        if (onSessionsUpdate) {
          console.log('Calling onSessionsUpdate after active session deletion');
          onSessionsUpdate()
        }
        // Close sidebar on mobile after deletion
        if (window.innerWidth < 768) {
          onClose()
        }
      } else {
        // Just refresh sessions list
        if (onSessionsUpdate) {
          console.log('Calling onSessionsUpdate after non-active session deletion');
          onSessionsUpdate()
        }
      }
    }
  }

  // Handle keyboard events for accessibility
  const handleKeyDown = (e: React.KeyboardEvent, callback: () => void) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      callback();
    }
  };

  return (
    <>
      <div 
        className={cn(
          "fixed inset-0 bg-black/40 backdrop-blur-sm z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 md:opacity-0 md:pointer-events-none" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      <aside 
        className={cn(
          "fixed top-0 bottom-0 right-0 z-50 w-80 md:w-72 bg-gradient-to-b from-red-50 via-orange-50 to-yellow-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 shadow-2xl border-l-4 border-red-200 dark:border-red-800/50",
          "transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ right: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b-2 border-red-200 dark:border-red-800/50 flex items-center justify-between bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 shadow-lg">
            <h2 className="text-xl font-bold text-red-700 dark:text-red-300 flex items-center animate-gradient-text">
              <MessageSquare className="h-6 w-6 ml-2 text-red-600 dark:text-red-400 animate-pulse" />
              المحادثات
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-10 w-10 rounded-full hover:bg-red-200/50 dark:hover:bg-red-900/30 transition-all duration-300 hover:scale-110 border-2 border-transparent hover:border-red-300"
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5 text-red-600 dark:text-red-400" />
            </Button>
          </div>
          
          {/* New Chat Button */}
          <div className="p-5 sticky top-0 z-10 bg-gradient-to-r from-red-50/90 via-orange-50/90 to-yellow-50/90 dark:from-gray-900/90 dark:via-gray-850/90 dark:to-gray-800/90 backdrop-blur-sm">
            <Button
              variant="default"
              size="default"
              className="w-full bg-gradient-to-r from-red-500 via-orange-500 to-red-600 hover:from-red-600 hover:via-orange-600 hover:to-red-700 text-white font-bold rounded-2xl py-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 border-2 border-red-400 animate-pulse-ring md:animate-pulse-ring"
              onClick={onNewSession}
            >
              <PlusCircle className="h-6 w-6 ml-2 animate-spin-slow md:animate-spin-slow" />
              محادثة جديدة
            </Button>
          </div>
          
          {/* Session List */}
          <div className="flex-1 overflow-y-auto pb-4">
            {sessions.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 p-6 rounded-full mb-4 shadow-lg animate-pulse-ring">
                  <MessageSquare className="h-10 w-10 text-red-600 dark:text-red-400 animate-float" />
                </div>
                <p className="text-gray-600 dark:text-gray-300 text-base font-medium">
                لا توجد محادثات سابقة
                </p>
                <p className="text-gray-500 dark:text-gray-400 text-sm mt-2">
                  ابدأ محادثة جديدة للحصول على توصيات زيوت السيارات
                </p>
              </div>
            ) : (
              <ul className="space-y-1 p-3">
                {sessions.map(session => (
                  <li key={session.id} className="relative">
                    <div
                      role="button"
                      tabIndex={0}
                      className={cn(
                        "w-full text-right px-5 py-4 rounded-2xl hover:bg-gradient-to-r hover:from-red-100/50 hover:via-orange-100/50 hover:to-yellow-100/50 dark:hover:from-red-900/20 dark:hover:via-orange-900/20 dark:hover:to-yellow-900/20 transition-all duration-300 group flex items-center cursor-pointer hover:scale-[1.02] hover:shadow-md",
                        activeSessionId === session.id 
                          ? "bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 border-2 border-red-300 dark:border-red-700 shadow-lg animate-glow" 
                          : "border-2 border-transparent hover:border-red-200 dark:hover:border-red-800/50"
                      )}
                      onClick={() => handleSessionClick(session.id)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleSessionClick(session.id))}
                    >
                      <div className="flex-1 truncate">
                        <span className={cn(
                          "block font-bold truncate text-base",
                          activeSessionId === session.id 
                            ? "text-red-800 dark:text-red-300 animate-gradient-text" 
                            : "text-gray-900 dark:text-gray-100"
                        )}>
                          {session.title}
                        </span>
                        <span className={cn(
                          "block text-sm mt-2 flex items-center font-medium",
                          activeSessionId === session.id 
                            ? "text-red-600 dark:text-red-400" 
                            : "text-gray-500 dark:text-gray-400"
                        )}>
                          <Clock className="h-4 w-4 ml-1 inline-block animate-pulse" />
                          {formatDate(session.updatedAt)}
                        </span>
                      </div>
                      
                      <div className={cn(
                        "absolute left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1 space-x-reverse",
                        activeSessionId === session.id ? "opacity-100" : ""
                      )}>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-all duration-300 hover:scale-110 border-2 border-transparent hover:border-orange-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session);
                          }}
                        >
                          <Edit className="h-4 w-4 text-orange-600 dark:text-orange-400 animate-pulse" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 transition-all duration-300 hover:scale-110 border-2 border-transparent hover:border-red-300"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(session);
                          }}
                        >
                          <Trash2 className="h-4 w-4 animate-pulse" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-5 border-t-2 border-red-200 dark:border-red-800/50 bg-gradient-to-r from-red-100 via-orange-100 to-yellow-100 dark:from-red-900/30 dark:via-orange-900/30 dark:to-yellow-900/30 shadow-lg">
            <p className="text-sm text-center text-red-700 dark:text-red-300 font-bold animate-gradient-text">
              🛢️ هندسة السيارات - مساعد زيوت السيارات الذكي 🚗
            </p>
          </div>
        </div>
      </aside>

      {/* Rename Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px] text-right">
          <DialogHeader>
            <DialogTitle>تعديل عنوان المحادثة</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Input
              dir="rtl"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  confirmRename()
                }
              }}
              className="col-span-3"
              placeholder="أدخل عنوان المحادثة الجديد"
              autoFocus
            />
          </div>
          <DialogFooter className="sm:justify-start flex-row-reverse">
            <Button 
              type="submit" 
              onClick={confirmRename}
              disabled={!newTitle || newTitle.trim().length === 0}
              className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              تأكيد
            </Button>
            <Button 
              variant="outline" 
              onClick={() => {
                setDialogOpen(false)
                setNewTitle("")
                setSessionToRename(null)
              }}
              className="border-2 border-red-200 hover:bg-red-50 hover:border-red-300 text-red-700 font-medium"
            >
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {sessionToDelete && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 animate-fade-in">
          <div className="bg-gradient-to-br from-white via-red-50 to-orange-50 dark:from-gray-900 dark:via-gray-850 dark:to-gray-800 p-8 rounded-3xl max-w-md w-full mx-4 text-right shadow-2xl border-4 border-red-200 dark:border-red-800/50 animate-scale-in">
            <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-3 animate-gradient-text">
              🗑️ حذف المحادثة
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-base leading-relaxed">
              هل أنت متأكد من حذف محادثة "<span className="font-bold text-red-700 dark:text-red-400">{sessionToDelete.title}</span>"؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-start space-x-4 space-x-reverse">
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white font-bold px-6 py-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-2 border-red-400"
              >
                حذف نهائياً
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSessionToDelete(null)}
                className="border-2 border-gray-300 hover:bg-gray-100 hover:border-gray-400 text-gray-700 font-medium px-6 py-3 transition-all duration-300 hover:scale-105"
              >
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 