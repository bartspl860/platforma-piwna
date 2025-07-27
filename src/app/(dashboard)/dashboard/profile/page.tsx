import { PageContainer } from "@/components/PageContainer/PageContainer";
import UserProfileForm from "@/components/Profile/ProfileForm";
import { PrismaClient } from "@/prisma/generated";
import { UserFormValues } from "@/services/users/schema";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

const prisma = new PrismaClient();

export default async function ProfilePage() {
	const session = await getServerSession();
	if (!session) redirect("/login");

	const userForm: UserFormValues = {
		name: session.user.name ?? "",
		email: session.user.email ?? "",
		image: session.user.image ?? null,
	};

	const user = await prisma.user.findUnique({
		where: {
			email: userForm.email,
		},
		select: {
			id: true,
		},
	});

	if (!user) redirect("/dashboard");

	return (
		<PageContainer title="Twój profil">
			<UserProfileForm
				editData={{
					initialValues: userForm,
					userId: user.id,
				}}
			/>
		</PageContainer>
	);
}
