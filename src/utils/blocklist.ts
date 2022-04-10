const blocklist: string[] = []

/**
 * @param {string} site
 */
export function isBlocked(site: string) {
	for (const item of blocklist) {
		if (site.includes(item)) {
			return true
		}
	}
	return false
}
