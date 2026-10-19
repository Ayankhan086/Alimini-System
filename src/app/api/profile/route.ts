import { NextResponse } from 'next/server';
import { getActiveSessionUser } from '@/lib/active-session';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
  avatarUrl: z.string().trim().url().max(500).optional().or(z.literal('')),
  currentEmployer: z.string().trim().max(100).optional().or(z.literal('')),
  jobTitle: z.string().trim().max(100).optional().or(z.literal('')),
  industry: z.string().trim().max(100).optional().or(z.literal('')),
  city: z.string().trim().max(100).optional().or(z.literal('')),
  country: z.string().trim().max(100).optional().or(z.literal('')),
  linkedinUrl: z.string().trim().url("Please enter a valid LinkedIn URL").max(200).optional().or(z.literal('')),
  skills: z.array(z.string().trim().max(50)).max(20, "You can add up to 20 skills").optional(),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Phone must be a valid number with 10-15 digits").optional().or(z.literal('')),
  showInDirectory: z.boolean().optional(),
  showEmail: z.boolean().optional(),
  showPhone: z.boolean().optional(),
  cnic: z.string().trim().regex(/^[0-9]{5}-[0-9]{7}-[0-9]$/).optional(),
  degreeLevel: z.string().trim().min(2).max(50).optional(),
  program: z.string().trim().min(2).max(100).optional(),
  graduationYear: z.number().int().min(2000).max(new Date().getFullYear()).optional(),
});

export async function PUT(req: Request) {
  try {
    const activeUser = await getActiveSessionUser();

    if (!activeUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (activeUser.role !== 'ALUMNI') {
      return NextResponse.json({ error: 'Only alumni can update alumni profiles.' }, { status: 403 });
    }

    const body = await req.json().catch(() => null);
    const parsed = updateProfileSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues }, { status: 400 });
    }
    const data = parsed.data;

    const identityChanged = data.cnic !== undefined
      || data.degreeLevel !== undefined
      || data.program !== undefined
      || data.graduationYear !== undefined
    const updatedAlumni = await prisma.$transaction(async (tx) => {
      const existingAlumni = await tx.alumni.findUnique({
        where: { userId: activeUser.id },
        select: {
          id: true,
          verificationStatus: true,
          admissionYear: true,
        },
      })
      if (!existingAlumni) return { error: 'Alumni profile not found.', status: 404 as const }
      if (identityChanged && existingAlumni.verificationStatus !== 'REJECTED') {
        return { error: 'Identity details can only be corrected after a profile is rejected.', status: 409 as const }
      }
      if (identityChanged && (!data.cnic || !data.degreeLevel || !data.program || !data.graduationYear)) {
        return { error: 'Enter your CNIC, degree level, program, and graduation year to resubmit your profile.', status: 400 as const }
      }
      if (identityChanged && data.graduationYear! <= existingAlumni.admissionYear) {
        return { error: 'Graduation year must be after your admission year.', status: 400 as const }
      }
      if (identityChanged) {
        const existingCnic = await tx.alumni.findFirst({
          where: { cnic: data.cnic, id: { not: existingAlumni.id } },
          select: { id: true },
        })
        if (existingCnic) return { error: 'This CNIC is already registered to another alumni profile.', status: 409 as const }
      }

      if (identityChanged) {
        await tx.membership.updateMany({
          where: { alumniId: existingAlumni.id },
          data: { status: 'INACTIVE' },
        })
        await tx.digitalIdCard.updateMany({
          where: { alumniId: existingAlumni.id },
          data: { isActive: false },
        })
      }

      const alumni = await tx.alumni.update({
        where: { id: existingAlumni.id },
        data: {
          avatarUrl: data.avatarUrl,
          currentEmployer: data.currentEmployer,
          jobTitle: data.jobTitle,
          industry: data.industry,
          city: data.city,
          country: data.country,
          linkedinUrl: data.linkedinUrl,
          skills: data.skills,
          phone: data.phone,
          showInDirectory: data.showInDirectory,
          showEmail: data.showEmail,
          showPhone: data.showPhone,
          ...(identityChanged
            ? {
                cnic: data.cnic,
                degreeLevel: data.degreeLevel,
                program: data.program,
                graduationYear: data.graduationYear,
                verificationStatus: 'PENDING' as const,
                rejectionReason: null,
                verifiedAt: null,
                verifiedBy: null,
              }
            : {}),
        },
      })
      return { alumni }
    });
    if ('error' in updatedAlumni) {
      return NextResponse.json({ error: updatedAlumni.error }, { status: updatedAlumni.status })
    }

    return NextResponse.json({
      success: true,
      alumni: updatedAlumni.alumni,
      ...(identityChanged ? { message: 'Your corrected profile has been resubmitted for verification.' } : {}),
    }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (typeof error === 'object' && error !== null && 'code' in error && error.code === 'P2002') {
      return NextResponse.json({ error: 'This CNIC is already registered to another alumni profile.' }, { status: 409 });
    }
    return NextResponse.json(
      { error: 'Failed to update profile due to an unexpected server issue. Please try again later.' }, 
      { status: 500 }
    );
  }
}
