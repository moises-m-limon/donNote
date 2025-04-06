"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download, RefreshCw, ZoomIn, ZoomOut } from "lucide-react"
import { toast } from "@/hooks/use-toast"
import * as d3 from "d3"
import winkNLP from 'wink-nlp'
import model from 'wink-eng-lite-web-model'

// Initialize NLP
const nlp = winkNLP(model)

// Common English stop words
const stopWords = new Set([
  "a", "an", "and", "are", "as", "at", "be", "by", "for", "from", "has", "he",
  "in", "is", "it", "its", "of", "on", "that", "the", "to", "was", "were",
  "will", "with", "the", "this", "but", "they", "have", "had", "what", "when",
  "where", "who", "which", "why", "how", "all", "any", "both", "each", "few",
  "more", "most", "other", "some", "such", "nor", "not", "only", "own", "same",
  "than", "too", "very", "can", "did", "does", "doing", "would", "should", "could"
])

interface KnowledgeGraphProps {
  content: string
}

interface Node {
  id: string
  text: string
  type: 'main' | 'concept' | 'detail' | 'subdetail'
  group?: number
  level: number
  parentId?: string
}

interface Link {
  source: string
  target: string
  value: number
  type: 'hierarchy' | 'relation'
}

interface Concept {
  text: string
  level: number
  children: Concept[]
  related: string[]
  vector?: number[]
}

export default function KnowledgeGraph({ content }: KnowledgeGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const [nodes, setNodes] = useState<Node[]>([])
  const [links, setLinks] = useState<Link[]>([])
  const [currentScale, setCurrentScale] = useState(1)
  const transformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity)
  const graphContainerRef = useRef<SVGGElement | null>(null)

  // Parse markdown and extract hierarchical concepts
  const parseMarkdown = (text: string): Concept[] => {
    const lines = text.split('\n')
    const concepts: Concept[] = []
    const stack: Concept[] = []
    let currentLevel = 0

    lines.forEach(line => {
      // Count leading spaces/tabs to determine level
      const match = line.match(/^[\s#]*/)
      const level = match ? match[0].length : 0
      const text = line.trim().replace(/^#+\s*/, '')

      if (!text) return

      const concept: Concept = {
        text,
        level,
        children: [],
        related: [],
        vector: generateVector(text)
      }

      // Handle hierarchy
      while (stack.length > 0 && stack[stack.length - 1].level >= level) {
        stack.pop()
      }

      if (stack.length > 0) {
        stack[stack.length - 1].children.push(concept)
      } else {
        concepts.push(concept)
      }

      stack.push(concept)
    })

    return findRelatedConcepts(concepts)
  }

  // Generate simple vector representation for a concept
  const generateVector = (text: string): number[] => {
    const doc = nlp.readDoc(text)
    const tokens = doc.tokens().out()
    const vector: number[] = new Array(100).fill(0)

    tokens.forEach((token, i) => {
      // Simple hash function to generate vector components
      const hash = hashString(token.toLowerCase())
      vector[hash % vector.length] += 1 / (i + 1)
    })

    return vector
  }

  // Simple string hash function
  const hashString = (str: string): number => {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return Math.abs(hash)
  }

  // Calculate cosine similarity between vectors
  const cosineSimilarity = (v1: number[], v2: number[]): number => {
    const dotProduct = v1.reduce((sum, a, i) => sum + a * v2[i], 0)
    const mag1 = Math.sqrt(v1.reduce((sum, a) => sum + a * a, 0))
    const mag2 = Math.sqrt(v2.reduce((sum, a) => sum + a * a, 0))
    return dotProduct / (mag1 * mag2)
  }

  // Find related concepts based on vector similarity
  const findRelatedConcepts = (concepts: Concept[]): Concept[] => {
    const flatConcepts = flattenConcepts(concepts)
    
    flatConcepts.forEach(concept => {
      flatConcepts.forEach(other => {
        if (concept !== other && concept.vector && other.vector) {
          const similarity = cosineSimilarity(concept.vector, other.vector)
          if (similarity > 0.5) {
            concept.related.push(other.text)
          }
        }
      })
    })

    return concepts
  }

  // Flatten hierarchical concepts
  const flattenConcepts = (concepts: Concept[]): Concept[] => {
    const flat: Concept[] = []
    const stack = [...concepts]

    while (stack.length > 0) {
      const concept = stack.pop()!
      flat.push(concept)
      stack.push(...concept.children)
    }

    return flat
  }

  // Convert concepts to nodes and links
  const conceptsToGraph = (concepts: Concept[]): { nodes: Node[], links: Link[] } => {
    const nodes: Node[] = []
    const links: Link[] = []
    let idCounter = 0

    const processConceptNode = (concept: Concept, parentId?: string, level: number = 0) => {
      const id = `node-${idCounter++}`
      const type = level === 0 ? 'main' : level === 1 ? 'concept' : level === 2 ? 'detail' : 'subdetail'

      nodes.push({
        id,
        text: concept.text,
        type,
        level,
        parentId,
        group: level
      })

      if (parentId) {
        links.push({
          source: parentId,
          target: id,
          value: 1,
          type: 'hierarchy'
        })
      }

      // Process children
      concept.children.forEach(child => {
        processConceptNode(child, id, level + 1)
      })

      // Add related concept links
      concept.related.forEach(relatedText => {
        const relatedNode = nodes.find(n => n.text === relatedText)
        if (relatedNode) {
          links.push({
            source: id,
            target: relatedNode.id,
            value: 0.5,
            type: 'relation'
          })
        }
      })
    }

    concepts.forEach(concept => processConceptNode(concept))
    return { nodes, links }
  }

  // Extract concepts and create graph
  const extractConcepts = (text: string) => {
    const concepts = parseMarkdown(text)
    return conceptsToGraph(concepts)
  }

  useEffect(() => {
    if (!svgRef.current || !content) return

    const width = svgRef.current.clientWidth
    const height = svgRef.current.clientHeight

    // Clear previous graph
    d3.select(svgRef.current).selectAll("*").remove()

    // Create SVG container with zoom behavior
    const svg = d3.select(svgRef.current)
      .attr("viewBox", [0, 0, width, height])
      .attr("style", "max-width: 100%; height: auto;")

    // Add arrow marker definitions for edges
    const defs = svg.append("defs")
    
    // Arrow for hierarchical links
    defs.append("marker")
      .attr("id", "arrow-hierarchy")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#6B7280")
      .attr("d", "M0,-5L10,0L0,5")

    // Arrow for relation links
    defs.append("marker")
      .attr("id", "arrow-relation")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 20)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("fill", "#C8CD44")
      .attr("d", "M0,-5L10,0L0,5")

    const g = svg.append("g")
    graphContainerRef.current = g.node()

    // Initialize zoom behavior
    const zoomBehavior = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on("zoom", (event: d3.D3ZoomEvent<SVGSVGElement, unknown>) => {
        g.attr("transform", event.transform.toString())
        setCurrentScale(event.transform.k)
        transformRef.current = event.transform
      })

    svg.call(zoomBehavior)

    // Create force simulation with improved layout
    const simulation = d3.forceSimulation(nodes as any)
      .force("link", d3.forceLink(links)
        .id((d: any) => d.id)
        .distance(d => (d as any).type === 'hierarchy' ? 120 : 250) // Increased distances
        .strength(d => (d as any).type === 'hierarchy' ? 0.8 : 0.2))
      .force("charge", d3.forceManyBody()
        .strength(d => (d as any).type === 'main' ? -2000 : -1000)) // Stronger repulsion
      .force("center", d3.forceCenter(width / 2, height / 2))
      .force("collision", d3.forceCollide().radius(70)) // Increased collision radius
      .force("x", d3.forceX(width / 2).strength(0.1))
      .force("y", d3.forceY().strength((d: any) => d.level * 0.2)) // Stronger vertical positioning

    // Create links with improved visibility
    const link = g.append("g")
      .selectAll("path")
      .data(links)
      .join("path")
      .attr("stroke", (d: any) => d.type === 'hierarchy' ? "#6B7280" : "#C8CD44")
      .attr("stroke-opacity", (d: any) => d.type === 'hierarchy' ? 0.8 : 0.6) // Increased opacity
      .attr("stroke-width", (d: any) => d.type === 'hierarchy' ? 2 : 1.5) // Thicker lines
      .attr("stroke-dasharray", (d: any) => d.type === 'relation' ? "5,5" : "none")
      .attr("marker-end", (d: any) => `url(#arrow-${d.type})`) // Add arrows
      .attr("fill", "none")

    // Create nodes with improved layout
    const node = g.append("g")
      .selectAll("g")
      .data(nodes)
      .join("g")
      .call(d3.drag<any, any>()
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended))

    // Add node backgrounds for better text visibility
    node.append("circle")
      .attr("r", (d: any) => {
        switch (d.type) {
          case 'main': return 45
          case 'concept': return 35
          case 'detail': return 30
          case 'subdetail': return 25
          default: return 25
        }
      })
      .attr("fill", (d: any) => {
        switch (d.type) {
          case 'main': return "#C8CD44"
          case 'concept': return "#20263B"
          case 'detail': return "#374151"
          case 'subdetail': return "#4B5563"
          default: return "#6B7280"
        }
      })
      .attr("stroke", "#20263B")
      .attr("stroke-width", 2)

    // Add text with improved wrapping and ellipsis
    node.append("text")
      .each(function(d: any) {
        const text = d3.select(this)
        const words = d.text.split(/\s+/)
        const maxLines = d.type === 'main' ? 3 : 2
        const maxChars = d.type === 'main' ? 20 : 15
        
        let lines: string[] = []
        let currentLine = words[0]

        for (let i = 1; i < words.length; i++) {
          const word = words[i]
          const testLine = `${currentLine} ${word}`
          if (testLine.length <= maxChars) {
            currentLine = testLine
          } else {
            lines.push(currentLine)
            currentLine = word
            if (lines.length >= maxLines - 1) {
              if (i < words.length - 1) {
                currentLine += "..."
              }
              break
            }
          }
        }
        lines.push(currentLine)

        lines.forEach((line, i) => {
          text.append("tspan")
            .attr("x", 0)
            .attr("y", 0)
            .attr("dy", `${i - (lines.length - 1) / 2}em`)
            .text(line)
        })
      })
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("fill", (d: any) => d.type === 'main' ? "#20263B" : "white")
      .attr("font-size", (d: any) => {
        switch (d.type) {
          case 'main': return "14px"
          case 'concept': return "12px"
          case 'detail': return "11px"
          case 'subdetail': return "10px"
          default: return "10px"
        }
      })
      .attr("font-weight", (d: any) => d.type === 'main' ? "bold" : "normal")

    // Update positions with curved edges
    simulation.on("tick", () => {
      link.attr("d", (d: any) => {
        const dx = d.target.x - d.source.x
        const dy = d.target.y - d.source.y
        const dr = Math.sqrt(dx * dx + dy * dy)
        
        // Curved paths for relation links, straight for hierarchy
        if (d.type === 'relation') {
          const curve = dr * 0.4
          return `M${d.source.x},${d.source.y}A${curve},${curve} 0 0,1 ${d.target.x},${d.target.y}`
        } else {
          return `M${d.source.x},${d.source.y}L${d.target.x},${d.target.y}`
        }
      })

      node.attr("transform", (d: any) => `translate(${d.x},${d.y})`)
    })

    // Drag functions
    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart()
      d.fx = d.x
      d.fy = d.y
    }

    function dragged(event: any, d: any) {
      d.fx = event.x
      d.fy = event.y
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0)
      d.fx = null
      d.fy = null
    }

    return () => {
      simulation.stop()
      graphContainerRef.current = null
    }
  }, [nodes, links])

  const handleGenerateGraph = () => {
    toast({
      title: "Analyzing content",
      description: "Generating knowledge graph from notes...",
    })
    const { nodes: newNodes, links: newLinks } = extractConcepts(content)
    setNodes(newNodes)
    setLinks(newLinks)
  }

  const handleDownload = () => {
    if (!svgRef.current) return

    const svgData = new XMLSerializer().serializeToString(svgRef.current)
    const svgBlob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" })
    const url = URL.createObjectURL(svgBlob)

    const link = document.createElement("a")
    link.href = url
    link.download = "knowledge-graph.svg"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)

    toast({
      title: "Download started",
      description: "Knowledge graph has been downloaded as SVG.",
    })
  }

  const handleZoom = (delta: number) => {
    if (!svgRef.current || !graphContainerRef.current) return

    const newScale = currentScale * (1 + delta)
    const scale = Math.min(Math.max(0.1, newScale), 4)
    
    const transform = transformRef.current
    const center = [svgRef.current.clientWidth / 2, svgRef.current.clientHeight / 2]
    
    const newTransform = d3.zoomIdentity
      .translate(transform.x, transform.y)
      .scale(scale)
      .translate(
        (1 - scale) * center[0],
        (1 - scale) * center[1]
      )

    d3.select(graphContainerRef.current)
      .transition()
      .duration(300)
      .attr("transform", newTransform.toString())

    setCurrentScale(scale)
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle>Knowledge Graph</CardTitle>
        <CardDescription>Interactive mind map of key concepts and their relationships</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex justify-end space-x-2 mb-2">
          <Button variant="outline" size="sm" onClick={handleGenerateGraph}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Generate
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleZoom(0.2)}>
            <ZoomIn className="mr-2 h-4 w-4" />
            Zoom In
          </Button>
          <Button variant="outline" size="sm" onClick={() => handleZoom(-0.2)}>
            <ZoomOut className="mr-2 h-4 w-4" />
            Zoom Out
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download
          </Button>
        </div>

        <div className="border rounded-md bg-white">
          <svg ref={svgRef} className="w-full h-[400px]" />
        </div>
      </CardContent>
    </Card>
  )
}

