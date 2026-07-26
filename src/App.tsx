import { Route, Routes } from 'react-router-dom'
import { RouteScrollManager } from './components/RouteScrollManager'
import { ThemeProvider } from './context/ThemeContext'
import { CaseStudyPage } from './pages/CaseStudyPage'
import { HomePage } from './pages/HomePage'
import { NotFoundPage } from './pages/NotFoundPage'

function App() {
  return (
    <ThemeProvider>
      <RouteScrollManager />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/work/tis-admissions"
          element={<CaseStudyPage slug="tis-admissions" />}
        />
        <Route
          path="/work/antrah-wellness"
          element={<CaseStudyPage slug="antrah-wellness" />}
        />
        <Route path="/work/roar-arena" element={<CaseStudyPage slug="roar-arena" />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </ThemeProvider>
  )
}

export default App
