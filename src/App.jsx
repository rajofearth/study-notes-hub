import { StudyNotesHubJsx } from "./components/study-notes-hub"
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import { ThemeProvider } from "./components/theme-provider"

function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/pdfs/*" element={null} />
          <Route path="*" element={<StudyNotesHubJsx />} />
        </Routes>
      </Router>
    </ThemeProvider>
  )
}

export default App
