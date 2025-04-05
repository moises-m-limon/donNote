"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Video, Search, Sparkles, ArrowLeft, Clock, BookOpen, ListChecks, RefreshCw, ThumbsUp } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

// Mock video data - in a real app, this would come from an API
const MOCK_VIDEOS = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "12:34",
    source: "Educational Videos API",
    description: "Learn the basics of machine learning algorithms and applications.",
  },
  {
    id: "2",
    title: "Understanding Quantum Computing",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "18:22",
    source: "Educational Videos API",
    description: "An overview of quantum computing principles and future applications.",
  },
  {
    id: "3",
    title: "The History of the Internet",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "15:45",
    source: "Educational Videos API",
    description: "Explore how the internet evolved from ARPANET to the modern web.",
  },
  {
    id: "4",
    title: "Climate Science Explained",
    thumbnail: "/placeholder.svg?height=200&width=350",
    duration: "21:18",
    source: "Educational Videos API",
    description: "Understanding the science behind climate change and global warming.",
  },
]

export default function VideoSummarizer() {
  const [searchQuery, setSearchQuery] = useState("")
  const [videos, setVideos] = useState(MOCK_VIDEOS)
  const [selectedVideo, setSelectedVideo] = useState<(typeof MOCK_VIDEOS)[0] | null>(null)
  const [summary, setSummary] = useState("")
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false)
  const [summaryType, setSummaryType] = useState("concise")

  // Filter videos based on search query
  const filteredVideos = videos.filter(
    (video) =>
      video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      video.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Mock function to generate summary with LLM
  const generateSummary = async () => {
    if (!selectedVideo) return

    setIsGeneratingSummary(true)

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Different summary types
    const summaries = {
      concise: `This video provides a comprehensive introduction to ${selectedVideo.title.toLowerCase()}. The key points covered include fundamental concepts, practical applications, and recent developments in the field. The presenter explains complex ideas in an accessible way, making it suitable for beginners while still offering valuable insights for those with some background knowledge.`,

      detailed: `This ${selectedVideo.duration} video on ${selectedVideo.title} delivers an in-depth exploration of the subject matter. The content is structured in a logical progression, beginning with foundational concepts and building toward more complex applications. The presenter uses clear examples and visual aids to illustrate key points.\n\nMajor topics covered include:\n• Historical context and development of the field\n• Core theoretical frameworks and principles\n• Practical applications in various industries\n• Current research directions and future possibilities\n\nThe video effectively balances technical accuracy with accessibility, making it valuable for both students and professionals looking to expand their knowledge.`,

      bullets: `• ${selectedVideo.title} covers fundamental concepts and principles\n• The video explains both theoretical foundations and practical applications\n• Key terminology and frameworks are clearly defined\n• Real-world examples demonstrate practical relevance\n• Current trends and future directions are briefly discussed\n• The presentation style is clear and accessible for beginners\n• Advanced viewers will still find valuable insights and perspectives\n• Total duration: ${selectedVideo.duration}, with the most critical content in the middle section`,
    }

    setSummary(summaries[summaryType as keyof typeof summaries])
    setIsGeneratingSummary(false)
  }

  return (
    <div className="min-h-screen bg-[#1e2761] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-[#f9e94e] p-2 rounded-md">
              <h1 className="text-[#1e2761] text-2xl md:text-3xl font-bold tracking-tight">DONS HACK</h1>
            </div>
            <div className="bg-[#7de2d1] px-2 py-1 rounded text-[#1e2761] text-xs font-bold">VIDEO SUMMARIZER</div>
          </div>
          <div className="flex gap-2">
            <Link href="/">
              <Button
                variant="outline"
                className="border-[#7de2d1] text-[#7de2d1] hover:bg-[#7de2d1] hover:text-[#1e2761]"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </div>
        </header>

        {!selectedVideo ? (
          // Video selection view
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for videos..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#2a3270] border-[#7de2d1] text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredVideos.map((video) => (
                <Card
                  key={video.id}
                  className="bg-[#2a3270] border-[#7de2d1] overflow-hidden hover:shadow-md hover:shadow-[#7de2d1]/20 cursor-pointer transition-all"
                  onClick={() => setSelectedVideo(video)}
                >
                  <div className="relative">
                    <Image
                      src={video.thumbnail || "/placeholder.svg"}
                      alt={video.title}
                      width={350}
                      height={200}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute bottom-2 right-2 bg-[#1e2761]/80 px-2 py-1 rounded text-xs flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {video.duration}
                    </div>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{video.title}</CardTitle>
                    <p className="text-xs text-[#7de2d1]">{video.source}</p>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-300 line-clamp-2">{video.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          // Video player and summary view
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-[#2a3270] border-[#7de2d1] overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <Image
                    src={selectedVideo.thumbnail || "/placeholder.svg"}
                    alt={selectedVideo.title}
                    fill
                    className="object-contain"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Video className="h-16 w-16 text-[#7de2d1]/50" />
                  </div>
                </div>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle>{selectedVideo.title}</CardTitle>
                      <p className="text-sm text-[#7de2d1] mt-1">
                        {selectedVideo.source} • {selectedVideo.duration}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#7de2d1] text-[#7de2d1] hover:bg-[#7de2d1] hover:text-[#1e2761]"
                      onClick={() => setSelectedVideo(null)}
                    >
                      Back to Videos
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-300">{selectedVideo.description}</p>
                </CardContent>
              </Card>
            </div>

            <div className="space-y-4">
              <Card className="bg-[#2a3270] border-[#7de2d1]">
                <CardHeader className="bg-[#7de2d1] text-[#1e2761]">
                  <CardTitle className="text-lg font-bold flex items-center gap-2">
                    <Sparkles className="h-5 w-5" /> AI Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block text-[#7de2d1]">Summary Type</label>
                      <Tabs value={summaryType} onValueChange={setSummaryType} className="w-full">
                        <TabsList className="bg-[#1e2761]/20 w-full grid grid-cols-3">
                          <TabsTrigger
                            value="concise"
                            className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                          >
                            <BookOpen className="h-4 w-4 mr-1" />
                            Concise
                          </TabsTrigger>
                          <TabsTrigger
                            value="detailed"
                            className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                          >
                            <ListChecks className="h-4 w-4 mr-1" />
                            Detailed
                          </TabsTrigger>
                          <TabsTrigger
                            value="bullets"
                            className="data-[state=active]:bg-[#f9e94e] data-[state=active]:text-[#1e2761]"
                          >
                            <ListChecks className="h-4 w-4 mr-1" />
                            Bullets
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>
                    </div>

                    <Button
                      className="w-full bg-[#f9e94e] text-[#1e2761] hover:bg-[#e9d93e]"
                      onClick={generateSummary}
                      disabled={isGeneratingSummary}
                    >
                      {isGeneratingSummary ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Sparkles className="mr-2 h-4 w-4" />
                          Generate Summary
                        </>
                      )}
                    </Button>

                    {summary && (
                      <div className="mt-4">
                        <div className="bg-[#1e2761]/40 p-4 rounded-lg">
                          <h3 className="font-semibold text-[#f9e94e] mb-2">Summary</h3>
                          <div className="text-white/90 text-sm whitespace-pre-line">{summary}</div>
                        </div>
                        <div className="flex justify-end mt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-[#7de2d1] hover:text-[#7de2d1] hover:bg-[#7de2d1]/10"
                          >
                            <ThumbsUp className="h-4 w-4 mr-1" />
                            Helpful
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        <footer className="mt-16 text-center text-[#7de2d1] text-sm">
          <p>
            <Sparkles className="inline h-4 w-4 mr-1" />
            Powered by #CampusTech *WIT* & *ACM* | 04/04 - 04/06
          </p>
        </footer>
      </div>
    </div>
  )
}

