"use client";

import { VoiceHealthInput } from "@/components/VoiceHealthInput";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";

export default function VoiceEntryPage() {
  // Mock analysis function - can be replaced with real API call
  const handleSubmit = async (text: string) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Here you could:
    // 1. Send to your existing assessment API
    // 2. Analyze with Gemini AI
    // 3. Save to database
    // 4. Process ingredients if it's a meal entry
    
    console.log("Voice entry submitted:", text);
    
    // Example: If text contains ingredients, you could trigger ingredient analysis
    if (text.toLowerCase().includes("ingredient") || text.toLowerCase().includes("contains")) {
      // Trigger ingredient analysis
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 md:py-12 max-w-4xl">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-8 space-y-3"
          >
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[var(--font-manrope)] bg-gradient-to-r from-[#22d3ee] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent">
              Voice Health Entry
            </h1>
            <p className="text-muted-foreground text-lg font-[var(--font-inter)] max-w-2xl mx-auto">
              Record your meals, symptoms, or health updates using your voice. 
              Speak naturally and let AI transcribe and analyze your entries.
            </p>
          </motion.div>

          {/* Voice Input Component */}
          <VoiceHealthInput
            onSubmit={handleSubmit}
            title="Record Your Health Entry"
            description="Click the microphone button and start speaking. Your words will be transcribed automatically."
            placeholder="Your voice entry will appear here after recording..."
          />

          {/* Info Cards */}
          <div className="grid md:grid-cols-3 gap-4 mt-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-[var(--font-manrope)] flex items-center gap-2">
                    <span className="text-2xl">🎤</span>
                    Easy Recording
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-[var(--font-inter)]">
                    Just click and speak. No typing required.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-[var(--font-manrope)] flex items-center gap-2">
                    <span className="text-2xl">✏️</span>
                    Edit & Confirm
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-[var(--font-inter)]">
                    Review and edit your transcribed text before submitting.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
                <CardHeader>
                  <CardTitle className="text-lg font-[var(--font-manrope)] flex items-center gap-2">
                    <span className="text-2xl">🤖</span>
                    AI Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="font-[var(--font-inter)]">
                    Your entries are automatically analyzed for health insights.
                  </CardDescription>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Usage Tips */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-8"
          >
            <Card className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
              <CardHeader>
                <CardTitle className="font-[var(--font-manrope)]">Tips for Best Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 font-[var(--font-inter)] text-sm text-gray-300">
                <div className="flex items-start gap-2">
                  <span className="text-[#22d3ee]">•</span>
                  <span>Speak clearly and at a moderate pace</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#22d3ee]">•</span>
                  <span>Use a quiet environment for better accuracy</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#22d3ee]">•</span>
                  <span>Allow microphone access when prompted</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#22d3ee]">•</span>
                  <span>Review and edit the transcription before submitting</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-[#22d3ee]">•</span>
                  <span>Works best in Chrome, Edge, or Safari browsers</span>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
