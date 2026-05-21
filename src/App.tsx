import { Routes, Route, Navigate, useParams } from 'react-router-dom'
import ProgressBar from './components/ProgressBar'
import Sidebar from './components/Sidebar'
import Footer from './components/Footer'
import DayZeroModal from './components/DayZeroModal'
import Dashboard from './pages/Dashboard'
import NotFound from './pages/NotFound'
import GlossaryPage from './pages/GlossaryPage'
import CheatSheet from './pages/CheatSheet'
import { LESSONS } from './data/lessons'
import Lesson0 from './lessons/Lesson0'
import Lesson1 from './lessons/Lesson1'
import Lesson2 from './lessons/Lesson2'
import Lesson3 from './lessons/Lesson3'
import Lesson4 from './lessons/Lesson4'
import Lesson5 from './lessons/Lesson5'
import Lesson6 from './lessons/Lesson6'
import Lesson7 from './lessons/Lesson7'
import Lesson8 from './lessons/Lesson8'
import Lesson9 from './lessons/Lesson9'
import Lesson10 from './lessons/Lesson10'
import Capstone from './lessons/Capstone'

const LESSON_COMPONENTS: Record<string, React.FC> = {
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

export default function App() {
  return (
    <>
      <ProgressBar />
      <Sidebar />
      <DayZeroModal />
      <main className="lg:ml-[280px] px-4 md:px-8 lg:px-10 pt-6 pb-8 min-h-screen">
        <div className="max-w-[1280px] mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/lesson/:slug" element={<LessonRoute />} />
            <Route path="/cheat-sheet" element={<CheatSheet />} />
            <Route path="/glossary" element={<GlossaryPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </div>
      </main>
    </>
  )
}
