"use client";
import { Box } from "@mantine/core";
import BeerPourAnimation from "../BeerPourAnimation/BeerPourAnimation";

export default function BeerSplashScreen() {
  return (
    <Box
      style={{
        position: "fixed",
        inset: 0,
        width: "100vw",
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <BeerPourAnimation />
    </Box>
  );
}
