"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useToast } from "@/hooks/use-toast";

const WELCOME_SHOWN_KEY = "health_heaven_welcome_shown";

export function WelcomeNotification() {
  const { user, isLoaded } = useUser();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoaded || !user) return;

    // Check if we've already shown the welcome message for this user
    const welcomeShown = localStorage.getItem(WELCOME_SHOWN_KEY);
    const userId = user.id;

    // Check if this is a new user (account created in the last 5 minutes)
    if (user.createdAt) {
      const accountAge = Date.now() - new Date(user.createdAt).getTime();
      const fiveMinutes = 5 * 60 * 1000; // 5 minutes in milliseconds

      // If account is less than 5 minutes old and we haven't shown welcome for this user
      if (accountAge < fiveMinutes && welcomeShown !== userId) {
        // Show congratulations toast
        toast({
          title: "🎉 Welcome to Health Heaven!",
          description: "Congratulations! You are now part of the Health Heaven family. Start your wellness journey today!",
          duration: 6000, // Show for 6 seconds
        });

        // Mark as shown for this user
        localStorage.setItem(WELCOME_SHOWN_KEY, userId);
      }
    }
  }, [isLoaded, user, toast]);

  return null; // This component doesn't render anything
}


