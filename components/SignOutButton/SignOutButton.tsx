"use client";

import { Button } from "@mantine/core";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <Button variant="outline" color="red" onClick={() => signOut({ callbackUrl: "/login" })}>
      Sign Out
    </Button>
  );
}