import createFastifyServer, {FastifyReply, FastifyRequest} from "fastify";
import Cors from "fastify-cors";
import Static from "fastify-static"
import * as path from "path";
import {RouteGenericInterface} from "fastify/types/route";
import fs from "fs/promises";
import {ROUTE_OPTIONS} from "@api/constants";
import {parseDdgQuery, parseGoogleQuery, parseHomePage, serveWithParser} from "@api/utils";

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

fastify.get("/", ROUTE_OPTIONS, async (request: FastifyRequest<RouteGenericInterface & { QueryString: { q: string } }>, reply: FastifyReply) => {
	return reply.type('text/html').send(await parseHomePage())
})

fastify.get("/google", ROUTE_OPTIONS, serveWithParser(parseGoogleQuery));

fastify.get("/ddg", ROUTE_OPTIONS, serveWithParser(parseDdgQuery));

fastify.get("/:folder/:file", async (request: FastifyRequest<{ Params: { folder: string, file: string } }>, reply) => {
	const {params} = request
	return reply.sendFile(`${params.folder}/${params.file}`)
})

fastify.get("/js/:file", async (request: FastifyRequest<{ Params: { folder: string, file: string } }>, reply) => {
	const {params} = request
	const file = await fs.readFile(path.resolve(path.dirname(''), `dist/js/${params.file}`), {encoding: 'utf-8'})
	return reply.type('text/javascript').send(file)
})

try {
	fastify.listen(5934, '0.0.0.0');
} catch (error) {
	fastify.log.error(error);
	process.exit(1);
}
