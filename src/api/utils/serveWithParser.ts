import {SearchResult} from "@types";
import {parseFilterBangs} from "@api/utils/bangs";
import {RouteHandlerMethod} from "fastify";

export function serveWithParser(fn: (q: string) => Promise<SearchResult[]>): RouteHandlerMethod {
	return function (request, reply) {
		const {q} = <{q: string}>request.query
		return fn(parseFilterBangs(q))
	}
}
