import {
  Avatar,
  Flex,
  Text,
  UnstyledButton,
  type UnstyledButtonProps,
} from "@mantine/core";
import classes from "./UserButton.module.css";
import { signOut, useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface UserButtonProps extends UnstyledButtonProps {
  image: string;
  name: string;
  email: string;
}

export function UserButton({ image, name, email }: UserButtonProps) {
  const { data: session } = useSession();

	const handleOnClick = async () => {
		await signOut();
		redirect('/login');
	}
  return (
    <UnstyledButton className={classes.user} onClick={handleOnClick}>
      <Flex direction="row" gap={8}>
        <Avatar src={session?.user?.image} radius="xl" />

        <div style={{ flex: 1 }}>
          <Text size="sm" w={500}>
            {session?.user?.name}
          </Text>

          <Text c="dimmed" size="xs">
            {session?.user?.email}
          </Text>
        </div>
      </Flex>
    </UnstyledButton>
  );
}
