export const getCroppedString = (str: string, startLimit: number, endLimit: number): string => {
    if (str.length <= startLimit + endLimit) return str;

    return str.slice(0, startLimit) + '...' + str.slice(str.length - endLimit - 1, str.length)
}