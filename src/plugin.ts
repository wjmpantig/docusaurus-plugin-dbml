/* eslint-disable @typescript-eslint/no-unused-vars */
import type { LoadContext, Plugin } from "@docusaurus/types";
import { fileURLToPath } from 'url';
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url));
export default function docusaurusPluginDbml(
  _context?: LoadContext,
  _options?: unknown
): Plugin {
  return {
    name: "docusaurus-plugin-dbml",
    
    getThemePath() {
      // Return the path to the theme directory relative to this file
      return join(__dirname, 'theme');
    },
    
    getTypeScriptThemePath() {
      return join(__dirname, '../src/theme');
    },
  };
}