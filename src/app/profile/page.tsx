
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useUser } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

// Move applyTheme outside component to ensure stability
const applyTheme = (t: "system" | "light" | "dark") => {
  if (typeof window === "undefined") return;
  const root = document.documentElement;
  if (t === "dark") {
    root.classList.add("dark");
  } else if (t === "light") {
    root.classList.remove("dark");
  } else {
    // system: follow OS preference
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    root.classList.toggle("dark", prefersDark);
  }
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { toast } = useToast();
  const [loaded, setLoaded] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [goals, setGoals] = useState("");
  const [theme, setTheme] = useState<"system" | "light" | "dark">("system");
  const [reducedMotion, setReducedMotion] = useState(false);
  const [primaryCondition, setPrimaryCondition] = useState("");
  const [objective, setObjective] = useState("");
  const [region, setRegion] = useState("");
  const [diet, setDiet] = useState("");
  const [allergies, setAllergies] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("");
  const [activityLevel, setActivityLevel] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    
    try {
      const prefsRaw = localStorage.getItem("hh_prefs");
      if (prefsRaw) {
        const prefs = JSON.parse(prefsRaw);
        setDisplayName(prefs.displayName || user?.firstName || "");
        setGoals(prefs.goals || "");
        setTheme(prefs.theme || "system");
        setReducedMotion(!!prefs.reducedMotion);
        setPrimaryCondition(prefs.primaryCondition || "");
        setObjective(prefs.objective || "");
        setRegion(prefs.region || "");
        setDiet(prefs.diet || "");
        setAllergies(prefs.allergies || "");
        setAge(prefs.age || "");
        setSex(prefs.sex || "");
        setActivityLevel(prefs.activityLevel || "");
        applyTheme(prefs.theme || "system");
      } else {
        // Initialize with user data if available
        if (user?.firstName) {
          setDisplayName(user.firstName);
        }
      }
    } catch {}
    setLoaded(true);
  }, [isLoaded, user]);

  useEffect(() => {
    if (!isLoaded) return;
    if (!user) {
      router.replace("/sign-in");
    }
  }, [isLoaded, user, router]);

  const savePreferences = () => {
    const prefs = { displayName, goals, theme, reducedMotion, primaryCondition, objective, region, diet, allergies, age, sex, activityLevel };
    localStorage.setItem("hh_prefs", JSON.stringify(prefs));
    applyTheme(theme);
  };

  const clearAllData = () => {
    try {
      localStorage.removeItem("hh_prefs");
      // Reset all state to initial values
      setDisplayName(user?.firstName || "");
      setGoals("");
      setTheme("system");
      setReducedMotion(false);
      setPrimaryCondition("");
      setObjective("");
      setRegion("");
      setDiet("");
      setAllergies("");
      setAge("");
      setSex("");
      setActivityLevel("");
      applyTheme("system");
      // Show success feedback
      toast({
        title: "Preferences cleared",
        description: "All your preferences have been reset to default values.",
      });
    } catch (error) {
      console.error("Error clearing preferences:", error);
      toast({
        title: "Error",
        description: "Failed to clear preferences. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (!isLoaded || !user) {
    return (
      <div className="container mx-auto py-12 px-6 max-w-4xl">
        <Card className="glass rounded-2xl">
          <CardContent className="p-12">
            <div className="flex items-center justify-center">
              <div className="text-muted-foreground">Loading...</div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-12 px-6 max-w-4xl space-y-6">
      {/* Personalized Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="glass rounded-2xl border-2 border-gradient-to-r from-[#22d3ee]/20 to-[#7c3aed]/20">
          <CardContent className="p-6">
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight font-[var(--font-manrope)] bg-gradient-to-r from-[#22d3ee] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent">
              Welcome back, {user.firstName || user.emailAddresses[0]?.emailAddress?.split("@")[0] || "User"} 🌿
            </h1>
            <p className="text-muted-foreground mt-2 font-[var(--font-inter)]">
              Manage your health preferences and track your wellness journey
            </p>
          </CardContent>
        </Card>
      </motion.div>

      <Card className="glass rounded-2xl">
        <CardHeader>
          <CardTitle>Account</CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <div className="text-sm text-muted-foreground">Signed in as</div>
            <div className="text-base font-medium">{user.emailAddresses[0]?.emailAddress ?? "Not signed in"}</div>
            {user.createdAt && (
              <div className="text-sm text-muted-foreground">
                Member since {new Date(user.createdAt).toLocaleDateString()}
              </div>
            )}
            <div className="pt-3 flex gap-3">
              <Button 
                onClick={clearAllData} 
                className="rounded-xl btn-outline-glass hover:scale-[1.02] cursor-pointer"
                type="button"
              >
                Clear preferences
              </Button>
            </div>
          </div>
          <div className="space-y-3">
            <label className="text-sm font-medium">Display name</label>
            <Input value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="e.g., Alex" className="rounded-xl" />
            <div className="grid grid-cols-2 gap-3 pt-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Theme</label>
                <select
                  className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value as any)}
                >
                  <option value="system">System</option>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
              <div className="grid gap-2 items-start">
                <label className="text-sm font-medium">Reduced motion</label>
                <div className="flex items-center gap-2">
                  <input
                    id="reduced-motion"
                    type="checkbox"
                    checked={reducedMotion}
                    onChange={(e) => setReducedMotion(e.target.checked)}
                    className="h-4 w-4"
                  />
                  <label htmlFor="reduced-motion" className="text-sm text-muted-foreground">Prefer fewer animations</label>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-3 pt-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Primary condition</label>
                <select
                  className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2"
                  value={primaryCondition}
                  onChange={(e) => setPrimaryCondition(e.target.value)}
                >
                  <option value="">— None —</option>
                  <option>Diabetes</option>
                  <option>Heart health</option>
                  <option>Hypertension</option>
                  <option>Weight management</option>
                  <option>PCOS</option>
                  <option>IBS</option>
                  <option>Cholesterol</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Objective</label>
                <Input
                  value={objective}
                  onChange={(e) => setObjective(e.target.value)}
                  placeholder="e.g., defend against diabetes, become leaner"
                  className="rounded-xl"
                />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3 pt-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Region</label>
                <Input value={region} onChange={(e) => setRegion(e.target.value)} placeholder="e.g., India" className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Diet</label>
                <select className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2" value={diet} onChange={(e) => setDiet(e.target.value)}>
                  <option value="">— Select —</option>
                  <option>Vegetarian</option>
                  <option>Vegan</option>
                  <option>Halal</option>
                  <option>Jain</option>
                  <option>Keto</option>
                  <option>Pescatarian</option>
                  <option>Omnivore</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Allergies</label>
                <Input value={allergies} onChange={(e) => setAllergies(e.target.value)} placeholder="e.g., peanuts, lactose" className="rounded-xl" />
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-3 pt-2">
              <div className="grid gap-2">
                <label className="text-sm font-medium">Age</label>
                <Input value={age} onChange={(e) => setAge(e.target.value)} placeholder="e.g., 28" className="rounded-xl" />
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Sex</label>
                <select className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2" value={sex} onChange={(e) => setSex(e.target.value)}>
                  <option value="">— Select —</option>
                  <option>M</option>
                  <option>F</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="grid gap-2">
                <label className="text-sm font-medium">Activity level</label>
                <select className="rounded-xl border bg-white/70 backdrop-blur px-3 py-2" value={activityLevel} onChange={(e) => setActivityLevel(e.target.value)}>
                  <option value="">— Select —</option>
                  <option>Sedentary</option>
                  <option>Light</option>
                  <option>Moderate</option>
                  <option>High</option>
                </select>
              </div>
            </div>
            <div className="pt-3">
              <Button onClick={savePreferences} className="rounded-xl btn-gradient hover:scale-[1.02]">Save preferences</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="glass rounded-2xl">
        <CardHeader>
          <CardTitle>Health goals</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="text-sm text-muted-foreground">Describe what you’re focusing on. This stays on your device.</div>
          <Textarea
            value={goals}
            onChange={(e) => setGoals(e.target.value)}
            placeholder="e.g., Lower added sugars, increase fiber, avoid seed oils"
            className="min-h-[160px] rounded-xl bg-white/70 backdrop-blur border-white/40"
          />
          <div>
            <Button onClick={savePreferences} className="rounded-xl btn-outline-glass hover:scale-[1.02]">Save goals</Button>
          </div>
        </CardContent>
      </Card>

      <Card className="glass rounded-2xl">
        <CardHeader>
          <CardTitle>Quick actions</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button asChild className="rounded-xl btn-gradient hover:scale-[1.02]">
            <a href="/assessment">Start a new assessment</a>
          </Button>
          <Button asChild className="rounded-xl btn-outline-glass hover:scale-[1.02]">
            <a href="/">Go to home</a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
