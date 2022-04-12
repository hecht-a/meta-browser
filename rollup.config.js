import commonjs from "@rollup/plugin-commonjs";
import {dependencies} from "./package.json";
import json from "@rollup/plugin-json";
import nodeResolve from "@rollup/plugin-node-resolve";
import remove from "rollup-plugin-delete";
import {resolve} from "path";
import {terser} from "rollup-plugin-terser";
import typescript from "@rollup/plugin-typescript";

export default {
	input: resolve("src", "server.ts"),

	plugins: [
		remove({targets: resolve("dist"), runOnce: true, verbose: true}),
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
		})
	],

	external: [...Object.keys(dependencies), "stream"],

	output: {
		file: resolve("dist", "server.js"),
		format: "cjs",
		sourcemap: true
	}
};
