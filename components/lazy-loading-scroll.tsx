import {useCallback, useEffect} from "react";

interface LazyLoadingScrollProps {
    callback: () => any
}


const LazyLoadingScroll = (props: LazyLoadingScrollProps) => {
    const handleScroll = useCallback(() => {
        const isNearBottom = (window.scrollY + window.innerHeight) >= document.body.offsetHeight - 500;

        if(isNearBottom) {
            props.callback();
        }
    }, [props.callback])


    useEffect(() => {
        window.addEventListener('scroll', handleScroll)

        return () => window.removeEventListener('scroll', handleScroll)
    }, [handleScroll])

    return null;
}

export default LazyLoadingScroll;