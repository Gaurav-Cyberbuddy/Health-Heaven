import type {Metadata} from 'next';
import { Inter, Manrope } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { FeedbackWidget } from '@/components/feedback-widget';
import { NeonBackdrop } from '@/components/neon-backdrop';
import { ClerkProvider } from '@clerk/nextjs';
import { RemoveClerkBanner } from '@/components/RemoveClerkBanner';

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600'],
  style: ['normal'],
});

const manrope = Manrope({
  variable: '--font-manrope',
  subsets: ['latin'],
  display: 'swap',
  weight: ['500', '600', '700'],
  style: ['normal'],
});

export const metadata: Metadata = {
  title: 'Health Heaven – Ingredient Decoder & Wellness Assistant',
  description: 'AI-powered ingredient summaries with clear ratings to help you choose better food.',
  themeColor: '#0ea5e9',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;
  
  const content = (
    <html lang="en" className={`${inter.variable} ${manrope.variable}`}>
      <body className="font-sans antialiased bg-[#070a0f] text-slate-100">
        <RemoveClerkBanner />
        <NeonBackdrop />
        {children}
        <FeedbackWidget />
        <Toaster />
      </body>
    </html>
  );

  // Always wrap with ClerkProvider to support components using Clerk hooks
  // Clerk supports keyless mode when publishableKey is undefined
  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      appearance={{
        elements: {
          // Hide the development banner/popup
        },
      }}
      // Disable keyless mode banner if no key is set
      {...(clerkPublishableKey ? {} : { 
        // When in keyless mode, try to suppress the banner
        // The RemoveClerkBanner component will handle visual removal
      })}
    >
      {content}
    </ClerkProvider>
  );
}
