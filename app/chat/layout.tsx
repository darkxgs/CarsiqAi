export default function ChatLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="chat-container min-h-screen flex flex-col">
      {children}
    </div>
  )
} 