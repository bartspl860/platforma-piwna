import { auth } from "@/auth";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const session = await auth();
	if (!session) await redirect("/login");
	return (
		<PageContainer title="Dashboard">
			Dashboard
		</PageContainer>
	);
}
