"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Mic, FileText, Network, BookOpen, BrainCircuit, LogOut, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Script from "next/script"
import { useRouter } from 'next/navigation'

// Define Google credential response type
interface CredentialResponse {
  credential: string
  select_by: string
}

interface GoogleUser {
  name: string
  email: string
  picture: string
  sub: string // Google's user ID
}

interface ToolInfo {
  title: string
  description: string
  icon: React.ReactNode
  color: string
}

export default function LandingPage() {
  const router = useRouter()
  const [user, setUser] = useState<GoogleUser | null>(null)
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const [currentToolIndex, setCurrentToolIndex] = useState(0)

  const tools: ToolInfo[] = [
    {
      title: "Voice to Text",
      description:
        "Capture lectures and discussions with real-time speech recognition that automatically converts audio to organized notes.",
      icon: <Mic className="h-8 w-8" />,
      color: "bg-purple-500",
    },
    {
      title: "Note Summarization",
      description:
        "Transform lengthy notes into concise summaries with AI-powered technology that highlights key concepts and important details.",
      icon: <FileText className="h-8 w-8" />,
      color: "bg-blue-500",
    },
    {
      title: "Knowledge Graph Diagramming",
      description:
        "Visualize complex concepts and their relationships with interactive knowledge graphs that help you understand connections.",
      icon: <Network className="h-8 w-8" />,
      color: "bg-green-500",
    },
    {
      title: "Access to Current Classes",
      description:
        "Seamlessly integrate with your Canvas courses to organize notes, assignments, and resources in one convenient location.",
      icon: <BookOpen className="h-8 w-8" />,
      color: "bg-amber-500",
    },
    {
      title: "Mock Quiz Generations",
      description:
        "Create practice quizzes from your notes with AI-generated questions that test your understanding and help you prepare for exams.",
      icon: <BrainCircuit className="h-8 w-8" />,
      color: "bg-rose-500",
    },
  ]

  // Parse JWT token from Google
  const parseJwt = (token: string) => {
    try {
      return JSON.parse(atob(token.split(".")[1]))
    } catch (e) {
      return null
    }
  }

  // Handle credential response from Google One Tap
  const handleCredentialResponse = useCallback((response: CredentialResponse) => {
    const decodedToken = parseJwt(response.credential)

    if (decodedToken) {
      const { name, email, picture, sub } = decodedToken
      setUser({ name, email, picture, sub })

      // Store in localStorage for persistence
      localStorage.setItem("googleUser", JSON.stringify({ name, email, picture, sub }))
      
      // Redirect to dashboard
      router.push('/dashboard')
    }
  }, [router])

  // Initialize Google One Tap
  const initializeGoogleOneTap = useCallback(() => {
    if (!window.google || !scriptLoaded) return

    try {
      window.google.accounts.id.initialize({
        client_id: process.env.NEXT_PUBLIC_OAUTH_CLIENT_ID,
        callback: handleCredentialResponse,
        auto_select: false,
        cancel_on_tap_outside: true,
      })

      window.google.accounts.id.renderButton(document.getElementById("googleOneTap")!, {
        type: "standard",
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "rectangular",
        logo_alignment: "left",
        width: 250,
      })

      // Also display the One Tap prompt
      if (!user) {
        window.google.accounts.id.prompt()
        //window.location.href = "/dashboard"
      }
    } catch (error) {
      console.error("Error initializing Google One Tap:", error)
    }
  }, [handleCredentialResponse, scriptLoaded, user])

  // Handle sign out
  const handleSignOut = () => {
    if (window.google && scriptLoaded) {
      window.google.accounts.id.disableAutoSelect()
      window.google.accounts.id.revoke(user?.sub || "", () => {
        setUser(null)
        localStorage.removeItem("googleUser")
      
      })
    } else {
      setUser(null)
      localStorage.removeItem("googleUser")
   
    }
  }

  // Check for existing user session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("googleUser")
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser)
        setUser(parsedUser)
        // Redirect to dashboard if already logged in
        router.push('/dashboard')
      } catch (e) {
        localStorage.removeItem("googleUser")
      }
    }
  }, [router])

  // Initialize Google One Tap when script is loaded
  useEffect(() => {
    if (scriptLoaded) {
      initializeGoogleOneTap()
    }
  }, [scriptLoaded, initializeGoogleOneTap])

  const nextTool = () => {
    setCurrentToolIndex((prev) => (prev + 1) % tools.length)
  }

  const prevTool = () => {
    setCurrentToolIndex((prev) => (prev - 1 + tools.length) % tools.length)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 to-purple-900 text-white">
      {/* Google Identity Services Script */}
      <Script
        src="https://accounts.google.com/gsi/client"
        onLoad={() => setScriptLoaded(true)}
        strategy="afterInteractive"
      />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div className="text-teal-400 font-bold text-2xl">Don Note</div>

          {user ? (
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-teal-400 font-medium">{user.name}</p>
                <p className="text-white/70 text-sm">{user.email}</p>
              </div>
              <div className="h-10 w-10 rounded-full overflow-hidden border-2 border-teal-400">
                <Image
                  src={user.picture || "/placeholder.svg"}
                  alt="User avatar"
                  width={40}
                  height={40}
                  className="object-cover"
                />
              </div>
              <Button
                variant="outline"
                size="sm"
                className="border-teal-400 text-teal-400 hover:bg-teal-400 hover:text-indigo-950"
                onClick={handleSignOut}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </div>
          ) : (
            <div id="googleOneTap"></div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-12 mt-16 mb-16 items-center">
          {/* Left side - Main tool info */}
          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-yellow-300">
              Don Note
            </h1>
            <p className="text-xl text-white/90 leading-relaxed">
              A smart, accessible tool designed to revolutionize your learning experience. With Canvas integration and
              AI-powered features, Don Note helps students capture, organize, and understand course content more
              effectively than ever before.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <Button 
                className="bg-teal-400 hover:bg-teal-500 text-indigo-950 font-medium text-lg py-6 px-8"
                onClick={() => user ? router.push('/dashboard') : window.google.accounts.id.prompt()}
              >
                Get Started
              </Button>
            </div>
          </div>

          {/* Right side - Tool pagination */}
          <div>
            <Card className="bg-indigo-900/50 border-teal-400/30 backdrop-blur-sm overflow-hidden">
              <CardContent className="p-0">
                <div className="relative">
                  {/* Tool content */}
                  <div className="p-8 min-h-[400px]">
                    <div
                      className={`${tools[currentToolIndex].color} w-16 h-16 rounded-2xl flex items-center justify-center mb-6`}
                    >
                      {tools[currentToolIndex].icon}
                    </div>
                    <h2 className="text-3xl font-bold mb-4 text-teal-400">{tools[currentToolIndex].title}</h2>
                    <p className="text-white/80 text-lg leading-relaxed">{tools[currentToolIndex].description}</p>
                  </div>

                  {/* Navigation controls */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 flex justify-between items-center">
                    <Button variant="ghost" size="icon" onClick={prevTool} className="text-white hover:bg-white/10">
                      <ChevronLeft className="h-6 w-6" />
                    </Button>

                    <div className="flex gap-2">
                      {tools.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 rounded-full ${
                            index === currentToolIndex ? "bg-teal-400" : "bg-white/30"
                          }`}
                          onClick={() => setCurrentToolIndex(index)}
                        />
                      ))}
                    </div>

                    <Button variant="ghost" size="icon" onClick={nextTool} className="text-white hover:bg-white/10">
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <footer className="mt-16 text-center text-teal-400 text-sm">
          <p>Powered by #CampusTech *WIT* & *ACM* | 04/04 - 04/06</p>
        </footer>
      </div>
    </div>
  )
}

// Add TypeScript declaration for Google Identity Services
declare global {
  interface Window {
    google: {
      accounts: {
        id: {
          initialize: (config: any) => void
          renderButton: (element: HTMLElement, options: any) => void
          prompt: (momentListener?: any) => void
          disableAutoSelect: () => void
          revoke: (hint: string, callback: () => void) => void
        }
      }
    }
  }
}
