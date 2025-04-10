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
  const [currentTab, setCurrentTab] = useState("notes")

  const handleTabChange = (value: string) => {
    setCurrentTab(value);
  };

  return <div><LandingPage /></div>
}

