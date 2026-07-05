import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { authConfig } from "./auth.config";

import { CredentialsSignin } from "next-auth";

class InvalidCredentialsError extends CredentialsSignin {
  constructor(public code: string) {
    super();
  }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new InvalidCredentialsError("Email and password are required.");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
          include: { alumni: true },
        });

        if (!user) {
          throw new InvalidCredentialsError("Invalid email or password.");
        }

        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.passwordHash
        );

        if (!isValid) {
          throw new InvalidCredentialsError("Invalid email or password.");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.alumni ? `${user.alumni.firstName} ${user.alumni.lastName}` : "Admin",
          role: user.role,
          verificationStatus: user.alumni?.verificationStatus,
          firstName: user.alumni?.firstName,
          lastName: user.alumni?.lastName,
        };
      },
    }),
  ],
});
