# Clerk Authentication Setup Guide

## Quick Start

1. **Create a Clerk Account**
   - Go to https://dashboard.clerk.com
   - Sign up for a free account
   - Create a new application

2. **Get Your API Keys**
   - In your Clerk dashboard, go to **API Keys**
   - Copy your **Publishable Key** (starts with `pk_test_` or `pk_live_`)
   - Copy your **Secret Key** (starts with `sk_test_` or `sk_live_`)

3. **Set Environment Variables**
   Create a `.env.local` file in the root of your project:

   ```env
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here

   # Optional: Customize Clerk URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/

   # Your existing environment variables
   GOOGLE_GENAI_API_KEY=your_gemini_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:9002
   ```

4. **Configure Clerk Dashboard**
   - Go to **Paths** in your Clerk dashboard
   - Set **Sign-in path** to: `/sign-in`
   - Set **Sign-up path** to: `/sign-up`
   - Set **After sign-in redirect** to: `/`
   - Set **After sign-up redirect** to: `/`

5. **Enable Social Providers (Optional)**
   - In Clerk dashboard, go to **User & Authentication** > **Social Connections**
   - Enable Google, GitHub, or other providers you want
   - Configure OAuth credentials for each provider

6. **Restart Your Dev Server**
   ```bash
   npm run dev
   ```

## Features Implemented

✅ **Secure Authentication**
- Clerk handles all authentication securely
- Session management with secure cookies
- CSRF protection enabled by default

✅ **Beautiful UI**
- Glassmorphism styled SignIn/SignUp pages
- Matches Health Heaven aesthetic
- Gradient buttons and smooth animations

✅ **User Experience**
- Personalized greeting on homepage: "Welcome back, [Name] 🌿"
- User avatar and dropdown in navbar
- Protected routes automatically redirect to sign-in

✅ **Protected Routes**
- `/profile` - User profile page
- `/assessment` - Ingredient assessment
- `/scanner` - Ingredient scanner

## How It Works

1. **Middleware Protection**: Routes are protected at the middleware level using Clerk's `clerkMiddleware`
2. **User State**: Components use `useUser()` hook to access user data
3. **Sign Out**: Users can sign out via the UserButton dropdown in the navbar
4. **Redirects**: Unauthenticated users are redirected to `/sign-in` with a return URL

## Troubleshooting

**Issue**: "Clerk: Missing publishableKey"
- **Solution**: Make sure `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` is set in `.env.local`

**Issue**: Sign-in page shows default Clerk styling
- **Solution**: Check that the environment variables are loaded (restart dev server)

**Issue**: Redirects not working
- **Solution**: Verify the paths in Clerk dashboard match your routes

## Security Notes

- ✅ Secure cookies enabled by default
- ✅ CSRF protection enabled
- ✅ HTTPS required in production
- ✅ Minimal user data stored (name, email, avatar)
- ✅ Session tokens are secure and encrypted

## Next Steps

1. Set up your Clerk account and add API keys
2. Test the sign-in/sign-up flow
3. Customize the appearance further if needed in the SignIn/SignUp components
4. Add user metadata fields if needed for additional personalization



