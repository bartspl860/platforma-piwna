import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { DashboardContent } from "@/components/Dashboard/DashboardContent";
import { PageContainer } from "@/components/PageContainer/PageContainer";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

export default async function Dashboard() {
	const session = await getServerSession(authOptions);
	if (!session) await redirect("/login");
	return (
		<PageContainer title="Dashboard">
			<DashboardContent />
		</PageContainer>
	);
}
