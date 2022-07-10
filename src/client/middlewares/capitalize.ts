const headerText: HTMLHeadingElement = document.querySelector('.header-text')!
let hasResult = false

export function capitalize(q: string): boolean {
	if (q.includes('!cap')) {
		const string = q.replaceAll('!cap', '').trim().toLowerCase()
		headerText.innerText =
			" = " + string[0].toUpperCase() + string.slice(1, string.length)

		return true;
	} else if (hasResult) {
		headerText!.innerHTML = "";
		hasResult = false;
	}
	return false;
}
