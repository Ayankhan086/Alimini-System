import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Strict Zod schema for registration data validation and sanitization
const registerSchema = z.object({
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  cnic: z.string().trim().regex(/^[0-9]{5}-[0-9]{7}-[0-9]$/, "CNIC must follow format: XXXXX-XXXXXXX-X").optional().or(z.literal('')),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Phone must be a valid number with 10-15 digits").optional().or(z.literal('')),
  degreeLevel: z.string().trim().min(2).max(50),
  program: z.string().trim().min(2).max(100),
  admissionYear: z.string().regex(/^[0-9]{4}$/, "Must be a 4-digit year"),
  graduationYear: z.string().regex(/^[0-9]{4}$/, "Must be a 4-digit year"),
  registrationNumber: z.string().trim().min(3).max(50),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    
    // ── Validation & Sanitization ─────────────────────────────────────────
    const parseResult = registerSchema.safeParse(body);
    
    if (!parseResult.success) {
      // Return the first error message encountered
      return NextResponse.json(
        { error: parseResult.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parseResult.data;
    
    // Convert CNIC and Phone to null if they are empty strings
    const cnic = data.cnic === '' ? null : data.cnic;
    const phone = data.phone === '' ? null : data.phone;

    // ── Check for existing records ─────────────────────────────────────────
    // Check if user exists with this email
    const existingEmail = await prisma.user.findUnique({ where: { email: data.email } });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check if alumni exists with this CNIC
    if (cnic) {
      const existingCnic = await prisma.alumni.findUnique({ where: { cnic } });
      if (existingCnic) {
        return NextResponse.json(
          { error: "An account with this CNIC already exists." },
          { status: 409 }
        );
      }
    }

    // Check if alumni exists with this Registration Number (mapped to rollNumber in db)
    if (data.registrationNumber) {
      const existingRoll = await prisma.alumni.findUnique({ where: { rollNumber: data.registrationNumber } });
      if (existingRoll) {
        return NextResponse.json(
          { error: "An account with this registration number already exists." },
          { status: 409 }
        );
      }
    }

    // ── Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // ── Create user and alumni profile in a transaction ────────────────────
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: hashedPassword,
          role: "ALUMNI",
        },
      });

      // 2. Create Alumni Profile
      const alumni = await tx.alumni.create({
        data: {
          userId: user.id,
          firstName: data.firstName,
          lastName: data.lastName,
          cnic: cnic,
          phone: phone,
          degreeLevel: data.degreeLevel,
          program: data.program,
          admissionYear: parseInt(data.admissionYear),
          graduationYear: parseInt(data.graduationYear),
          rollNumber: data.registrationNumber,
          verificationStatus: "PENDING",
        },
      });

      return { user, alumni };
    });

    return NextResponse.json(
      {
        message: "Registration successful! You can now sign in.",
        userId: result.user.id,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[REGISTER_ERROR]", error);
    return NextResponse.json(
      { error: "Registration failed due to an unexpected server issue. Please try again later." },
      { status: 500 }
    );
  }
}
