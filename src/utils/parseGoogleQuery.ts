import {JSDOM} from "jsdom";
import got from "got";
import {Link, SearchResult} from "@/types";
import {GOOGLE_URL} from "@/constants";
import {options} from "@/options";

export async function parseGoogleQuery(q: string): Promise<SearchResult[]> {
	const {body} = await got.get(`${GOOGLE_URL}${q}`, options)
	const dom = new JSDOM(body)
	const items: NodeListOf<HTMLElement> = dom.window.document.querySelectorAll('div.g')
	let results: SearchResult[] = []
	const urls: Record<string, boolean> = {}

	items.forEach((item: HTMLElement) => {
		const link = item.querySelector("a")!.href
		const title = item.querySelector("h3")!.textContent ?? ""
		const desc = item.querySelector(".VwiC3b")
		const cite = item.querySelector("cite")

		if (link !== "" && link !== "#" && !link.startsWith("/")) {
			const {hostname} = new URL(link)
			const linkAlreadyListed = urls[link]
			if (!linkAlreadyListed) {
				urls[link] = true
				results.push({
					title,
					link,
					desc: desc ? desc.innerHTML : "",
					domain: hostname,
					author: cite?.innerText,
					related: extractRelated(Array.from(item.querySelectorAll(".fl")))
				})

				results = extractSameSite(item, results)
				results = extractNestedLi(item, results)
			}
		}
	})

	return results
}

function extractRelated(s: HTMLAnchorElement[]): Link[] {
	const selection: Link[] = []
	s.forEach((item: HTMLAnchorElement) => {
		const title = item.querySelector("span")
		if (!title) {
			return
		}
		const link = item.href ?? ""
		if (!link.includes("webcache.googleusercontent") && !link.includes("translate.google.com") && !link.startsWith("/search?q")) {
			selection.push({
				title: title.innerText,
				link
			})
		}
	})
	return selection

}

function extractSameSite(s: HTMLElement, r: SearchResult[]) {
	const items = s.querySelectorAll('.mslg')
	items.forEach((item) => {
		const title = item.querySelector("h3")
		if (!title) {
			return
		}
		const link = title.querySelector("a")!.href
		const {hostname} = new URL(link)
		const desc = title.nextElementSibling ? title.nextElementSibling.innerHTML : "<br/>"
		r.push({
			title: title.textContent ?? "",
			link,
			desc,
			domain: hostname
		})
	})
	return r
}

/**
 * @param {HTMLElement} s
 * @param {array} r
 */
function extractNestedLi(s: HTMLElement, r: SearchResult[]) {
	const items = s.querySelectorAll("li.MYVUIe")
	items.forEach((item) => {
		const title = item.querySelector("h3")!
		const link = (<HTMLAnchorElement>title.parentElement).href
		const {hostname} = new URL(link)
		const desc = item.querySelector("div[data-content-feature]")!.innerHTML
		r.push({
			title: title.textContent ?? "",
			link,
			desc,
			domain: hostname
		})
	})
	return r
}
