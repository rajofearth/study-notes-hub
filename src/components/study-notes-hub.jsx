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
  const [pinnedSubjects, setPinnedSubjects] = useState([]); 

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
      semesters: [1, 2],
      semester2Title: "Communication Skills",
    },
    { 
      title: "Writing Skills", 
      file: "ws", 
      image: "https://images.pexels.com/photos/1766604/pexels-photo-1766604.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
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
    },
    { 
      title: "Constitution Of India", 
      file: "coi", 
      image: "https://images.pexels.com/photos/19883686/pexels-photo-19883686/free-photo-of-rashtrapati-bhavan-presidential-palace-in-new-delhi-india.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [2],
    }
  ];

  const studyTopics = studyTopicsData.map(topic => ({
    ...topic,
    progress: subjectProgress[topic.file] || { notes: false, handwritten: false }
  }));

  useEffect(() => {
    const storedProgress = localStorage.getItem('subjectProgress');
    if (storedProgress) {
      setSubjectProgress(JSON.parse(storedProgress));
    }
    const storedRecentlyViewed = localStorage.getItem('recentlyViewed');
    if (storedRecentlyViewed) {
      const parsedRecent = JSON.parse(storedRecentlyViewed);
      const validRecent = parsedRecent.map(recentSubject => {
        const fullSubject = studyTopics.find(topic => topic.file === recentSubject.file);
        return fullSubject || recentSubject;
      });
      setRecentlyViewed(validRecent);
    }
    const storedPinnedSubjects = localStorage.getItem('pinnedSubjects');
    if (storedPinnedSubjects) {
      try {
        const parsedPinnedSubjects = JSON.parse(storedPinnedSubjects);
        if (Array.isArray(parsedPinnedSubjects) && parsedPinnedSubjects.every(item => typeof item === 'string')) {
          setPinnedSubjects(parsedPinnedSubjects);
        } else {
          console.warn("Stored pinnedSubjects is not a valid array of strings. Resetting.");
          localStorage.setItem('pinnedSubjects', JSON.stringify([]));
        }
      } catch (e) {
        console.error("Failed to parse pinnedSubjects from localStorage", e);
        localStorage.setItem('pinnedSubjects', JSON.stringify([]));
      }
    }
  }, []);

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

  useEffect(() => {
    if (selectedSubject) {
      const semester = semesterId || selectedSubject.semesters[0];
      const notes = noteType || 'notes';
      navigate(`/subject/${selectedSubject.file}/semester/${semester}/${notes}`);
    }
  }, [selectedSubject, semesterId, noteType, navigate]);

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
    const defaultSemester = subject.semesters[0];
    navigate(`/subject/${subject.file}/semester/${defaultSemester}/notes`);
  };

  const handleBack = () => {
    setSelectedSubject(null);
    setSearchTerm(''); // Clear search term
    navigate('/');
  };

  const getAllSubjects = () => {
    let filteredInitialList = [...studyTopics];
    if (semesterFilter !== 'all') {
      filteredInitialList = filteredInitialList.filter(topic => 
        topic.semesters.includes(semesterFilter)
      );
    }
    if (searchTerm && !selectedSubject) { 
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredInitialList = filteredInitialList.filter(topic =>
        topic.title.toLowerCase().includes(lowerSearchTerm) ||
        topic.tags?.some(tag => tag.toLowerCase().includes(lowerSearchTerm))
      );
    }
    const filteredInitialMap = new Map(filteredInitialList.map(subject => [subject.file, subject]));
    const orderedPinned = [];
    const orderedRecentlyViewedNotPinned = [];
    const finalOtherSubjects = [];
    const pinnedFileIds = new Set(pinnedSubjects);
    const processedFileIds = new Set();

    for (const pinnedFileId of pinnedSubjects) {
      if (filteredInitialMap.has(pinnedFileId)) {
        orderedPinned.push(filteredInitialMap.get(pinnedFileId));
        processedFileIds.add(pinnedFileId);
      }
    }
    for (const recentSubject of recentlyViewed) {
      const recentFileId = recentSubject.file;
      if (filteredInitialMap.has(recentFileId) && !pinnedFileIds.has(recentFileId)) {
        orderedRecentlyViewedNotPinned.push(filteredInitialMap.get(recentFileId));
        processedFileIds.add(recentFileId);
      }
    }
    for (const subject of filteredInitialList) {
      if (!processedFileIds.has(subject.file)) {
        finalOtherSubjects.push(subject);
      }
    }
    return [...orderedPinned, ...orderedRecentlyViewedNotPinned, ...finalOtherSubjects];
  };

  const filteredTopics = getAllSubjects();

  const handlePinSubjectClick = (subjectToToggle) => {
    const subjectFile = subjectToToggle.file;
    let newPinnedSubjects;
    if (pinnedSubjects.includes(subjectFile)) {
      newPinnedSubjects = pinnedSubjects.filter(file => file !== subjectFile);
    } else {
      newPinnedSubjects = [...pinnedSubjects, subjectFile];
    }
    setPinnedSubjects(newPinnedSubjects);
    localStorage.setItem('pinnedSubjects', JSON.stringify(newPinnedSubjects));
  };

  if (selectedSubject) {
    return (
      <SubjectPageJsx 
        subject={selectedSubject} 
        onBack={handleBack} 
        pdfSearchTerm={searchTerm} 
      />
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header 
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm} 
        isPdfView={false} 
      />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <h1 className="text-3xl font-bold mb-8 text-center">All Subjects</h1>
          <SubjectFilter 
            semesterFilter={semesterFilter}
            onSemesterFilterChange={setSemesterFilter}
          />
          <SubjectsGrid 
            topics={filteredTopics}
            onSubjectClick={handleSubjectClick}
            recentlyViewed={recentlyViewed}
            pinnedSubjects={pinnedSubjects}
            onPinClick={handlePinSubjectClick}
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
