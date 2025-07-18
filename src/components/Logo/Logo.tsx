import { Flex, Text } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import classes from "./Logo.module.css";
import pp_logo from "/public/static/icons/pp-logo.png";

interface Props {
	width?: string;
	height?: string;
}

export const Logo: React.FC<Props> = () => {
	return (
		<Flex direction="row" align="center" gap={5}>
			<Image src={pp_logo} alt="Platform Logo" height={32} />
			<Link
				href="/"
				style={{ textDecoration: "none" }}
				className={classes.heading}
			>
				<Text fw="bolder" size="xl">
					Platforma
					<Text component="span" fw="normal" className={classes.subheading}>
						Piwna
					</Text>
				</Text>
			</Link>
			<Text
				fw={600}
				style={{
					display: "inline-block",
					padding: "2px 12px",
					borderRadius: "999px",
					background: "linear-gradient(90deg, #F4B731 0%, #D68A1D 100%)",
					color: "#2C2520", // dark text for contrast
					fontSize: 14,
					letterSpacing: 1,
					boxShadow: "0 1px 3px 0 rgba(44,37,32,0.08)",
				}}
			>
				v0.0.1
			</Text>
		</Flex>
	);
};
