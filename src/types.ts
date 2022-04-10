export type SearchResult = {
	link: string;
	title: string;
	desc: string;
	domain: string;
	author?: string;
	related?: Link[];
}

export type Link = {
	title: string;
	link: string;
}
