import got from "got";
import {BING_URL, OPTIONS} from "@api/constants";
import {JSDOM} from "jsdom";

async function getBing(): Promise<Document> {
	const {body} = await got(`${BING_URL}`, OPTIONS)
	const dom = new JSDOM(body)
	return dom.window.document
}

export async function getBingBackground() {
	const bing = await getBing()
	const imgCont = bing.querySelector('.img_cont')!
	const img = imgCont.getAttribute('style')!.split(/.+\((.+)\).+/)[1].replace('"', '');
	return `${BING_URL}${img}`
}
