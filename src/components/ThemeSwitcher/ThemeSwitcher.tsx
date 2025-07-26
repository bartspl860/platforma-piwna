"use client";

import { useEffect, useState } from "react";
import { Within } from "@theme-toggles/react";
import "@theme-toggles/react/css/Within.css";

import {
  useMantineColorScheme,
  ActionIcon,
  Tooltip,
  Center,
} from "@mantine/core";

export const ThemeSwitcher = () => {
  const { colorScheme, setColorScheme } = useMantineColorScheme();
  const [mounted, setMounted] = useState(false);
  const [toggled, setToggled] = useState(false);

  useEffect(() => {
    setMounted(true);
    setToggled(colorScheme === "dark"); // set initial toggle state
  }, [colorScheme]);

  const handleToggle = () => {
    const next = colorScheme === "dark" ? "light" : "dark";
    setColorScheme(next);
    setToggled(next === "dark"); // ensure immediate re-render
  };

  if (!mounted) return null;

  return (
    <Tooltip label={toggled ? "Switch to light mode" : "Switch to dark mode"} withArrow>
      <ActionIcon
        variant="default"
        size="lg"
        radius="xl"
        onClick={handleToggle}
        aria-label="Toggle theme"
      >
        <Center>
          <Within placeholder={'Toggle dark theme'} toggled={toggled} duration={500} />
        </Center>
      </ActionIcon>
    </Tooltip>
  );
};
