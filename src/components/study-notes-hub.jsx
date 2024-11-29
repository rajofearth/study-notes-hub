'use client';
import { useState, useEffect } from "react"
import { useParams, useNavigate, useLocation } from "react-router-dom"
import { Card, CardContent } from "@/components/ui/card"
import { SubjectPageJsx } from "./subject-page"
import { Input } from "@/components/ui/input"
import { Header } from "./Header"
import { ThemeToggle } from "@/components/ui/theme-toggle"
import { Button } from "@/components/ui/button"

export function StudyNotesHubJsx() {
  const navigate = useNavigate()
  const location = useLocation()
  const { subjectId, semesterId, noteType } = useParams()
  
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [semesterFilter, setSemesterFilter] = useState('all')
  const [recentlyViewed, setRecentlyViewed] = useState([])
  const [subjectProgress, setSubjectProgress] = useState({})

  const studyTopics = [
    { 
      title: "Operating System", 
      file: "os", 
      image: "https://images.pexels.com/photos/4584830/pexels-photo-4584830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      semesters: [1],
      progress: subjectProgress["os"] || { notes: false, handwritten: false }
    },
    { title: "Computer Fundamentals", file: "cf", image: "https://images.pexels.com/photos/4792720/pexels-photo-4792720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1], progress: subjectProgress["cf"] || { notes: false, handwritten: false } },
    { title: "C Programming", file: "c", image: "https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1, 2], semester2Title: "Advanced C Programming", progress: subjectProgress["c"] || { notes: false, handwritten: false } },
    { title: "Mathematics", file: "m", image: "https://images.pexels.com/photos/5212334/pexels-photo-5212334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1], progress: subjectProgress["m"] || { notes: false, handwritten: false } },
    { title: "Communication Skills", file: "cs", image: "https://images.pexels.com/photos/5439371/pexels-photo-5439371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1], progress: subjectProgress["cs"] || { notes: false, handwritten: false } },
    { title: "Writing Skills", file: "ws", image: "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1], progress: subjectProgress["ws"] || { notes: false, handwritten: false } },
    { title: "Hindi", file: "hindi", image: "https://images.pexels.com/photos/4308161/pexels-photo-4308161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1], progress: subjectProgress["hindi"] || { notes: false, handwritten: false } },
    { title: "Data Structures", file: "ds", image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [2], progress: subjectProgress["ds"] || { notes: false, handwritten: false } },
    { title: "Database Management System", file: "dbms", image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [2], progress: subjectProgress["dbms"] || { notes: false, handwritten: false } },
    { title: "Microprocessor 8086", file: "mp", image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [2], progress: subjectProgress["mp"] || { notes: false, handwritten: false } }
  ].map(topic => ({
    ...topic,
    progress: subjectProgress[topic.file] || { notes: false, handwritten: false }
  }))

  // Load progress and recently viewed from localStorage on mount
  useEffect(() => {
    const storedProgress = localStorage.getItem('subjectProgress')
    if (storedProgress) {
      setSubjectProgress(JSON.parse(storedProgress))
    }

    const storedRecentlyViewed = localStorage.getItem('recentlyViewed')
    if (storedRecentlyViewed) {
      const parsedRecent = JSON.parse(storedRecentlyViewed)
      // Ensure the stored subjects have all required properties by matching with studyTopics
      const validRecent = parsedRecent.map(recentSubject => {
        const fullSubject = studyTopics.find(topic => topic.file === recentSubject.file)
        return fullSubject || recentSubject
      })
      setRecentlyViewed(validRecent)
    }
  }, [])

  // Listen for progress updates
  useEffect(() => {
    const handleProgressUpdate = (event) => {
      const { subjectFile, progress } = event.detail;
      const updatedProgress = {
        ...subjectProgress,
        [subjectFile]: progress
      };
      setSubjectProgress(updatedProgress);
      // Save to localStorage
      localStorage.setItem('subjectProgress', JSON.stringify(updatedProgress));
    };

    window.addEventListener('progressUpdate', handleProgressUpdate);
    return () => window.removeEventListener('progressUpdate', handleProgressUpdate);
  }, [subjectProgress]);

  // Update URL when subject is selected
  useEffect(() => {
    if (selectedSubject) {
      const semester = semesterId || selectedSubject.semesters[0]
      const notes = noteType || 'notes'
      navigate(`/subject/${selectedSubject.file}/semester/${semester}/${notes}`)
    }
  }, [selectedSubject, semesterId, noteType, navigate])

  // Load subject from URL params on mount
  useEffect(() => {
    if (subjectId && !selectedSubject) {
      const subject = studyTopics.find(topic => topic.file === subjectId)
      if (subject) {
        setSelectedSubject(subject)
        // Update recently viewed
        const updatedRecent = [subject, ...recentlyViewed.filter(item => item.file !== subject.file)].slice(0, 4)
        setRecentlyViewed(updatedRecent)
        localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent))
      }
    }
  }, [subjectId, studyTopics, recentlyViewed])

  const handleSubjectClick = (subject) => {
    // Update recently viewed
    const updatedRecent = [subject, ...recentlyViewed.filter(item => item.file !== subject.file)].slice(0, 4)
    setRecentlyViewed(updatedRecent)
    localStorage.setItem('recentlyViewed', JSON.stringify(updatedRecent))
    setSelectedSubject(subject)
    // Navigate to the subject's page with default semester and note type
    const defaultSemester = subject.semesters[0]
    navigate(`/subject/${subject.file}/semester/${defaultSemester}/notes`)
  }

  const handleBack = () => {
    setSelectedSubject(null)
    navigate('/')
  }

  const getAllSubjects = () => {
    // Combine recently viewed and other subjects, removing duplicates
    const recentIds = new Set(recentlyViewed.map(subject => subject.file));
    const otherSubjects = studyTopics.filter(subject => !recentIds.has(subject.file));
    
    let allSubjects = [...recentlyViewed, ...otherSubjects];

    // Apply filters
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

  const SubjectCard = ({ topic }) => (
    <Card
      className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1 subject-card"
      onClick={() => handleSubjectClick(topic)}
      role="button"
      aria-label={`View ${topic.title} notes`}
      tabIndex={0}
      onKeyPress={(e) => e.key === 'Enter' && handleSubjectClick(topic)}
    >
      <CardContent className="p-0">
        <div className="relative aspect-video">
          <img
            alt={topic.title}
            className="object-cover w-full h-full"
            src={topic.image}
          />
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <h3 className="text-xl font-semibold text-white">{topic.title}</h3>
          </div>
          {recentlyViewed.some(recent => recent.file === topic.file) && (
            <div className="absolute top-2 right-2 bg-primary/90 text-primary-foreground px-2 py-1 rounded-full text-xs">
              Recently Viewed
            </div>
          )}
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-black/80">
            <div className="flex gap-2 justify-center">
              <span 
                className={`h-2 w-2 rounded-full ${topic.progress?.notes ? 'bg-green-500' : 'bg-gray-500'}`}
                title="Notes Progress"
              />
              <span 
                className={`h-2 w-2 rounded-full ${topic.progress?.handwritten ? 'bg-green-500' : 'bg-gray-500'}`}
                title="Handwritten Notes Progress"
              />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
          <h1 className="text-3xl font-bold mb-8 text-center">All Subjects</h1>
          <div className="max-w-3xl mx-auto mb-8">
            <Input
              type="text"
              placeholder="Search subjects..."
              className="mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex gap-4 justify-center">
              <Button 
                variant={semesterFilter === 'all' ? 'default' : 'outline'}
                onClick={() => setSemesterFilter('all')}
              >
                All Subjects
              </Button>
              <Button 
                variant={semesterFilter === 1 ? 'default' : 'outline'}
                onClick={() => setSemesterFilter(1)}
              >
                Semester 1
              </Button>
              <Button 
                variant={semesterFilter === 2 ? 'default' : 'outline'}
                onClick={() => setSemesterFilter(2)}
              >
                Semester 2
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {filteredTopics.map((topic, index) => (
              <SubjectCard key={`subject-${topic.file}`} topic={topic} />
            ))}
          </div>
          
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