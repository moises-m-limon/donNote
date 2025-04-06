"use client"

import LandingPage from "@/landing-page"
import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { BookOpen, Search, Sparkles, FileText } from "lucide-react"
import NoteTab from "@/components/note-tab"
import ClassTab from "@/components/class-tab"
import HistoryPanel from "@/components/history-panel"
import NavigationPanel from "@/components/navigation-panel"
import VoiceNavigationButton from "@/components/voice-navigation-button"


export default function Home() {
  const [isRecording, setIsRecording] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  return <div><LandingPage />
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-secondary text-white">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-bold flex items-center">
            <Sparkles className="mr-2 h-5 w-5" />
            Intelligent Note-Taking Assistant
          </h1>
          <div className="flex items-center space-x-2">
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex">
        {/* Right panel for history */}
        <div className="b-100 border-l">
          <NavigationPanel />
        </div>
        {/* Main content area with tabs */}
        <div className="flex-1 flex flex-col border-r border-gray-200">
          <Tabs defaultValue="notes" className="flex-1 flex flex-col">
            <TabsList className="grid w-full grid-cols-2 bg-secondary text-white">
              <TabsTrigger value="notes" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
                <FileText className="mr-2 h-4 w-4" />
                Notes
              </TabsTrigger>
              <TabsTrigger value="class" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
                <BookOpen className="mr-2 h-4 w-4" />
                Class
              </TabsTrigger>
            </TabsList>
            <TabsContent value="notes" className="flex-1 p-0">
              <NoteTab />
            </TabsContent>
            <TabsContent value="class" className="flex-1 p-0">
              <ClassTab />
            </TabsContent>
          </Tabs>
        </div>

        {/* Right panel for history */}
        <div className="w-80 border-l border-gray-200 bg-gray-50">
          <HistoryPanel />
        </div>
      </main>

      {/* Voice navigation button */}
      <VoiceNavigationButton /> 
    </div>
  </div>
}

