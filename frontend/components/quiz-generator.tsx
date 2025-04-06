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

interface Question {
  id: number
  question: string
  type: "true_false" | "multiple_choice" | "multi_select"
  difficulty: string
  explanation: string
  correct_answer?: boolean | number
  correct_answers?: number[]
  options?: string[]
}

interface QuizGeneratorProps {
  content: string
}

export default function QuizGenerator({ content }: QuizGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [quizQuestions, setQuizQuestions] = useState<Question[]>([])
  const [userAnswers, setUserAnswers] = useState<Record<number, boolean | number | number[]>>({})
  const [showResults, setShowResults] = useState(false)

  const handleGenerate = async () => {
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

    try {
      const response = await fetch('https://donnote-427348651859.us-west1.run.app/api/generate-questions-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text: content,
          num_questions: 8
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to generate questions')
      }

      const data = await response.json()
      setQuizQuestions(data.questions)
      toast({
        title: "Quiz generated",
        description: `Generated ${data.questions.length} questions successfully.`,
      })
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate quiz questions.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const handleAnswerChange = (questionId: number, answer: boolean | number | number[]) => {
    setUserAnswers({
      ...userAnswers,
      [questionId]: answer,
    })
  }

  const handleMultiSelectChange = (questionId: number, optionIndex: number) => {
    const currentAnswers = (userAnswers[questionId] as number[]) || []
    const newAnswers = currentAnswers.includes(optionIndex)
      ? currentAnswers.filter(a => a !== optionIndex)
      : [...currentAnswers, optionIndex].sort((a, b) => a - b)
    
    handleAnswerChange(questionId, newAnswers)
  }

  const isAnswerCorrect = (question: Question, userAnswer: boolean | number | number[] | undefined): boolean => {
    if (!userAnswer) return false
    
    if (question.type === "multi_select") {
      const correctAnswers = question.correct_answers || []
      const userAnswers = userAnswer as number[]
      return (
        correctAnswers.length === userAnswers.length &&
        correctAnswers.every(a => userAnswers.includes(a))
      )
    }
    
    return userAnswer === question.correct_answer
  }

  const handleSubmitQuiz = () => {
    setShowResults(true)

    const correctAnswers = quizQuestions.filter(q => 
      isAnswerCorrect(q, userAnswers[q.id])
    ).length

    const totalQuestions = quizQuestions.length

    toast({
      title: "Quiz submitted",
      description: `You got ${correctAnswers} out of ${totalQuestions} questions correct.`,
    })
  }

  const handleDownload = () => {
    const quizContent = quizQuestions.map((q, index) => {
      const userAnswer = userAnswers[q.id]
      const isCorrect = isAnswerCorrect(q, userAnswer)
      
      let answerText = ''
      if (q.type === 'true_false') {
        answerText = `Your answer: ${userAnswer ? 'True' : 'False'}\nCorrect answer: ${q.correct_answer ? 'True' : 'False'}`
      } else if (q.type === 'multiple_choice' && q.options) {
        answerText = `Your answer: ${q.options[userAnswer as number]}\nCorrect answer: ${q.options[q.correct_answer as number]}`
      } else if (q.type === 'multi_select' && q.options) {
        const userAnswers = (userAnswer as number[] || []).map(i => q.options![i]).join(', ')
        const correctAnswers = (q.correct_answers || []).map(i => q.options![i]).join(', ')
        answerText = `Your answers: ${userAnswers}\nCorrect answers: ${correctAnswers}`
      }

      return `
Question ${index + 1}: ${q.question}
Type: ${q.type}
Difficulty: ${q.difficulty}
${q.options ? '\nOptions:\n' + q.options.map((opt, i) => `${i + 1}. ${opt}`).join('\n') : ''}
${showResults ? `\n${answerText}\nExplanation: ${q.explanation}` : ''}
-------------------`
    }).join('\n\n')

    const blob = new Blob([quizContent], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'quiz.txt'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Download complete",
      description: "Quiz has been downloaded as a text file.",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Quiz Generator</CardTitle>
        <CardDescription>Test your knowledge with AI-generated questions</CardDescription>
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
              <>
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Quiz
              </>
            )}
          </Button>
        </div>

        {quizQuestions.length > 0 && (
          <div className="space-y-6">
            {quizQuestions.map((question, index) => (
              <div key={question.id} className="border rounded-md p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">Question {index + 1}: {question.question}</h3>
                  <span className={`text-xs px-2 py-1 rounded ${
                    question.difficulty === 'easy' ? 'bg-green-100 text-green-800' :
                    question.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                  }`}>
                    {question.difficulty}
                  </span>
                </div>

                {question.type === "true_false" && (
                  <RadioGroup
                    value={userAnswers[question.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, value === "true")}
                    disabled={showResults}
                    className="space-y-2"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="true" id={`${question.id}-true`} />
                      <Label htmlFor={`${question.id}-true`}>True</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="false" id={`${question.id}-false`} />
                      <Label htmlFor={`${question.id}-false`}>False</Label>
                    </div>
                  </RadioGroup>
                )}

                {question.type === "multiple_choice" && question.options && (
                  <RadioGroup
                    value={userAnswers[question.id]?.toString() || ""}
                    onValueChange={(value) => handleAnswerChange(question.id, parseInt(value))}
                    disabled={showResults}
                    className="space-y-2"
                  >
                    {question.options.map((option, optionIndex) => (
                      <div key={optionIndex} className="flex items-center space-x-2">
                        <RadioGroupItem value={optionIndex.toString()} id={`${question.id}-${optionIndex}`} />
                        <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                      </div>
                    ))}
                  </RadioGroup>
                )}

                {question.type === "multi_select" && question.options && (
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isSelected = (userAnswers[question.id] as number[] || []).includes(optionIndex)
                      return (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`${question.id}-${optionIndex}`}
                            checked={isSelected}
                            onChange={() => handleMultiSelectChange(question.id, optionIndex)}
                            disabled={showResults}
                            className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                          />
                          <Label htmlFor={`${question.id}-${optionIndex}`}>{option}</Label>
                        </div>
                      )
                    })}
                  </div>
                )}

                {showResults && (
                  <div className="mt-4 p-3 bg-gray-50 rounded-md">
                    <p className={`text-sm font-medium ${
                      isAnswerCorrect(question, userAnswers[question.id])
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {isAnswerCorrect(question, userAnswers[question.id]) ? 'Correct!' : 'Incorrect'}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{question.explanation}</p>
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

