import { PrismaAdapter } from '@next-auth/prisma-adapter';
import bcrypt from 'bcryptjs';
import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { PrismaClient } from '@/app/generated/prisma';
import { env } from '@/env';

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
        if ((await prisma.user.findMany()).length === 0) {
          const firstUser = prisma.user.create({
            data: {
              email: credentials.email,
              hashedPassword: bcrypt.hashSync(credentials.password, 10),
            },
          });
          return firstUser;
        }
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
};

export default NextAuth(authOptions);
