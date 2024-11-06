/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.externals = [...config.externals, { canvas: 'canvas' }]; // required to make Konva & react-konva work

    return config;
  },
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "file.302.ai",
      },
      {
        protocol: "https",
        hostname: "file.302ai.cn",
      },
    ],
  },
};

export default nextConfig;
