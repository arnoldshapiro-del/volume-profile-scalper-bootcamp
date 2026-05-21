import LessonLayout from '../components/LessonLayout'
import { useProgress } from '../hooks/useProgress'

interface Props { lessonId: string }

export default function LessonStub({ lessonId }: Props) {
  const { completeLesson, isCompleted } = useProgress()
  const done = isCompleted(lessonId)
  return (
    <LessonLayout lessonId={lessonId}>
      <div className="rounded-xl border border-dashed border-border-subtle bg-bg-card/40 p-8 text-center">
        <p className="text-text-secondary mb-4">This lesson's content is being authored. Full lesson coming in a subsequent phase.</p>
        {!done && (
          <button className="btn-secondary" onClick={() => completeLesson(lessonId, 0)}>
            Mark as Reviewed (Dev)
          </button>
        )}
      </div>
    </LessonLayout>
  )
}
