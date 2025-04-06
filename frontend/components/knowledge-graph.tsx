"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw } from "lucide-react"
import { toast } from "@/hooks/use-toast"

interface KnowledgeGraphProps {
  content: string
}

export default function KnowledgeGraph({ content }: KnowledgeGraphProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || !content) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw knowledge graph
    drawKnowledgeGraph(ctx, canvas.width, canvas.height)
  }, [content, canvasRef])

  const drawKnowledgeGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Set colors based on theme
    const primaryColor = "#C8CD44"
    const secondaryColor = "#20263B"
    const tertiaryColor = "#6B7280"

    // Center of the canvas
    const centerX = width / 2
    const centerY = height / 2

    // Draw main node
    ctx.beginPath()
    ctx.arc(centerX, centerY, 50, 0, 2 * Math.PI)
    ctx.fillStyle = primaryColor
    ctx.fill()
    ctx.strokeStyle = secondaryColor
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw main node text
    ctx.fillStyle = secondaryColor
    ctx.font = "bold 14px Arial"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText("Main Concept", centerX, centerY)

    // Draw secondary nodes
    const nodeCount = 5
    const radius = 150

    for (let i = 0; i < nodeCount; i++) {
      const angle = (i / nodeCount) * 2 * Math.PI
      const x = centerX + radius * Math.cos(angle)
      const y = centerY + radius * Math.sin(angle)

      // Draw connection line
      ctx.beginPath()
      ctx.moveTo(centerX, centerY)
      ctx.lineTo(x, y)
      ctx.strokeStyle = tertiaryColor
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Draw secondary node
      ctx.beginPath()
      ctx.arc(x, y, 30, 0, 2 * Math.PI)
      ctx.fillStyle = secondaryColor
      ctx.fill()

      // Draw secondary node text
      ctx.fillStyle = "white"
      ctx.font = "12px Arial"
      ctx.fillText(`Concept ${i + 1}`, x, y)

      // Draw tertiary nodes
      if (i % 2 === 0) {
        const tertiaryCount = 2
        const tertiaryRadius = 60

        for (let j = 0; j < tertiaryCount; j++) {
          const tertiaryAngle = angle + (((j + 0.5) / tertiaryCount - 0.5) * Math.PI) / 2
          const tx = x + tertiaryRadius * Math.cos(tertiaryAngle)
          const ty = y + tertiaryRadius * Math.sin(tertiaryAngle)

          // Draw connection line
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(tx, ty)
          ctx.strokeStyle = tertiaryColor
          ctx.lineWidth = 1
          ctx.stroke()

          // Draw tertiary node
          ctx.beginPath()
          ctx.arc(tx, ty, 20, 0, 2 * Math.PI)
          ctx.fillStyle = "#E5E7EB"
          ctx.fill()
          ctx.strokeStyle = tertiaryColor
          ctx.lineWidth = 1
          ctx.stroke()

          // Draw tertiary node text
          ctx.fillStyle = secondaryColor
          ctx.font = "10px Arial"
          ctx.fillText(`Detail ${j + 1}`, tx, ty)
        }
      }
    }
  }

  const handleGenerateGraph = () => {
    toast({
      title: "Generating knowledge graph",
      description: "Creating visual representation of key concepts.",
    })
  }

  const handleDownload = () => {
    if (!canvasRef.current) return

    const link = document.createElement("a")
    link.download = "knowledge-graph.png"
    link.href = canvasRef.current.toDataURL("image/png")
    link.click()

    toast({
      title: "Download started",
      description: "Knowledge graph has been downloaded.",
    })
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Knowledge Graph</CardTitle>
        <CardDescription>Visual representation of key concepts and their relationships</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2 mb-2">
          <Button variant="outline" size="sm" onClick={handleGenerateGraph}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="border rounded-md bg-white">
          <canvas ref={canvasRef} className="w-full h-[400px]" />
        </div>
      </CardContent>
    </Card>
  )
}

