const SURROGATE_PAIR_REGEXP = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g
const NON_ALPHANUMERIC_REGEXP = /([^\#-~| |!])/g;

/**
 *
 * @param {string} value
 * @return string
 */
export function encodeEntities(value: string): string {
	return value.replace(/&/g, '&amp;').replace(SURROGATE_PAIR_REGEXP,  (value) => {
		const hi = value.charCodeAt(0);
		const low = value.charCodeAt(1);
		return '&#' + (((hi - 0xD800) * 0x400) + (low - 0xDC00) + 0x10000) + ';';
	}).replace(NON_ALPHANUMERIC_REGEXP, function (value) {
		return '&#' + value.charCodeAt(0) + ';';
	}).replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
