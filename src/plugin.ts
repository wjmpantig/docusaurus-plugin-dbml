/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoadContext, Plugin } from "@docusaurus/types";

export default function docusaurusPluginDbml(
  _context?: LoadContext,
  _options?: unknown
): Plugin {
  return {
    name: "docusaurus-plugin-dbml",
    
    getThemePath() {
      // Return the path to the theme directory relative to this file
      return "../dist/theme";
    },
    
    getTypeScriptThemePath() {
      return "../src/theme";
    },
  };
}