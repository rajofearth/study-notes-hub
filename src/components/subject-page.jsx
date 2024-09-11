'use client'

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2, AlertCircle, Download, FileX } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Header } from "./Header"

export function SubjectPageJsx({ subject, onBack }) {
  const [selectedSemester, setSelectedSemester] = useState("semester1")
  const [selectedNoteType, setSelectedNoteType] = useState("notes")
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768) // Adjust this breakpoint as needed
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const pdfSources = {
    semester1: {
      notes: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s1.pdf`,
      handwritten: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s1.pdf`,
    },
    semester2: {
      notes: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s2.pdf`,
      handwritten: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s2.pdf`,
    },
  }

  const handleSemesterChange = (value) => {
    setSelectedSemester(value)
    setSelectedNoteType("notes")
  }

  const handleNoteTypeChange = (value) => {
    setSelectedNoteType(value)
  }

  const currentPdfSource = pdfSources[selectedSemester][selectedNoteType]

  useEffect(() => {
    setIsLoading(true)
    setError(null)
    const timer = setTimeout(() => {
      if (Math.random() > 0.9) {
        setError("Failed to load PDF. Please try again.")
      }
      setIsLoading(false)
    }, 1000)
    return () => clearTimeout(timer)
  }, [currentPdfSource])

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: subject.title },
    { label: selectedSemester === "semester1" ? "Semester 1" : "Semester 2" },
    { label: selectedNoteType === "notes" ? "Notes" : "Handwritten Notes" },
  ]

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 sm:mb-0">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="w-full sm:w-auto">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold my-8">{subject.title}</h1>
        <Card className="mb-8">
          <CardContent className="p-6">
            <Tabs value={selectedSemester} onValueChange={handleSemesterChange}>
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="semester1">Semester 1</TabsTrigger>
                <TabsTrigger value="semester2">Semester 2</TabsTrigger>
              </TabsList>
              <TabsContent value="semester1">
                <SemesterContent
                  semester="semester1"
                  selectedNoteType={selectedNoteType}
                  onNoteTypeChange={handleNoteTypeChange}
                />
              </TabsContent>
              <TabsContent value="semester2">
                <SemesterContent
                  semester="semester2"
                  selectedNoteType={selectedNoteType}
                  onNoteTypeChange={handleNoteTypeChange}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
        <div>
          <h2 className="text-2xl font-semibold mb-4">PDF Viewer</h2>
          <div className={`w-full ${isMobile ? 'h-[200px]' : 'h-[600px]'} border border-input rounded-lg overflow-hidden relative`}>
            {isLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <Loader2 className="h-8 w-8 animate-spin" />
              </div>
            )}
            {error && (
              <div className="absolute inset-0 flex items-center justify-center bg-background/80">
                <div className="text-center">
                  <AlertCircle className="h-8 w-8 text-destructive mx-auto mb-2" />
                  <p className="text-destructive">{error}</p>
                </div>
              </div>
            )}
            {!isLoading && !error && (
              isMobile ? (
                <div className="flex items-center justify-center h-full">
                  <Button onClick={() => window.open(currentPdfSource, '_blank')}>
                    <Download className="mr-2 h-4 w-4" /> Download PDF
                  </Button>
                </div>
              ) : (
                <iframe
                  src={currentPdfSource}
                  className="w-full h-full"
                  title={`${subject.title} - ${selectedSemester} ${selectedNoteType}`}
                  key={currentPdfSource}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

function SemesterContent({ semester, selectedNoteType, onNoteTypeChange }) {
  return (
    <Tabs value={selectedNoteType} onValueChange={onNoteTypeChange}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="handwritten">Handwritten Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <p className="text-sm text-muted-foreground">Viewing {semester} notes</p>
      </TabsContent>
      <TabsContent value="handwritten">
        <p className="text-sm text-muted-foreground">Viewing {semester} handwritten notes</p>
      </TabsContent>
    </Tabs>
  );
}
