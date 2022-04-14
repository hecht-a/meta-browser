class ThemeSwitcher extends HTMLElement {
	connectedCallback() {
		this.classList.add('theme-switcher')
		this.innerHTML = `<input type="checkbox" id="switch" /><label for="switch">Toggle</label>`
		const input = this.querySelector('input')
		input.addEventListener('change', e => {
			const themeToRemove = e.currentTarget.checked ? 'light' : 'dark'
			const themeToAdd = e.currentTarget.checked ? 'dark' : 'light'
			document.body.classList.add(`theme-${themeToAdd}`)
			document.body.classList.remove(`theme-${themeToRemove}`)
			localStorage.setItem("theme", themeToAdd)
		})
	}
}


