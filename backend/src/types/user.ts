export interface User {
    id: string
    name: string
    email: string
    role: 'buyer' | 'agent'
    created_at: string
}
