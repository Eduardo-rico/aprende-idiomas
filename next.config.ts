import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
  // Self-host: emit a minimal standalone server (`.next/standalone/server.js`)
  // with only the node_modules it actually needs. The Dockerfile copies that
  // plus `.next/static` and `public/` (which holds the ~451 MB audio corpus).
  // No effect on `npm run dev`.
  output: "standalone",
  // Configure `pageExtensions` to include markdown and MDX files.
  // Required by @next/mdx so .mdx files are recognized as routes/imports.
  pageExtensions: ["ts", "tsx", "md", "mdx"],
  // A.6: 308 redirect from the legacy /settings page (which kept the
  // shadcn chrome) to the new /cuenta hub (Manual Lusitano chrome).
  // Bookmarks and in-flight links that still target /:lang/settings
  // land on /:lang/cuenta with a permanent redirect. The /settings page
  // file stays in the repo as a safety net (falls through to the
  // redirect) but is unreachable from the navbar.
  async redirects() {
    return [
      {
        source: "/:lang/settings",
        destination: "/:lang/cuenta",
        permanent: true,
      },
    ];
  },
  // E.4: Content-Security-Policy header — applied to all routes.
  // img-src includes data: (inline SVGs / placeholder images) and blob:
  // (audio waveform canvas exports). Update this list if external image
  // hosts are added.
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "img-src 'self' data: blob:",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline'",
              "font-src 'self' data:",
              "connect-src 'self'",
              "media-src 'self' blob:",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
