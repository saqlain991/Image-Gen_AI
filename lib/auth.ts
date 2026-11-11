import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "@/lib/db";
import { compare } from "bcrypt";

// Define a UserRole type that matches your role values
type UserRole = "GUEST" | "FREE" | "PRO" | undefined;

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        const user = await db.user.findUnique({
          where: {
            email: credentials.email,
          },
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(credentials.password, user.password);

        if (!isPasswordValid) {
          return null;
        }

        // Cast user.role as a UserRole to ensure proper type
        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role as UserRole,  // Assert that role is one of UserRole
        };
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.name = token.name as string;
        session.user.email = token.email as string;

        // Make sure to assert role as UserRole in the session object
        session.user.role = token.role as UserRole;  // Type assertion for role
      }

      return session;
    },
    async jwt({ token, user }) {
      // If user is null or undefined, just return the token
      if (!user) {
        return token;
      }

      const dbUser = await db.user.findFirst({
        where: {
          email: token.email, // Check for user by email in DB
        },
      });

      // If dbUser is not found, return the token as is
      if (!dbUser) {
        return token;
      }

      // Assert that the dbUser.role is of type UserRole
      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        role: dbUser.role as UserRole,  // Type assertion for role
      };
    },
  },
};
