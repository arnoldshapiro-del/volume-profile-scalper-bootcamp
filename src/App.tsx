import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import ProgressBar from './components/ProgressBar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import DayZeroModal from './components/DayZeroModal'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import { LESSONS } from './data/lessons'

const GlossaryPage = lazy(() => import('./pages/GlossaryPage'))
const CheatSheet = lazy(() => import('./pages/CheatSheet'))
const Settings = lazy(() => import('./pages/Settings'))
const Lesson0 = lazy(() => import('./lessons/Lesson0'))
const Lesson1 = lazy(() => import('./lessons/Lesson1'))
const Lesson2 = lazy(() => import('./lessons/Lesson2'))
const Lesson3 = lazy(() => import('./lessons/Lesson3'))
const Lesson4 = lazy(() => import('./lessons/Lesson4'))
const Lesson5 = lazy(() => import('./lessons/Lesson5'))
const Lesson6 = lazy(() => import('./lessons/Lesson6'))
const Lesson7 = lazy(() => import('./lessons/Lesson7'))
const Lesson8 = lazy(() => import('./lessons/Lesson8'))
const Lesson9 = lazy(() => import('./lessons/Lesson9'))
const Lesson10 = lazy(() => import('./lessons/Lesson10'))
const Capstone = lazy(() => import('./lessons/Capstone'))

const LESSON_COMPONENTS: Record<string, React.LazyExoticComponent<React.FC>> = {
  l0: Lesson0, l1: Lesson1, l2: Lesson2, l3: Lesson3, l4: Lesson4,
  l5: Lesson5, l6: Lesson6, l7: Lesson7, l8: Lesson8, l9: Lesson9, l10: Lesson10,
  capstone: Capstone,
}

function LessonRoute() {
  const { slug } = useParams<{ slug: string }>()
  const lesson = LESSONS.find((l) => l.slug === slug)
  if (!lesson) return <Navigate to="/404" replace />
  const Comp = LESSON_COMPONENTS[lesson.id]
  return <Comp />
}

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="flex items-center gap-3 text-text-secondary">
        <div className="w-5 h-5 rounded-full border-2 border-poc-gold border-t-transparent animate-spin" />
        <span className="text-sm font-mono">Loading…</span>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <>
      <ProgressBar />
      <Sidebar />
      <DayZeroModal />
      <main className="lg:ml-[280px] px-4 md:px-8 lg:px-10 pt-6 pb-8 min-h-screen">
        <div className="max-w-[1280px] mx-auto">
          <Suspense fallback={<LoadingFallback />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/lesson/:slug" element={<LessonRoute />} />
              <Route path="/cheat-sheet" element={<CheatSheet />} />
              <Route path="/glossary" element={<GlossaryPage />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <Footer />
        </div>
      </main>
    </>
  )
}
