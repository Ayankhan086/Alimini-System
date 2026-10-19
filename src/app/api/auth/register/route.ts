import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

// Strict Zod schema for registration data validation and sanitization
const registerSchema = z.object({
  accountType: z.enum(["STUDENT", "ALUMNI"]).default("ALUMNI"),
  firstName: z.string().trim().min(2, "First name must be at least 2 characters").max(50),
  lastName: z.string().trim().min(2, "Last name must be at least 2 characters").max(50),
  email: z.string().trim().toLowerCase().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters").max(100),
  cnic: z.string().trim().regex(/^[0-9]{5}-[0-9]{7}-[0-9]$/, "CNIC must follow format: XXXXX-XXXXXXX-X").optional().or(z.literal('')),
  phone: z.string().trim().regex(/^\+?[0-9]{10,15}$/, "Phone must be a valid number with 10-15 digits").optional().or(z.literal('')),
  degreeLevel: z.string().trim().max(50).optional(),
  department: z.string().trim().min(2).max(100).optional(),
  program: z.string().trim().min(2).max(100).optional(),
  admissionYear: z.string().regex(/^[0-9]{4}$/, "Must be a 4-digit year"),
  graduationYear: z.string().regex(/^[0-9]{4}$/, "Must be a 4-digit year").optional(),
  registrationNumber: z.string().trim().min(3).max(50),
}).superRefine((data, context) => {
  const currentYear = new Date().getFullYear();
  const admissionYear = Number(data.admissionYear);
  const graduationYear = Number(data.graduationYear);
  if (admissionYear < 2000 || admissionYear > currentYear) {
    context.addIssue({ code: "custom", path: ["admissionYear"], message: `Admission year must be between 2000 and ${currentYear}.` });
  }
  const maximumGraduationYear = data.accountType === "STUDENT" ? currentYear + 6 : currentYear;
  if (data.accountType === "ALUMNI" && !data.cnic) {
    context.addIssue({ code: "custom", path: ["cnic"], message: "CNIC is required for alumni registration." });
  }
  if (data.accountType === "ALUMNI" && !data.degreeLevel) {
    context.addIssue({ code: "custom", path: ["degreeLevel"], message: "Degree level is required." });
  }
  if (!data.graduationYear) {
    context.addIssue({ code: "custom", path: ["graduationYear"], message: "Expected graduation year is required." });
  } else if (graduationYear <= admissionYear) {
    context.addIssue({ code: "custom", path: ["graduationYear"], message: "Graduation year must be after admission year." });
  } else if (graduationYear > maximumGraduationYear) {
    context.addIssue({ code: "custom", path: ["graduationYear"], message: `Graduation year cannot be later than ${maximumGraduationYear}.` });
  }
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => null);
    
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
    const existingEmail = await prisma.user.findFirst({
      where: { email: { equals: data.email, mode: "insensitive" } },
      select: { id: true },
    });
    if (existingEmail) {
      return NextResponse.json(
        { error: "An account with this email already exists." },
        { status: 409 }
      );
    }

    // Check if alumni exists with this CNIC
    if (cnic) {
      const existingCnic = data.accountType === "ALUMNI"
        ? await prisma.alumni.findUnique({ where: { cnic } })
        : null;
      if (existingCnic) {
        return NextResponse.json(
          { error: "An account with this CNIC already exists." },
          { status: 409 }
        );
      }
    }

    // Check if alumni exists with this Registration Number (mapped to rollNumber in db)
    const [existingAlumniRoll, existingStudentRoll] = await Promise.all([
      prisma.alumni.findUnique({ where: { rollNumber: data.registrationNumber }, select: { id: true } }),
      prisma.student.findUnique({ where: { rollNumber: data.registrationNumber }, select: { id: true } }),
    ]);
    if (existingAlumniRoll || existingStudentRoll) {
      return NextResponse.json(
        { error: "An account with this registration number already exists." },
        { status: 409 }
      );
    }

    const targetDeptName = data.department;
    if (!targetDeptName) {
      return NextResponse.json({ error: "Choose a department." }, { status: 400 });
    }
    const department = await prisma.department.findFirst({
      where: { name: { equals: targetDeptName, mode: "insensitive" } },
    });
    if (!department) {
      return NextResponse.json(
        { error: "Select a department that is already configured in the system." },
        { status: 400 }
      );
    }

    // ── Hash password ─────────────────────────────────────────────────────
    const hashedPassword = await bcrypt.hash(data.password, 12);

    // ── Create user and profile in a transaction ──────────────────────────
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email: data.email,
          passwordHash: hashedPassword,
          role: data.accountType,
        },
      });

      if (data.accountType === "STUDENT") {
        const student = await tx.student.create({
          data: {
            userId: user.id,
            departmentId: department.id,
            firstName: data.firstName,
            lastName: data.lastName,
            rollNumber: data.registrationNumber,
            admissionYear: Number(data.admissionYear),
            expectedGraduationYear: Number(data.graduationYear),
            phone,
          },
        });
        return { user, profileId: student.id };
      }

      const resolvedProgram = data.program || targetDeptName;
      const alumni = await tx.alumni.create({
        data: {
          userId: user.id,
          departmentId: department.id,
          firstName: data.firstName,
          lastName: data.lastName,
          cnic,
          phone,
          degreeLevel: data.degreeLevel!,
          program: resolvedProgram,
          admissionYear: Number(data.admissionYear),
          graduationYear: Number(data.graduationYear),
          rollNumber: data.registrationNumber,
          verificationStatus: "PENDING",
        },
      });
      return { user, profileId: alumni.id };
    });

    return NextResponse.json(
      {
        message: data.accountType === "STUDENT"
          ? "Student registration successful! You can now sign in."
          : "Registration successful! Your alumni profile is pending verification.",
        userId: result.user.id,
        role: data.accountType,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error("[REGISTER_ERROR]", error);
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "P2002"
    ) {
      return NextResponse.json(
        { error: "An account with this email, CNIC, or registration number already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Registration failed due to an unexpected server issue. Please try again later." },
      { status: 500 }
    );
  }
}
