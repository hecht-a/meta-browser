import * as fs from "fs/promises";
import * as path from "path";

export async function parseHomePage() {
	const file = await fs.readFile(path.resolve(path.dirname(''), 'public/index.html'), {encoding: 'utf-8'})
	return file.replace('{{ style }}', "/css/app.css")
}
