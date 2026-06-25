"use client";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";

export default function Home() {
  const { data } = authClient.useSession();
  console.log("🚀 ~ Home ~ data:", data);
  return (
    <div>
      asdas
      <Button onClick={async () => await authClient.signOut()}>Logout</Button>
    </div>
  );
}
