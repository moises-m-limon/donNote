"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { NotebookPen, University, ChevronLeft, ChevronRight, Compass} from "lucide-react"

interface NavigationPanelProps {
    onTabChange: (tab: string) => void;
    currentTab: string;
}

export default function NavigationPanel({ onTabChange, currentTab }: NavigationPanelProps) {
    const [isCollapsed, setIsCollapsed] = useState(false)

    return (
        <div className={`flex flex-col h-full bg-[#2a3270] border-r border-[#7de2d1]/20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[240px]'}`}>
            {/* Header */}
            <div className="p-4 border-b border-[#7de2d1]/20">
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#7de2d1] hover:bg-[#3a4180] w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    <Compass className="h-8 w-8 flex-shrink-0" />
                    {!isCollapsed && <span className="font-medium flex-1 text-left">Navigation</span>}
                    {isCollapsed ? 
                        <ChevronRight className="h-4 w-4" /> : 
                        <ChevronLeft className="h-4 w-4" />
                    }
                </Button>
            </div>

            {/* Navigation Tabs */}
            <Tabs 
                value={currentTab} 
                onValueChange={onTabChange} 
                className="flex-1"
                orientation="vertical"
            >
                <TabsList className="flex flex-col bg-transparent h-full pt-4 px-2">
                    <TabsTrigger 
                        value="notes" 
                        className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all
                            data-[state=active]:bg-[#7de2d1] data-[state=active]:text-[#1e2761]
                            hover:bg-[#3a4180] text-white/70 hover:text-white
                            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    >
                        <NotebookPen className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Notes</span>}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="class" 
                        className={`w-full flex items-center gap-3 px-4 py-3 mb-2 rounded-lg transition-all
                            data-[state=active]:bg-[#7de2d1] data-[state=active]:text-[#1e2761]
                            hover:bg-[#3a4180] text-white/70 hover:text-white
                            ${isCollapsed ? 'justify-center' : 'justify-start'}`}
                    >
                        <University className="h-5 w-5 flex-shrink-0" />
                        {!isCollapsed && <span className="text-sm font-medium">Class</span>}
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}

