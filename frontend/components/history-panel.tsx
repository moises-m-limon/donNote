"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronDown, Clock, FileText, Video, Music, Presentation, ChevronLeft, ChevronRight } from "lucide-react"

export default function HistoryPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(true)
  const [isCollapsed, setIsCollapsed] = useState(false)

  const mockHistory = [
    { id: "1", title: "Biology Notes", type: "note", date: "2023-04-15T10:30:00", class: "Biology 101" },
    {
      id: "2",
      title: "CS Lecture Recording",
      type: "audio",
      date: "2023-04-14T14:45:00",
      class: "Computer Science 202",
    },
    { id: "3", title: "Psychology Quiz", type: "quiz", date: "2023-04-13T09:15:00", class: "Psychology 110" },
    { id: "4", title: "Study Session", type: "note", date: "2023-04-12T16:20:00", class: "Biology 101" },
    {
      id: "5",
      title: "Midterm Presentation",
      type: "presentation",
      date: "2023-04-11T11:00:00",
      class: "Computer Science 202",
    },
    { id: "6", title: "Research Methods", type: "video", date: "2023-04-10T13:30:00", class: "Psychology 110" },
  ]

  const getIcon = (type: string) => {
    switch (type) {
      case "note":
        return <FileText className="h-4 w-4 text-[#7de2d1]" />
      case "audio":
        return <Music className="h-4 w-4 text-[#f9e94e]" />
      case "video":
        return <Video className="h-4 w-4 text-[#f9e94e]" />
      case "presentation":
        return <Presentation className="h-4 w-4 text-[#7de2d1]" />
      default:
        return <FileText className="h-4 w-4 text-[#7de2d1]" />
    }
  }

  const filteredHistory = mockHistory.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.class.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className={`flex flex-col h-full bg-[#1e2761] text-white transition-all duration-300 ${isCollapsed ? 'w-[50px]' : 'w-80'}`}>
      <div className="p-4 border-b border-[#7de2d1]/20 flex justify-between items-center">
        <div className="text-[#7de2d1] font-semibold flex items-center gap-2">
          {!isCollapsed && <>
            <Clock className="h-5 w-5" />
            <span>History</span>
          </>}
          {isCollapsed && <Clock className="h-5 w-5" />}
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[#7de2d1] hover:bg-[#2a3270] p-1 h-6 w-6"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? 
            <ChevronLeft className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
        </Button>
      </div>

      {!isCollapsed && (
        <>
          <div className="p-4 border-b border-[#7de2d1]/20">
            <div className="relative">
              <Input
                type="text"
                placeholder="Search history..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-[#2a3270] border-[#7de2d1]/20 text-white placeholder:text-white/40"
              />
              <Search className="absolute right-2 top-2.5 h-4 w-4 text-[#7de2d1]" />
            </div>

            <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-3">
              <CollapsibleTrigger asChild>
                <Button variant="ghost" size="sm" className="flex items-center justify-between w-full p-2 text-sm text-[#7de2d1] hover:bg-[#2a3270] hover:text-[#7de2d1]">
                  <span>Search Suggestions</span>
                  <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "transform rotate-180" : ""}`} />
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {["has:audio", "has:video", "class:biology", "before:today", "after:lastweek"].map((suggestion) => (
                    <Button
                      key={suggestion}
                      variant="outline"
                      size="sm"
                      className="text-xs justify-start h-7 border-[#7de2d1]/20 text-[#7de2d1] hover:bg-[#2a3270] hover:text-[#7de2d1]"
                      onClick={() => setSearchQuery(suggestion)}
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </CollapsibleContent>
            </Collapsible>
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-2">
              {filteredHistory.length > 0 ? (
                <ul className="space-y-1">
                  {filteredHistory.map((item) => (
                    <li key={item.id} className="p-2 hover:bg-[#2a3270] rounded cursor-pointer">
                      <div className="flex items-start">
                        <div className="mr-2 mt-0.5">{getIcon(item.type)}</div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-[#f9e94e]">{item.title}</p>
                          <p className="text-xs text-[#7de2d1]">{item.class}</p>
                          <p className="text-xs text-white/40">
                            {new Date(item.date).toLocaleDateString()} at{" "}
                            {new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-center py-8 text-[#7de2d1]/60">
                  <p>No matching items found</p>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

