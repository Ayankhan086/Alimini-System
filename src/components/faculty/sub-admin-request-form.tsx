'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export function SubAdminRequestForm() {
  const router = useRouter()
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setLoading(true)
    try {
      const response = await fetch('/api/faculty/sub-admin-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Request could not be submitted.')
      setReason('')
      router.refresh()
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Request could not be submitted.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      <label htmlFor="sub-admin-reason" className="block text-sm font-medium text-slate-700">Why are you requesting department sub-admin access?</label>
      <textarea
        id="sub-admin-reason"
        value={reason}
        onChange={(event) => setReason(event.target.value)}
        minLength={20}
        maxLength={1000}
        required
        rows={5}
        className="w-full rounded-md border border-slate-300 p-3 text-sm"
        placeholder="Describe your role and how you will support alumni in your department."
      />
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs text-slate-500">{reason.length}/1000 characters</p>
        <button disabled={loading || reason.trim().length < 20} className="rounded-md bg-[#16345c] px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50">
          {loading ? 'Submitting…' : 'Submit request'}
        </button>
      </div>
    </form>
  )
}
