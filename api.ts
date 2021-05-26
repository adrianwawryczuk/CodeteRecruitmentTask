import {Movie} from "./types/movie";

const serverApiUrl = `http://www.omdbapi.com/`

interface SearchParams {
    title?: string,
    page: number,
    year?: number,
}


export type MovieSearchResponse = {
    result: Movie[],
    totalResults: number,
};

const searchMovies = async (params: SearchParams): Promise<MovieSearchResponse> => {
    const urlSearchParams = new URLSearchParams([
        ['apikey', process.env.API_KEY],
        ['s', params.title ?? ''],
        ['page', params.page.toFixed(0)],
        ['y', params.year?.toFixed(0) ?? undefined]
        //  Review info: TS doesnt correctly infer return type from filter(Boolean)
    ].filter(Boolean) as string[][]);

    const url = `${serverApiUrl}?${urlSearchParams}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        return {
            result: data?.Search ?? [],
            totalResults: data?.totalResults ?? 0
        }
    } catch (e) {
        return {
            result: [],
            totalResults: 0
        }
    }

};

const serverApi = {
    searchMovies
}

export default serverApi;