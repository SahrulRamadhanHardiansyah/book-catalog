/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Untuk sampul buku Google Books
      { hostname: "books.google.com" },

      // Untuk avatar pengguna Google
      { hostname: "lh3.googleusercontent.com" },

      // Untuk avatar pengguna GitHub
      { hostname: "avatars.githubusercontent.com" },

      // Untuk avatar pengguna Facebook
      { hostname: "platform-lookaside.fbsbx.com" },
    ],
  },
};

export default nextConfig;
