import LoginSchema from "@/lib/schemas/login.schema"
import NextAuth, { type AuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/prisma"

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        user: { label: "Email o usuario", type: "text" },
        password: { label: "Password", type: "password" }
      },

      async authorize(credentials: { user: string, password: string }) {
        if (!credentials) return null

        const parsed = await LoginSchema.safeParseAsync(credentials)
        if (!parsed.success) return null

        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: parsed.data.user },
              { username: parsed.data.user }
            ]
          }
        })

        if (!user || !user.state) return null

        const isValid = await bcrypt.compare(
          parsed.data.password,
          user.password
        )
        if (!isValid) return null

        return {
          id: user.id,
          email: user.email,
          name: user.username
        }
      }
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name,
          token.picture = user.image
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.image = token.picture as string
      }
      return session
    }
  }
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
