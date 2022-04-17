import {ResourceLoader} from "jsdom";

export const GOOGLE_URL = "https://google.com/search?q="

export const DDG_URL = "https://html.duckduckgo.com/html/?q="

export const BING_URL = "https://www.bing.com"

export const RESOURCE_LOADER = new ResourceLoader({
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36",
});

export const OPTIONS = {
	headers: {
		accept: "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9",
		"accept-language": "fr,fr-FR;q=0.9,en;q=0.8,en-GB;q=0.7,en-US;q=0.6",
		"cache-control": "no-cache",
		"user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36"
	}
}

export const ROUTE_OPTIONS = {}
