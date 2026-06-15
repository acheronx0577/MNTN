import { getCurrentUser } from "@/lib/auth";
import Header from "./Header";

export default async function HeaderUser() {
  const user = await getCurrentUser();

  return (
    <Header
      user={user ? { name: user.name, email: user.email } : null}
    />
  );
}
