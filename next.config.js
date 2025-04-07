/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["shopping-phinf.pstatic.net"], // 네이버 이미지 도메인 추가
  },
};

module.exports = nextConfig;