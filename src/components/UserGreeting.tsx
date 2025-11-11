"use client";

import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

export function UserGreeting() {
  // Check if Clerk is configured
  if (!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY) {
    return null;
  }

  const { isSignedIn, user, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return null;
  }

  const displayName =
    user.firstName ||
    user.emailAddresses[0]?.emailAddress?.split("@")[0] ||
    "User";

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-6 pt-6 pb-2 max-w-6xl"
    >
      <Card className="glass rounded-2xl border-2 border-gradient-to-r from-[#22d3ee]/20 to-[#7c3aed]/20">
        <CardContent className="p-4 md:p-6">
          <h2 className="text-xl md:text-2xl font-bold tracking-tight font-[var(--font-manrope)] bg-gradient-to-r from-[#22d3ee] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent">
            Welcome back, {displayName} 🌿
          </h2>
          <p className="text-muted-foreground mt-1 text-sm font-[var(--font-inter)]">
            Ready to continue your wellness journey?
          </p>
        </CardContent>
      </Card>
    </motion.div>
  );
}
