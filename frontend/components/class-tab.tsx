"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Upload, BrainCircuit, FileQuestion, Key, BookOpen, MoreVertical, ChevronLeft, FileIcon, Calendar, Clock, HardDrive } from "lucide-react"
import KnowledgeGraph from "@/components/knowledge-graph"
import QuizGenerator from "@/components/quiz-generator"
import Summarizer from "@/components/summarizer"
import { toast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Skeleton } from "@/components/ui/skeleton"

interface Course {
  id: string;
  name: string;
  course_code: string;
}

interface CourseFile {
  id: string;
  name: string;
  url: string;
  size: number;
  content_type: string;
  created_at: string;
  updated_at: string;
  folder_path: string;
}

const CourseCardSkeleton = () => (
  <Card className="bg-accent/50 relative min-h-[200px] flex flex-col justify-between animate-pulse">
    <CardHeader>
      <Skeleton className="h-6 w-3/4 mb-2" />
      <Skeleton className="h-4 w-1/2 mb-1" />
      <Skeleton className="h-4 w-1/3" />
    </CardHeader>
    <CardContent className="flex gap-4">
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
      <Skeleton className="h-8 w-8" />
    </CardContent>
  </Card>
)

const FileListSkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <Card key={i} className="animate-pulse">
        <CardContent className="flex items-center p-4">
          <Skeleton className="h-8 w-8 mr-4" />
          <div className="flex-1">
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <Skeleton className="h-5 w-48" />
                <Skeleton className="h-4 w-32" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

export default function ClassTab() {
  const [accessToken, setAccessToken] = useState("")
  const [hasToken, setHasToken] = useState(false)
  const [selectedClass, setSelectedClass] = useState<Course | null>(null)
  const [selectedDocument, setSelectedDocument] = useState("")
  const [activeWidget, setActiveWidget] = useState<string | null>(null)
  const [courses, setCourses] = useState<Course[]>([])
  const [courseFiles, setCourseFiles] = useState<CourseFile[]>([])
  const [displayedFiles, setDisplayedFiles] = useState<CourseFile[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingFiles, setIsLoadingFiles] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [page, setPage] = useState(1)
  const observerTarget = useRef<HTMLDivElement>(null)
  const ITEMS_PER_PAGE = 20
  const FILE_CARD_HEIGHT = 88 // height of each file card in pixels

  const loadMoreFiles = useCallback(() => {
    const startIndex = (page - 1) * ITEMS_PER_PAGE
    const endIndex = startIndex + ITEMS_PER_PAGE
    const newFiles = courseFiles.slice(startIndex, endIndex)
    
    if (newFiles.length > 0) {
      setDisplayedFiles(prev => [...prev, ...newFiles])
      setPage(prev => prev + 1)
    }
  }, [courseFiles, page])

  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && !isLoadingMore && displayedFiles.length < courseFiles.length) {
          setIsLoadingMore(true)
          loadMoreFiles()
          setIsLoadingMore(false)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [loadMoreFiles, isLoadingMore, displayedFiles.length, courseFiles.length])

  useEffect(() => {
    if (hasToken) {
      fetchCourses()
    }
  }, [hasToken])

  const fetchCourses = async () => {
    setIsLoading(true)
    try {
      const baseUrl = 'https://donnote-427348651859.us-west1.run.app'
      
      const response = await fetch(`${baseUrl}/api/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: accessToken,
          url: "https://canvas.instructure.com"
        })
      })
      const data = await response.json()
      if (data.courses) {
        setCourses(data.courses)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch courses. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const fetchCourseFiles = async (courseId: string) => {
    setIsLoadingFiles(true)
    try {
      const baseUrl = 'https://donnote-427348651859.us-west1.run.app'
      
      const response = await fetch(`${baseUrl}/api/courses/${courseId}/files`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          token: accessToken,
          url: "https://canvas.instructure.com"
        })
      })
      const data = await response.json()
      if (data.files) {
        setCourseFiles(data.files)
        setDisplayedFiles(data.files.slice(0, ITEMS_PER_PAGE))
        setPage(2)
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch course files. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoadingFiles(false)
    }
  }

  const handleClassClick = (course: Course) => {
    setSelectedClass(course)
    fetchCourseFiles(course.id)
  }

  const formatFileSize = (bytes: number) => {
    const units = ['B', 'KB', 'MB', 'GB']
    let size = bytes
    let unitIndex = 0
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024
      unitIndex++
    }
    
    return `${size.toFixed(1)} ${units[unitIndex]}`
  }

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

  // Array of background colors for course cards
  const cardColors = [
    "bg-[#2E7D32]", // Green
    "bg-[#5E35B1]", // Purple
    "bg-[#C2185B]", // Pink
    "bg-[#1976D2]", // Blue
    "bg-[#8D6E63]", // Brown
  ]

  return (
    <div className="flex flex-col h-full p-4 overflow-auto">
      {!hasToken ? (
        <Card className="bg-[#2a3270] border-[#7de2d1]">
          <CardHeader className="pb-2">
            <CardTitle className="text-[#f9e94e]">Canvas LMS Integration</CardTitle>
            <CardDescription className="text-[#f9e94e]">Enter your Canvas LMS access token to connect to your classes.</CardDescription>
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
              <Button onClick={saveToken} className="border-[#7de2d1] bg-[#7de2d1] text-[#1e2761] hover:bg-[#f9e94e] hover:text-[#1e2761]">
                <Key className="mr-2 h-4 w-4" />
                Connect
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <>
          {selectedClass ? (
            <div>
              <div className="flex items-center mb-6">
                <Button 
                  variant="ghost" 
                  className="mr-4 text-[#7de2d1] hover:bg-[#7de2d1]/10"
                  onClick={() => {
                    setSelectedClass(null)
                    setCourseFiles([])
                    setDisplayedFiles([])
                    setPage(1)
                  }}
                >
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Back to Courses
                </Button>
                <h1 className="text-2xl font-bold text-[#7de2d1]">{selectedClass.name}</h1>
              </div>

              {isLoadingFiles ? (
                <div className="h-[352px] overflow-hidden">
                  <FileListSkeleton />
                </div>
              ) : courseFiles.length > 0 ? (
                <div className="h-[352px] overflow-y-auto scrollbar-thin scrollbar-thumb-[#7de2d1]/20 scrollbar-track-transparent">
                  <div className="space-y-4">
                    {displayedFiles.map((file) => (
                      <Card 
                        key={file.id}
                        className="hover:bg-[#7de2d1]/5 transition-colors cursor-pointer border-[#7de2d1]/20 group"
                        onClick={() => setSelectedDocument(file.id)}
                      >
                        <CardContent className="flex items-center p-4">
                          <div className="mr-4">
                            <FileIcon className="h-8 w-8 text-black group-hover:text-[#7de2d1]" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3 className="font-medium truncate text-black group-hover:text-[#7de2d1]">{file.name}</h3>
                                <p className="text-sm text-black/60 group-hover:text-[#7de2d1]/60 truncate">{file.folder_path}</p>
                              </div>
                              <div className="flex items-center space-x-4 text-sm text-black/60 group-hover:text-[#7de2d1]/60">
                                <div className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  {format(new Date(file.created_at), 'MMM d, yyyy')}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {format(new Date(file.updated_at), 'h:mm a')}
                                </div>
                                <div className="flex items-center">
                                  <HardDrive className="h-4 w-4 mr-1" />
                                  {formatFileSize(file.size)}
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                    {displayedFiles.length < courseFiles.length && (
                      <div ref={observerTarget} className="h-8 flex items-center justify-center">
                        {isLoadingMore && (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-[#7de2d1]"></div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#7de2d1]/60">No files found in this course.</p>
                </div>
              )}
            </div>
          ) : (
            <>
              <h1 className="text-3xl font-bold mb-6 text-[#7de2d1]">Dashboard</h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {isLoading ? (
                  <>
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <CourseCardSkeleton key={i} />
                    ))}
                  </>
                ) : courses.length > 0 ? (
                  courses.map((course, index) => (
                    <Card 
                      key={course.id}
                      className={`${cardColors[index % cardColors.length]} text-white hover:shadow-lg transition-shadow cursor-pointer relative min-h-[200px] flex flex-col justify-between`}
                      onClick={() => handleClassClick(course)}
                    >
                      <Button 
                        variant="ghost" 
                        className="absolute top-2 right-2 text-white hover:bg-white/10"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Add menu handling here
                        }}
                      >
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                      
                      <CardHeader>
                        <CardTitle className="text-xl font-bold">{course.name}</CardTitle>
                        <CardDescription className="text-white/80">{course.course_code}</CardDescription>
                        <div className="text-sm text-white/80 mt-1">Spring 2025</div>
                      </CardHeader>
                      
                      <CardContent className="flex gap-4">
                        <Button variant="ghost" className="text-white hover:bg-white/10" size="sm">
                          <BookOpen className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10" size="sm">
                          <FileQuestion className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" className="text-white hover:bg-white/10" size="sm">
                          <BrainCircuit className="h-4 w-4" />
                        </Button>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <p className="text-[#7de2d1]/60">No courses found. Please check your Canvas integration.</p>
                )}
              </div>
            </>
          )}

          {selectedClass && selectedDocument && (
            <Card className="mt-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <BookOpen className="mr-2 h-5 w-5 text-primary" />
                  {courseFiles.find((f) => f.id === selectedDocument)?.name}
                </CardTitle>
                <CardDescription>
                  From {selectedClass.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
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
                      <TabsTrigger 
                        value="quiz" 
                        className="data-[state=active]:bg-primary data-[state=active]:text-secondary"
                      >
                        <FileQuestion className="mr-2 h-4 w-4" />
                        Generate Quiz
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="summarize">
                      <Summarizer content={selectedDocument ? "Sample document content for summarization" : ""} setNoteContent={() => {}} />
                    </TabsContent>

                    <TabsContent value="knowledge-graph">
                      <KnowledgeGraph content={selectedDocument ? "Sample document content for knowledge graph" : ""} />
                    </TabsContent>

                    <TabsContent value="quiz">
                      <QuizGenerator content={selectedDocument ? "Sample document content for quiz generation" : ""} />
                    </TabsContent>
                  </Tabs>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      )}
    </div>
  )
}

