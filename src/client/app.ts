import {SearchResult} from "@types";
import {bangs, calculator, capitalize} from "./middlewares";
import {encodeEntities} from "./helpers/encodeEntities";
import {SettingsPane, ThemeSwitcher} from './CustomElements'

const form: HTMLFormElement = document.querySelector('.search')!
const url = new URL(window.location.href)
const searchInput: HTMLInputElement = document.querySelector('.search-input')!

window.customElements.define('theme-switcher', ThemeSwitcher)
window.customElements.define('settings-pane', SettingsPane)

const middlewares = [bangs, calculator, capitalize]

const {body} = document
const theme = localStorage.getItem("theme")
if (theme) {
	const {classList} = body;
	if (classList.contains('theme-dark') && theme === "light") {
		classList.remove('theme-dark')
		classList.add('theme-light')
	} else if (classList.contains('theme-light') && theme === "dark") {
		classList.add('theme-dark')
		classList.remove('theme-light')
		const switchButton: HTMLInputElement = document.querySelector('#switch')!
		switchButton.checked = true
	}
}

searchInput.addEventListener('focus', () => {
	document.body.classList.add('has-focus')
})

searchInput.addEventListener('blur', () => {
	document.body.classList.remove('has-focus')
})

form.addEventListener('submit', (e) => {
	e.preventDefault()
	const q = new FormData(<HTMLFormElement>e.target).get('q')!.toString()
	initHistory(q)
})

/**
 * @param {string} element
 * @return {(function({link: string, title: string, desc: string, domain: string}[]): void)|*}
 */
const injectResult = (element: string) => (results: SearchResult[]) => {
	/** @type {HTMLDivElement} */
	const container = document.querySelector(element)!
	container.innerHTML = results.map(templates).join('')
}

/**
 * @param {string} q
 */
const initHistory = (q: string) => {
	if (search(q)) {
		url.searchParams.set('q', q)
		history.pushState(null, '', url.toString())
	}
}

/**
 * @param {string} q
 * @return {boolean}
 */
function search(q: string) {
	searchInput.value = q
	if (q === "") {
		return false
	}

	for (const middleware of middlewares) {
		if (middleware(q)) {
			return false
		}
	}

	document.title = `${q} - Recherche`
	document.body.classList.add('is-loading')
	document.body.classList.add('has-results')
	Promise.any([
		fetch(`/ddg?q=${q}`).then((response) => response.json()).then(injectResult('#ddg')),
		fetch(`/google?q=${q}`).then((response) => response.json()).then(injectResult('#google'))
	]).then(() => document.body.classList.remove('is-loading'))

	return true
}

/**
 * @param {string} link
 * @param {string} title
 * @param {string} desc
 * @param {string} domain
 * @return {string}
 */
const templates = ({link, title, desc, domain}: SearchResult): string => `
	<div class="result">
		<a href="${encodeEntities(link)}" class="result_title">${encodeEntities(title)}</a>
		<div class="result_url">
			<img src="https://external-content.duckduckgo.com/ip3/${domain}.ico" alt="">
			<span>${encodeEntities(link)}</span>
		</div>
		<p class="result_desc">${desc}</p>
	</div>
`

const q = url.searchParams.get('q')
if (q && q !== "") {
	initHistory(q)
}
