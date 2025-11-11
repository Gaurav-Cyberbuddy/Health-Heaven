"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Icons } from "@/components/icons";

interface HealthQuote {
  quote: string;
  author?: string;
}

// Local fallback quotes array
const FALLBACK_QUOTES: HealthQuote[] = [
  {
    quote: "Your body is a temple, but only if you treat it as one.",
    author: "Astrid Alauda",
  },
  {
    quote: "Take care of your body. It's the only place you have to live.",
    author: "Jim Rohn",
  },
  {
    quote: "The food you eat can be either the safest and most powerful form of medicine or the slowest form of poison.",
    author: "Ann Wigmore",
  },
  {
    quote: "Health is not about the weight you lose, but about the life you gain.",
  },
  {
    quote: "Every time you eat is an opportunity to nourish your body.",
  },
  {
    quote: "Balance is not something you find, it's something you create.",
  },
  {
    quote: "Wellness is the complete integration of body, mind, and spirit.",
    author: "Greg Anderson",
  },
  {
    quote: "The greatest wealth is health.",
    author: "Virgil",
  },
  {
    quote: "Let food be thy medicine and medicine be thy food.",
    author: "Hippocrates",
  },
  {
    quote: "Your health is an investment, not an expense.",
  },
  {
    quote: "Small changes, big results. Start where you are.",
  },
  {
    quote: "Nourish your body, fuel your mind, energize your soul.",
  },
  {
    quote: "Health is a state of complete harmony of the body, mind and spirit.",
    author: "B.K.S. Iyengar",
  },
  {
    quote: "The best time to plant a tree was 20 years ago. The second best time is now.",
    author: "Chinese Proverb",
  },
  {
    quote: "Progress, not perfection. Every step forward counts.",
  },
  {
    quote: "You don't have to be great to start, but you have to start to be great.",
    author: "Zig Ziglar",
  },
  {
    quote: "The only bad workout is the one that didn't happen.",
  },
  {
    quote: "Your future self will thank you for the choices you make today.",
  },
  {
    quote: "Health is a relationship between you and your body.",
    author: "Terri Guillemets",
  },
  {
    quote: "Every moment is a fresh beginning.",
    author: "T.S. Eliot",
  },
  {
    quote: "Invest in your health today, reap the benefits tomorrow.",
  },
  {
    quote: "Wellness is a journey, not a destination.",
  },
  {
    quote: "Your body can do it. It's your mind you need to convince.",
  },
];

const QUOTE_CACHE_KEY = "health_heaven_quote";
const QUOTE_CACHE_EXPIRY = 1000 * 60 * 60; // 1 hour in milliseconds

interface CachedQuote {
  quote: HealthQuote;
  timestamp: number;
}

export function HealthQuote() {
  const [quote, setQuote] = useState<HealthQuote | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const lastQuoteIndexRef = useRef<number>(-1);

  // Fetch quote from API or use fallback
  const fetchQuote = useCallback(async (skipCache = false, forceNew = false) => {
    try {
      // Check cache first (unless refreshing or forcing new)
      if (!skipCache && !forceNew) {
        const cached = localStorage.getItem(QUOTE_CACHE_KEY);
        if (cached) {
          const parsed: CachedQuote = JSON.parse(cached);
          const now = Date.now();
          if (now - parsed.timestamp < QUOTE_CACHE_EXPIRY) {
            setQuote(parsed.quote);
            setIsLoading(false);
            return;
          }
        }
      }

      // Try to fetch from API
      try {
        const response = await fetch("/api/health-quote", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (response.ok) {
          const data = await response.json();
          const newQuote: HealthQuote = {
            quote: data.quote || data.text || "",
            author: data.author,
          };

          // Cache the quote
          const cacheData: CachedQuote = {
            quote: newQuote,
            timestamp: Date.now(),
          };
          localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(cacheData));

          setQuote(newQuote);
          setIsLoading(false);
          return;
        }
      } catch (apiError) {
        // API failed, fall through to fallback
        console.log("API unavailable, using fallback quotes");
      }

      // Fallback to local quotes - ensure we get a different quote
      let newIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
      // If forcing new quote, make sure it's different from the last one
      if (forceNew && lastQuoteIndexRef.current >= 0 && FALLBACK_QUOTES.length > 1) {
        while (newIndex === lastQuoteIndexRef.current) {
          newIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        }
      }
      const randomQuote = FALLBACK_QUOTES[newIndex];
      lastQuoteIndexRef.current = newIndex;
      setQuote(randomQuote);

      // Cache the fallback quote
      const cacheData: CachedQuote = {
        quote: randomQuote,
        timestamp: Date.now(),
      };
      localStorage.setItem(QUOTE_CACHE_KEY, JSON.stringify(cacheData));
    } catch (error) {
      console.error("Error fetching quote:", error);
      // Use random fallback on error - ensure different quote
      let newIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
      if (forceNew && lastQuoteIndexRef.current >= 0 && FALLBACK_QUOTES.length > 1) {
        while (newIndex === lastQuoteIndexRef.current) {
          newIndex = Math.floor(Math.random() * FALLBACK_QUOTES.length);
        }
      }
      const randomQuote = FALLBACK_QUOTES[newIndex];
      lastQuoteIndexRef.current = newIndex;
      setQuote(randomQuote);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch quote on mount
  useEffect(() => {
    fetchQuote();
  }, [fetchQuote]);

  // Auto-rotate quotes every 2 minutes (120000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      fetchQuote(true, true); // Skip cache and force new quote
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, [fetchQuote]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative"
    >
      <div className="relative bg-white/5 backdrop-blur-xl rounded-2xl p-6 border border-white/10 shadow-xl overflow-hidden">
        {/* Glowing accent effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/30 to-transparent" />

        {/* Content */}
        <div className="relative z-10">
          <AnimatePresence mode="wait">
            {isLoading ? (
              <motion.div
                key="loading"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center justify-center py-8"
              >
                <div className="flex items-center gap-3 text-muted-foreground">
                  <Icons.loader className="h-5 w-5 animate-spin text-[#22d3ee]" />
                  <span className="text-sm font-[var(--font-inter)]">
                    Loading inspiration...
                  </span>
                </div>
              </motion.div>
            ) : quote ? (
              <motion.div
                key="quote"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4 }}
                className="space-y-3"
              >
                {/* Quote text */}
                <p className="text-xl md:text-2xl font-medium text-gray-200 leading-relaxed italic font-[var(--font-manrope)] antialiased">
                  "{quote.quote}"
                </p>

                {/* Author */}
                {quote.author && (
                  <p className="text-sm text-gray-400 mt-2 text-right font-[var(--font-inter)] antialiased">
                    — {quote.author}
                  </p>
                )}

                {/* Soft pulse effect on quote */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#22d3ee]/5 to-transparent animate-pulse-slow pointer-events-none" />
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}



