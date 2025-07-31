import { auth } from "@/auth";
import LoginForm from "@/components/Auth/LoginForm";
import { redirect } from "next/navigation";

export default async function Login() {
	const session = await auth();
		if (session) await redirect("/");
  return <LoginForm />;
}
