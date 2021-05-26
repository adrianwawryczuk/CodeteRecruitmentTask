import {MovieSearchResponse} from "../api";

async function fetchMovies(page: number, formState: Record<string, string>) {
    const query = new URLSearchParams({
        page: page.toString(),
        year: formState?.year ?? process.env.DEFAULT_YEAR,
        title: formState?.title?.toString() ?? process.env.DEFAULT_TITLE
    })

    const response = await window.fetch(`/api/movies/?${query}`);
    return await response.json() as MovieSearchResponse;
}

export default fetchMovies;