"use client"

import { useState } from "react"
import { PlusCircle, Trash2, Edit, Clock, X, ChevronLeft, ChevronRight } from "lucide-react"
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
    if (sessionToRename && newTitle.trim()) {
      renameChatSession(sessionToRename.id, newTitle.trim())
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
          "fixed inset-0 bg-black/30 z-40 transition-opacity duration-300",
          isOpen ? "opacity-100 md:opacity-0 md:pointer-events-none" : "opacity-0 pointer-events-none"
        )}
        onClick={onClose}
      />
      
      <aside 
        className={cn(
          "fixed top-0 bottom-0 right-0 z-50 w-72 md:w-64 bg-white dark:bg-gray-900 shadow-xl transition-all duration-300 transform border-l border-gray-200 dark:border-gray-700",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
        style={{ right: 0 }}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">المحادثات</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className={cn(
                "h-8 w-8",
                "md:hover:bg-gray-200 md:dark:hover:bg-gray-800"
              )}
              aria-label="إغلاق القائمة"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
          
          {/* New Chat Button */}
          <div className="p-4">
            <Button
              variant="outline"
              size="sm"
              className="w-full border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 text-gray-600 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800"
              onClick={onNewSession}
            >
              <PlusCircle className="h-4 w-4 ml-2" />
              محادثة جديدة
            </Button>
          </div>
          
          {/* Session List */}
          <div className="flex-1 overflow-y-auto pb-4">
            {sessions.length === 0 ? (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400 text-sm">
                لا توجد محادثات سابقة
              </div>
            ) : (
              <ul className="space-y-1 p-2">
                {sessions.map(session => (
                  <li key={session.id} className="relative">
                    <div
                      role="button"
                      tabIndex={0}
                      className={cn(
                        "w-full text-right px-3 py-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group flex items-center cursor-pointer",
                        activeSessionId === session.id ? "bg-gray-100 dark:bg-gray-800" : ""
                      )}
                      onClick={() => handleSessionClick(session.id)}
                      onKeyDown={(e) => handleKeyDown(e, () => handleSessionClick(session.id))}
                    >
                      <div className="flex-1 truncate">
                        <span className="block font-medium text-gray-900 dark:text-gray-100 truncate">
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
                          className="h-7 w-7 rounded-full"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRename(session);
                          }}
                        >
                          <Edit className="h-3.5 w-3.5 text-gray-500 dark:text-gray-400" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg max-w-md w-full mx-4 text-right">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              حذف المحادثة
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              هل أنت متأكد من رغبتك في حذف هذه المحادثة؟ لا يمكن التراجع عن هذا الإجراء.
            </p>
            <div className="flex justify-start space-x-4 space-x-reverse">
              <Button variant="destructive" onClick={confirmDelete}>
                حذف
              </Button>
              <Button variant="outline" onClick={() => setSessionToDelete(null)}>
                إلغاء
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 