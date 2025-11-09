import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@next-auth/prisma-adapter'
import { prisma } from './prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // DEMO CREDENTIALS - Remove in production!
        const demoUsers = {
          'admin@diptrack.com': { password: 'admin123', roles: ['admin'], name: 'Admin User' },
          'operator@diptrack.com': { password: 'operator123', roles: ['operator'], name: 'Operator User' },
          'qc@diptrack.com': { password: 'qc123', roles: ['qc_officer'], name: 'QC Officer' }
        };

        const demoUser = demoUsers[credentials.email as keyof typeof demoUsers];
        
        if (!demoUser || demoUser.password !== credentials.password) {
          return null;
        }

        return {
          id: credentials.email,
          email: credentials.email,
          name: demoUser.name,
          roles: demoUser.roles
        }
      }
    })
  ],
  session: {
    strategy: 'jwt'
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.roles = (user as any).roles
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub!
        session.user.roles = token.roles as string[]
      }
      return session
    }
  },
  pages: {
    signIn: '/login'
  }
}