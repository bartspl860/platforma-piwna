import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@theme-toggles/react/css/Within.css"
import {
	ColorSchemeScript,
	DirectionProvider,
	MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { inter } from "styles/fonts";
import { theme } from "styles/theme";
import { AppProvider } from "./provider";

export const metadata = {
	title: { default: "Platforma Piwna" },
	description: "Platforma do oceniania piw.",
};

export default function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="en-US">
			<head>
				{/* <ColorSchemeScript defaultColorScheme="auto" /> */}
				<meta
					name="viewport"
					content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
				/>
			</head>
			<body className={inter.className}>
				<DirectionProvider>
					<MantineProvider theme={theme}>
						<ModalsProvider>
							<AppProvider>{children}</AppProvider>
						</ModalsProvider>
						<Notifications />
					</MantineProvider>
				</DirectionProvider>
			</body>
		</html>
	);
}
