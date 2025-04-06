"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Mic, MicOff } from "lucide-react"
import { toast } from "@/hooks/use-toast"

export default function VoiceNavigationButton() {
  const [isListening, setIsListening] = useState(false)

  const toggleVoiceNavigation = () => {
    setIsListening(!isListening)

    if (!isListening) {
      toast({
        title: "Voice navigation activated",
        description: "Speak a command like 'open summarizer' or 'create note'.",
      })

      // Simulate voice recognition timeout
      setTimeout(() => {
        setIsListening(false)
        toast({
          title: "Voice navigation stopped",
          description: "No command detected or command executed.",
        })
      }, 5000)
    } else {
      toast({
        title: "Voice navigation stopped",
        description: "Voice command listening canceled.",
      })
    }
  }

  return (
    <Button
      className={`fixed bottom-6 right-6 rounded-full w-14 h-14 p-0 shadow-lg ${
        isListening ? "bg-red-500 hover:bg-red-600" : "bg-primary text-secondary hover:bg-primary/90"
      }`}
      onClick={toggleVoiceNavigation}
    >
      {isListening ? <MicOff className="h-6 w-6" /> : <Mic className="h-6 w-6" />}
    </Button>
  )
}

