import {useRouter} from "next/dist/client/router";
import {useCallback, useState} from "react";

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
export default useSearchMovieForm;