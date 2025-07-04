export default function getAllSubjects(studyTopics, recentlyViewed, semesterFilter, searchTerm) {
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