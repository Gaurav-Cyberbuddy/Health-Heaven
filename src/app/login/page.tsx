
"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to Clerk sign-in page
    router.replace("/sign-in");
  }, [router]);

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex items-center justify-center">
        <div className="text-muted-foreground">Redirecting to sign in...</div>
      </div>
    </div>
  );
}
