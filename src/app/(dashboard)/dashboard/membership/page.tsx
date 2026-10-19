import { Metadata } from 'next'
import Image from 'next/image'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import QRCode from 'qrcode'
import { PrintCardButton } from '@/components/profile/print-card-button'
import { Sidebar } from '@/components/alumni/sidebar'
import { getActiveSessionUser } from '@/lib/active-session'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Digital Alumni ID - Alumni Management System',
}

async function getVerificationOrigin() {
  const configuredUrl = process.env.AUTH_URL ?? process.env.NEXTAUTH_URL
  if (configuredUrl) {
    const url = new URL(configuredUrl)
    if (url.protocol !== 'https:' && url.protocol !== 'http:') {
      throw new Error('AUTH_URL must use HTTP or HTTPS.')
    }
    return url.origin
  }

  const requestHeaders = await headers()
  const host = (requestHeaders.get('x-forwarded-host') ?? requestHeaders.get('host') ?? '')
    .split(',')[0]
    .trim()
  const protocol = (requestHeaders.get('x-forwarded-proto') ?? 'http').split(',')[0].trim()
  if (!/^(https?|http)$/.test(protocol) || !/^[a-z\d.-]+(?::\d+)?$/i.test(host)) {
    throw new Error('A valid AUTH_URL or request host is required to create the ID verification QR code.')
  }
  return `${protocol}://${host}`
}

export default async function MembershipPage() {
  const user = await getActiveSessionUser()
  if (!user) redirect('/login')
  if (user.role !== 'ALUMNI') redirect('/dashboard')

  const alumni = await prisma.alumni.findUnique({
    where: { userId: user.id },
    select: {
      firstName: true,
      lastName: true,
      program: true,
      graduationYear: true,
      verificationStatus: true,
      rejectionReason: true,
      department: { select: { name: true } },
      membership: { select: { status: true, expiryDate: true } },
      digitalIdCard: {
        select: { cardNumber: true, issuedAt: true, isActive: true },
      },
    },
  })

  const card = alumni?.digitalIdCard
  const isCardValid = Boolean(card?.isActive && alumni?.verificationStatus === 'VERIFIED')
  const verificationUrl = card
    ? new URL(`/verify-card/${encodeURIComponent(card.cardNumber)}`, await getVerificationOrigin()).toString()
    : ''
  const qrCode = isCardValid ? await QRCode.toDataURL(verificationUrl, { width: 160, margin: 1 }) : null

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-4xl space-y-6">
          <header>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#b68b24]">Membership</p>
            <h1 className="mt-2 text-3xl font-bold text-[#16345c]">Digital alumni ID</h1>
            <p className="mt-2 text-sm text-slate-600">Print this card or save it as a PDF. The QR code opens the live verification page.</p>
          </header>
          {isCardValid && alumni && card && qrCode ? (
            <>
              <article className="relative grid min-h-[300px] grid-cols-[1fr_160px] gap-6 overflow-hidden rounded-2xl border border-[#d5b45a] bg-white p-8 shadow-lg print:shadow-none">
                <div className="absolute inset-x-0 top-0 h-3 bg-[#16345c]" />
                <div className="min-w-0 pt-2">
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#a47c16]">UET Mardan Alumni Association</p>
                  <h2 className="mt-7 text-2xl font-bold text-[#16345c]">{alumni.firstName} {alumni.lastName}</h2>
                  <p className="mt-2 text-sm text-slate-600">{alumni.program}</p>
                  <p className="mt-1 text-sm text-slate-600">{alumni.department.name} · Class of {alumni.graduationYear}</p>
                  <div className="mt-7 border-t border-slate-200 pt-4">
                    <p className="text-xs uppercase tracking-wider text-slate-500">Card number</p>
                    <p className="mt-1 break-all font-mono text-sm font-semibold text-[#16345c]">{card.cardNumber}</p>
                    <p className="mt-2 text-xs text-slate-500">Issued {card.issuedAt.toLocaleDateString()}</p>
                  </div>
                </div>
                <div className="flex flex-col items-center justify-center gap-2 self-center">
                  <Image src={qrCode} alt="Scan to verify this alumni ID card" width={160} height={160} unoptimized />
                  <span className="text-center text-[11px] text-slate-500">Scan to verify</span>
                </div>
              </article>
              <div className="flex flex-wrap items-center justify-between gap-4 print:hidden">
                <p className="text-sm text-slate-600">Membership status: <strong className="text-emerald-700">{alumni.membership?.status ?? 'Not active'}</strong></p>
                <PrintCardButton />
              </div>
            </>
          ) : (
            <section className="rounded-xl border border-slate-200 bg-white p-8">
              <h2 className="font-semibold text-[#16345c]">Your digital ID is not available yet</h2>
              <p className="mt-2 text-sm text-slate-600">
                {alumni?.verificationStatus === 'PENDING'
                  ? 'Your alumni profile is awaiting verification. The ID card will be issued after approval.'
                  : alumni?.verificationStatus === 'REJECTED'
                    ? `Your profile was rejected. ${alumni.rejectionReason ?? 'Correct your details and resubmit from your profile.'}`
                  : 'An active, verified alumni profile is required before an ID card can be issued.'}
              </p>
            </section>
          )}
        </div>
      </main>
    </div>
  )
}
