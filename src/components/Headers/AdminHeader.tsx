"use client";

import { ActionIcon, Box, Drawer, Stack, TextInput } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { IconSearch, IconSettings } from "@tabler/icons-react";
import classes from "./AdminHeader.module.css";
import { DirectionSwitcher } from "../DirectionSwitcher/DirectionSwitcher";
import { Logo } from "../Logo/Logo";
import { ThemeSwitcher } from "../ThemeSwitcher/ThemeSwitcher";

interface Props {
  burger?: React.ReactNode;
}

export function AdminHeader({ burger }: Props) {
  return (
    <header className={classes.header}>
      {burger && burger}
      <Logo />
      <Box style={{ flex: 1 }} />
      <TextInput
        placeholder="Search"
        variant="filled"
        leftSection={<IconSearch size="0.8rem" />}
        style={{}}
      />
      <ThemeSwitcher />
    </header>
  );
}
