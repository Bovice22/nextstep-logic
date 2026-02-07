
/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'export', // Static export for simplicity/speed since it's a landing page
    images: {
        unoptimized: true, // Required for static export
    },
};

export default nextConfig;
