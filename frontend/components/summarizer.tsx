"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import MarkdownReader from "@/components/markdown"

interface SummarizerProps {
  content: string;
  setNoteContent: (content: string) => void;
}

export default function Summarizer({ content, setNoteContent }: SummarizerProps) {
  const [summaryType, setSummaryType] = useState("concise")
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = async () => {
    if (!content) {
      toast({
        title: "No content to summarize",
        description: "Please add some content first.",
        variant: "destructive",
      })
      return
    }

    try {
      setIsGenerating(true);
      const response = await fetch("http://127.0.0.1:5000/api/summarize-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          str: content,
          id: JSON.parse(localStorage.getItem("googleUser") || "{}").sub
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setSummary(data.summary);
      
      // Option to set the summary as the note content
      //setNoteContent(data.summary);
    

    } catch (error) {
      console.error("Error generating summary:", error);
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)

    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard.",
    })

    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <>
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Summarizer</CardTitle>
        <CardDescription>Generate concise summaries from your notes or documents</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-primary text-secondary hover:bg-primary/90"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Summary"
            )}
          </Button>
        </div>

        {summary && (
          <div className="relative">
            <div className="p-3 border rounded-md bg-gray-50 whitespace-pre-line">{summary}</div>
            <Button size="sm" variant="ghost" className="absolute top-2 right-2" onClick={handleCopy}>
              {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
    </>
  )
}

