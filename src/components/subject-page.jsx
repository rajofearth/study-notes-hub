'use client';

import React, { useState, useEffect, useRef } from "react"; 
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button"; 
import { ChevronLeft, ChevronRight } from "lucide-react"; 
import { Header } from "./Header"; 
import NavigationBar from "@/components/notesPage/NavigationBar";
import SemesterTabs from "@/components/notesPage/SemesterTabs";
import PdfViewerSection from "@/components/notesPage/PdfViewerSection";
import PdfSearchResultsPane from "@/components/pdfSearch/PdfSearchResultsPane"; // Step 1: Import

export function SubjectPageJsx({ subject, onBack, pdfSearchTerm }) {
  const navigate = useNavigate();
  const { semesterId, noteType } = useParams();
  
  const [currentSearchInPdf, setCurrentSearchInPdf] = useState(pdfSearchTerm || '');
  const [pdfMatches, setPdfMatches] = useState([]); 
  const [currentMatchIndex, setCurrentMatchIndex] = useState(0); // 0-based internal state
  const pdfViewerRef = useRef(null); 

  // Step 4: Ensure useEffect for resetting matches is correct
  useEffect(() => {
    setCurrentSearchInPdf(pdfSearchTerm || ''); 
    setPdfMatches([]); 
    setCurrentMatchIndex(0); 
  }, [pdfSearchTerm]);

  const [selectedSemester, setSelectedSemester] = useState(() => {
    return semesterId
      ? `semester${semesterId}`
      : (subject.semesters.includes(1) ? "semester1" : "semester2");
  });
  const [selectedNoteType, setSelectedNoteType] = useState(noteType || "notes");
  const [isMobile, setIsMobile] = useState(false);
  const [touchStart, setTouchStart] = useState(null);
  const [touchEnd, setTouchEnd] = useState(null);
  
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const pdfSources = {
    semester1: {
      notes: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s1.pdf`,
      handwritten: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s1.pdf`,
    },
    semester2: {
      notes: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s2.pdf`,
      handwritten: `https://mozilla.github.io/pdf.js/web/viewer.html?file=https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s2.pdf`,
    },
  };

  const rawPdfSources = {
    semester1: {
      notes: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s1.pdf`,
      handwritten: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s1.pdf`,
    },
    semester2: {
      notes: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/${subject.file.toLowerCase()}-s2.pdf`,
      handwritten: `https://raw.githubusercontent.com/rajofearth/study-notes-hub/main/public/pdfs/hwn/${subject.file.toLowerCase()}-s2.pdf`,
    },
  };

  const handleSemesterChange = (value) => {
    setSelectedSemester(value);
    setSelectedNoteType("notes"); 
    const semester = value.replace("semester", "");
    navigate(`/subject/${subject.file}/semester/${semester}/notes`);
  };

  const handleNoteTypeChange = (value) => {
    setSelectedNoteType(value);
    const semester = selectedSemester.replace("semester", "");
    navigate(`/subject/${subject.file}/semester/${semester}/${value}`);
  };

  const currentPdfSource = pdfSources[selectedSemester]?.[selectedNoteType];
  const currentRawPdfSource = rawPdfSources[selectedSemester]?.[selectedNoteType];

  useEffect(() => {
    const storedProgress = JSON.parse(localStorage.getItem("subjectProgress") || "{}");
    const subjectFileProgress = storedProgress[subject.file] || { notes: false, handwritten: false };
    
    if (!subjectFileProgress[selectedNoteType]) { 
      const updatedProgress = {
        ...storedProgress,
        [subject.file]: {
          ...subjectFileProgress,
          [selectedNoteType]: true,
        },
      };
      localStorage.setItem("subjectProgress", JSON.stringify(updatedProgress));
      window.dispatchEvent(
        new CustomEvent("progressUpdate", {
          detail: {
            subjectFile: subject.file,
            progress: updatedProgress[subject.file],
          },
        })
      );
    }
  }, [subject.file, selectedNoteType]);

  const minSwipeDistance = 50;
  const onTouchStart = (e) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e) => {
    e.preventDefault(); 
    setTouchEnd(e.targetTouches[0].clientX);
  };
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    if (isLeftSwipe && selectedNoteType === "notes" && subject.semesters.some(s => rawPdfSources[`semester${s}`]?.handwritten)) {
      handleNoteTypeChange("handwritten");
    }
    if (isRightSwipe && selectedNoteType === "handwritten" && subject.semesters.some(s => rawPdfSources[`semester${s}`]?.notes)) {
      handleNoteTypeChange("notes");
    }
  };

  const getSubjectTitle = () => {
    if (selectedSemester === "semester2" && subject.semester2Title) {
      return subject.semester2Title;
    }
    return subject.title;
  };

  const breadcrumbItems = [
    { label: "Home", onClick: onBack },
    { label: getSubjectTitle() },
    { label: selectedSemester === "semester1" ? "Semester 1" : "Semester 2" },
    { label: selectedNoteType === "notes" ? "Notes" : "Handwritten Notes" },
  ];

  const showSemesterTabs = subject.semesters.length > 1;

  const handleSearchResults = (matches) => {
    setPdfMatches(matches || []);
    setCurrentMatchIndex(0); 
  };

  // Step 2: Update Search Navigation Logic
  const handleJumpToMatch = (oneBasedMatchIndex) => { 
    if (pdfViewerRef.current && pdfViewerRef.current.jumpToMatch && oneBasedMatchIndex > 0 && oneBasedMatchIndex <= pdfMatches.length) {
      pdfViewerRef.current.jumpToMatch(oneBasedMatchIndex);
      setCurrentMatchIndex(oneBasedMatchIndex - 1); 
    }
  };

  const handlePreviousMatch = () => {
    if (pdfMatches.length === 0) return;
    const newZeroBasedIndex = currentMatchIndex === 0 ? pdfMatches.length - 1 : currentMatchIndex - 1;
    handleJumpToMatch(newZeroBasedIndex + 1);
  };

  const handleNextMatch = () => {
    if (pdfMatches.length === 0) return;
    const newZeroBasedIndex = (currentMatchIndex + 1) % pdfMatches.length;
    handleJumpToMatch(newZeroBasedIndex + 1);
  };

  return (
    <div
      className="flex flex-col min-h-screen bg-background text-foreground"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <Header 
        searchTerm={currentSearchInPdf}
        onSearchChange={setCurrentSearchInPdf}
        isPdfView={true} 
      />
      <main className="container mx-auto px-4 py-8 flex-grow">
        <NavigationBar
          onBack={onBack}
          breadcrumbItems={breadcrumbItems}
          subjectTitle={getSubjectTitle()}
        />
        <Card className="mb-8">
          <CardContent className="p-6">
            <SemesterTabs
              showSemesterTabs={showSemesterTabs}
              subject={subject}
              selectedSemester={selectedSemester}
              selectedNoteType={selectedNoteType}
              onSemesterChange={handleSemesterChange}
              onNoteTypeChange={handleNoteTypeChange}
            />
          </CardContent>
        </Card>

        {/* Step 3: Modify the Search Results Display Section */}
        {currentSearchInPdf && (
          <div className="my-4 p-4 border rounded-lg bg-card">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">
                {pdfMatches.length > 0 
                  ? `Found ${pdfMatches.length} match${pdfMatches.length === 1 ? '' : 'es'}. Viewing match ${currentMatchIndex + 1}.`
                  : (currentSearchInPdf && pdfMatches.length === 0 && currentSearchInPdf.trim() !== '' ? 'No matches found.' : '') 
                  // Added check for currentSearchInPdf.trim() to avoid "No matches" when search is empty
                }
              </p>
              {pdfMatches.length > 0 && (
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="icon" onClick={handlePreviousMatch} aria-label="Previous match">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon" onClick={handleNextMatch} aria-label="Next match">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {/* Render PdfSearchResultsPane only if there are matches and a search term */}
            {currentSearchInPdf.trim() !== '' && pdfMatches.length > 0 && (
              <PdfSearchResultsPane 
                matches={pdfMatches}
                onSelectMatch={handleJumpToMatch} 
                currentMatchIndex={currentMatchIndex + 1} 
              />
            )}
          </div>
        )}

        <PdfViewerSection
          currentRawPdfSource={currentRawPdfSource}
          isMobile={isMobile}
          subject={subject}
          selectedSemester={selectedSemester}
          selectedNoteType={selectedNoteType}
          pdfSearchTerm={currentSearchInPdf}
          onSearchResults={handleSearchResults} 
          viewerRef={pdfViewerRef} 
        />
      </main>
    </div>
  );
}
