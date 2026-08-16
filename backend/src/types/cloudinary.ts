export type UploadResult = { 
    secure_url: string, 
    public_id: string,
    created_at: string
}
export type ResolveType = (
    value: {
        secure_url: string,
        public_id: string,
        created_at: string
    }
) => void
export type RejectType = (reason?: any) => void