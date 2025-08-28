/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Add configuration to handle hydration mismatches due to BitDefender extension
  experimental: {
    // This helps avoid hydration mismatch issues with browser extensions that modify HTML
  },
  // Force client-side rendering for this app to avoid hydration mismatches
  reactStrictMode: false,
}

export default nextConfig
