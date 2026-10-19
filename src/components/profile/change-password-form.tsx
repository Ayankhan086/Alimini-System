'use client'

import { useState } from 'react'

export function ChangePasswordForm() {
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const form = event.currentTarget
    const values = new FormData(form)
    const currentPassword = String(values.get('currentPassword') ?? '')
    const newPassword = String(values.get('newPassword') ?? '')
    const confirmPassword = String(values.get('confirmPassword') ?? '')
    setError('')
    setNotice('')

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.')
      return
    }

    setIsSaving(true)
    try {
      const response = await fetch('/api/profile/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentPassword, newPassword }),
      })
      const result = await response.json()
      if (!response.ok) throw new Error(result.error ?? 'Password could not be changed.')
      form.reset()
      setNotice('Password changed successfully.')
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Password could not be changed.')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <form onSubmit={submit} className="mt-5 max-w-xl space-y-4">
      {error && <p role="alert" className="rounded-md bg-red-50 p-3 text-sm text-red-800">{error}</p>}
      {notice && <p role="status" className="rounded-md bg-emerald-50 p-3 text-sm text-emerald-800">{notice}</p>}
      <label className="block text-sm font-medium text-slate-700">
        Current password
        <input required name="currentPassword" type="password" autoComplete="current-password" className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3" />
      </label>
      <label className="block text-sm font-medium text-slate-700">
        New password
        <input required name="newPassword" type="password" minLength={12} maxLength={100} autoComplete="new-password" className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3" />
        <span className="mt-1 block text-xs font-normal text-slate-500">Use at least 12 characters.</span>
      </label>
      <label className="block text-sm font-medium text-slate-700">
        Confirm new password
        <input required name="confirmPassword" type="password" minLength={12} maxLength={100} autoComplete="new-password" className="mt-1 h-11 w-full rounded-md border border-slate-300 px-3" />
      </label>
      <button disabled={isSaving} className="min-h-11 rounded-md bg-[#16345c] px-5 text-sm font-semibold text-white disabled:opacity-60">
        {isSaving ? 'Saving…' : 'Change password'}
      </button>
    </form>
  )
}
