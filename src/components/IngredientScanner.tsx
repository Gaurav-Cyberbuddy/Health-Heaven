"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Icons } from "@/components/icons";

// Types for ingredient analysis
interface IngredientAnalysis {
  healthScore: number; // 0-10
  pros: string[];
  cons: string[];
  summary: string;
}

// Mock AI analysis function (can be replaced with real API call)
async function analyzeIngredients(text: string): Promise<IngredientAnalysis> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 1500));

  const lowerText = text.toLowerCase();
  
  // Simple keyword-based analysis (replace with real AI later)
  const healthyKeywords = [
    "organic", "natural", "whole grain", "fiber", "protein", 
    "vitamin", "mineral", "antioxidant", "omega-3", "probiotic"
  ];
  
  const concerningKeywords = [
    "artificial", "preservative", "high fructose", "trans fat",
    "hydrogenated", "sodium", "sugar", "aspartame", "msg", "sulfite"
  ];

  const foundHealthy = healthyKeywords.filter(kw => lowerText.includes(kw));
  const foundConcerning = concerningKeywords.filter(kw => lowerText.includes(kw));

  // Calculate health score (0-10)
  let score = 7; // Base score
  score += foundHealthy.length * 0.5;
  score -= foundConcerning.length * 0.8;
  score = Math.max(0, Math.min(10, Math.round(score * 10) / 10));

  // Generate pros
  const pros: string[] = [];
  if (foundHealthy.length > 0) {
    pros.push(`Contains ${foundHealthy.slice(0, 2).join(" and ")}`);
  }
  if (lowerText.includes("protein")) {
    pros.push("Good protein content");
  }
  if (lowerText.includes("fiber")) {
    pros.push("Dietary fiber present");
  }
  if (pros.length === 0) {
    pros.push("Minimal processing detected");
  }

  // Generate cons
  const cons: string[] = [];
  if (foundConcerning.length > 0) {
    cons.push(`Contains ${foundConcerning.slice(0, 2).join(" and ")}`);
  }
  if (lowerText.includes("sugar") && !lowerText.includes("no added sugar")) {
    cons.push("Added sugars present");
  }
  if (lowerText.includes("sodium") || lowerText.includes("salt")) {
    cons.push("High sodium content");
  }
  if (cons.length === 0) {
    cons.push("Some processed ingredients may be present");
  }

  // Generate summary
  let summary = "";
  if (score >= 8) {
    summary = "Balanced product with minimal additives. Good nutritional profile with natural ingredients.";
  } else if (score >= 6) {
    summary = "Moderate health profile. Contains some beneficial ingredients but also includes processed additives.";
  } else {
    summary = "Contains several processed ingredients and additives. Consider alternatives with fewer additives.";
  }

  return {
    healthScore: score,
    pros,
    cons,
    summary,
  };
}

export function IngredientScanner() {
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [extractedText, setExtractedText] = useState<string>("");
  const [analysis, setAnalysis] = useState<IngredientAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [showCamera, setShowCamera] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);

  // Handle file selection
  const handleFileSelect = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please select a valid image file (JPG, PNG, etc.)");
      return;
    }

    setImage(file);
    setError(null);
    setAnalysis(null);
    setExtractedText("");

    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  }, []);

  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileSelect(file);
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  }, []);

  // Start camera
  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setShowCamera(true);
      }
    } catch (err) {
      setError("Unable to access camera. Please check permissions.");
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setShowCamera(false);
  }, []);

  // Capture photo from camera
  const capturePhoto = useCallback(() => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(videoRef.current, 0, 0);
        canvas.toBlob((blob) => {
          if (blob) {
            const file = new File([blob], "camera-capture.jpg", { type: "image/jpeg" });
            handleFileSelect(file);
            stopCamera();
          }
        }, "image/jpeg");
      }
    }
  }, [handleFileSelect, stopCamera]);

  // Process image with OCR and AI
  const processImage = useCallback(async () => {
    if (!image) return;

    setIsProcessing(true);
    setError(null);
    setAnalysis(null);

    try {
      // Step 1: OCR with Tesseract.js (dynamic import for client-side only)
      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      const { data } = await worker.recognize(image);
      await worker.terminate();

      const text = data.text.trim();
      setExtractedText(text);

      if (!text || text.length < 10) {
        setError("Could not extract text from image. Please ensure the image is clear and contains readable text.");
        setIsProcessing(false);
        return;
      }

      // Step 2: AI Analysis
      const result = await analyzeIngredients(text);
      setAnalysis(result);
    } catch (err: any) {
      setError(err?.message || "Failed to process image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  }, [image]);

  // Reset scanner
  const resetScanner = useCallback(() => {
    setImage(null);
    setImagePreview(null);
    setExtractedText("");
    setAnalysis(null);
    setError(null);
    stopCamera();
  }, [stopCamera]);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-[var(--font-manrope)] bg-gradient-to-r from-[#22d3ee] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent">
            Ingredient Scanner
          </h1>
          <p className="text-muted-foreground text-lg font-[var(--font-inter)]">
            Upload or scan a food label to analyze ingredients instantly
          </p>
        </div>

        {/* Upload/Scan Section */}
        {!imagePreview && !showCamera && (
          <Card className="glass border-2 border-dashed border-white/20 hover:border-[#22d3ee]/40 transition-colors">
            <CardContent className="p-8 md:p-12">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                className="flex flex-col items-center justify-center space-y-6 min-h-[300px]"
              >
                <div className="flex flex-col items-center space-y-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[#22d3ee] to-[#7c3aed] flex items-center justify-center">
                    <Icons.upload className="h-10 w-10 text-white" />
                  </div>
                  <div className="text-center space-y-2">
                    <h3 className="text-xl font-semibold text-white font-[var(--font-manrope)]">
                      Drop your image here
                    </h3>
                    <p className="text-muted-foreground font-[var(--font-inter)]">
                      or click to browse
                    </p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    onClick={() => fileInputRef.current?.click()}
                    className="bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] rounded-full px-6 py-2 text-white font-semibold hover:scale-105 transition-transform"
                  >
                    <Icons.upload className="h-4 w-4 mr-2" />
                    Upload Image
                  </Button>
                  <Button
                    onClick={startCamera}
                    variant="secondary"
                    className="rounded-full px-6 py-2 font-semibold hover:scale-105 transition-transform"
                  >
                    <Icons.camera className="h-4 w-4 mr-2" />
                    Use Camera
                  </Button>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleFileSelect(file);
                  }}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {/* Camera View */}
        {showCamera && (
          <Card className="glass">
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Camera</span>
                <Button
                  onClick={stopCamera}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative rounded-lg overflow-hidden bg-black">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-auto"
                />
              </div>
              <Button
                onClick={capturePhoto}
                className="w-full bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] rounded-full py-2 text-white font-semibold"
              >
                <Icons.camera className="h-4 w-4 mr-2" />
                Capture Photo
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Image Preview */}
        {imagePreview && !isProcessing && !analysis && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass">
              <CardHeader>
                <CardTitle>Preview</CardTitle>
                <CardDescription>Review your image before scanning</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border border-white/10">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-auto"
                  />
                </div>
                <div className="flex gap-3">
                  <Button
                    onClick={processImage}
                    className="flex-1 bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] rounded-full py-2 text-white font-semibold hover:scale-105 transition-transform"
                  >
                    <Icons.search className="h-4 w-4 mr-2" />
                    Analyze Ingredients
                  </Button>
                  <Button
                    onClick={resetScanner}
                    variant="secondary"
                    className="rounded-full px-6 py-2"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Loading State */}
        <AnimatePresence>
          {isProcessing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <Card className="glass">
                <CardContent className="p-12">
                  <div className="flex flex-col items-center justify-center space-y-4">
                    <div className="relative">
                      <div className="h-16 w-16 border-4 border-[#22d3ee]/30 border-t-[#22d3ee] rounded-full animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Icons.loader className="h-6 w-6 text-[#22d3ee] animate-pulse" />
                      </div>
                    </div>
                    <div className="text-center space-y-2">
                      <p className="text-lg font-semibold text-white font-[var(--font-manrope)]">
                        Analyzing ingredients...
                      </p>
                      <p className="text-sm text-muted-foreground font-[var(--font-inter)]">
                        Extracting text and generating health analysis
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error State */}
        {error && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass border border-red-500/30 bg-red-500/10"
          >
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <Icons.alertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <p className="text-red-300 font-semibold font-[var(--font-manrope)]">Error</p>
                  <p className="text-red-200 text-sm mt-1 font-[var(--font-inter)]">{error}</p>
                </div>
                <Button
                  onClick={() => setError(null)}
                  variant="ghost"
                  size="icon"
                  className="rounded-full"
                >
                  <Icons.x className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </motion.div>
        )}

        {/* Results */}
        <AnimatePresence>
          {analysis && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.4 }}
            >
              <Card className="glass border-2 border-gradient-to-r from-[#22d3ee]/30 to-[#7c3aed]/30">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>Analysis Results</span>
                    <Button
                      onClick={resetScanner}
                      variant="ghost"
                      size="sm"
                      className="rounded-full"
                    >
                      Scan Again
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Health Score */}
                  <div className="text-center p-6 rounded-xl bg-white/5 border border-white/10">
                    <p className="text-sm text-muted-foreground mb-2 font-[var(--font-inter)] uppercase tracking-wider">
                      Health Score
                    </p>
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-5xl font-bold bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] bg-clip-text text-transparent font-[var(--font-manrope)]">
                        {analysis.healthScore.toFixed(1)}
                      </span>
                      <span className="text-2xl text-muted-foreground">/ 10</span>
                    </div>
                    <div className="mt-4 w-full bg-white/10 rounded-full h-2 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${(analysis.healthScore / 10) * 100}%` }}
                        transition={{ duration: 1, delay: 0.2 }}
                        className="h-full bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] rounded-full"
                      />
                    </div>
                  </div>

                  {/* Pros and Cons */}
                  <div className="grid md:grid-cols-2 gap-4">
                    {/* Pros */}
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                      <h3 className="font-semibold text-emerald-400 mb-3 flex items-center gap-2 font-[var(--font-manrope)]">
                        <Icons.check className="h-4 w-4" />
                        Pros
                      </h3>
                      <ul className="space-y-2">
                        {analysis.pros.map((pro, idx) => (
                          <li key={idx} className="text-sm text-emerald-200 flex items-start gap-2 font-[var(--font-inter)]">
                            <Icons.checkCircle className="h-4 w-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                            <span>{pro}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Cons */}
                    <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30">
                      <h3 className="font-semibold text-red-400 mb-3 flex items-center gap-2 font-[var(--font-manrope)]">
                        <Icons.alertCircle className="h-4 w-4" />
                        Cons
                      </h3>
                      <ul className="space-y-2">
                        {analysis.cons.map((con, idx) => (
                          <li key={idx} className="text-sm text-red-200 flex items-start gap-2 font-[var(--font-inter)]">
                            <Icons.xCircle className="h-4 w-4 text-red-400 flex-shrink-0 mt-0.5" />
                            <span>{con}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* AI Summary */}
                  <div className="p-5 rounded-xl bg-white/5 border border-white/10">
                    <h3 className="font-semibold text-white mb-2 font-[var(--font-manrope)] flex items-center gap-2">
                      <Icons.sparkles className="h-4 w-4 text-[#22d3ee]" />
                      AI Summary
                    </h3>
                    <p className="text-sm text-gray-300 leading-relaxed font-[var(--font-inter)]">
                      {analysis.summary}
                    </p>
                  </div>

                  {/* Extracted Text (Collapsible) */}
                  {extractedText && (
                    <details className="p-4 rounded-xl bg-white/5 border border-white/10">
                      <summary className="cursor-pointer text-sm font-semibold text-muted-foreground hover:text-white transition-colors font-[var(--font-manrope)]">
                        View Extracted Text
                      </summary>
                      <p className="mt-3 text-xs text-gray-400 font-mono whitespace-pre-wrap font-[var(--font-inter)]">
                        {extractedText}
                      </p>
                    </details>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
