import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { User } from "next-auth";
import { prisma } from "./prisma";
import bcrypt from "bcryptjs";
import Credentials from "next-auth/providers/credentials";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: { strategy: "jwt" },
  adapter: PrismaAdapter(prisma),
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        // If no users, create the first user
        if ((await prisma.user.count()) === 0) {
          const firstUser = await prisma.user.create({
            data: {
              email: credentials.email as string,
              hashedPassword: bcrypt.hashSync(
                credentials.password as string,
                10
              ),
            },
          });
          return firstUser;
        }
        // Normal login
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.hashedPassword) {
          return null;
        }
        const isValid = await bcrypt.compare(
          credentials.password as string,
          user.hashedPassword
        );
        if (!isValid) {
          return null;
        }
        return user;
      },
    }),
  ],
	callbacks: {
		async jwt({ token, user }: { token: JWT; user?: User }) {
			// On login, `user` is available
			if (user) {
				token.id = user.id;
				token.name = user.name;
				token.email = user.email;
				token.image = user.image;
			} else if (token?.email) {
				// On session refresh, re-fetch user
				const dbUser = await prisma.user.findUnique({
					where: { email: token.email },
					select: {
						id: true,
						name: true,
						email: true,
						image: true,
					},
				});

				if (dbUser) {
					token.id = dbUser.id;
					token.name = dbUser.name;
					token.email = dbUser.email;
					token.image = dbUser.image;
				}
			}

			return token;
		},

		async session({ session, token }: { session: Session; token: JWT }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.name = token.name as string;
				session.user.email = token.email as string;
				session.user.image = token.image as string;
			}

			return session;
		},
	},
});
