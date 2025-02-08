'use client';
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { SubjectPageJsx } from "./subject-page";
import SubjectFilter from '@/components/homePage/SubjectFilter';
import SubjectsGrid from '@/components/homePage/SubjectsGrid';
import { Header } from '@/components/Header';

export function StudyNotesHubJsx() {
  const navigate = useNavigate();
  const { subjectId, semesterId, noteType } = useParams();
  
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [semesterFilter, setSemesterFilter] = useState('all');
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [subjectProgress, setSubjectProgress] = useState({});

  // Define the study topics data
  const studyTopicsData = [
    { 
      title: "Operating System", 
      file: "os", 
      image: "https://images.pexels.com/photos/4584830/pexels-photo-4584830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1],
    },
    { 
      title: "Computer Fundamentals", 
      file: "cf", 
      image: "https://images.pexels.com/photos/4792720/pexels-photo-4792720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1],
    },
    { 
      title: "C Programming", 
      file: "c", 
      image: "https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1, 2],
      semester2Title: "Advanced C Programming",
    },
    { 
      title: "Mathematics", 
      file: "m", 
      image: "https://images.pexels.com/photos/5212334/pexels-photo-5212334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1],
    },
    { 
      title: "Communication Skills", 
      file: "cs", 
      image: "https://images.pexels.com/photos/5439371/pexels-photo-5439371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1],
    },
    { 
      title: "Writing Skills", 
      file: "ws", 
      image: "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1],
    },
    { 
      title: "Hindi", 
      file: "hindi", 
      image: "https://images.pexels.com/photos/4308161/pexels-photo-4308161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1],
    },
    { 
      title: "Data Structures", 
      file: "ds", 
      image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [2],
    },
    { 
      title: "Database Management System", 
      file: "dbms", 
      image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [2],
    },
    { 
      title: "Microprocessor 8086", 
      file: "mp", 
      image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [2],
    }
  ];

  // Append progress to each topic
  const studyTopics = studyTopicsData.map(topic => ({
    ...topic,
    progress: subjectProgress[topic.file] || { notes: false, handwritten: false }
  }));

  // Load progress and recently viewed from localStorage on mount
  useEffect(() => {
    const storedProgress = localStorage.getItem('subjectProgress');
    if (storedProgress) {
      setSubjectProgress(JSON.parse(storedProgress));
    }
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (storedRecentlyViewed) {
      const parsedRecent = JSON.parse(storedRecentlyViewed);
      // Validate each stored subject against our study topics
      const validRecent = parsedRecent.map(recentSubject => {
        const fullSubject = studyTopics.find(topic => topic.file === recentSubject.file);
        return fullSubject || recentSubject;
      });
      setRecentlyViewed(validRecent);
    }
  }, []);

  // Listen for progress updates via a custom event
  useEffect(() => {
    const handleProgressUpdate = (event) => {
      const { subjectFile, progress } = event.detail;
      const updatedProgress = { ...subjectProgress, [subjectFile]: progress };
      setSubjectProgress(updatedProgress);
      localStorage.setItem('subjectProgress', JSON.stringify(updatedProgress));
    };
    window.addEventListener('progressUpdate', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdate', handleProgressUpdate);
  }, [subjectProgress]);

  // Update URL when a subject is selected
  useEffect(() => {
    if (selectedSubject) {
      const semester = semesterId || selectedSubject.semesters[0];
      const notes = noteType || 'notes';
      navigate(`/subject/${selectedSubject.file}/semester/${semester}/${notes}`);
    }
  }, [selectedSubject, semesterId, noteType, navigate]);

  // If a subject is provided in the URL params, select it on mount
  useEffect(() => {
    if (subjectId && !selectedSubject) {
      const subject = studyTopics.find(topic => topic.file === subjectId);
      if (subject) {
        setSelectedSubject(subject);
        const updatedRecent = [subject, ...recentlyViewed.filter(item => item.file !== subject.file)].slice(0, 4);
        setRecentlyViewed(updatedRecent);
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
      }
    }
  }, [subjectId, studyTopics, recentlyViewed, selectedSubject]);

  const handleSubjectClick = (subject) => {
    const updatedRecent = [subject, ...recentlyViewed.filter(item => item.file !== subject.file)].slice(0, 4);
    setRecentlyViewed(updatedRecent);
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent));
    setSelectedSubject(subject);
    // Navigate with default semester and note type
    const defaultSemester = subject.semesters[0];
    navigate(`/subject/${subject.file}/semester/${defaultSemester}/notes`);
  };

  const handleBack = () => {
    setSelectedSubject(null);
    navigate('/');
  };

  // Combine recently viewed with all subjects and apply filters
  const getAllSubjects = () => {
    const recentIds = new Set(recentlyViewed.map(subject => subject.file));
    const otherSubjects = studyTopics.filter(subject => !recentIds.has(subject.file));
    let allSubjects = [...recentlyViewed, ...otherSubjects];
    if (semesterFilter !== 'all') {
      allSubjects = allSubjects.filter(topic => topic.semesters.includes(semesterFilter));
    }
    if (searchTerm) {
      allSubjects = allSubjects.filter(topic =>
        topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        topic.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    return allSubjects;
  };

  const filteredTopics = getAllSubjects();

  if (selectedSubject) {
    return <SubjectPageJsx subject={selectedSubject} onBack={handleBack} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <h1 className="text-3xl font-bold mb-8 text-center">All Subjects</h1>
          <SubjectFilter 
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            semesterFilter={semesterFilter}
            onSemesterFilterChange={setSemesterFilter}
          />
          <SubjectsGrid 
            topics={filteredTopics}
            onSubjectClick={handleSubjectClick}
            recentlyViewed={recentlyViewed}
          />
          {filteredTopics.length === 0 && (
            <p className="text-center text-muted-foreground mt-8">
              No subjects found matching your criteria.
            </p>
          )}
        </div>
      </main>
    </div>
  );
}
