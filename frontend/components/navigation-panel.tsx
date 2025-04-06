"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible" // Stretch goal to have horizontal collapse
import { NotebookPen, University } from "lucide-react"

export default function NavigationPanel() {
    const [isOpen, setIsOpen] = useState(true)


    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">

                <div>Navigation</div>

            </div>
            <div><NotebookPen className="h-4 w-4 text-orange-500" />Notes</div>
            <div><University className="h-4 w-4 text-orange-500" />Class</div>
        </div>
    )
}

