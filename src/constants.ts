import {ResourceLoader} from "jsdom";

export const GOOGLE_URL = "https://google.com/search?q="

export const DDG_URL = "https://html.duckduckgo.com/html/?q="

export const RESOURCE_LOADER = new ResourceLoader({
	userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4844.74 Safari/537.36",
});
