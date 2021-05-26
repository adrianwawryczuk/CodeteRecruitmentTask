export const parseToNumber = (query: string | string[] | number | undefined | null, defaultValue: number): number => {
    return Number.isNaN(query) || query == null ? defaultValue : Number(query)
}