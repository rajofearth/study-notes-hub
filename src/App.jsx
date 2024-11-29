import { StudyNotesHubJsx } from "./components/study-notes-hub"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <ThemeProvider>
      <Router basename="/study-notes-hub">
        <Routes>
          <Route path="/" element={<StudyNotesHubJsx />} />
          <Route path="/subject/:subjectId/semester/:semesterId/:noteType" element={<StudyNotesHubJsx />} />
          <Route path="*" element={<StudyNotesHubJsx />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App