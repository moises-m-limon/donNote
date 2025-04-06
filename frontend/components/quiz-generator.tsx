"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Download, RefreshCw, CheckCircle2 } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface QuizGeneratorProps {
  content: string
}

export default function QuizGenerator({ content }: QuizGeneratorProps) {
  const [quizType, setQuizType] = useState("multiple-choice")
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<any[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<string, string>>({})
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = () => {
    if (!content) {
      toast({
        title: "No content for quiz",
        description: "Please add some content first.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)
    setQuizQuestions([])
    setUserAnswers({})
    setShowResults(false)

    // Simulate API call
    setTimeout(() => {
      let generatedQuestions = []

      if (quizType === "multiple-choice") {
        generatedQuestions = [
          {
            id: "q1",
            question: "What is the main purpose of this application?",
            options: [
              { id: "a", text: "Video editing" },
              { id: "b", text: "Note-taking and summarization" },
              { id: "c", text: "Social networking" },
              { id: "d", text: "Gaming" },
            ],
            correctAnswer: "b",
          },
          {
            id: "q2",
            question: "Which feature allows for converting speech to text?",
            options: [
              { id: "a", text: "Knowledge Graph" },
              { id: "b", text: "Quiz Generator" },
              { id: "c", text: "Voice to Text" },
              { id: "d", text: "Summarizer" },
            ],
            correctAnswer: "c",
          },
          {
            id: "q3",
            question: "What does the Knowledge Graph feature do?",
            options: [
              { id: "a", text: "Creates quizzes" },
              { id: "b", text: "Records audio" },
              { id: "c", text: "Visualizes relationships between concepts" },
              { id: "d", text: "Translates text" },
            ],
            correctAnswer: "c",
          },
        ]
      } else if (quizType === "open-ended") {
        generatedQuestions = [
          {
            id: "q1",
            question: "Explain the main purpose of this application and how it can help students.",
            sampleAnswer:
              "This application is designed for intelligent note-taking and study assistance. It helps students by transcribing lectures, summarizing content, visualizing knowledge, and generating quizzes for better retention.",
          },
          {
            id: "q2",
            question: "Describe how the Knowledge Graph feature works and its benefits.",
            sampleAnswer:
              "The Knowledge Graph feature creates visual representations of concepts and their relationships. It helps students understand connections between ideas, identify key concepts, and remember information through visual learning.",
          },
        ]
      } else if (quizType === "mixed") {
        generatedQuestions = [
          {
            id: "q1",
            type: "multiple-choice",
            question: "Which integration does the application support?",
            options: [
              { id: "a", text: "Google Classroom" },
              { id: "b", text: "Microsoft Teams" },
              { id: "c", text: "Canvas LMS" },
              { id: "d", text: "Blackboard" },
            ],
            correctAnswer: "c",
          },
          {
            id: "q2",
            type: "open-ended",
            question: "Explain how the voice navigation feature enhances accessibility.",
            sampleAnswer:
              "The voice navigation feature enhances accessibility by allowing users to control the application using voice commands. This is particularly helpful for users with mobility impairments or those who prefer hands-free operation.",
          },
        ]
      }

      setQuizQuestions(generatedQuestions)
      setIsGenerating(false)

      toast({
        title: "Quiz generated",
        description: `${quizType
          .split("-")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")} quiz created successfully.`,
      })
    }, 1500)
  }

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    })
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)

    const correctAnswers = quizQuestions.filter((q) => q.correctAnswer && userAnswers[q.id] === q.correctAnswer).length

    const totalQuestions = quizQuestions.filter((q) => q.correctAnswer).length

    toast({
      title: "Quiz submitted",
      description: `You got ${correctAnswers} out of ${totalQuestions} questions correct.`,
    })
  }

  const handleDownload = () => {
    toast({
      title: "Download started",
      description: "Quiz has been downloaded as a PDF.",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quiz Generator</CardTitle>
        <CardDescription>Create quizzes to test your knowledge</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center space-x-2 mb-4">
          <Tabs defaultValue={quizType} onValueChange={setQuizType} className="w-full">
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="multiple-choice" className="text-xs">
                Multiple Choice
              </TabsTrigger>
              <TabsTrigger value="open-ended" className="text-xs">
                Open Ended
              </TabsTrigger>
              <TabsTrigger value="mixed" className="text-xs">
                Mixed
              </TabsTrigger>
            </TabsList>
          </Tabs>

          <Button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="bg-primary text-secondary hover:bg-primary/90 whitespace-nowrap"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate
              </>
            )}
          </Button>
        </div>

        {quizQuestions.length > 0 && (
          <div className="space-y-6">
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-md p-4">
                <h3 className="font-medium mb-2">
                  Question {index + 1}: {question.question}
                </h3>

                {(question.type === "multiple-choice" || !question.type) && question.options && (
                  <RadioGroup
                    value={userAnswers[question.id] || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value)}
                    disabled={showResults}
                  >
                    <div className="space-y-2">
                      {question.options.map((option: any) => (
                        <div key={option.id} className="flex items-center space-x-2">
                          <RadioGroupItem value={option.id} id={`${question.id}-${option.id}`} />
                          <Label htmlFor={`${question.id}-${option.id}`} className="flex-1">
                            {option.text}
                          </Label>
                          {showResults && question.correctAnswer === option.id && (
                            <CheckCircle2 className="h-4 w-4 text-green-500" />
                          )}
                        </div>
                      ))}
                    </div>
                  </RadioGroup>
                )}

                {(question.type === "open-ended" || (!question.type && !question.options)) && (
                  <div className="space-y-2">
                    <Textarea
                      placeholder="Type your answer here..."
                      value={userAnswers[question.id] || ""}
                      onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                      disabled={showResults}
                      className="min-h-[100px]"
                    />
                    {showResults && (
                      <div className="mt-2">
                        <p className="text-sm font-medium">Sample Answer:</p>
                        <p className="text-sm text-gray-600">{question.sampleAnswer}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            <div className="flex justify-between">
              <Button
                onClick={handleSubmitQuiz}
                disabled={Object.keys(userAnswers).length !== quizQuestions.length || showResults}
                className="bg-primary text-secondary hover:bg-primary/90"
              >
                Submit Quiz
              </Button>

              <Button variant="outline" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

