import type { NextConfig } from "next";
import createMDX from "@next/mdx";

const nextConfig: NextConfig = {
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
};

const withMDX = createMDX({});

export default withMDX(nextConfig);
