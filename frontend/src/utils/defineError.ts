export function defineError(error: unknown | null | Error) {
    if(error instanceof Error) {
        return error
    }
}