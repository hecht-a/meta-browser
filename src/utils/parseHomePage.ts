import * as fs from "fs/promises";
import * as path from "path";
import {getBingBackground} from "@utils/getBingBackground";

export async function parseHomePage() {
	const file = await fs.readFile(path.resolve(path.dirname(''), 'public/index.html'), {encoding: 'utf-8'})
	return file
		.replace('{{ style }}', "/css/app.css")
		.replace("{{ script }}", "/js/app.js")
		.replace("{{ background }}", `url('${await getBingBackground()}');`)
}
