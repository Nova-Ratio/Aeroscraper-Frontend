export const getSettledValue = <T,>(result: PromiseSettledResult<T>): T | undefined => {
    return result.status === "fulfilled" ? result.value : undefined;
}