"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mic, 
  MicOff, 
  Upload, 
  BrainCircuit, 
  FileQuestion, 
  BookmarkPlus, 
  PauseCircle,
  Save,
  FileText,
  Layers,
  List,
  Sparkles,
  Trash2,
  Send,
} from "lucide-react";
import KnowledgeGraph from "@/components/knowledge-graph";
import QuizGenerator from "@/components/quiz-generator";
import Summarizer from "@/components/summarizer";
import { toast } from "@/hooks/use-toast";

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: SpeechRecognition;
    webkitSpeechRecognition: SpeechRecognition;
  }
}

export default function EnhancedNoteTab() {
  const [isRecording, setIsRecording] = useState(false);
  const [noteContent, setNoteContent] = useState("");
  const [noteTitle, setNoteTitle] = useState("Untitled Note");
  const [noteMode, setNoteMode] = useState("detailed");
  const [activeWidget, setActiveWidget] = useState<string | null>(null);
  const [savedNotes, setSavedNotes] = useState<
    { id: string; title: string; content: string; mode: string }[]
  >([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      ("SpeechRecognition" in window || "webkitSpeechRecognition" in window)
    ) {
      const SpeechRecognition =
        window.SpeechRecognition || window.webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");

        if (event.results[0].isFinal) {
          setNoteContent((prev) => {
            // For big picture mode, add bullet points and keep it concise
            if (noteMode === "bigpicture") {
              return prev + "• " + transcript + "\n";
            }
            // For detailed mode, just append the transcript
            return prev + transcript + " ";
          });
        }
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [noteMode]);

  const toggleRecording = () => {
    if (!recognitionRef.current) return;

    if (isRecording) {
      recognitionRef.current.stop();
      toast({
        title: "Recording stopped",
        description: "Your speech has been transcribed.",
      });
    } else {
      recognitionRef.current.start();
      toast({
        title: "Recording started",
        description: "Speak clearly into your microphone.",
      });
    }
    setIsRecording(!isRecording);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Get userId from localStorage
    const userId = JSON.parse(localStorage.getItem('googleUser') || '{}').sub;
    console.log(userId);
    if (!userId) {
      toast({
        title: "Authentication Error",
        description: "User ID not found. Please log in again.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        // First set the content in the UI
        setNoteContent(event.target.result as string);
        
        try {
          // Prepare the data for the API call
          const fileData = {
            userId: userId, // Now using the userId from localStorage
            file_content: event.target.result as string,
            file_name: file.name
          };
          console.log(fileData);
          // Make the API call
          const response = await fetch('http://localhost:5000/api/users/files', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(fileData)
          });

          if (!response.ok) {
            throw new Error('Failed to upload file');
          }

          const result = await response.json();
          
          toast({
            title: "File uploaded successfully",
            description: `${file.name} has been uploaded and processed.`,
          });
        } catch (error) {
          console.error('Error uploading file:', error);
          toast({
            title: "Upload failed",
            description: "There was an error uploading your file.",
            variant: "destructive",
          });
        }
      }
    };

    reader.readAsText(file);
  };

  const saveNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: noteTitle || "Untitled Note",
      content: noteContent,
      mode: noteMode,
    };

    setSavedNotes((prev) => [...prev, newNote]);
    setNoteContent("");
    setNoteTitle("Untitled Note");
    
    toast({
      title: "Note saved",
      description: `${newNote.title} has been saved.`,
    });
  };

  const loadNote = (id: string) => {
    const note = savedNotes.find((note) => note.id === id);
    if (note) {
      setNoteContent(note.content);
      setNoteTitle(note.title);
      setNoteMode(note.mode);
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
    
    toast({
      title: "Note deleted",
      description: "The note has been removed.",
    });
  };

  const createNewNote = () => {
    setNoteContent("");
    setNoteTitle("Untitled Note");
    setSelectedNoteId(null);
  };

  const handleAssignToClass = () => {
    toast({
      title: "Assign to class",
      description: "Select a class to assign this note to.",
    });
  };

  const submitNote = async () => {
    if (!noteContent.trim()) return;
    
    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      // You would replace this with your actual API endpoint
      const response = await fetch("http://127.0.0.1:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          notes: noteContent,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit note");
      }

      setSubmitStatus("success");
      toast({
        title: "Note submitted",
        description: "Your note has been successfully processed.",
      });
    } catch (error) {
      console.error("Error submitting note:", error);
      setSubmitStatus("error");
      toast({
        title: "Submission failed",
        description: "There was an error submitting your note.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#1e2761] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-[#f9e94e] p-2 rounded-md">
              <h1 className="text-[#1e2761] text-2xl md:text-3xl font-bold tracking-tight">
                DONS HACK
              </h1>
            </div>
            <div className="bg-[#7de2d1] px-2 py-1 rounded text-[#1e2761] text-xs font-bold">
              NOTES
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              className="border-[#7de2d1] text-[#7de2d1] hover:bg-[#7de2d1] hover:text-[#1e2761]"
              onClick={createNewNote}
            >
              <FileText className="mr-2 h-4 w-4" />
              New Note
            </Button>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1 space-y-4">
            <Card className="bg-[#2a3270] border-[#7de2d1]">
              <CardHeader className="bg-[#7de2d1] text-[#1e2761]">
                <CardTitle className="text-lg font-bold">Saved Notes</CardTitle>
              </CardHeader>
              <CardContent className="pt-4">
                {savedNotes.length === 0 ? (
                  <p className="text-[#7de2d1] text-center py-4">
                    No saved notes yet
                  </p>
                ) : (
                  <ul className="space-y-2">
                    {savedNotes.map((note) => (
                      <li
                        key={note.id}
                        className={`p-2 rounded cursor-pointer flex justify-between items-center ${
                          selectedNoteId === note.id
                            ? "bg-[#f9e94e] text-[#1e2761]"
                            : "hover:bg-[#3a4180]"
                        }`}
                        onClick={() => loadNote(note.id)}
                      >
                        <div className="truncate flex-1">
                          <span className="font-medium">{note.title}</span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-400 hover:text-red-500 hover:bg-red-100/20"
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteNote(note.id);
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                )}
              </CardContent>
            </Card>

            <Card className="bg-[#2a3270] border-[#7de2d1]">
              <CardHeader className="bg-[#7de2d1] text-[#1e2761]">
                <CardTitle className="text-lg font-bold">Tools</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                <Button
                  className={`w-full ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-[#f9e94e] text-[#1e2761] hover:bg-[#e9d93e]"
                  }`}
                  onClick={toggleRecording}
                >
                  {isRecording ? (
                    <>
                      <MicOff className="mr-2 h-4 w-4" /> Stop Recording
                    </>
                  ) : (
                    <>
                      <Mic className="mr-2 h-4 w-4" /> Start Recording
                    </>
                  )}
                </Button>

                <div className="relative">
                  <Button
                    variant="outline"
                    className="w-full border-[#7de2d1] text-[#7de2d1] hover:bg-[#7de2d1] hover:text-[#1e2761]"
                    onClick={() =>
                      document.getElementById("file-upload")?.click()
                      
                    }
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".txt,.md,.pdf"
                    onChange={handleFileUpload}
                  />
                </div>
                {/* Stretch goal*/}
                {/* <Button
                  variant="outline"
                  className="w-full border-[#7de2d1] text-[#7de2d1] hover:bg-[#7de2d1] hover:text-[#1e2761]"
                  onClick={handleAssignToClass}
                >
                  <BookmarkPlus className="mr-2 h-4 w-4" />
                  Assign to Class
                </Button> */}

                <Button
                  className="w-full bg-[#7de2d1] text-[#1e2761] hover:bg-[#6dd2c1]"
                  onClick={saveNote}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Note
                </Button>

                {submitStatus === "success" && (
                  <p className="text-green-400 text-sm text-center">
                    Note submitted successfully!
                  </p>
                )}

                {submitStatus === "error" && (
                  <p className="text-red-400 text-sm text-center">
                    Failed to submit note. Please try again.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card className="bg-[#2a3270] border-[#7de2d1]">
              <CardHeader className="bg-[#7de2d1] text-[#1e2761] flex flex-row justify-between items-center">
                <div className="flex-1">
                  <input
                    type="text"
                    value={noteTitle}
                    onChange={(e) => setNoteTitle(e.target.value)}
                    className="bg-transparent text-lg font-bold w-full focus:outline-none"
                    placeholder="Note Title"
                  />
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <Tabs
                  value={noteMode}
                  onValueChange={setNoteMode}
                  className="w-full"
                >
                  <TabsContent value="detailed" className="m-0">
                    <div className="p-4 bg-white/5 min-h-[500px]">
                      <Textarea
                        ref={textareaRef}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="Start typing or recording your detailed notes here..."
                        className="min-h-[500px] bg-transparent border-none focus-visible:ring-0 resize-none text-white placeholder:text-white/40"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="bigpicture" className="m-0">
                    <div className="p-4 bg-white/5 min-h-[500px]">
                      <Textarea
                        ref={textareaRef}
                        value={noteContent}
                        onChange={(e) => setNoteContent(e.target.value)}
                        placeholder="• Record key points and main ideas here...
• Perfect for summarizing concepts
• Use bullet points for clarity"
                        className="min-h-[500px] bg-transparent border-none focus-visible:ring-0 resize-none text-white placeholder:text-white/40"
                      />
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
            
            {/* AI tools section */}
            <div className="mt-6">
              <Tabs
                value={activeWidget || "none"}
                onValueChange={(value) => setActiveWidget(value === "none" ? null : value)}
              >
                <TabsList className="grid grid-cols-3 bg-[#2a3270]">
                  <TabsTrigger
                    value="summarize"
                    className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                  >
                    <Upload className="mr-2 h-4 w-4" />
                    Summarize
                  </TabsTrigger>
                  <TabsTrigger
                    value="knowledge-graph"
                    className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                  >
                    <BrainCircuit className="mr-2 h-4 w-4" />
                    Knowledge Graph
                  </TabsTrigger>
                  <TabsTrigger 
                    value="quiz" 
                    className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                  >
                    <FileQuestion className="mr-2 h-4 w-4" />
                    Generate Quiz
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summarize">
                  <Card className="bg-[#2a3270] border-[#7de2d1]">
                    <CardContent className="pt-6">
                      <Summarizer content={noteContent} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="knowledge-graph">
                  <Card className="bg-[#2a3270] border-[#7de2d1]">
                    <CardContent className="pt-6">
                      <KnowledgeGraph content={noteContent} />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="quiz">
                  <Card className="bg-[#2a3270] border-[#7de2d1]">
                    <CardContent className="pt-6">
                      <QuizGenerator content={noteContent} />
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            <div className="mt-4 text-center text-[#7de2d1] text-sm">
              <p>
                <Sparkles className="inline h-4 w-4 mr-1" />
                Speech-to-text powered by #CampusTech *WIT* & *ACM*
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}