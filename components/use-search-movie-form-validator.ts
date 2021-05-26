import {useMemo} from "react";

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

export default useSearchMoviesFormValidator;