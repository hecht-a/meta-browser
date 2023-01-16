import commonjs from "@rollup/plugin-commonjs";
import {dependencies} from "./package.json";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import remove from "rollup-plugin-delete";
import {resolve} from "path";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";
import copy from "rollup-plugin-copy";

const config = {
	plugins: [
		nodeResolve(),
		commonjs(),
		json(),
		typescript({
			noEmitOnError: false
		}),
		"production" === process.env.NODE_ENV && terser({
			compress: {
				drop_console: true
			}
		}),
		copy({
			targets: [
				{src: "public/css/app.css", dest: "dist/css"},
				{src: "public/index.html", dest: "dist/"},
				{src: "public/static/**/*", dest: "dist/static"}
			]
		})
	],

	external: [...Object.keys(dependencies), "stream", 'node:fs/promises', 'node:path'],
}

export default [
	{
		...config,
		input: resolve("src/api", "server.ts"),

		plugins: [
			...config.plugins,
			remove({targets: resolve("dist"), runOnce: true, verbose: true})
		],

		output: {
			file: resolve("dist/api", "server.js"),
			format: "cjs",
			sourcemap: true
		}
	},
	{
		...config,
		input: resolve("src/client", "app.ts"),

		output: {
			file: resolve("dist/js", "app.js"),
			format: "cjs",
			sourcemap: true
		}
	}
];
