'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function AlumniTransitionForm({
  expectedGraduationYear,
}: {
  expectedGraduationYear: number
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const fields = new FormData(form)
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/student/transition-to-alumni', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          degreeLevel: fields.get('degreeLevel'),
          program: fields.get('program'),
          graduationYear: Number(fields.get('graduationYear')),
          cnic: fields.get('cnic'),
        }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Transition request failed.')
      router.replace('/dashboard')
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Transition request failed.')
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-4 grid gap-4 sm:grid-cols-2">
      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800 sm:col-span-2">{error}</p>}
      <label className="space-y-1 text-sm font-medium text-slate-700">
        Degree level
        <select name="degreeLevel" required className="mt-1 h-11 w-full rounded-md border border-slate-300 bg-white px-3">
          <option value="">Select degree</option><option value="BSc">BSc</option><option value="MSc">MSc</option><option value="PhD">PhD</option>
        </select>
      </label>
      <label className="space-y-1 text-sm font-medium text-slate-700">
        Program
        <input name="program" required minLength={2} maxLength={100} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3" />
      </label>
      <label className="space-y-1 text-sm font-medium text-slate-700">
        Graduation year
        <input name="graduationYear" required type="number" min={expectedGraduationYear} max={new Date().getFullYear()} defaultValue={expectedGraduationYear} className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3" />
      </label>
      <label className="space-y-1 text-sm font-medium text-slate-700">
        CNIC (optional)
        <input name="cnic" pattern="[0-9]{5}-[0-9]{7}-[0-9]" placeholder="XXXXX-XXXXXXX-X" className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3" />
      </label>
      <div className="sm:col-span-2">
        <p className="mb-3 text-xs text-slate-500">Your alumni profile will be created as pending and will need department verification before it appears in the alumni directory.</p>
        <button disabled={loading} className="rounded-md bg-[#16345c] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-60">
          {loading ? 'Submitting…' : 'Submit graduation details'}
        </button>
      </div>
    </form>
  )
}
