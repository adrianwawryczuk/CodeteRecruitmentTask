import {Movie} from "../types/movie";
import {useCallback, useEffect, useState} from "react";

const useFormLazyFetch = (initialTotalResult: number, initialMovies: Movie[], formState: Record<string, string>) => {
    const [page, setPage] = useState(1);
    const [isLoading, setLoading] = useState(false)
    const [totalResults, setTotalResults] = useState(initialTotalResult ?? 0);
    const [movies, setMovies] = useState(initialMovies)

    const fetch = useCallback(async () => {
        if (movies.length >= totalResults || isLoading) {
            return
        }

        setLoading(true);
        const data = await fetchMovies(page, formState);

        setTotalResults(data.totalResults);
        setMovies(page === 1 ? data.result : movies.concat(data.result));
        setLoading(false);
    }, [formState, page]);

    const goNext = useCallback(() => {
        if (isLoading) {
            return
        }

        setPage(page => page + 1);
    }, [isLoading]);

    useEffect(() => {
        async function fetchFreshPage() {
            setPage(1)
            setLoading(true);
            const movieSearchResponse = await fetchMovies(1, formState);
            setMovies(movieSearchResponse.result);
            setTotalResults(movieSearchResponse.totalResults);
            setLoading(false);
        }

        fetchFreshPage();
    }, [formState.year, formState.title])

    useEffect(() => {
        fetch()
    }, [page])

    return {
        totalResults,
        movies,
        goNext
    }
}

export default useFormLazyFetch;