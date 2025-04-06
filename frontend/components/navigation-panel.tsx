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
        <div className={`flex flex-col h-full bg-[#1e2761] text-white transition-all duration-300 relative ${isCollapsed ? 'w-[50px]' : 'w-[100px]'}`}>
            <div className="p-4 border-b border-[#7de2d1]/20 flex justify-between items-center">
                <div className="text-[#7de2d1] font-semibold">
                    {!isCollapsed && <>
                <div onClick={() => setIsCollapsed(!isCollapsed)}>
                <Compass className="h-5 w-5" />
                <span>Navigation</span></div>
            </>}
                </div>
                <Button 
                    variant="ghost" 
                    size="sm" 
                    className="text-[#7de2d1] hover:bg-[#2a3270] p-1 h-6 w-6"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                >
                    {isCollapsed ? 
                        <ChevronRight className="h-4 w-4" /> : 
                        <ChevronLeft className="h-4 w-4" />
                    }
                </Button>
            </div>
            <Tabs 
                value={currentTab} 
                onValueChange={onTabChange} 
                className="flex-1"
                orientation="vertical"
            >
                <TabsList className="flex flex-col bg-transparent space-y-1 w-full h-full pt-2">
                    <TabsTrigger 
                        value="notes" 
                        className="w-full flex flex-col items-center gap-1 p-4 data-[state=active]:bg-[#2a3270] data-[state=active]:text-[#f9e94e] hover:bg-[#2a3270]/50"
                    >
                        <NotebookPen className="h-4 w-4" />
                        {!isCollapsed && <span className="text-xs">Notes</span>}
                    </TabsTrigger>
                    <TabsTrigger 
                        value="class" 
                        className="w-full flex flex-col items-center gap-1 p-4 data-[state=active]:bg-[#2a3270] data-[state=active]:text-[#f9e94e] hover:bg-[#2a3270]/50"
                    >
                        <University className="h-4 w-4" />
                        {!isCollapsed && <span className="text-xs">Class</span>}
                    </TabsTrigger>
                </TabsList>
            </Tabs>
        </div>
    )
}

