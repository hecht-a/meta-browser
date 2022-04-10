const filterBangs = {
	"!r":  "site:reddit.com",
}

export function parseFilterBangs(q: string) {
	for(const [bang, replace] of Object.entries(filterBangs)) {
		if(q.includes(`${bang} `) || q.includes(` ${bang}`)) {
			return q.replace(`${bang}`, replace)
		}
	}
	return q
}
