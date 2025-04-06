"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, Copy, Check } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import Latex from "react-latex-next";
import "katex/dist/katex.min.css";

interface SummarizerProps {
  content: string;
  setNoteContent: (content: string) => void;
}

// eslint-disable-next-line no-useless-escape
const INITIAL_MACROS = { "\\f": "#1f(#2)" };

interface SummaryResponse {
  summary: string;
  key_points: string[];
}

export default function Summarizer({
  content,
  setNoteContent,
}: SummarizerProps) {
  const [summaryType, setSummaryType] = useState("concise");
  const [isGenerating, setIsGenerating] = useState(false);
  const [summary, setSummary] = useState<SummaryResponse | null>(null);
  const [copied, setCopied] = useState(false);
  const [mydata, setMyData] = useState<any>(null);

  const handleGenerate = async () => {
    if (!content) {
      toast({
        title: "No content to summarize",
        description: "Please add some content first.",
        variant: "destructive",
      });
      return;
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
          id: JSON.parse(localStorage.getItem("googleUser") || "{}").sub,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate summary");
      }

      const data = await response.json();
      setMyData(data);

      console.log(data);

      // Check if the response is a string that needs to be parsed
      let parsedData;
      if (typeof data === "string") {
        try {
          parsedData = JSON.parse(data);
        } catch (e) {
          console.error("Error parsing JSON string:", e);
          parsedData = data;
        }
      } else {
        parsedData = data;
      }

      console.log(parsedData);
      // Transform the response to match our interface
      const transformedData: SummaryResponse = {
        summary: parsedData.summary,
        key_points: [
          parsedData.key_point1,
          parsedData.key_point2,
          parsedData.key_point3,
          parsedData.key_point4,
          parsedData.key_point5,
        ].filter((point) => point && point.trim() !== ""), // Filter out empty points
      };

      setSummary(transformedData);

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
  };

  const handleCopy = () => {
    if (!summary) return;

    const textToCopy = `
Summary:
${summary.summary}

Key Points:
${summary.key_points.map((point, index) => `${index + 1}. ${point}`).join("\n")}
    `;

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);

    toast({
      title: "Copied to clipboard",
      description: "Summary has been copied to your clipboard.",
    });

    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle>Summarizer</CardTitle>
          <CardDescription>
            Generate concise summaries from your notes or documents
          </CardDescription>
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
              <div className="p-4 border rounded-md bg-gray-50 overflow-auto max-h-[500px]">
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-2">Summary</h3>
                  <div className="prose prose-sm max-w-none">
                    <Latex strict={false} macros={INITIAL_MACROS}>
                      {summary.summary}
                    </Latex>
                  </div>
                </div>
                {mydata.bullet_points?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Key Points</h3>
                    <ol className="list-decimal pl-5 space-y-2">
                      {mydata.bullet_points.map((point: string, index: number) => (
                        <li key={index}>
                          <Latex strict={false} macros={INITIAL_MACROS}>
                            {point}
                          </Latex>
                        </li>
                      ))}
                    </ol>
                  </div>
                )}
              </div>
              <Button
                size="sm"
                variant="ghost"
                className="absolute top-2 right-2"
                onClick={handleCopy}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
}
