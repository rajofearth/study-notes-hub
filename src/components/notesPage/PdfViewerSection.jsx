'use client';

import React, { lazy, Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import ErrorBoundary from "@/components/ErrorBoundary";

const PdfViewer = lazy(() => import("@/components/notesPage/PdfViewer"));

const PdfViewerSection = ({
  currentRawPdfSource,
  isMobile,
  subject,
  selectedSemester,
  selectedNoteType,
  pdfSearchTerm,
  onSearchResults,
  viewerRef, // This is the ref received from SubjectPageJsx
}) => {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">PDF Viewer</h2>
        <Button
          onClick={() => window.open(currentRawPdfSource, "_blank")}
          aria-label="Download PDF"
          size="sm"
          disabled={!currentRawPdfSource}
        >
          <Download className="mr-2 h-4 w-4" /> Download PDF
        </Button>
      </div>
      <ErrorBoundary fallback={<p>Something went wrong. Please try again later.</p>}>
        <Suspense fallback={<p>Loading PDF...</p>}>
          <PdfViewer
            fileUrl={currentRawPdfSource}
            subject={subject}
            selectedSemester={selectedSemester}
            selectedNoteType={selectedNoteType}
            isMobile={isMobile}
            pdfSearchTerm={pdfSearchTerm}
            onSearchResults={onSearchResults}
            ref={viewerRef} // Corrected: was viewerRef={viewerRef}
          />
        </Suspense>
      </ErrorBoundary>
    </section>
  );
};

export default PdfViewerSection;
