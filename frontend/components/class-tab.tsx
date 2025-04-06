"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, BrainCircuit, FileQuestion, Key, BookOpen } from "lucide-react"
import KnowledgeGraph from "@/components/knowledge-graph"
import QuizGenerator from "@/components/quiz-generator"
import Summarizer from "@/components/summarizer"
import { toast } from "@/hooks/use-toast"

export default function ClassTab() {
  const [accessToken, setAccessToken] = useState("")
  const [hasToken, setHasToken] = useState(false)
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedDocument, setSelectedDocument] = useState("")
  const [activeWidget, setActiveWidget] = useState<string | null>(null)

  const mockClasses = [
    { id: "1", name: "Biology 101" },
    { id: "2", name: "Computer Science 202" },
    { id: "3", name: "Psychology 110" },
  ]

  const mockDocuments = [
    { id: "1", name: "Lecture 1 - Introduction.pdf" },
    { id: "2", name: "Week 2 Reading.docx" },
    { id: "3", name: "Midterm Study Guide.pptx" },
  ]

  const saveToken = () => {
    if (accessToken.trim()) {
      setHasToken(true)
      toast({
        title: "Access token saved",
        description: "Your Canvas LMS access token has been saved.",
      })
    } else {
      toast({
        title: "Error",
        description: "Please enter a valid access token.",
        variant: "destructive",
      })
    }
  }

  return (
    <div className="flex flex-col h-full p-4 overflow-auto">
      {!hasToken ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-secondary">Canvas LMS Integration</CardTitle>
            <CardDescription>Enter your Canvas LMS access token to connect to your classes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-2">
              <Input
                type="password"
                placeholder="Enter your Canvas access token"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                className="flex-1"
              />
              <Button onClick={saveToken} className="bg-primary text-secondary hover:bg-primary/90">
                <Key className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="mb-4 grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Select Class</label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a class" />
                </SelectTrigger>
                <SelectContent>
                  {mockClasses.map((cls) => (
                    <SelectItem key={cls.id} value={cls.id}>
                      {cls.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Select Document</label>
              <Select value={selectedDocument} onValueChange={setSelectedDocument} disabled={!selectedClass}>
                <SelectTrigger>
                  <SelectValue placeholder={selectedClass ? "Select a document" : "Select a class first"} />
                </SelectTrigger>
                <SelectContent>
                  {mockDocuments.map((doc) => (
                    <SelectItem key={doc.id} value={doc.id}>
                      {doc.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {selectedDocument && (
            <Card className="mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  {mockDocuments.find((d) => d.id === selectedDocument)?.name}
                </CardTitle>
                <CardDescription>From {mockClasses.find((c) => c.id === selectedClass)?.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  This is a placeholder for the document content. In a real implementation, this would display the
                  actual document content or a preview of it.
                </p>
              </CardContent>
            </Card>
          )}

          <div className="grid grid-cols-1 gap-4">
            <Tabs
              value={activeWidget || "none"}
              onValueChange={(value) => setActiveWidget(value === "none" ? null : value)}
            >
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger
                  value="summarize"
                  className="data-[state=active]:bg-primary data-[state=active]:text-secondary"
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Summarize
                </TabsTrigger>
                <TabsTrigger
                  value="knowledge-graph"
                  className="data-[state=active]:bg-primary data-[state=active]:text-secondary"
                >
                  <BrainCircuit className="mr-2 h-4 w-4" />
                  Knowledge Graph
                </TabsTrigger>
                <TabsTrigger value="quiz" className="data-[state=active]:bg-primary data-[state=active]:text-secondary">
                  <FileQuestion className="mr-2 h-4 w-4" />
                  Generate Quiz
                </TabsTrigger>
              </TabsList>

              <TabsContent value="summarize">
                <Summarizer content={selectedDocument ? "Sample document content for summarization" : ""} />
              </TabsContent>

              <TabsContent value="knowledge-graph">
                <KnowledgeGraph content={selectedDocument ? "Sample document content for knowledge graph" : ""} />
              </TabsContent>

              <TabsContent value="quiz">
                <QuizGenerator content={selectedDocument ? "Sample document content for quiz generation" : ""} />
              </TabsContent>
            </Tabs>
          </div>
        </>
      )}
    </div>
  )
}

