const bangsList = {
	"!npmjs":  "https://www.npmjs.com/search?q=%s",
	"!tr":   "https://www.wordreference.com/enfr/%s",
	"!imdb": "https://www.imdb.com/find?s=all&q=%s",
	"!gh":   "https://github.com/search?utf8=%E2%9C%93&q=%s",
	"!ytb":   "https://www.youtube.com/results?search_query=%s",
	"!d":    "https://www.larousse.fr/dictionnaires/francais/%s",
	"!g":    "https://www.google.com/search?q=%s",
	"!ddg": "https://www.duckduckgo.com?q=%s",
	"!gmap": "https://www.google.fr/maps?hl=fr&q=%s",
	"!w": "https://fr.wikipedia.org/wiki/%s",
	"!gr": "https://grafikart.fr/recherche?q=%s"
}

export function bangs(q: string) {
	if(!q.includes('!')) {
		return false
	}
	for(const [bang, replace] of Object.entries(bangsList)) {
		if(q.startsWith(`${bang} `) || q.endsWith(` ${bang}`)) {
			const search = q.replace(bang, "").trim()
			window.location.href = replace.replace('%s', encodeURIComponent(search).replaceAll(bang, "").trim())
			return true
		}
	}
	return false
}
