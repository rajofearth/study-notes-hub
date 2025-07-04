'use client';

import React from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const SemesterTabs = ({
  showSemesterTabs,
  subject,
  selectedSemester,
  selectedNoteType,
  onSemesterChange,
  onNoteTypeChange,
}) => {
  const renderNoteTypeTabs = (semesterLabel) => (
    <Tabs value={selectedNoteType} onValueChange={onNoteTypeChange}>
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="notes">Notes</TabsTrigger>
        <TabsTrigger value="handwritten">Handwritten Notes</TabsTrigger>
      </TabsList>
      <TabsContent value="notes">
        <p className="text-sm text-muted-foreground">Viewing {semesterLabel} notes</p>
      </TabsContent>
      <TabsContent value="handwritten">
        <p className="text-sm text-muted-foreground">Viewing {semesterLabel} handwritten notes</p>
      </TabsContent>
    </Tabs>
  );

  if (showSemesterTabs) {
    const gridCols = subject.semesters.length === 2 ? 'grid-cols-2' : 
                     subject.semesters.length === 3 ? 'grid-cols-3' : 
                     'grid-cols-4';
    
    return (
      <Tabs value={selectedSemester} onValueChange={onSemesterChange}>
        <TabsList className={`grid w-full ${gridCols} mb-6`}>
          {subject.semesters.map((semester) => (
            <TabsTrigger key={semester} value={`semester${semester}`}>
              Semester {semester}
            </TabsTrigger>
          ))}
        </TabsList>
        {subject.semesters.map((semester) => (
          <TabsContent key={semester} value={`semester${semester}`}>
            {renderNoteTypeTabs(`Semester ${semester}`)}
          </TabsContent>
        ))}
      </Tabs>
    );
  }

  return renderNoteTypeTabs(selectedSemester);
};

export default SemesterTabs;
