"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { 
  BookOpen, 
  Sparkles, 
  FileText,
  LogOut,
  NotebookPen,
  University
} from "lucide-react"
import NoteTab from "@/components/note-tab"
import ClassTab from "@/components/class-tab"
import HistoryPanel from "@/components/history-panel"
import NavigationPanel from "@/components/navigation-panel"
import VoiceNavigationButton from "@/components/voice-navigation-button"
import Image from "next/image"
import { useRouter } from 'next/navigation'

export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [currentTab, setCurrentTab] = useState("notes")
  const [user, setUser] = useState<any>(null)
  const [noteContent, setNoteContent] = useState("")
  const [noteTitle, setNoteTitle] = useState("Untitled Note")
  const router = useRouter()

  useEffect(() => {
    // Get user data from localStorage
    const storedUser = localStorage.getItem("googleUser")
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    } else {
      // Redirect to landing page if no user found
      router.push('/')
    }
  }, [router])

  const handleSignOut = () => {
    localStorage.removeItem("googleUser")
    router.push('/')
  }

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  if (!user) return null;

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900">
      {/* Header */}
      <header className="border-b border-white/10 backdrop-blur-sm bg-indigo-950/50 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            {/* Logo and Title */}
            <div className="flex items-center gap-4">
              <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-yellow-300">
                Don Note
              </h1>
            
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-teal-400 font-medium">{user.name}</p>
                <p className="text-white/70 text-sm">{user.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-teal-400 hover:border-teal-300 transition-colors">
                <Image
                  src={user.picture || "/placeholder.svg"}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-[#7de2d1] bg-[#7de2d1] text-[#1e2761] hover:bg-[#f9e94e] hover:text-[#1e2761]"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex">
        {/* Left navigation panel */}
        <NavigationPanel onTabChange={handleTabChange} currentTab={currentTab} />
        
        {/* Main content area with tabs */}
        <div className="flex-1 flex flex-col">
          <Tabs value={currentTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
            <TabsContent value="notes" className="flex-1 p-0">
              <NoteTab 
                noteContent={noteContent}
                setNoteContent={setNoteContent}
                noteTitle={noteTitle}
                setNoteTitle={setNoteTitle}
              />
            </TabsContent>
            <TabsContent value="class" className="flex-1 p-0">
              <ClassTab />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel for history */}
        <HistoryPanel setNoteContent={setNoteContent} setNoteTitle={setNoteTitle} />
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 backdrop-blur-sm bg-indigo-950/50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="text-white/70 text-sm">
              © 2024 Don Note. All rights reserved.
            </div>
            <div className="text-center text-teal-400 text-sm flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Powered by #CampusTech *WIT* & *ACM*</span>
            </div>
            <div className="text-white/70 text-sm">
              Version 1.0.0
            </div>
          </div>
        </div>
      </footer>

      {/* Voice navigation button */}
      {/* <VoiceNavigationButton /> */}
    </div>
  )
}





