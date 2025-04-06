"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Mic,
  MicOff,
  FileUp,
  Save,
  FileText,
  Layers,
  List,
  Sparkles,
  Trash2,
  Send,
} from "lucide-react";

// Declare SpeechRecognition interface
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: {
    transcript: string;
  };
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionEvent {
  results: SpeechRecognitionResultList;
}

export default function SpeechToTextInterface() {
  const [isRecording, setIsRecording] = useState(false);
  const [notes, setNotes] = useState("");
  const [noteTitle, setNoteTitle] = useState("Untitled Note");
  const [noteMode, setNoteMode] = useState("detailed");
  const [savedNotes, setSavedNotes] = useState<
    { id: string; title: string; content: string; mode: string }[]
  >([]);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<
    "idle" | "success" | "error"
  >("idle");

  const recognitionRef = useRef<any>(null);
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

      recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
        const results = event.results;
        const transcript = Array.from({ length: results.length }, (_, i) => results.item(i))
          .map(result => result[0])
          .map(result => result.transcript)
          .join("");

        if (event.results[0].isFinal) {
          setNotes((prev) => {
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
    } else {
      recognitionRef.current.start();
    }
    setIsRecording(!isRecording);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setNotes(event.target.result as string);
      }
    };
    reader.readAsText(file);
  };

  const saveNote = () => {
    const newNote = {
      id: Date.now().toString(),
      title: noteTitle || "Untitled Note",
      content: notes,
      mode: noteMode,
    };

    setSavedNotes((prev) => [...prev, newNote]);
    setNotes("");
    setNoteTitle("Untitled Note");
  };

  const loadNote = (id: string) => {
    const note = savedNotes.find((note) => note.id === id);
    if (note) {
      setNotes(note.content);
      setNoteTitle(note.title);
      setNoteMode(note.mode);
      setSelectedNoteId(id);
    }
  };

  const deleteNote = (id: string) => {
    setSavedNotes((prev) => prev.filter((note) => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
      setNotes("");
      setNoteTitle("Untitled Note");
    }
  };

  const createNewNote = () => {
    setNotes("");
    setNoteTitle("Untitled Note");
    setSelectedNoteId(null);
  };

  const submitNote = async () => {
    if (!notes.trim()) return;

    setIsSubmitting(true);
    setSubmitStatus("idle");

    try {
      const response = await fetch("/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: noteTitle,
          content: notes,
          mode: noteMode,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit note");
      }

      setSubmitStatus("success");
    } catch (error) {
      console.error("Error submitting note:", error);
      setSubmitStatus("error");
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
                          <div className="text-xs opacity-70">
                            {note.mode === "bigpicture"
                              ? "Big Picture"
                              : "Detailed"}{" "}
                            • {new Date().toLocaleDateString()}
                          </div>
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
                    <FileUp className="mr-2 h-4 w-4" />
                    Upload File
                  </Button>
                  <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    accept=".txt,.md"
                    onChange={handleFileUpload}
                  />
                </div>

                <Button
                  className="w-full bg-[#7de2d1] text-[#1e2761] hover:bg-[#6dd2c1]"
                  onClick={saveNote}
                >
                  <Save className="mr-2 h-4 w-4" />
                  Save Note
                </Button>

                <Button
                  className="w-full bg-[#f9e94e] text-[#1e2761] hover:bg-[#e9d93e]"
                  onClick={submitNote}
                  disabled={isSubmitting || !notes.trim()}
                >
                  <Send className="mr-2 h-4 w-4" />
                  {isSubmitting ? "Submitting..." : "Submit Note"}
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
                  <TabsList className="bg-[#1e2761]/20 w-full justify-end rounded-none border-b border-[#7de2d1]/20">
                    <TabsTrigger
                      value="detailed"
                      className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                    >
                      <List className="h-4 w-4 mr-1" />
                      Detailed
                    </TabsTrigger>
                    <TabsTrigger
                      value="bigpicture"
                      className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                    >
                      <Layers className="h-4 w-4 mr-1" />
                      Big Picture
                    </TabsTrigger>
                  </TabsList>
                  <TabsContent value="detailed" className="m-0">
                    <div className="p-4 bg-white/5 min-h-[500px]">
                      <Textarea
                        ref={textareaRef}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Start typing or recording your detailed notes here..."
                        className="min-h-[500px] bg-transparent border-none focus-visible:ring-0 resize-none text-white placeholder:text-white/40"
                      />
                    </div>
                  </TabsContent>
                  <TabsContent value="bigpicture" className="m-0">
                    <div className="p-4 bg-white/5 min-h-[500px]">
                      <Textarea
                        ref={textareaRef}
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
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

            <div className="mt-4 text-center text-[#7de2d1] text-sm">
              <p>
                <Sparkles className="inline h-4 w-4 mr-1" />
                Speech-to-text powered by Web Speech API
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
