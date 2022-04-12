const form = document.querySelector('.search')
const url = new URL(window.location.href)
const searchInput = document.querySelector('.search-input')

const middlewares = [bangs, calculator]

searchInput.addEventListener('focus', () => {
	document.body.classList.add('has-focus')
})

searchInput.addEventListener('blur', () => {
	document.body.classList.remove('has-focus')
})

form.addEventListener('submit', (e) => {
	e.preventDefault()
	initHistory(new FormData(e.target).get('q'))
})

/**
 * @param {string} element
 * @return {(function({link: string, title: string, desc: string, domain: string}[]): void)|*}
 */
const injectResult = (element) => (results) => {
	/** @type {HTMLDivElement} */
	const container = document.querySelector(element)
	container.innerHTML = results.map(templates).join('')
}

/**
 * @param {string} q
 */
const initHistory = (q) => {
	if (search(q)) {
		url.searchParams.set('q', q)
		history.pushState(null, '', url.toString())
	}
}

/**
 * @param {string} q
 * @return {boolean}
 */
function search(q) {
	searchInput.value = q
	if (q === "") {
		return false
	}

	for(const middleware of middlewares) {
		if(middleware(q)) {
			return false
		}
	}

	document.title = `${q} - Recherche`
	document.body.classList.add('has-results')
	document.body.classList.add('is-loading')
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
const templates = ({link, title, desc, domain}) => `
	<div class="result">
		<a href="${link}" class="result_title">${title}</a>
		<div class="result_url">
			<img src="https://external-content.duckduckgo.com/ip3/${domain}.ico" alt="">
			<span>${link}</span>
		</div>
		<p class="result_desc">${desc}</p>
	</div>
`

const q = url.searchParams.get('q')
if (q && q !== "") {
	initHistory(q)
}
