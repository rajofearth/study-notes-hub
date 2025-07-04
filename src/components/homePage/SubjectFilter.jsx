'use client';
import React from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const SubjectFilter = ({ searchTerm, onSearchChange, semesterFilter, onSemesterFilterChange }) => (
  <div className="max-w-3xl mx-auto mb-8">
    <Input
      type="text"
      placeholder="Search subjects..."
      className="mb-6"
      value={searchTerm}
      onChange={(e) => onSearchChange(e.target.value)}
    />
    <div className="flex gap-4 justify-center">
      <Button 
        variant={semesterFilter === 'all' ? 'default' : 'outline'}
        onClick={() => onSemesterFilterChange('all')}
      >
        All Subjects
      </Button>
      <Button 
        variant={semesterFilter === 1 ? 'default' : 'outline'}
        onClick={() => onSemesterFilterChange(1)}
      >
        Semester 1
      </Button>
      <Button 
        variant={semesterFilter === 2 ? 'default' : 'outline'}
        onClick={() => onSemesterFilterChange(2)}
      >
        Semester 2
      </Button>
      <Button 
        variant={semesterFilter === 3 ? 'default' : 'outline'}
        onClick={() => onSemesterFilterChange(3)}
      >
        Semester 3
      </Button>
    </div>
  </div>
);

export default SubjectFilter;
