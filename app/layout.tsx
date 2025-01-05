import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { TodoProvider } from '@/contexts/TodoContext'
import { Toaster } from "@/components/ui/toaster"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh">
      <body>
        <AuthProvider>
          <TodoProvider>
            {children}
          </TodoProvider>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}