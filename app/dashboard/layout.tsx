"use client";

import {
  AppShell,
  Burger,
  Center,
  Text,
  useMantineColorScheme,
  useMantineTheme,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { AdminHeader } from "@/components/Headers/AdminHeader";
import { Navbar } from "@/components/Navbar/Navbar";
import { navLinks } from "config";
import { useEffect, useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: Props) {
  const [opened, { toggle }] = useDisclosure();
  const [mounted, setMounted] = useState(false);
  const { colorScheme } = useMantineColorScheme();
  const theme = useMantineTheme();

  const isDark = colorScheme === "dark";
  const bg = isDark ? theme.colors.dark[7] : theme.colors.gray[0];

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{
        width: 300,
        breakpoint: "sm",
        collapsed: { mobile: !opened, desktop: !opened },
      }}
      padding="md"
      transitionDuration={500}
      transitionTimingFunction="ease"
      withBorder={false}
      layout="default"
    >
      <AppShell.Header>
        <AdminHeader
          burger={
            <Burger opened={opened} onClick={toggle} size="sm" color="beer.4" />
          }
        />
      </AppShell.Header>

      <AppShell.Navbar>
        <Navbar data={navLinks} hidden={!opened} />
      </AppShell.Navbar>

      <AppShell.Main style={{ flexGrow: 1 }}>{children}</AppShell.Main>

      <AppShell.Footer
        style={{
          marginTop: "auto",
        }}
      >
        <Center>
          {/* Only render after mount to avoid hydration error */}
          {mounted && (
            <Text w="full" size="sm" c={isDark ? "platform.6" : "platform.1"}>
              © {new Date().getFullYear()} Name Surname
            </Text>
          )}
        </Center>
      </AppShell.Footer>
    </AppShell>
  );
}
