import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import UsersGrid from "@/components/Users/UsersGrid";
import { prisma } from "prisma";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function UsersPage() {
	const session = await getServerSession(authOptions);
	if (!session) await redirect("/login");

	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	});

	return (
		<PageContainer title="Uczestnicy">
			<UsersGrid users={users} />
		</PageContainer>
	)
}
