export class ThemeSwitcher extends HTMLElement {
	connectedCallback() {
		this.classList.add('theme-switcher')
		this.innerHTML = `<input type="checkbox" id="switch" /><label for="switch">Toggle</label>`
		const input = this.querySelector('input')!
		input.addEventListener('change', e => {
			const target = e.currentTarget! as HTMLInputElement
			const themeToRemove = target.checked ? 'light' : 'dark'
			const themeToAdd = target.checked ? 'dark' : 'light'
			document.body.classList.add(`theme-${themeToAdd}`)
			document.body.classList.remove(`theme-${themeToRemove}`)
			localStorage.setItem("theme", themeToAdd)
		})
	}
}


