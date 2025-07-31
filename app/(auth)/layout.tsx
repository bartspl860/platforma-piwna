import { Box, Title, Text } from "@mantine/core";
import classes from "./layout.module.css";
import logo from "/public/logo.png";
import Image from "next/image";

interface Props {
	children: React.ReactNode;
}

export default function AuthLayout({ children }: Props) {
	return (
		<Box className={classes.wrapper}>
			<Image src={logo} alt="Platform Logo" width={72} />
			<Title order={1} fw="bolder">
				Platforma
				<Title component="span" fw="normal">
					Piwna
				</Title>
			</Title>
			<Text c="dimmed" size="sm" mt={5}>
				Testuj, oceniaj, analizuj!
			</Text>
			<Box w={400}>{children}</Box>
		</Box>
	);
}
