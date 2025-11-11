"use client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import React from "react";
import { Icons } from "@/components/icons";
import Reveal from "@/components/reveal";
import { motion } from "framer-motion";
import { Navbar } from "@/components/navbar";
import { HealthQuote } from "@/components/HealthQuote";
import { UserGreeting } from "@/components/UserGreeting";
import { WelcomeNotification } from "@/components/WelcomeNotification";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <WelcomeNotification />

      <main className="flex-1">
        {/* Personalized Greeting for logged-in users */}
        <UserGreeting />

        {/* Health Quote Section */}
        <section className="container mx-auto px-6 pt-8 pb-4 max-w-6xl">
          <HealthQuote />
        </section>

        {/* Hero */}
        <section id="hero" className="relative overflow-hidden">
          <div className="container mx-auto px-6 py-16 md:py-28 relative max-w-6xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:.6}} className="space-y-7">
                <div className="inline-flex items-center rounded-full btn-outline-glass px-3 py-1 text-xs font-medium text-primary">AI Health Assistant</div>
                <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight font-[var(--font-manrope)] antialiased" style={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '1.2' }}>
                  <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-sky-600 bg-clip-text text-transparent drop-shadow-sm">Decode ingredients</span>
                  <br /> with calm confidence
                </h1>
                <p className="text-muted-foreground text-lg max-w-prose font-[var(--font-inter)] antialiased" style={{ fontWeight: 400, letterSpacing: '-0.01em', lineHeight: '1.7' }}>
                  Paste or pick ingredients and get a professional, easy-to-read summary with a clear star rating.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild size="lg" className="px-6 rounded-xl btn-gradient hover:scale-[1.03] transition-all">
                    <Link href="/assessment" className="inline-flex items-center gap-2">
                      <Icons.search className="h-4 w-4" /> Try Ingredient Decoder
                    </Link>
                  </Button>
                  <Button asChild size="lg" className="px-6 rounded-xl bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] text-white hover:scale-[1.03] transition-all">
                    <Link href="/scanner" className="inline-flex items-center gap-2">
                      <Icons.camera className="h-4 w-4" /> Ingredient Scanner
                    </Link>
                  </Button>
                  <Button asChild variant="secondary" size="lg" className="px-6 rounded-xl btn-outline-glass hover:scale-[1.03]">
                    <Link href="/profile" className="inline-flex items-center gap-2">
                      <Icons.user className="h-4 w-4" /> View Profile
                    </Link>
                  </Button>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="inline-flex items-center gap-2"><Icons.shield className="h-4 w-4" /> Private by default</div>
                  <div className="inline-flex items-center gap-2"><Icons.loader className="h-4 w-4" /> Fast Gemini summaries</div>
                </div>
              </motion.div>
              {/* Preview card */}
              <motion.div initial={{opacity:0, y:16}} animate={{opacity:1, y:0}} transition={{duration:.6, delay:.1}}>
                <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.4)] transition-transform duration-300 hover:-translate-y-0.5 hover:scale-[1.01]">
                  <CardHeader className="space-y-2">
                    <CardTitle className="text-3xl font-bold text-white font-[var(--font-manrope)] tracking-tight antialiased" style={{ fontWeight: 700, letterSpacing: '-0.02em', lineHeight: '1.2' }}>Live Preview</CardTitle>
                    <CardDescription className="text-gray-400 font-[var(--font-inter)]" style={{ fontWeight: 400 }}>How an assessment looks</CardDescription>
                  </CardHeader>
                  <CardContent className="grid gap-4">
                    <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-5">
                      <div className="mb-3 text-xs uppercase tracking-widest text-gray-400 font-[var(--font-inter)] antialiased" style={{ fontWeight: 500, fontVariant: 'small-caps', letterSpacing: '0.1em' }}>Summary</div>
                      <p className="leading-relaxed text-[var(--text)]/90 font-[var(--font-inter)] antialiased" style={{ fontWeight: 400, letterSpacing: '-0.01em', lineHeight: '1.7' }}>
                        Based on the listed ingredients, this snack provides balanced macros with minimal additives. Good protein contribution from whey; watch added sugars. <span className="font-semibold text-[#22d3ee]" style={{ fontWeight: 500 }}>8/10</span>
                      </p>
                    </div>
                    <div className="inline-flex items-start gap-3 text-gray-300 font-[var(--font-inter)] antialiased" style={{ fontWeight: 400, letterSpacing: '-0.005em', lineHeight: '1.6' }}><Icons.check className="h-4 w-4 text-emerald-500" /> Easy-to-read assessment of ingredients</div>
                    <div className="inline-flex items-start gap-3 text-gray-300 font-[var(--font-inter)] antialiased" style={{ fontWeight: 400, letterSpacing: '-0.005em', lineHeight: '1.6' }}><Icons.check className="h-4 w-4 text-emerald-500" /> Highlights of pros and cons</div>
                    <div className="inline-flex items-start gap-3 text-gray-300 font-[var(--font-inter)] antialiased" style={{ fontWeight: 400, letterSpacing: '-0.005em', lineHeight: '1.6' }}><Icons.check className="h-4 w-4 text-emerald-500" /> Final rating like <span className="font-semibold text-[#22d3ee]" style={{ fontWeight: 500 }}>"8/10"</span></div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Logos strip */}
        <section className="container mx-auto px-6 pb-10 max-w-6xl">
          <div className="flex flex-wrap items-center justify-center gap-8 opacity-80">
            <div className="text-xs uppercase tracking-widest">Trusted by conscious eaters</div>
            <div className="h-6 w-px bg-border" />
            <div className="text-sm font-medium">Wellness</div>
            <div className="text-sm font-medium">NutriLab</div>
            <div className="text-sm font-medium">FitFuel</div>
            <div className="text-sm font-medium">GreenBite</div>
          </div>
        </section>

        {/* Features */}
        <section className="container mx-auto px-6 pb-16 max-w-6xl relative">
          <div className="pointer-events-none absolute -top-10 right-10 h-40 w-40 rounded-full bg-gradient-to-br from-emerald-200/60 via-teal-200/40 to-sky-200/30 blur-2xl" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                key: 'feature-1',
                icon: <Icons.search className="h-5 w-5" />,
                title: 'Smart analysis',
                desc: 'Understands common and packaged-food ingredients.',
              },
              {
                key: 'feature-2',
                icon: <Icons.camera className="h-5 w-5" />,
                title: 'Ingredient Scanner',
                desc: 'Scan food labels with your camera or upload images.',
                link: '/scanner',
              },
              {
                key: 'feature-3',
                icon: <Icons.mic className="h-5 w-5" />,
                title: 'Voice Entry',
                desc: 'Record meals and health updates using your voice.',
                link: '/voice-entry',
              },
              {
                key: 'feature-4',
                icon: <Icons.shield className="h-5 w-5" />,
                title: 'Privacy-first',
                desc: 'Your inputs stay in your session.',
              },
              {
                key: 'feature-5',
                icon: <Icons.loader className="h-5 w-5" />,
                title: 'Fast results',
                desc: 'Powered by Gemini via Genkit.',
              },
            ].map((f, i) => (
              <motion.div
                key={f.key}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group"
              >
                <Card className={`rounded-2xl ${f.link ? 'cursor-pointer hover:border-[#22d3ee]/40' : ''}`}>
                  {f.link ? (
                    <Link href={f.link}>
                      <CardHeader className="space-y-1">
                        <div className="inline-flex items-center gap-3">
                          <div className="h-9 w-9 grid place-items-center rounded-full bg-white/10 border border-white/10 text-white/90">
                            {f.icon}
                          </div>
                          <span className="font-semibold text-white">{f.title}</span>
                        </div>
                        <CardDescription className="text-gray-400">{f.desc}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-300 gap-4">
                        {f.link === '/scanner' && 'Click to try the ingredient scanner →'}
                        {f.link === '/voice-entry' && 'Click to record your health entries with voice →'}
                      </CardContent>
                    </Link>
                  ) : (
                    <>
                      <CardHeader className="space-y-1">
                        <div className="inline-flex items-center gap-3">
                          <div className="h-9 w-9 grid place-items-center rounded-full bg-white/10 border border-white/10 text-white/90">
                            {f.icon}
                          </div>
                          <span className="font-semibold text-white">{f.title}</span>
                        </div>
                        <CardDescription className="text-gray-400">{f.desc}</CardDescription>
                      </CardHeader>
                      <CardContent className="text-sm text-gray-300 gap-4">
                        {f.key === 'feature-1' && 'Type to get suggestions, or paste your own list—no brands required.'}
                        {f.key === 'feature-4' && 'We only use your data to generate the summary you see.'}
                        {f.key === 'feature-5' && 'Most assessments complete in a couple of seconds.'}
                      </CardContent>
                    </>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Simple steps */}
        <section className="container mx-auto px-6 pb-16 max-w-6xl relative">
          <div className="pointer-events-none absolute -bottom-6 left-16 h-44 w-44 rounded-full bg-gradient-to-br from-violet-200/50 via-fuchsia-200/40 to-pink-200/30 blur-3xl" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { n: '01', t: 'Enter ingredients', d: 'Add items like oats, whey, or xanthan gum. Suggestions help you pick fast.' },
              { n: '02', t: 'AI analyzes', d: 'We generate a concise, professional summary tailored to your list.' },
              { n: '03', t: 'Get rating', d: 'See an easy "8/10" style score with pros and cons.' },
            ].map((step, i) => (
              <motion.div
                key={step.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.4 }}
                transition={{ duration: 0.55, delay: i * 0.06 }}
              >
                <Card className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.35)] hover:-translate-y-0.5 hover:scale-[1.02] transition-transform duration-300">
                  <CardHeader className="space-y-3">
                    <div className="text-3xl font-extrabold bg-gradient-to-r from-[var(--primary)] to-[var(--primary-2)] bg-clip-text text-transparent">{step.n}</div>
                    <CardTitle className="text-lg text-white">{step.t}</CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-gray-300 leading-relaxed">{step.d}</CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Tagline + CTA */}
        <section className="container mx-auto px-6 pb-20 max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2 rounded-2xl border border-white/10 bg-white/10 backdrop-blur-xl shadow-xl overflow-hidden">
              <div className="relative p-8 md:p-10">
                <div className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-gradient-to-br from-[var(--primary)]/35 to-[var(--primary-2)]/25 blur-3xl" />
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight">
                  <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary)] to-[var(--primary-2)]">
                    Eat smarter. Feel better.
                  </span>
                </h2>
                <p className="mt-3 text-[var(--muted)] text-base md:text-lg max-w-prose">
                  Clear ingredient insights in seconds — calm, detailed, and tailored to your choices.
                </p>
              </div>
            </Card>
            <Card className="glass rounded-2xl">
              <CardHeader>
                <CardTitle className="text-lg">Ready to try?</CardTitle>
                <CardDescription>Start with a few ingredients</CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild className="w-full rounded-xl btn-gradient hover:scale-[1.02]">
                  <Link href="/assessment">Get started</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </section>
      </main>

      <footer className="bg-white/30 backdrop-blur border-t border-white/40">
        <div className="container mx-auto px-6 py-5 text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Health Heaven. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
