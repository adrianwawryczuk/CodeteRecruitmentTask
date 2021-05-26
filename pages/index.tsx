import Head from 'next/head'
import Image from "next/image";
import serverApi, {MovieSearchResponse} from "../api";
import {Button, Input} from "reakit";
import {useCallback, useEffect, useMemo, useState} from "react";
import {GetServerSideProps} from "next";
import {parseToNumber} from "../utils";
import {useRouter} from "next/dist/client/router";
import {Movie} from "../types/movie";
import LazyLoadingScroll from "../components/lazy-loading-scroll";

const useSearchMovieForm = () => {
    const router = useRouter();
    const [formState, setFormState] = useState<Record<string, string>>({
        title: router.query.title?.toString() ?? process.env.DEFAULT_TITLE!,
        year: router.query.year?.toString() ?? process.env.DEFAULT_YEAR!
    })

    const handleChange = useCallback(({currentTarget}: React.FormEvent<HTMLInputElement>) => {
        const newState = {
            ...formState,
            [currentTarget.name]: currentTarget.value
        };
        setFormState(newState)

        const query = new URLSearchParams({
            title: newState.title,
            year: newState.year
        });

        router.replace(`${router.pathname}?${query}`);
    }, [formState])

    return {
        formState,
        handleChange
    }
}

const useSearchMoviesFormValidator = (formState: Record<string, string | number | undefined>) => {

    return useMemo(() => {
        const year = Number.isNaN(formState?.year) ? 0 : Number(formState?.year);
        const titleError = Boolean(formState.title) ? null : 'Enter title';
        const yearError = year >= 1900 || year <= 2050 ? null : 'Wrong year';

        return {
            title: titleError,
            year: yearError
        }
    }, [formState.year, formState.title])
}

async function fetchMovies(page: number, formState: Record<string, string>) {
    const query = new URLSearchParams({
        page: page.toString(),
        year: formState?.year ?? process.env.DEFAULT_YEAR,
        title: formState?.title?.toString() ?? process.env.DEFAULT_TITLE
    })

    const response = await window.fetch(`/api/movies/?${query}`);
    return await response.json() as MovieSearchResponse;
}

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


const Index = (props: MovieSearchResponse) => {
    const {handleChange, formState} = useSearchMovieForm();
    const errors = useSearchMoviesFormValidator(formState);
    const { totalResults, movies, goNext } = useFormLazyFetch(props.totalResults, props.result, formState);

    return (
        <>
            <Head>
                <title>Movie Search</title>
            </Head>

            <div className="container mx-auto flex flex-wrap pt-6 md:px-4">
                <label className="w-36">
                    Title
                </label>

                <label className="w-36 ml-4">
                    Year
                </label>
            </div>

            <div className="container mx-auto flex flex-wrap md:px-4">
                <Input className="w-36" onChange={handleChange} value={formState.title} name="title"/>
                <Input className="w-36 ml-4" onChange={handleChange} value={formState.year} name="year" type="number"/>

                <Button className="p-2 flex bg-red-500 ml-4 rounded-md text-white">
                    Reset
                    <svg xmlns="http://www.w3.org/2000/svg" className="ml-2 h-6 w-6" fill="none" viewBox="0 0 24 24"
                         stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                    </svg>
                </Button>
            </div>

            <div className="container mx-auto flex flex-wrap pb-6 text-red-700 text-center md:px-4">
                <span className="w-36">
                    {errors.title}
                </span>

                <span className="w-36 ml-4">
                    {errors.year}
                </span>
            </div>

            <div className="container mx-auto flex flex-wrap md:p-4 p-2">

                <div className="my-2 w-full ml-4 text-medium">
                    Found: {totalResults} movies.
                </div>

                {movies.map((movie) => {
                    return (
                        <div
                            key={movie.imdbID}
                            className="min-w-screen py-6 flex flex-wrap justify-center sm:py-12 xl:w-1/3 md:w-1/2 w-full">
                            <div className="flex space-x-4 px-4 justify-center w-full">
                                <div
                                    className="w-full bg-white rounded-md shadow-md relative flex justify-between items-start overflow-hidden">

                                    <div
                                        className="transform rotate-0 text-2xl font-semibold text-gray-700 mb-1 p-5 w-1/2 flex-grow">
                                        {movie.Title}

                                        <hr className="mt-2 mb-2 border-0 bg-gray-500 text-gray-500 h-px"/>

                                        {movie.Year && (
                                            <div
                                                className="text-sm w-full mt-2 text-gray-500">
                                                Year: {movie.Year}
                                            </div>
                                        )}
                                    </div>

                                    <div className="w-1/2 h-full relative">
                                        {movie.Poster === 'N/A' ? (
                                            <div className="w-full h-full bg-gray-600 flex justify-center items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                                </svg>
                                            </div>
                                        ) : (
                                            <Image className="w-full h-full" layout="responsive" src={movie.Poster}
                                                   width={170} height={250}/>
                                        )}
                                    </div>


                                </div>
                            </div>
                        </div>
                    );
                })}

                <LazyLoadingScroll callback={goNext} />
            </div>
        </>
    );
}

export const getServerSideProps: GetServerSideProps = async ({query}) => {
    const movies = await serverApi.searchMovies({
        page: parseToNumber(query?.page, 1),
        year: parseToNumber(query?.year, Number(process.env.DEFAULT_YEAR)),
        title: query?.title?.toString() ?? process.env.DEFAULT_TITLE
    });

    return {
        props: movies
    }
}

export default Index;