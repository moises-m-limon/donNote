"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Search, ChevronDown, Clock, FileText, Video, Music, Presentation, ChevronLeft, ChevronRight, Trash2 } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

interface HistoryPanelProps {
  setNoteContent: (content: string) => void;
  setNoteTitle: (title: string) => void;
}

interface Note {
  id: string;
  title: string;
  content: string;
  mode: string;
  created_at?: string;
}

const url = process.env.DEV === "development" ? "http://127.0.0.1:5000" : "https://donnote-427348651859.us-west1.run.app";

export default function HistoryPanel({ setNoteContent, setNoteTitle }: HistoryPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [savedNotes, setSavedNotes] = useState<Note[]>([])
  const [userFiles, setUserFiles] = useState<Array<{ id: string; name: string; created_at: string; updated_at: string }>>([])

  // Fetch user files on component mount
  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const userId = JSON.parse(localStorage.getItem("googleUser") || "{}").sub;
        if (!userId) {
          console.log("No user ID found");
          return;
        }

        const response = await fetch(url + "/api/users", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        });

        if (!response.ok) throw new Error("Failed to fetch files");

        const files = await response.json();
        const filteredFiles = files.filter((file: any) => file.name !== ".emptyFolderPlaceholder");
        setUserFiles(filteredFiles);
      } catch (error) {
        console.error("Error fetching files:", error);
      }
    };

    fetchFiles();
  }, []);

  const loadNote = (id: string) => {
    const note = savedNotes.find((note) => note.id === id);
    if (note) {
      setNoteContent(note.content);
      setNoteTitle(note.title);
      setSelectedNoteId(id);
    }
  };

  const deleteNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setNoteContent("");
      setNoteTitle("Untitled Note");
    }
  };

  const filteredNotes = [...savedNotes, ...userFiles.map(file => ({
    id: file.id,
    title: file.name,
    content: "",
    mode: "file",
    created_at: file.created_at
  }))].filter(item =>
    item.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`flex flex-col h-full bg-[#2a3270] border-l border-[#7de2d1]/20 transition-all duration-300 ${isCollapsed ? 'w-16' : 'w-[240px]'}`}>
      <div className="p-4 border-b border-[#7de2d1]/20">
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[#7de2d1] hover:bg-[#3a4180] w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? 
            <ChevronLeft className="h-4 w-4" /> : 
            <ChevronRight className="h-4 w-4" />
          }
          <Clock className="h-8 w-8 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium flex-1 text-left">History</span>}
          
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
          </div>

          <div className="flex-1 overflow-auto">
            <div className="p-2">
              {filteredNotes.length > 0 ? (
                <ul className="space-y-2">
                  {filteredNotes.map((item) => (
                    <li
                      key={item.id}
                      className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                        selectedNoteId === item.id
                          ? "bg-[#7de2d1] text-[#1e2761]"
                          : "hover:bg-[#3a4180] text-white/70"
                      }`}
                      onClick={async () => {
                        if (item.mode === "file") {
                          const userId = JSON.parse(localStorage.getItem("googleUser") || "{}").sub;
                          const filePath = `users/${userId}/${item.title}`;
                          const { data } = supabase.storage.from("donshack2025").getPublicUrl(filePath);

                          try {
                            const response = await fetch(data.publicUrl);
                            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                            const text = await response.text();
                            setNoteContent(text);
                            setNoteTitle(item.title.replace(".txt", ""));
                            setSelectedNoteId(item.id);
                          } catch (error) {
                            console.error("Error fetching file contents:", error);
                          }
                        } else {
                          loadNote(item.id);
                        }
                      }}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <FileText className="h-4 w-4 flex-shrink-0 text-[#7de2d1]" />
                        <div className="truncate">
                          <span className="font-medium">{item.title}</span>
                          {item.created_at && (
                            <span className="text-xs text-[#7de2d1] ml-2">
                              {new Date(item.created_at).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                      </div>
                      {item.mode !== "file" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-[#7de2d1] hover:text-[#f9e94e] hover:bg-[#3a4180]"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(item.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
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

