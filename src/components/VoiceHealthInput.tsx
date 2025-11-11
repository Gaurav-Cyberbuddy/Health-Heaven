"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Icons } from "@/components/icons";
import { useToast } from "@/hooks/use-toast";

interface VoiceHealthInputProps {
  onSubmit?: (text: string) => Promise<void> | void;
  placeholder?: string;
  title?: string;
  description?: string;
}

export function VoiceHealthInput({
  onSubmit,
  placeholder = "Your transcribed text will appear here...",
  title = "Voice Health Entry",
  description = "Record your meals, symptoms, or health updates using your voice",
}: VoiceHealthInputProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [transcribedText, setTranscribedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const { toast } = useToast();

  // Check if Web Speech API is supported
  useEffect(() => {
    const SpeechRecognition =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      setIsSupported(true);
      recognitionRef.current = new SpeechRecognition();
      const recognition = recognitionRef.current;

      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = "en-US";

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        let interimTranscript = "";
        let finalTranscript = "";

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + " ";
          } else {
            interimTranscript += transcript;
          }
        }

        setTranscribedText((prev) => {
          // Remove previous interim results and add new ones
          const prevFinal = prev.replace(/\s*\[listening\.\.\.\]\s*$/, "");
          return prevFinal + finalTranscript + (interimTranscript ? " [listening...]" : "");
        });
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error("Speech recognition error:", event.error);
        setIsRecording(false);
        
        let errorMessage = "Speech recognition error occurred";
        switch (event.error) {
          case "no-speech":
            errorMessage = "No speech detected. Please try again.";
            break;
          case "audio-capture":
            errorMessage = "Microphone not found. Please check your microphone settings.";
            break;
          case "not-allowed":
            errorMessage = "Microphone permission denied. Please allow microphone access.";
            break;
          case "network":
            errorMessage = "Network error. Please check your connection.";
            break;
          default:
            errorMessage = `Error: ${event.error}`;
        }
        
        setError(errorMessage);
        toast({
          title: "Recording Error",
          description: errorMessage,
          variant: "destructive",
        });
      };

      recognition.onend = () => {
        setIsRecording(false);
        // Clean up interim text
        setTranscribedText((prev) => prev.replace(/\s*\[listening\.\.\.\]\s*$/, ""));
      };
    } else {
      setIsSupported(false);
      setError("Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.");
    }
  }, [toast]);

  // Start/stop recording
  const toggleRecording = useCallback(() => {
    if (!recognitionRef.current) {
      setError("Speech recognition not initialized");
      return;
    }

    if (isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    } else {
      setError(null);
      setTranscribedText("");
      try {
        recognitionRef.current.start();
        setIsRecording(true);
      } catch (err: any) {
        console.error("Failed to start recognition:", err);
        setError("Failed to start recording. Please try again.");
        setIsRecording(false);
      }
    }
  }, [isRecording]);

  // Handle submission
  const handleSubmit = useCallback(async () => {
    if (!transcribedText.trim()) {
      toast({
        title: "Empty Entry",
        description: "Please record or enter some text before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    try {
      if (onSubmit) {
        await onSubmit(transcribedText.trim());
      } else {
        // Mock submission - can be replaced with real API call
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      toast({
        title: "Success!",
        description: "Voice entry saved successfully!",
      });

      // Clear the text after successful submission
      setTranscribedText("");
    } catch (err: any) {
      toast({
        title: "Submission Error",
        description: err?.message || "Failed to save entry. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  }, [transcribedText, onSubmit, toast]);

  // Clear text
  const handleClear = useCallback(() => {
    setTranscribedText("");
    setError(null);
  }, []);

  if (!isSupported) {
    return (
      <Card className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center gap-3 text-red-300">
            <Icons.alertCircle className="h-5 w-5" />
            <p className="text-sm font-[var(--font-inter)]">
              {error || "Speech recognition is not supported in your browser."}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-lg">
        <CardHeader>
          <CardTitle className="font-[var(--font-manrope)] text-white">
            {title}
          </CardTitle>
          <CardDescription className="font-[var(--font-inter)]">
            {description}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Microphone Button Section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              {/* Glowing ring animation when recording */}
              <AnimatePresence>
                {isRecording && (
                  <>
                    <motion.div
                      initial={{ scale: 1, opacity: 0.8 }}
                      animate={{ scale: 1.3, opacity: 0 }}
                      exit={{ scale: 1.3, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] blur-xl"
                    />
                    <motion.div
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.2, opacity: 0 }}
                      exit={{ scale: 1.2, opacity: 0 }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeOut",
                        delay: 0.3,
                      }}
                      className="absolute inset-0 rounded-full bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] blur-lg"
                    />
                  </>
                )}
              </AnimatePresence>

              {/* Microphone Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={toggleRecording}
                disabled={isProcessing}
                className={`
                  relative z-10 h-20 w-20 rounded-full
                  bg-gradient-to-r from-[#22d3ee] to-[#7c3aed]
                  flex items-center justify-center
                  shadow-lg hover:shadow-xl
                  transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed
                  ${isRecording ? "ring-4 ring-[#22d3ee]/50" : ""}
                `}
                aria-label={isRecording ? "Stop recording" : "Start recording"}
              >
                <motion.div
                  animate={isRecording ? { scale: [1, 1.1, 1] } : { scale: 1 }}
                  transition={{
                    duration: 1,
                    repeat: isRecording ? Infinity : 0,
                    ease: "easeInOut",
                  }}
                >
                  <Icons.mic className="h-8 w-8 text-white" />
                </motion.div>
              </motion.button>
            </div>

            {/* Recording Status */}
            <AnimatePresence>
              {isRecording && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="flex items-center gap-2 text-sm text-[#22d3ee] font-[var(--font-inter)]"
                >
                  <motion.div
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="h-2 w-2 rounded-full bg-[#22d3ee]"
                  />
                  <span>Speak now...</span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Error Display */}
          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="rounded-xl bg-red-500/10 border border-red-500/30 p-3"
            >
              <div className="flex items-start gap-2">
                <Icons.alertCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300 font-[var(--font-inter)]">
                  {error}
                </p>
              </div>
            </motion.div>
          )}

          {/* Textarea for transcribed text */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-300 font-[var(--font-inter)]">
              Transcribed Text
            </label>
            <Textarea
              value={transcribedText}
              onChange={(e) => setTranscribedText(e.target.value)}
              placeholder={placeholder}
              className="
                min-h-[120px] rounded-xl
                border border-white/10
                bg-white/5
                text-gray-200
                placeholder:text-gray-500
                focus:ring-2 focus:ring-[#22d3ee]
                focus:border-[#22d3ee]/50
                font-[var(--font-inter)]
                resize-none
              "
            />
            <div className="flex items-center justify-between text-xs text-gray-400 font-[var(--font-inter)]">
              <span>
                {transcribedText.length} character{transcribedText.length !== 1 ? "s" : ""}
              </span>
              {transcribedText && (
                <button
                  onClick={handleClear}
                  className="text-[#22d3ee] hover:text-[#7c3aed] transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              onClick={handleSubmit}
              disabled={!transcribedText.trim() || isProcessing}
              className="
                flex-1
                bg-gradient-to-r from-[#22d3ee] to-[#7c3aed]
                rounded-full
                px-6 py-2
                text-white
                font-semibold
                hover:scale-105
                transition-transform
                disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
                font-[var(--font-manrope)]
              "
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <Icons.loader className="h-4 w-4 animate-spin" />
                  Processing...
                </span>
              ) : (
                "Submit Entry"
              )}
            </Button>
            {transcribedText && (
              <Button
                onClick={handleClear}
                variant="secondary"
                className="rounded-full px-6 py-2 font-[var(--font-inter)]"
              >
                Clear
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}



