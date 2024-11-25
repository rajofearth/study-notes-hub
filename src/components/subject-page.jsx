'use client'

import React, { useState, useEffect, lazy, Suspense } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download } from "lucide-react"
import { Breadcrumb } from "@/components/ui/breadcrumb"
import { Header } from "./Header"
import ErrorBoundary from "@/components/ErrorBoundary"

const PdfViewer = lazy(() => import("@/components/PdfViewer"))

export function SubjectPageJsx({ subject, onBack }) {
  const [selectedSemester, setSelectedSemester] = useState(() => {
    return subject.semesters.includes(1) ? "semester1" : "semester2"
  })
  const [selectedNoteType, setSelectedNoteType] = useState("notes")
  // const [isLoading, setIsLoading] = useState(true)
  // const [error, setError] = useState(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const pdfSources = {
    semester1: {
      notes: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s1.pdf`,
      handwritten: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s1.pdf`,
    },
    semester2: {
      notes: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s2.pdf`,
      handwritten: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s2.pdf`,
    },
  }

  const rawPdfSources = {
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
  const currentRawPdfSource = rawPdfSources[selectedSemester][selectedNoteType]

  // useEffect(() => {
  //   setIsLoading(true)
  //   setError(null)
  //   const timer = setTimeout(() => {
  //     if (Math.random() > 0.9) {
  //       setError("Failed to load PDF. Please try again.")
  //     }
  //     setIsLoading(false)
  //   }, 1000)
  //   return () => clearTimeout(timer)
  // }, [currentPdfSource])

  const getSubjectTitle = () => {
    if (selectedSemester === "semester2" && subject.semester2Title) {
      return subject.semester2Title
    }
    return subject.title
  }

  const breadcrumbItems = [
    { 
      label: "Home", 
      onClick: onBack  // Only Home is clickable
    },
    { 
      label: getSubjectTitle()
    },
    { 
      label: selectedSemester === "semester1" ? "Semester 1" : "Semester 2"
    },
    { 
      label: selectedNoteType === "notes" ? "Notes" : "Handwritten Notes"
    }
  ]

  const showSemesterTabs = subject.semesters.length > 1

  // Add touch gestures for mobile
  const handleSwipe = (direction) => {
    if (direction === 'left') {
      // Next note type
      if (selectedNoteType === 'notes') {
        handleNoteTypeChange('handwritten');
      }
    }
    if (direction === 'right') {
      // Previous note type
      if (selectedNoteType === 'handwritten') {
        handleNoteTypeChange('notes');
      }
    }
  };

  // Add useEffect to update progress when viewing notes
  useEffect(() => {
    // Get stored progress from localStorage
    const storedProgress = JSON.parse(localStorage.getItem('subjectProgress') || '{}');
    
    // Update progress for current subject
    const updatedProgress = {
      ...storedProgress,
      [subject.file]: {
        ...storedProgress[subject.file],
        [selectedNoteType]: true
      }
    };

    // Save updated progress
    localStorage.setItem('subjectProgress', JSON.stringify(updatedProgress));

    // Dispatch custom event to notify study-notes-hub
    window.dispatchEvent(new CustomEvent('progressUpdate', {
      detail: {
        subjectFile: subject.file,
        progress: updatedProgress[subject.file]
      }
    }));
  }, [subject.file, selectedNoteType]);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <nav className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          <Button variant="ghost" onClick={onBack} className="mb-4 sm:mb-0" aria-label="Go back">
            <ArrowLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <div className="w-full sm:w-auto">
            <Breadcrumb items={breadcrumbItems} />
          </div>
        </nav>
        <h1 className="text-3xl sm:text-4xl font-bold mb-8">{getSubjectTitle()}</h1>
        <Card className="mb-8">
          <CardContent className="p-6">
            {showSemesterTabs ? (
              <Tabs value={selectedSemester} onValueChange={handleSemesterChange}>
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  {subject.semesters.includes(1) && (
                    <TabsTrigger value="semester1">Semester 1</TabsTrigger>
                  )}
                  {subject.semesters.includes(2) && (
                    <TabsTrigger value="semester2">Semester 2</TabsTrigger>
                  )}
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
            ) : (
              <SemesterContent
                semester={selectedSemester}
                selectedNoteType={selectedNoteType}
                onNoteTypeChange={handleNoteTypeChange}
              />
            )}
          </CardContent>
        </Card>
        <section className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-semibold">PDF Viewer</h2>
            <Button 
              onClick={() => window.open(currentRawPdfSource, '_blank')} 
              aria-label="Download PDF"
              size="sm"
            >
              <Download className="mr-2 h-4 w-4" /> Download PDF
            </Button>
          </div>
          <ErrorBoundary fallback={<p>Something went wrong. Please try again later.</p>}>
            <Suspense fallback={<p>Loading PDF...</p>}>
              <PdfViewer
                // isLoading={isLoading}
                // error={error}
                currentPdfSource={currentPdfSource}
                subject={subject}
                selectedSemester={selectedSemester}
                selectedNoteType={selectedNoteType}
                isMobile={isMobile}
              />
            </Suspense>
          </ErrorBoundary>
        </section>
      </main>
    </div>
  )
}

const SemesterContent = React.memo(({ semester, selectedNoteType, onNoteTypeChange }) => {
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
})

SemesterContent.displayName = 'SemesterContent'
