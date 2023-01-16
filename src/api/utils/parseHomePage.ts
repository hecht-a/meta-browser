import * as fs from "node:fs/promises";
import * as path from "path";
import {getBingBackground} from "@api/utils/getBingBackground";

export async function parseHomePage() {
	const file = await fs.readFile(path.resolve(path.dirname(''), 'dist/index.html'), {encoding: 'utf-8'})
	return file
		.replace("{{ background }}", `url('${await getBingBackground()}');`)
}
