import { PageContainer } from "@/components/PageContainer/PageContainer";
import { prisma } from "@/prisma";
import { UserFormValues } from "@/services/users/schema";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import UserProfileForm from "@/components/Profile/ProfileForm";

export default async function ProfilePage() {
	const session = await getServerSession();
	if (!session) redirect("/login");

	const user = await prisma.user.findUnique({
		where: {
			email: session.user.email,
		},
		select: {
			id: true,
			name: true,
			email: true,
			image: true,
		},
	});

	if (!user) redirect("/dashboard");

	const userForm: UserFormValues = {
		name: user.name ?? "",
		email: user.email,
		image: user.image ?? null,
	};

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
