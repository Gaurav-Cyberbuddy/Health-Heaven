import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight font-[var(--font-manrope)] bg-gradient-to-r from-[#22d3ee] via-[#7c3aed] to-[#10b981] bg-clip-text text-transparent mb-2">
            Start Your Journey
          </h1>
          <p className="text-muted-foreground font-[var(--font-inter)]">
            Create an account to unlock personalized health insights
          </p>
        </div>
        
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-xl overflow-hidden">
          {/* Glowing accent */}
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-violet-500/5 pointer-events-none" />
          
          <div className="relative z-10">
            <SignUp
              appearance={{
                elements: {
                  rootBox: "mx-auto",
                  card: "bg-transparent shadow-none border-none",
                  headerTitle: "hidden",
                  headerSubtitle: "hidden",
                  socialButtonsBlockButton:
                    "bg-white/10 hover:bg-white/15 border border-white/10 text-gray-200 rounded-xl font-[var(--font-inter)] transition-all hover:scale-105",
                  formButtonPrimary:
                    "bg-gradient-to-r from-[#22d3ee] to-[#7c3aed] rounded-full hover:scale-105 transition-transform font-[var(--font-manrope)] font-semibold",
                  formFieldInput:
                    "bg-white/10 border-white/10 text-gray-200 rounded-xl focus:ring-2 focus:ring-[#22d3ee] font-[var(--font-inter)]",
                  formFieldLabel: "text-gray-300 font-[var(--font-inter)]",
                  footerActionLink: "text-[#22d3ee] hover:text-[#7c3aed] transition-colors font-[var(--font-inter)]",
                  identityPreviewText: "text-gray-200 font-[var(--font-inter)]",
                  identityPreviewEditButton: "text-[#22d3ee] hover:text-[#7c3aed]",
                  formResendCodeLink: "text-[#22d3ee] hover:text-[#7c3aed]",
                  otpCodeFieldInput: "bg-white/10 border-white/10 text-gray-200 rounded-xl",
                  alertText: "text-red-300 font-[var(--font-inter)]",
                  formFieldErrorText: "text-red-300 font-[var(--font-inter)]",
                },
              }}
              routing="path"
              path="/sign-up"
              signInUrl="/sign-in"
            />
          </div>
        </div>
      </div>
    </div>
  );
}



