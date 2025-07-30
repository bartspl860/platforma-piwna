import { PageContainer } from "@/components/PageContainer/PageContainer";
import UsersGrid from "@/components/Users/UsersGrid";
import { prisma } from "prisma";
import { redirect } from "next/navigation";
import { auth } from "@/auth";

export default async function UsersPage() {
	const session = await auth();
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
