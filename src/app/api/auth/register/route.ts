import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      cnic,
      phone,
      degreeLevel,
      program,
      admissionYear,
      graduationYear,
      registrationNumber,
    } = body;

    // ── Validation ────────────────────────────────────────────────────────
    if (!firstName || !lastName || !email || !password || !degreeLevel || !program || !admissionYear || !graduationYear || !registrationNumber) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please enter a valid email address." },
        { status: 400 }
      );
    }

    // ── Check for existing records ─────────────────────────────────────────
    // Check if user exists with this email
    const existingEmail = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
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
    if (registrationNumber) {
      const existingRoll = await prisma.alumni.findUnique({ where: { rollNumber: registrationNumber } });
      if (existingRoll) {
        return NextResponse.json(
          { error: "An account with this registration number already exists." },
          { status: 409 }
        );
      }
    }

    // ── Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(password, 12);

    // ── Create user and alumni profile in a transaction ────────────────────
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase().trim(),
          passwordHash: hashedPassword,
          role: "ALUMNI",
        },
      });

      // 2. Create Alumni Profile
      const alumni = await tx.alumni.create({
        data: {
          userId: user.id,
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          cnic: cnic || null,
          phone: phone || null,
          degreeLevel: degreeLevel,
          program: program.trim(),
          admissionYear: parseInt(admissionYear),
          graduationYear: parseInt(graduationYear),
          rollNumber: registrationNumber.trim(),
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
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
