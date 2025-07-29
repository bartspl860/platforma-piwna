import { PrismaAdapter } from "@next-auth/prisma-adapter";
import bcrypt from "bcryptjs";
import NextAuth, { User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { env } from "env";
import { Session } from "next-auth";
import { JWT } from "next-auth/jwt";
import { prisma } from "@/prisma";

export const authOptions = {
	adapter: PrismaAdapter(prisma),
	providers: [
		CredentialsProvider({
			name: "Credentials",
			credentials: {
				email: { label: "Email", type: "email" },
				password: { label: "Password", type: "password" },
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
				const isValid = await bcrypt.compare(
					credentials.password,
					user.hashedPassword
				);
				if (!isValid) {
					return null;
				}
				return user;
			},
		}),
	],
	session: { strategy: "jwt" as const },
	secret: env.NEXTAUTH_SECRET,
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
};

// For app/api/auth/[...nextauth]/route.ts
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
