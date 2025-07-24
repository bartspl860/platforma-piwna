import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { env } from 'env';
import { PrismaClient } from '@/prisma/generated';
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";


const prisma = new PrismaClient();

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // If no users, create the first user
        if ((await prisma.user.count()) === 0) {
          const firstUser = await prisma.user.create({
            data: {
              email: credentials.email,
              hashedPassword: bcrypt.hashSync(credentials.password, 10),
            },
          });
          return firstUser;
        }
        // Normal login
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user || !user.hashedPassword) {
          return null;
        }
        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword);
        if (!isValid) {
          return null;
        }
        return user;
      },
    }),
  ],
  session: { strategy: 'jwt' as const },
  secret: env.NEXTAUTH_SECRET,
	callbacks: {
  async session({
    session,
    token,
  }: {
    session: Session;
    token?: JWT;
  }) {
    if (session.user && token?.sub) {
      (session.user as any).id = token.sub;
    }
    return session;
  },
},
};

// For app/api/auth/[...nextauth]/route.ts
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
