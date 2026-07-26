import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { RouteScrollManager } from './components/RouteScrollManager'
import { ThemeProvider } from './context/ThemeContext'

const HomePage = lazy(() =>
  import('./pages/HomePage').then(({ HomePage: page }) => ({ default: page })),
)
const CaseStudyPage = lazy(() =>
  import('./pages/CaseStudyPage').then(({ CaseStudyPage: page }) => ({ default: page })),
)
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then(({ NotFoundPage: page }) => ({ default: page })),
)

const routeLoadingFallback = (
  <div
    role="status"
    aria-live="polite"
    className="grid min-h-screen place-items-center bg-background text-on-surface"
  >
    Loading page…
  </div>
)

function App() {
  return (
    <ThemeProvider>
      <RouteScrollManager />
      <Suspense fallback={routeLoadingFallback}>
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
      </Suspense>
    </ThemeProvider>
  )
}

export default App
