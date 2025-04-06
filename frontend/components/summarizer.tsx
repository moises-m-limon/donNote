"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Copy, Check } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import MarkdownReader from "@/components/markdown"

interface SummarizerProps {
  content: string
}

export default function Summarizer({ content }: SummarizerProps) {
  const [summaryType, setSummaryType] = useState("concise")
  const [isGenerating, setIsGenerating] = useState(false)
  const [summary, setSummary] = useState("")
  const [copied, setCopied] = useState(false)

  const handleGenerate = () => {
    if (!content) {
      toast({
        title: "No content to summarize",
        description: "Please add some content first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setSummary("")

    // Simulate API call
    setTimeout(() => {
      let generatedSummary = ""

      if (summaryType === "concise") {
        generatedSummary =
          "This is a concise summary of the content. It focuses on the main points only and is designed to give you a quick overview of the material."
      } else if (summaryType === "detailed") {
        generatedSummary =
          "This is a detailed summary of the content. It includes main points as well as supporting details, examples, and explanations to provide a comprehensive understanding of the material."
      } else if (summaryType === "bullet") {
        generatedSummary =
          "• Main point 1: Key concept explained briefly\n• Main point 2: Another important concept\n• Main point 3: Final key takeaway\n• Supporting detail: Additional information that helps understand the main points"
      }

      setSummary(generatedSummary)
      setIsGenerating(false)

      toast({
        title: "Summary generated",
        description: `${summaryType.charAt(0).toUpperCase() + summaryType.slice(1)} summary created successfully.`,
      })
    }, 1500)
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

