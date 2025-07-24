import "@mantine/core/styles.css";
import "mantine-react-table/styles.css";

import {
	ColorSchemeScript,
	DirectionProvider,
	MantineProvider,
} from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { Notifications } from "@mantine/notifications";
import { Analytics } from "@vercel/analytics/react";
import { inter } from "@/styles/fonts";
import { theme } from "@/styles/theme";
import { AppProvider } from "./provider";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";

export const metadata = {
	title: { default: "Platforma Piwna"},
	description: "Platforma do oceniania piw.",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  return (
    <html lang="en-US">
      <head>
        <ColorSchemeScript />
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width, user-scalable=no"
        />
      </head>
      <body className={inter.className}>
        <DirectionProvider>
          <MantineProvider theme={theme}>
            <ModalsProvider>
              <AppProvider session={session}>{children}</AppProvider>
              <Analytics />
            </ModalsProvider>
            <Notifications />
          </MantineProvider>
        </DirectionProvider>
      </body>
    </html>
  );
}

