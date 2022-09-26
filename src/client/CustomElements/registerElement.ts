export const registerElement = (name: string) => (target: CustomElementConstructor) => {
	console.log({target})
	window.customElements.define(name, target)
}
