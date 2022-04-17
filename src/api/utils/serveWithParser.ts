import {SearchResult} from "@types";
import {FastifyReply, FastifyRequest} from "fastify";
import {RouteGenericInterface} from "fastify/types/route";
import {parseFilterBangs} from "@api/utils/bangs";

export function serveWithParser(fn: (q: string) => Promise<SearchResult[]>) {
	return function (request: FastifyRequest<RouteGenericInterface & { QueryString: { q: string } }>, reply: FastifyReply) {
		const {q} = <{ q: string }>request.query
		return fn(parseFilterBangs(q))
	}
}
