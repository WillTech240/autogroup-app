"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Shuffle, Users, Upload, FileDown, FileSpreadsheet } from "lucide-react"
import jsPDF from "jspdf"
import * as XLSX from "xlsx"
import Image from "next/image"

export default function AutoGroupPage() {
  const [inputText, setInputText] = useState("")
  // keep as string so the user can clear the field while typing
  const [groupSize, setGroupSize] = useState<string>("")
  const [groups, setGroups] = useState<string[][]>([])
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleGenerateGroups = () => {
    setError("")

    // Parse input - split by newlines or commas
    const items = inputText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    if (items.length === 0) {
      setError("Please enter at least one item")
      return
    }

    // parse and validate group size (allow empty input while typing)
    const parsedSize = parseInt(groupSize, 10)
    if (Number.isNaN(parsedSize) || parsedSize < 1) {
      setError("Group size must be a positive integer")
      return
    }

    // Create groups
    const newGroups: string[][] = []
    for (let i = 0; i < items.length; i += parsedSize) {
      newGroups.push(items.slice(i, i + parsedSize))
    }

    setGroups(newGroups)
  }

  const handleShuffle = () => {
    if (inputText.trim().length === 0) {
      setError("Please enter items first")
      return
    }

    // Shuffle the input text
    const items = inputText
      .split(/[\n,]+/)
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    const shuffled = [...items].sort(() => Math.random() - 0.5)
    setInputText(shuffled.join("\n"))
    setGroups([])
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError("")

    try {
      const fileExtension = file.name.split(".").pop()?.toLowerCase()

      if (fileExtension === "txt" || fileExtension === "csv") {
        // Handle text and CSV files
        const text = await file.text()
        setInputText(text)
      } else if (fileExtension === "xlsx" || fileExtension === "xls") {
        // Handle Excel files
        const arrayBuffer = await file.arrayBuffer()
        const workbook = XLSX.read(arrayBuffer, { type: "array" })
        const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
        const data = XLSX.utils.sheet_to_json(firstSheet, { header: 1 }) as string[][]

        // Flatten the array and join items
        const items = data.flat().filter((item) => item && item.toString().trim())
        setInputText(items.join("\n"))
      } else {
        setError("Unsupported file format. Please use .txt, .csv, .xlsx, or .xls")
      }
    } catch (err) {
      setError("Failed to read file. Please try again.")
    }

    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const handleExportPDF = () => {
    if (groups.length === 0) {
      setError("Please generate groups first")
      return
    }

    const doc = new jsPDF()
    const pageWidth = doc.internal.pageSize.getWidth()
    let yPosition = 20

    // Title
    doc.setFontSize(20)
    doc.text("Auto Group Results", pageWidth / 2, yPosition, { align: "center" })
    yPosition += 15

    // Groups
    doc.setFontSize(12)
    groups.forEach((group, groupIndex) => {
      // Check if we need a new page
      if (yPosition > 270) {
        doc.addPage()
        yPosition = 20
      }

      doc.setFont("helvetica", "bold")
      doc.text(`Group ${groupIndex + 1} (${group.length} members):`, 20, yPosition)
      yPosition += 7

      doc.setFont("helvetica", "normal")
      group.forEach((item) => {
        if (yPosition > 280) {
          doc.addPage()
          yPosition = 20
        }
        doc.text(`  • ${item}`, 25, yPosition)
        yPosition += 6
      })

      yPosition += 5
    })

    doc.save("auto-groups.pdf")
  }

  const handleExportExcel = () => {
    if (groups.length === 0) {
      setError("Please generate groups first")
      return
    }

    // Create worksheet data
    const worksheetData: (string | number)[][] = []

    // Add headers
    const maxGroupSize = Math.max(...groups.map((g) => g.length))
    const headers = groups.map((_, i) => `Group ${i + 1}`)
    worksheetData.push(headers)

    // Add members
    for (let i = 0; i < maxGroupSize; i++) {
      const row = groups.map((group) => group[i] || "")
      worksheetData.push(row)
    }

    // Create workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Groups")

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" })
    const blob = new Blob([excelBuffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" })
    const url = URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    link.download = "auto-groups.xlsx"
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <main className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12 max-w-5xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <Image src="/logo.jpg" alt="Auto Group Logo" width={120} height={120} className="rounded-2xl" />
          </div>
          <h1 className="text-4xl font-bold mb-3 text-balance">Auto Group Generator</h1>
          <p className="text-muted-foreground text-lg text-pretty">
            Divide your list into equal-sized groups instantly
          </p>
        </div>

        {/* Input Section */}
        <Card className="p-6 mb-8">
          <div className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label htmlFor="items" className="text-base font-semibold">
                  Your List
                </Label>
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm" onClick={() => fileInputRef.current?.click()} className="gap-2">
                    <Upload className="w-4 h-4" />
                    Import
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleShuffle} className="gap-2">
                    <Shuffle className="w-4 h-4" />
                    Shuffle
                  </Button>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.csv,.xlsx,.xls"
                onChange={handleImport}
                className="hidden"
              />
              <Textarea
                id="items"
                placeholder="Enter items (one per line or comma-separated)&#10;Example:&#10;Alice&#10;Bob&#10;Charlie&#10;David"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                className="min-h-[200px] font-mono text-sm resize-none"
              />
              <p className="text-sm text-muted-foreground mt-2">
                {inputText.split(/[\n,]+/).filter((item) => item.trim().length > 0).length} items
              </p>
            </div>

            <div>
              <Label htmlFor="groupSize" className="text-base font-semibold mb-2 block">
                Group Size
              </Label>
              <Input
                id="groupSize"
                type="number"
                min="0"
                value={groupSize}
                onChange={(e) => setGroupSize(e.target.value)}
                placeholder="Enter group size"
                className="max-w-xs"
              />
            </div>

            {error && <div className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</div>}

            <Button onClick={handleGenerateGroups} size="lg" className="w-full sm:w-auto">
              Generate Groups
            </Button>
          </div>
        </Card>

        {/* Results Section */}
        {groups.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h2 className="text-2xl font-bold">Results</h2>
                <span className="text-sm text-muted-foreground">
                  {groups.length} {groups.length === 1 ? "group" : "groups"}
                </span>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleExportPDF} className="gap-2 bg-transparent">
                  <FileDown className="w-4 h-4" />
                  Export PDF
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportExcel} className="gap-2 bg-transparent">
                  <FileSpreadsheet className="w-4 h-4" />
                  Export Excel
                </Button>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {groups.map((group, groupIndex) => (
                <Card key={groupIndex} className="p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-accent/20 text-accent font-bold">
                      {groupIndex + 1}
                    </div>
                    <div>
                      <h3 className="font-semibold">Group {groupIndex + 1}</h3>
                      <p className="text-sm text-muted-foreground">
                        {group.length} {group.length === 1 ? "member" : "members"}
                      </p>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {group.map((item, itemIndex) => (
                      <li key={itemIndex} className="text-sm bg-secondary/50 px-3 py-2 rounded-md">
                        {item}
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Features Showcase and Creator Credit */}
        <div className="mt-16 pt-12 border-t border-border">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold mb-6">Features</h3>
            <div className="flex flex-wrap justify-center gap-8">
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Shuffle className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium">Shuffle</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium">Import</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileDown className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium">Export PDF</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <FileSpreadsheet className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium">Export Excel</span>
              </div>
              <div className="flex flex-col items-center gap-2">
                <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="w-7 h-7 text-primary" />
                </div>
                <span className="text-sm font-medium">Auto Group</span>
              </div>
            </div>
          </div>
          <div className="text-center text-sm text-muted-foreground">
            <p>Created by Wilfred</p>
          </div>
        </div>
      </div>
    </main>
  )
}
