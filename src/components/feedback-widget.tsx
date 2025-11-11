"use client";

import { useEffect, useMemo, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

export function FeedbackWidget() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [email, setEmail] = useState('');
  const [rating, setRating] = useState<number | undefined>(undefined);
  const [submitting, setSubmitting] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const { toast } = useToast();

  // Simple confetti particles using CSS keyframes
  const particles = useMemo(
    () =>
      Array.from({ length: 36 }).map((_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: `${Math.random() * 80}ms`,
        duration: `${800 + Math.random() * 900}ms`,
        bg:
          Math.random() > 0.5
            ? 'bg-cyan-400'
            : Math.random() > 0.5
            ? 'bg-fuchsia-400'
            : 'bg-emerald-400',
      })),
    []
  );

  useEffect(() => {
    if (!confetti) return;
    const t = setTimeout(() => setConfetti(false), 1200);
    return () => clearTimeout(t);
  }, [confetti]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message || message.trim().length < 5) {
      toast({ title: 'Please add more details', description: 'Message must be at least 5 characters.' });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: message.trim(),
          email: email.trim() || undefined,
          rating: rating ?? undefined,
          page: typeof window !== 'undefined' ? window.location.pathname : undefined,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || 'Something went wrong');
      }
      toast({ title: 'Thanks for your feedback!', description: 'We appreciate your input.' });
      setConfetti(true);
      setMessage('');
      setEmail('');
      setRating(undefined);
      setOpen(false);
    } catch (err: any) {
      toast({ title: 'Failed to send feedback', description: err?.message || 'Please try again later.' });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Confetti overlay */}
      {confetti && (
        <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
          <div className="absolute inset-0">
            {particles.map((p) => (
              <span
                key={p.id}
                className={`absolute top-0 h-2 w-2 ${p.bg} rounded-sm shadow-[0_0_12px_rgba(34,211,238,0.45)]`}
                style={{
                  left: p.left,
                  animation: `fw-pop 150ms ease-out ${p.delay} 1 both, fw-fall ${p.duration} cubic-bezier(.17,.67,.3,1) ${p.delay} 1 forwards`,
                }}
              />
            ))}
          </div>
        </div>
      )}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            className="rounded-full bg-[#0b0f14]/80 border border-cyan-400/30 text-cyan-200 px-4 py-2 shadow-[0_0_20px_rgba(34,211,238,0.25)]
                       hover:text-fuchsia-200 hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10
                       hover:shadow-[0_0_28px_rgba(236,72,153,0.35)]
                       transition-all duration-300 ease-out backdrop-blur-md"
          >
            Feedback
          </Button>
        </DialogTrigger>
        <DialogContent
          className="sm:max-w-lg border border-cyan-400/20 bg-[#070a0f]/90 text-slate-100
                     shadow-[0_0_40px_rgba(34,211,238,0.20),0_0_80px_rgba(236,72,153,0.10)]
                     backdrop-blur-xl transition-all duration-300 ease-out"
        >
          <DialogHeader>
            <DialogTitle className="font-mono tracking-wide text-transparent bg-clip-text
                                    bg-gradient-to-r from-cyan-300 via-sky-300 to-fuchsia-400
                                    drop-shadow-[0_0_10px_rgba(34,211,238,0.35)]">
              Share your feedback
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex items-center gap-2">
              {[1,2,3,4,5].map((r) => {
                const active = (rating ?? 0) >= r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRating(r)}
                    aria-pressed={active}
                    aria-label={`Rate ${r} out of 5`}
                    className={
                      "group h-9 w-9 grid place-items-center rounded-md border transition-all duration-300 ease-out " +
                      (active
                        ? "border-fuchsia-400/50 bg-gradient-to-br from-cyan-500/30 to-fuchsia-500/30 text-white " +
                          "shadow-[0_0_14px_rgba(236,72,153,0.45),inset_0_0_10px_rgba(34,211,238,0.25)]"
                        : "border-cyan-400/30 bg-[#0b0f14]/70 text-cyan-200 hover:border-fuchsia-400/40 " +
                          "hover:shadow-[0_0_16px_rgba(34,211,238,0.35)]")
                    }
                  >
                    <span className="text-lg leading-none transition-transform duration-300 group-hover:scale-110">
                      {active ? '⭐' : '☆'}
                    </span>
                  </button>
                );
              })}
            </div>
            <Textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What’s working well? What can be improved?"
              rows={5}
              required
              className="min-h-[120px] resize-y bg-[#0b0f14]/70 text-slate-100 placeholder:text-slate-400
                         border border-cyan-400/20 focus:border-cyan-400/40
                         focus:ring-2 focus:ring-cyan-400/40 focus:outline-none
                         shadow-inner shadow-cyan-500/5 transition-all duration-300"
            />
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email (optional)"
              inputMode="email"
              autoComplete="email"
              className="bg-[#0b0f14]/70 text-slate-100 placeholder:text-slate-400
                         border border-cyan-400/20 focus:border-cyan-400/40
                         focus:ring-2 focus:ring-cyan-400/40 focus:outline-none
                         shadow-inner shadow-cyan-500/5 transition-all duration-300"
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={submitting}
                className="border border-cyan-400/30 text-cyan-200 hover:text-fuchsia-200
                           hover:border-fuchsia-400/40 hover:bg-fuchsia-500/10
                           transition-all duration-300"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={submitting}
                className="bg-gradient-to-r from-cyan-500 to-fuchsia-500 text-white border-0
                           shadow-[0_0_20px_rgba(34,211,238,0.35),0_0_30px_rgba(236,72,153,0.25)]
                           hover:shadow-[0_0_28px_rgba(34,211,238,0.55),0_0_45px_rgba(236,72,153,0.45)]
                           hover:translate-y-[-1px] active:translate-y-0 transition-all duration-300"
              >
                {submitting ? 'Sending…' : 'Send'}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      {/* Keyframes for confetti */}
      <style jsx>{`
        @keyframes fw-pop {
          0% { transform: scale(0.6) translateY(-6px) rotate(0deg); opacity: 0; }
          100% { transform: scale(1) translateY(0) rotate(12deg); opacity: 1; }
        }
        @keyframes fw-fall {
          0% { transform: translateY(-10vh) translateX(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) translateX(18px) rotate(360deg); opacity: 0; }
        }
      `}</style>
    </div>
  );
}



