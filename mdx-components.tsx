import type { MDXComponents } from "mdx/types";

/**
 * Global MDX components. Required by @next/mdx for App Router.
 * Per-page custom components (e.g. <Example>, <Tip>, <Rule> for lessons)
 * are passed via the `components` prop to <MDXContent /> — see
 * components/lessons/mdx-components.tsx for the lesson-specific set.
 */
export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    ...components,
  };
}
