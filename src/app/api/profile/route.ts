import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
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
});

export async function PUT(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user || !session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await req.json();
    const data = updateProfileSchema.parse(body);

    // Update the Alumni record associated with the current user
    const updatedAlumni = await prisma.alumni.update({
      where: {
        userId: session.user.id,
      },
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
      },
    });

    return NextResponse.json({ success: true, alumni: updatedAlumni }, { status: 200 });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.issues }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to update profile due to an unexpected server issue. Please try again later.' }, 
      { status: 500 }
    );
  }
}
