/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "shopping-phinf.pstatic.net", // 네이버 쇼핑 이미지 도메인
        port: "",
        pathname: "/**",
      },
    ],
  },
  experimental: {
    serverComponentsExternalPackages: ["puppeteer"], // Puppeteer 지원
  },
};

module.exports = nextConfig;