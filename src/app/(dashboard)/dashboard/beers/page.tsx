import { BeerPaginationTable } from "@/components/Beers/BeerTable/BeerPaginationTable";
import { PageContainer } from "@/components/PageContainer/PageContainer";

export default function BeersPage() {
	return (
		<PageContainer title="Baza piw">
			<BeerPaginationTable />;
		</PageContainer>
	);
}
