import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  webpack: (config, { isServer }) => {
    // Handle tesseract.js for client-side only
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      };
      
      // Optimize bundle size and performance
      config.optimization = {
        ...config.optimization,
        sideEffects: false,
        usedExports: true,
      };
      
      // Enable tree shaking for AI libraries
      config.resolve.alias = {
        ...config.resolve.alias,
        // Add any large library aliases for optimization
      };
    }
    return config;
  },
  // Performance optimizations
  experimental: {
    // Enable modern JavaScript features for better performance
    esmExternals: true,
    // Optimize images
    images: {
      allowFutureImage: true,
    },
    // Enable server components optimization
    serverComponentsExternalPackages: ['tesseract.js'],
  },
  // Optimize images
  images: {
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  // Enable compression
  compress: true,
  // Enable static optimization
  generateEtags: true,
  // Enable production optimizations
  productionBrowserSourceMaps: false,
  // Optimize for faster builds
  swcMinify: true,
  // Enable Clerk keyless mode to allow components to use Clerk hooks without a key
  // This allows the app to work even when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is not set
};

export default nextConfig;
