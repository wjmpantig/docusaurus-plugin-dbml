import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dts from "vite-plugin-dts";
import { resolve } from "path";
import { visualizer } from "rollup-plugin-visualizer";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    visualizer({
			filename: "stats.html",
			gzipSize: true,
			brotliSize: true,
			open: false,
		}),
    dts({
      entryRoot: "src",
      outDir: "dist/types",
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
		lib: {
			entry: {
				index: resolve(__dirname, "src/index.ts"),
				DbmlDiagram: resolve(__dirname, "src/DbmlDiagram.tsx"),
			},
			name: "DocusaurusPluginDbml",
			// the proper extensions will be added
			fileName: (format, entryName) => {
				const ext = format === "es" ? "js" : "cjs";
				return `${entryName}.${ext}`;
			},
			formats: ["es", "cjs"],
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			external: [
				/^react($|\/)/,
				/^react-dom($|\/)/,
				"@dbml/core",
				"@dbml/parse",
				"@wjmpantig/react-dbml-renderer",
				"@wjmpantig/react-dbml-renderer/style.css",
				"@xyflow/react",
				"@xyflow/react/dist/style.css",
				'path',
				'url',
				],
			output: {
				exports: "named",
				globals: {
					react: "React",
					"react-dom": "ReactDOM",
				},
				assetFileNames: ({ names }) => {
					for (const name of names) {
						if (name.endsWith(".css")) {
							return "style.css";
						}
					}

					// everything else keeps the default pattern
					return "[name].[extname]";
				},
			},
		},
	},
	css: {
		modules: {
			localsConvention: "camelCaseOnly",
		},
	},
})
