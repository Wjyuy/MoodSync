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
  // ⭐️ webpack 설정
  webpack: (config, { isServer }) => {
    // 서버에서 실행되는 코드가 아닐 경우 (즉, 클라이언트에서 실행될 코드일 경우)
    if (!isServer) {
      // 'fs' 모듈을 빈 모듈로 대체하여 무시하도록 설정합니다.
      config.resolve.fallback = {
        fs: false,
        path: false, // 'path' 모듈도 가끔 문제를 일으킬 수 있으니 함께 추가하는 것이 좋습니다.
      };
    }
    return config;
  },
};

export default nextConfig; 