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
}

export function ChatSidebar({
  isOpen,
  onClose,
  sessions,
  activeSessionId,
  onSessionSelect,
  onNewSession
}: ChatSidebarProps) {
  const [dialogOpen, setDialogOpen] = useState(false)
  const [sessionToRename, setSessionToRename] = useState<ChatSession | null>(null)
  const [newTitle, setNewTitle] = useState("")
  const [sessionToDelete, setSessionToDelete] = useState<ChatSession | null>(null)

  // Handle session click
  const handleSessionClick = (sessionId: string) => {
    onSessionSelect(sessionId)
    
    // On mobile, close the sidebar after selection
    if (window.innerWidth < 768) {
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
    if (sessionToRename && (newTitle?.trim?.() || '')) {
      renameChatSession(sessionToRename.id, newTitle?.trim?.() || newTitle || '')
      setDialogOpen(false)
      setSessionToRename(null)
    }
  }

  // Confirm delete
  const confirmDelete = () => {
    if (sessionToDelete) {
      deleteChatSession(sessionToDelete.id)
      setSessionToDelete(null)
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
          "fixed top-0 bottom-0 right-0 z-50 w-80 md:w-72 bg-white dark:bg-gray-900 shadow-2xl transition-all duration-300 transform border-l border-gray-200 dark:border-gray-700",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ right: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-5 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gradient-to-r from-blue-50 to-white dark:from-gray-800 dark:to-gray-900">
            <h2 className="text-xl font-bold text-blue-600 dark:text-blue-400 flex items-center">
              <MessageSquare className="h-5 w-5 ml-2" />
              المحادثات
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-9 w-9 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* New Chat Button */}
          <div className="p-4 sticky top-0 z-10 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
            <Button
              variant="default"
              size="default"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl py-5 shadow-md hover:shadow-lg transition-all duration-200"
              onClick={onNewSession}
            >
              <PlusCircle className="h-5 w-5 ml-2" />
              محادثة جديدة
            </Button>
          </div>
          
          {/* Session List */}
          <div className="flex-1 overflow-y-auto pb-4">
            {sessions.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center h-full">
                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-full mb-3">
                  <MessageSquare className="h-8 w-8 text-blue-500 dark:text-blue-400" />
                </div>
                <p className="text-gray-500 dark:text-gray-400 text-sm">
                لا توجد محادثات سابقة
                </p>
                <p className="text-gray-400 dark:text-gray-500 text-xs mt-2">
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
                        "w-full text-right px-4 py-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group flex items-center cursor-pointer",
                        activeSessionId === session.id 
                          ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" 
                          : "border border-transparent"
                      )}
                      onClick={() => handleSessionClick(session.id)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleSessionClick(session.id))}
                    >
                      <div className="flex-1 truncate">
                        <span className={cn(
                          "block font-medium truncate",
                          activeSessionId === session.id 
                            ? "text-blue-700 dark:text-blue-400" 
                            : "text-gray-900 dark:text-gray-100"
                        )}>
                          {session.title}
                        </span>
                        <span className="block text-xs text-gray-500 mt-1 flex items-center">
                          <Clock className="h-3 w-3 ml-1 inline-block" />
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
                          className="h-8 w-8 rounded-full hover:bg-blue-100 dark:hover:bg-blue-900/30"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(session);
                          }}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          
          {/* Footer */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <p className="text-xs text-center text-gray-500 dark:text-gray-400">
              هندسة السيارات - مساعد زيوت السيارات الذكي
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
              className="col-span-3"
            />
          </div>
          <DialogFooter className="sm:justify-start flex-row-reverse">
            <Button type="submit" onClick={confirmRename}>تأكيد</Button>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              إلغاء
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      {sessionToDelete && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-xl max-w-md w-full mx-4 text-right shadow-2xl border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              حذف المحادثة
            </h3>
            <p className="text-gray-500 dark:text-gray-400 mb-6">
              هل أنت متأكد من حذف محادثة "{sessionToDelete.title}"؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-start space-x-3 space-x-reverse">
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                className="bg-red-500 hover:bg-red-600"
              >
                حذف
              </Button>
              <Button 
                variant="outline" 
                onClick={() => setSessionToDelete(null)}
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