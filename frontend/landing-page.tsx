import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, Video, FileText, Sparkles, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#1e2761] text-white">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="bg-[#f9e94e] p-3 rounded-md">
              <h1 className="text-[#1e2761] text-4xl md:text-5xl font-bold tracking-tight">DONS HACK</h1>
            </div>
            <div className="bg-[#7de2d1] px-3 py-2 rounded text-[#1e2761] text-lg font-bold">LEARNING TOOLS</div>
          </div>
          <p className="text-xl text-[#7de2d1] max-w-2xl mx-auto">
            Accessibility-focused tools to enhance your learning experience
          </p>
        </header>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          <Card className="bg-[#2a3270] border-[#7de2d1] hover:shadow-lg hover:shadow-[#7de2d1]/20 transition-all">
            <CardHeader className="bg-[#7de2d1] text-[#1e2761]">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Mic className="h-6 w-6" /> Speech-to-Text Notes
              </CardTitle>
              <CardDescription className="text-[#1e2761]/70 font-medium">
                Convert lectures to text notes in real-time
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div className="bg-[#1e2761]/40 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#f9e94e] rounded-full p-2 mt-1">
                      <FileText className="h-4 w-4 text-[#1e2761]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f9e94e]">Intelligent Note-Taking</h3>
                      <p className="text-white/80 text-sm mt-1">
                        Choose between detailed notes or big-picture bullet points
                      </p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1e2761]/40 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#f9e94e] rounded-full p-2 mt-1">
                      <Mic className="h-4 w-4 text-[#1e2761]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f9e94e]">Voice Recording</h3>
                      <p className="text-white/80 text-sm mt-1">
                        Capture lectures and discussions with one-click recording
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2a3270] z-10"></div>
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Speech to Text Interface Preview"
                    width={400}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/speech-to-text" className="w-full">
                <Button className="w-full bg-[#f9e94e] text-[#1e2761] hover:bg-[#e9d93e]">
                  Open Notes Tool <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>

          <Card className="bg-[#2a3270] border-[#7de2d1] hover:shadow-lg hover:shadow-[#7de2d1]/20 transition-all">
            <CardHeader className="bg-[#7de2d1] text-[#1e2761]">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <Video className="h-6 w-6" /> Video Summarizer
              </CardTitle>
              <CardDescription className="text-[#1e2761]/70 font-medium">
                AI-powered video content summarization
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 pb-4">
              <div className="space-y-4">
                <div className="bg-[#1e2761]/40 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#f9e94e] rounded-full p-2 mt-1">
                      <Video className="h-4 w-4 text-[#1e2761]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f9e94e]">Video Library</h3>
                      <p className="text-white/80 text-sm mt-1">Access educational videos from various APIs</p>
                    </div>
                  </div>
                </div>

                <div className="bg-[#1e2761]/40 p-4 rounded-lg">
                  <div className="flex items-start gap-3">
                    <div className="bg-[#f9e94e] rounded-full p-2 mt-1">
                      <Sparkles className="h-4 w-4 text-[#1e2761]" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-[#f9e94e]">AI Summaries</h3>
                      <p className="text-white/80 text-sm mt-1">
                        Get concise summaries of video content using LLM technology
                      </p>
                    </div>
                  </div>
                </div>

                <div className="relative h-40 w-full overflow-hidden rounded-lg">
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#2a3270] z-10"></div>
                  <Image
                    src="/placeholder.svg?height=200&width=400"
                    alt="Video Summarizer Preview"
                    width={400}
                    height={200}
                    className="object-cover w-full h-full"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Link href="/video-summarizer" className="w-full">
                <Button className="w-full bg-[#f9e94e] text-[#1e2761] hover:bg-[#e9d93e]">
                  Open Video Summarizer <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>

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

