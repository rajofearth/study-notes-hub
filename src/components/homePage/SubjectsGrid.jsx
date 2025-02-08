'use client';
import React from 'react';
import SubjectCard from './SubjectCard';

const SubjectsGrid = ({ topics, onSubjectClick, recentlyViewed }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
    {topics.map(topic => (
      <SubjectCard 
        key={`subject-${topic.file}`} 
        topic={topic} 
        onClick={onSubjectClick} 
        recentlyViewed={recentlyViewed}
      />
    ))}
  </div>
);

export default SubjectsGrid;
