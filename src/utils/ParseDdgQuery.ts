import {JSDOM} from "jsdom";
import got from "got";
import {DDG_URL} from "@/constants";
import {options} from "@/options";
import {isBlocked} from "@utils/blocklist";
import {SearchResult} from "@/types";

export async function parseDdgQuery(q: string): Promise<SearchResult[]> {
	const {body} = await got.get(`${DDG_URL}${q}`, options)
	const dom = new JSDOM(body)

	const items = dom.window.document.querySelectorAll(".result")
	const results: SearchResult[] = []
	items.forEach((item) => {
		const title = item.querySelector(".result__title")!.querySelector("a")!
		const link = title.href
		const desc = item.querySelector(".result__snippet") ? item.querySelector(".result__snippet")!.innerHTML : ""
		const {hostname} = new URL(link)
		if(!item.classList.contains("result--add") && !isBlocked(hostname)) {
			results.push({
				title: title.textContent ?? "",
				link,
				desc,
				domain: hostname
			})
		}
	})

	return results
}
