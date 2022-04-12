const headerText = document.querySelector('.header-text')
const precision = Math.pow(10, 15)
let hasCalculation = false

/**
 * @param {string} q
 * @return {boolean}
 */
function calculator(q) {
	if (q.match(/^[0-9][0-9\s\+\/\-\*\.]*$/)) {
		const result = eval(q);
		headerText.innerText =
			" = " + Math.round(result * precision) / precision;
		hasCalculation = true;
		return true;
	} else if (hasCalculation) {
		headerText.innerHTML = "";
		hasCalculation = false;
	}
	return false;
}
