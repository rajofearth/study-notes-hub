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
    return (
      <Tabs value={selectedSemester} onValueChange={onSemesterChange}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          {subject.semesters.includes(1) && (
            <TabsTrigger value="semester1">Semester 1</TabsTrigger>
          )}
          {subject.semesters.includes(2) && (
            <TabsTrigger value="semester2">Semester 2</TabsTrigger>
          )}
        </TabsList>
        <TabsContent value="semester1">
          {renderNoteTypeTabs("Semester 1")}
        </TabsContent>
        <TabsContent value="semester2">
          {renderNoteTypeTabs("Semester 2")}
        </TabsContent>
      </Tabs>
    );
  }

  return renderNoteTypeTabs(selectedSemester);
};

export default SemesterTabs;
