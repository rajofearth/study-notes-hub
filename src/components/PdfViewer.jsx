import React from 'react';
import { Loader2, AlertCircle } from "lucide-react"

const PdfViewer = ({ isLoading, error, currentPdfSource, subject, selectedSemester, selectedNoteType, isMobile }) => {
  return (
    <div className={`w-full ${isMobile ? 'h-[calc(100vh-300px)]' : 'h-[600px]'} border border-input rounded-lg overflow-hidden relative`}>
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
        <iframe
          src={currentPdfSource}
          className="w-full h-full"
          title={`${subject.title} - ${selectedSemester} ${selectedNoteType}`}
        />
      )}
    </div>
  );
};

export default PdfViewer;