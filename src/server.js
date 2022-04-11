import createFastifyServer from "fastify";
import Cors from "fastify-cors";
import Static from "fastify-static"
import {parseGoogleQuery} from "./utils/parseGoogleQuery.js";
import {parseDdgQuery} from "./utils/ParseDdgQuery.js";
import {parseFilterBangs} from "./utils/bangs.js";
import * as path from "path";
import {parseHomePage} from "./utils/parseHomePage.js";
import fs from "fs/promises";
import serveStatic from "serve-static"

const fastify = createFastifyServer({
	logger: true,
});

fastify.register(Cors, {
	origin: "*"
});

fastify.register(Static, {
	root: path.resolve(path.dirname(''), 'public'),
	prefix: '/public/',
})

const routeOptions = {};

function serveWithParser(fn) {
	return function (request, reply) {
		const {q} = request.query
		return fn(parseFilterBangs(q))
	}
}

fastify.get("/", routeOptions, async (request, reply) => {
	// return reply.sendFile('index.html')
	return reply.type('text/html').send(await parseHomePage())
})

fastify.get("/google", routeOptions, serveWithParser(parseGoogleQuery));

fastify.get("/ddg", routeOptions, serveWithParser(parseDdgQuery));

fastify.get("/:folder/:file", async (request, reply) => {
	const {params} = request
	return reply.sendFile(`${params.folder}/${params.file}`)
})

try {
	fastify.listen(3000);
} catch (error) {
	fastify.log.error(error);
	process.exit(1);
}
