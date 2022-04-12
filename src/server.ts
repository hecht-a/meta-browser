import createFastifyServer, {FastifyReply, FastifyRequest} from "fastify";
import Cors from "fastify-cors";
import Static from "fastify-static"
import {parseGoogleQuery} from "@utils/parseGoogleQuery";
import {parseDdgQuery} from "@/utils/ParseDdgQuery";
import {parseFilterBangs} from "@/utils/bangs";
import * as path from "path";
import {SearchResult} from "@/types";
import {RouteGenericInterface} from "fastify/types/route";
import {parseHomePage} from "@utils/parseHomePage";

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

function serveWithParser(fn: (q: string) => Promise<SearchResult[]>) {
	return function (request: FastifyRequest<RouteGenericInterface & { QueryString: { q: string } }>, reply: FastifyReply) {
		const {q} = <{ q: string }>request.query
		return fn(parseFilterBangs(q))
	}
}

fastify.get("/", routeOptions, async (request: FastifyRequest, reply) => {
	return reply.type('text/html').send(await parseHomePage())
})

fastify.get("/google", routeOptions, serveWithParser(parseGoogleQuery));

fastify.get("/ddg", routeOptions, serveWithParser(parseDdgQuery));

fastify.get("/:folder/:file", async (request: FastifyRequest<{ Params: { folder: string, file: string } }>, reply) => {
	const {params} = request
	return reply.sendFile(`${params.folder}/${params.file}`)
})

fastify.get("/js/middlewares/:file", async (request: FastifyRequest<{ Params: { folder: string, file: string } }>, reply) => {
	const {params} = request
	return reply.sendFile(`js/middlewares/${params.file}`)
})

try {
	fastify.listen(5934, '0.0.0.0');
} catch (error) {
	fastify.log.error(error);
	process.exit(1);
}
