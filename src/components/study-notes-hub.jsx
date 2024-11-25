'use client';
import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SubjectPageJsx } from "./subject-page"
import { Input } from "@/components/ui/input"
import { Header } from "./Header"
import { ThemeToggle } from "@/components/ui/theme-toggle"

export function StudyNotesHubJsx() {
  const [selectedSubject, setSelectedSubject] = useState(null)
  const [searchTerm, setSearchTerm] = useState("")

  const studyTopics = [
    { title: "Operating System", file: "os", image: "https://images.pexels.com/photos/4584830/pexels-photo-4584830.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1] },
    { title: "Computer Fundamentals", file: "cf", image: "https://images.pexels.com/photos/4792720/pexels-photo-4792720.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1] },
    { title: "C Programming", file: "c", image: "https://images.pexels.com/photos/52608/pexels-photo-52608.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1], semester2Title: "Advanced C Programming" },
    { title: "Mathematics", file: "m", image: "https://images.pexels.com/photos/5212334/pexels-photo-5212334.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1] },
    { title: "Communication Skills", file: "cs", image: "https://images.pexels.com/photos/5439371/pexels-photo-5439371.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1] },
    { title: "Writing Skills", file: "ws", image: "https://images.pexels.com/photos/159581/dictionary-reference-book-learning-meaning-meaning-159581.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1] },
    { title: "Hindi", file: "hindi", image: "https://images.pexels.com/photos/4308161/pexels-photo-4308161.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [1] },
    { title: "Data Structures", file: "ds", image: "https://images.pexels.com/photos/1181671/pexels-photo-1181671.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [2] },
    { title: "Database Management System", file: "dbms", image: "https://images.pexels.com/photos/1181677/pexels-photo-1181677.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [2] },
    { title: "Microprocessor 8086", file: "mp", image: "https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", semesters: [2] }
  ]

  const handleSubjectClick = (subject) => {
    setSelectedSubject(subject)
  }

  const filteredTopics = studyTopics.filter(topic =>
    topic.title.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (selectedSubject) {
    return <SubjectPageJsx subject={selectedSubject} onBack={() => setSelectedSubject(null)} />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <Header />
      <main className="flex-1">
        <section className="w-full py-12 md:py-24">
          <div className="container px-4 md:px-6">
            <h1 className="text-3xl font-bold mb-8 text-center">Choose a Subject</h1>
            <Input
              type="text"
              placeholder="Search subjects..."
              className="mb-6"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTopics.map((topic, index) => (
                <Card
                  key={index}
                  className="overflow-hidden cursor-pointer transition-all hover:shadow-lg hover:-translate-y-1"
                  onClick={() => handleSubjectClick(topic)}>
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
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}