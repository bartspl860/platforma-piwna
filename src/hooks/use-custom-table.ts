import {
	type MRT_TableOptions,
	useMantineReactTable,
} from "mantine-react-table";

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export type CustomTableOptions<TData extends Record<string, any> = {}> = Omit<
	MRT_TableOptions<TData>,
	| "manualPagination"
	| "enablePagination"
	| "mantinePaginationProps"
	| "paginationDisplayMode"
	| "mantineTableProps.align"
	| "mantinePaperProps"
	| "initialState.density"
>;

// biome-ignore lint/complexity/noBannedTypes: <explanation>
export const useCustomTable = <TData extends Record<string, any> = {}>(
	tableOptions: CustomTableOptions<TData>
) => {
	return useMantineReactTable({
		...{
			paginationDisplayMode: "pages",
			// styles
			mantineTableProps: {
				align: "center",
			},
			positionActionsColumn: "last",
			mantinePaperProps: {
				shadow: "0",
				radius: "md",
				p: "md",
				withBorder: false,
			},
			mantineFilterTextInputProps: {
				style: { borderBottom: "unset", marginTop: "8px" },
				variant: "filled",
			},
			mantineFilterSelectProps: {
				style: { borderBottom: "unset", marginTop: "8px" },
				variant: "filled",
			},
			mantineFilterDateInputProps: {
				style: { borderBottom: "unset", marginTop: "8px" },
				variant: "filled",
				locale: 'pl',

			},
			displayColumnDefOptions: {
				"mrt-row-actions": {
					header: '',
					size: 20
				}
			},
			// features
			enableColumnActions: true,
			enableDensityToggle: true,
			enableFullScreenToggle: true,
			enableHiding: true,
			enablePinning: true,
			// states
			initialState: {
				density: "xl",
			},
			columns: [],
			data: [],
		},
		...tableOptions,
	});
};
