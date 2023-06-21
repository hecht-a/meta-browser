import createFastifyServer, {FastifyReply, FastifyRequest} from "fastify";
import Cors from "fastify-cors";
import Static from "fastify-static"
import * as path from "node:path";
import {RouteGenericInterface} from "fastify/types/route";
import fs from "node:fs/promises";
import fss from "node:fs";
import {ROUTE_OPTIONS} from "@api/constants";
import {parseDdgQuery, parseGoogleQuery, parseHomePage, serveWithParser} from "@api/utils";
import * as dotenv from 'dotenv'
import {logger, sticker} from '@poppinss/cliui'

dotenv.config()

const {env} = process

let fastifyOptions: {
	logger: boolean,
	http2?: boolean,
	https?: {
		allowHTTP1: boolean,
		key: Buffer,
		cert: Buffer
	}
} = {
	logger: true
}
if (env.HTTPS) {
	fastifyOptions = {
		...fastifyOptions,
		http2: true,
		https: {
			allowHTTP1: true, // fallback support for HTTP1
			key: fss.readFileSync(path.join(__dirname, "..", "..", "https", "fastify.key")),
			cert: fss.readFileSync(path.join(__dirname, "..", "..", "https", "fastify.cert")),
		},
	}
}

const fastify = createFastifyServer(fastifyOptions);

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

const port = env.NODE_ENV === 'production' ? env.PORT_PROD : env.PORT_DEV

try {
	fastify.listen(port!, '0.0.0.0').then((address) => {
		sticker()
			.add('Started server')
			.add('')
			.add(`Environment: ${logger.colors.cyan(env.NODE_ENV!)}`)
			.add(`Local address: ${logger.colors.cyan(address)}`)
			.render()
	})
} catch (error) {
	fastify.log.error(error);
	process.exit(1);
}
