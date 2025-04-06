"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronDown, Clock, FileText, Video, Music, FileIcon as FilePresentation } from "lucide-react"

export default function HistoryPanel() {
  const [searchQuery, setSearchQuery] = useState("")
  const [isOpen, setIsOpen] = useState(true)

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
        return <FileText className="h-4 w-4 text-blue-500" />
      case "audio":
        return <Music className="h-4 w-4 text-purple-500" />
      case "video":
        return <Video className="h-4 w-4 text-red-500" />
      case "presentation":
        return <FilePresentation className="h-4 w-4 text-orange-500" />
      default:
        return <FileText className="h-4 w-4 text-gray-500" />
    }
  }

  const filteredHistory = mockHistory.filter(
    (item) =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.class.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold mb-2 text-secondary flex items-center">
          <Clock className="mr-2 h-5 w-5" />
          History
        </h2>
        <div className="relative">
          <Input
            type="text"
            placeholder="Search history..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pr-8"
          />
          <Search className="absolute right-2 top-2.5 h-4 w-4 text-gray-400" />
        </div>

        <Collapsible open={isOpen} onOpenChange={setIsOpen} className="mt-3">
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center justify-between w-full p-2 text-sm">
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
                  className="text-xs justify-start h-7"
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
                <li key={item.id} className="p-2 hover:bg-gray-100 rounded cursor-pointer">
                  <div className="flex items-start">
                    <div className="mr-2 mt-0.5">{getIcon(item.type)}</div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      <p className="text-xs text-gray-500">{item.class}</p>
                      <p className="text-xs text-gray-400">
                        {new Date(item.date).toLocaleDateString()} at{" "}
                        {new Date(item.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <p>No matching items found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

