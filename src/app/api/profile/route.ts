import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const updateProfileSchema = z.object({
  avatarUrl: z.string().optional(),
  currentEmployer: z.string().optional(),
  jobTitle: z.string().optional(),
  industry: z.string().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
  linkedinUrl: z.string().optional(),
  skills: z.array(z.string()).optional(),
  phone: z.string().optional(),
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
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
