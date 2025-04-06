"use client"
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
  const [currentTab, setCurrentTab] = useState("notes")

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return <div className="flex flex-col min-h-screen bg-[#1e2761]">
  <main className="flex-1 flex">
    {/* Left navigation panel */}
    <NavigationPanel onTabChange={handleTabChange} currentTab={currentTab} />
    
    {/* Main content area with tabs */}
    <div className="flex-1 flex flex-col">
      <Tabs value={currentTab} onValueChange={handleTabChange} className="flex-1 flex flex-col">
        <TabsContent value="notes" className="flex-1 p-0">
          <NoteTab />
        </TabsContent>
        <TabsContent value="class" className="flex-1 p-0">
          <ClassTab />
        </TabsContent>
      </Tabs>
    </div>

    {/* Right panel for history */}
    <HistoryPanel />
  </main>

  {/* Voice navigation button */}
  <VoiceNavigationButton /> 
</div>
}





