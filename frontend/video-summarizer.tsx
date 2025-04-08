"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Video,
  Search,
  Sparkles,
  ArrowLeft,
  Clock,
  BookOpen,
  ListChecks,
  RefreshCw,
  ThumbsUp,
  LogIn,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Define the course type
interface Course {
  id: number;
  name: string;
  course_code: string;
}

// Define the Google user type
interface GoogleUser {
  name: string;
  email: string;
  picture: string;
  sub: string;
}

const url = process.env.DEV === "development" ? "http://127.0.0.1:5000" : "https://donnote-427348651859.us-west1.run.app";

export default function VideoSummarizer() {
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState<Course[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [summary, setSummary] = useState("");
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [summaryType, setSummaryType] = useState("concise");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<GoogleUser | null>(null);

  // Check if user is logged in
  useEffect(() => {
    const storedUser = localStorage.getItem("googleUser");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error("Error parsing stored user:", e);
        setUser(null);
      }
    }
  }, []);

  // Fetch courses from the backend
  useEffect(() => {
    const fetchCourses = async () => {
      // Only fetch courses if user is logged in
      if (!user) {
        setIsLoading(false);
        return;
      }

      try {

        setIsLoading(true);
        const response = await fetch(url + "/api/courses");

        if (!response.ok) {
          throw new Error("Failed to fetch courses");
        }

        const data = await response.json();
        setCourses(data.courses);
        setError(null);
      } catch (err) {
        console.error("Error fetching courses:", err);
        setError("Failed to load courses. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [user]);

  // Filter courses based on search query
  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.course_code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Mock function to generate summary with LLM
  const generateSummary = async () => {
    if (!selectedCourse) return;

    setIsGeneratingSummary(true);

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    // Different summary types
    const summaries = {
      concise: `This course ${selectedCourse.name} provides a comprehensive introduction to ${selectedCourse.course_code}. The key points covered include fundamental concepts, practical applications, and recent developments in the field. The instructor explains complex ideas in an accessible way, making it suitable for beginners while still offering valuable insights for those with some background knowledge.`,

      detailed: `This course ${selectedCourse.name} delivers an in-depth exploration of the subject matter. The content is structured in a logical progression, beginning with foundational concepts and building toward more complex applications. The instructor uses clear examples and visual aids to illustrate key points.\n\nMajor topics covered include:\n• Historical context and development of the field\n• Core theoretical frameworks and principles\n• Practical applications in various industries\n• Current research directions and future possibilities\n\nThe course effectively balances technical accuracy with accessibility, making it valuable for both students and professionals looking to expand their knowledge.`,

      bullets: `• ${selectedCourse.name} covers fundamental concepts and principles\n• The course explains both theoretical foundations and practical applications\n• Key terminology and frameworks are clearly defined\n• Real-world examples demonstrate practical relevance\n• Current trends and future directions are briefly discussed\n• The presentation style is clear and accessible for beginners\n• Advanced learners will still find valuable insights and perspectives\n• Course code: ${selectedCourse.course_code}`,
    };

    setSummary(summaries[summaryType as keyof typeof summaries]);
    setIsGeneratingSummary(false);
  };

  return (
    <div className="min-h-screen bg-[#1e2761] text-white p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="flex items-center gap-2 mb-4 md:mb-0">
            <div className="bg-[#f9e94e] p-2 rounded-md">
              <h1 className="text-[#1e2761] text-2xl md:text-3xl font-bold tracking-tight">
                DONS HACK
              </h1>
            </div>
            <div className="bg-[#7de2d1] px-2 py-1 rounded text-[#1e2761] text-xs font-bold">
              COURSE SUMMARIZER
            </div>
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

        {!user ? (
          // Not logged in view
          <div className="flex flex-col items-center justify-center py-16">
            <div className="bg-[#2a3270] border-[#7de2d1] p-8 rounded-lg max-w-md w-full text-center">
              <LogIn className="h-16 w-16 mx-auto text-[#7de2d1] mb-4" />
              <h2 className="text-2xl font-bold mb-2">Please Log In</h2>
              <p className="text-white/70 mb-6">
                You need to be logged in with your Google account to view your
                courses.
              </p>
              <Link href="/">
                <Button className="bg-[#f9e94e] text-[#1e2761] hover:bg-[#e9d93e]">
                  Go to Login Page
                </Button>
              </Link>
            </div>
          </div>
        ) : !selectedCourse ? (
          // Course selection view
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search for courses..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 bg-[#2a3270] border-[#7de2d1] text-white"
                />
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-12">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-[#7de2d1]" />
                <p className="mt-4 text-[#7de2d1]">Loading courses...</p>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <p className="text-red-400">{error}</p>
                <Button
                  className="mt-4 bg-[#7de2d1] text-[#1e2761] hover:bg-[#6dd2c1]"
                  onClick={() => window.location.reload()}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            ) : filteredCourses.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#7de2d1]">
                  No courses found matching your search.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCourses.map((course) => (
                  <Card
                    key={course.id}
                    className="bg-[#2a3270] border-[#7de2d1] overflow-hidden hover:shadow-md hover:shadow-[#7de2d1]/20 cursor-pointer transition-all"
                    onClick={() => setSelectedCourse(course)}
                  >
                    <div className="relative">
                      <Image
                        src="/placeholder.svg"
                        alt={course.name}
                        width={350}
                        height={200}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute bottom-2 right-2 bg-[#1e2761]/80 px-2 py-1 rounded text-xs flex items-center">
                        <BookOpen className="h-3 w-3 mr-1" />
                        {course.course_code}
                      </div>
                    </div>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{course.name}</CardTitle>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            )}
          </div>
        ) : (
          // Course summary view
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-4">
              <Card className="bg-[#2a3270] border-[#7de2d1] overflow-hidden">
                <div className="relative aspect-video bg-black">
                  <Image
                    src="/placeholder.svg"
                    alt={selectedCourse.name}
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
                      <CardTitle>{selectedCourse.name}</CardTitle>
                      <p className="text-sm text-[#7de2d1] mt-1">
                        {selectedCourse.course_code}
                      </p>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-[#7de2d1] text-[#7de2d1] hover:bg-[#7de2d1] hover:text-[#1e2761]"
                      onClick={() => setSelectedCourse(null)}
                    >
                      Back to Courses
                    </Button>
                  </div>
                </CardHeader>
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
                      <label className="text-sm font-medium mb-2 block text-[#7de2d1]">
                        Summary Type
                      </label>
                      <Tabs
                        value={summaryType}
                        onValueChange={setSummaryType}
                        className="w-full"
                      >
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
                          <h3 className="font-semibold text-[#f9e94e] mb-2">
                            Summary
                          </h3>
                          <div className="text-white/90 text-sm whitespace-pre-line">
                            {summary}
                          </div>
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
  );
}
