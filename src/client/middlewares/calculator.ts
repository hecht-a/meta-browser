const headerText: HTMLHeadingElement = document.querySelector('.header-text')!
const precision = Math.pow(10, 15)
let hasCalculation = false

export function calculator(q: string) {
	if(q.match(/^\d$/)) {
		return false
	}

	if (q.match(/^\d[\d\s\+\/\-\*\.]*$/)) {
		const result = eval(q);
		headerText!.innerText =
			" = " + Math.round(result * precision) / precision;
		hasCalculation = true;

		return true;
	} else if (hasCalculation) {
		headerText.innerHTML = "";
		hasCalculation = false;
	}

	return false;
}
