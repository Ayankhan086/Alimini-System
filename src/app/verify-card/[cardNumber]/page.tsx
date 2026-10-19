import { Metadata } from 'next'
import { prisma } from '@/lib/prisma'

export const metadata: Metadata = {
  title: 'Verify Alumni ID Card - UET Mardan',
  robots: { index: false, follow: false },
}

export default async function VerifyCardPage({
  params,
}: {
  params: Promise<{ cardNumber: string }>
}) {
  const { cardNumber } = await params
  const card = await prisma.digitalIdCard.findUnique({
    where: { cardNumber },
    select: {
      isActive: true,
      alumni: {
        select: {
          firstName: true,
          lastName: true,
          program: true,
          graduationYear: true,
          verificationStatus: true,
          department: { select: { name: true } },
        },
      },
    },
  })

  const isValid = Boolean(card?.isActive && card.alumni.verificationStatus === 'VERIFIED')

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-5">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-8 shadow-lg">
        <p className="text-sm font-semibold uppercase tracking-[0.15em] text-[#b68b24]">UET Mardan</p>
        <h1 className="mt-2 text-2xl font-bold text-[#16345c]">Alumni ID verification</h1>
        <p className={`mt-5 inline-flex rounded-full px-3 py-1 text-sm font-semibold ${isValid ? 'bg-emerald-100 text-emerald-800' : 'bg-red-100 text-red-800'}`}>
          {isValid ? 'Valid active card' : 'Invalid or inactive card'}
        </p>
        {isValid && card && (
          <dl className="mt-6 grid grid-cols-[auto_1fr] gap-x-5 gap-y-3 text-sm">
            <dt className="font-medium text-slate-500">Name</dt><dd className="font-semibold text-slate-900">{card.alumni.firstName} {card.alumni.lastName}</dd>
            <dt className="font-medium text-slate-500">Department</dt><dd className="text-slate-800">{card.alumni.department.name}</dd>
            <dt className="font-medium text-slate-500">Program</dt><dd className="text-slate-800">{card.alumni.program}</dd>
            <dt className="font-medium text-slate-500">Graduation year</dt><dd className="text-slate-800">{card.alumni.graduationYear}</dd>
          </dl>
        )}
        <p className="mt-7 text-xs text-slate-500">This check confirms the card&apos;s current status with the alumni management system.</p>
      </section>
    </main>
  )
}
