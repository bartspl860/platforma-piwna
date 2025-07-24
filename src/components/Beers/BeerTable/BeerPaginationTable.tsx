"use client";

import { Button, Group, Modal, Paper, Title } from "@mantine/core";
import { MantineReactTable, type MRT_ColumnDef } from "mantine-react-table";
import { useMemo, useState } from "react";
import { useCustomTable } from "@/hooks/use-custom-table";
import { useBeers } from "@/services/beers";
import { Beer } from "@/services/beers/types";
import { useDisclosure } from "@mantine/hooks";
import { urlToFile } from "@/services/common";
import { useRouter } from "next/navigation";
import BeerForm, { BeerFormValues } from "../AddBeerForm";

export function BeerPaginationTable() {
	const { data, isError, isFetching, isLoading, refetch } = useBeers();
	const [editFormBeer, setEditFormBeer] = useState<{
		initialValues: BeerFormValues;
		beerId: string;
	}>();
	const [modalOpened, { open, close }] = useDisclosure(false);
	const router = useRouter();

	const openModal = async (beer?: Beer) => {
		if (beer) {
			const formBeer: BeerFormValues = {
				name: beer.name,
				alcohol: beer.alcohol,
				price: beer.price,
				category: beer.category,
				image: await urlToFile(beer.image),
			};
			setEditFormBeer({ initialValues: formBeer, beerId: beer.id });
			open();
			return;
		}
		setEditFormBeer(undefined);
		open();
	};

	const columns = useMemo<MRT_ColumnDef<Beer>[]>(
		() => [
			{
				accessorKey: "name",
				header: "Nazwa",
			},
			{
				accessorKey: "alcohol",
				header: "Alkohol",
				filterVariant: "range",
				minSize: 1,
				Cell: ({ cell }) => `${cell.getValue()}%`,
			},
			{
				accessorKey: "price",

				header: "Cena",

				Cell: ({ cell }) =>
					cell.getValue<number>().toLocaleString("pl", {
						style: "currency",
						currency: "PLN",
					}),

				filterVariant: "range-slider",
				filterFn: (row, columnId, filterValue) => {
					const value = row.getValue(columnId);
					if (
						typeof value !== "number" ||
						!Array.isArray(filterValue) ||
						filterValue.length !== 2
					) {
						return false;
					}
					return value >= filterValue[0] && value <= filterValue[1];
				},
				mantineFilterRangeSliderProps: {
					max: 30,
					min: 0,
					step: 1,
					minRange: 1,
					label: (value) =>
						value.toLocaleString("pl", {
							style: "currency",
							currency: "PLN",
						}),
				},
			},
			{
				accessorKey: "category",
				header: "Kategoria",
				filterVariant: "select",
			},
			{
				accessorKey: "image",
				header: "Obraz",
				enableColumnFilter: false,
				Cell: ({ cell }) => (
					<img
						src={cell.getValue<string>()}
						alt="<Brak>"
						style={{
							width: 50,
							height: 50,
							objectFit: "cover",
							borderRadius: 8,
						}}
					/>
				),
			},
			{
				accessorKey: "createdAt",
				header: "Data dodania",
				filterVariant: "date-range",
				accessorFn: (originalRow) => new Date(originalRow.createdAt),
				Cell: ({ cell }) => new Date(cell.getValue<string>()).toLocaleString(),
			},
			{
				id: "actions",
				header: "Akcje",
				Cell: ({ row }) => (
					<Group gap={8}>
						<Button
							size="xs"
							variant="light"
							onClick={(e) => {
								e.stopPropagation();
								openModal(row.original);
							}}
						>
							Edytuj
						</Button>
						<Button
							size="xs"
							color="red"
							variant="light"
							// onClick={() => onDelete(row.original)}
						>
							Usuń
						</Button>
					</Group>
				),
				enableSorting: false,
				enableColumnFilter: false,
			},
		],
		[]
	);

	const table = useCustomTable<Beer>({
		columns,
		data: data ?? [],
		rowCount: data?.length ?? 0,
		state: {
			isLoading,
			showAlertBanner: isError,
			showProgressBars: isFetching,
		},
		initialState: { showColumnFilters: true },
		mantineTableBodyRowProps: ({ row }) => ({
			onClick:  () => {
				router.push(`/dashboard/beers/${row.original.id}`)
			},
			style: { cursor: "pointer" },
		}),
	});

	return (
		<>
			<Modal centered opened={modalOpened} onClose={close}>
				<BeerForm
					editData={editFormBeer}
					onFormSubmit={() => {
						close();
						refetch();
					}}
				/>
			</Modal>
			<Paper withBorder radius="md" p="md" mt="lg">
				<Group align="center" mb="md">
					<Title order={5}>Baza Piw</Title>
					<Button size="xs" onClick={() => openModal()}>
						Dodaj piwo
					</Button>
				</Group>
				<MantineReactTable table={table} />
			</Paper>
		</>
	);
}
