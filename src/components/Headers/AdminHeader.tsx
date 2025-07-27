"use client";

import { Box, TextInput } from "@mantine/core";
import { IconSearch } from "@tabler/icons-react";
import classes from "./AdminHeader.module.css";
import { Logo } from "../Logo/Logo";
import ProfileButton from "../Profile/ProfileButton";

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
			<ProfileButton/>
    </header>
  );
}
