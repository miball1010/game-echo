import { Timestamp } from 'firebase/firestore'

export interface Game {
    id?: string | undefined
    img: string
    name: string
    status: string
    platform: string[]
    note: string
    completedAt: string
    startAt: string | null
    updatedAt?: Timestamp
    category: string[]
}

export interface MenuNode {
    id: string,
    status?: string,
    statusCN: string,
    children?: MenuNode[]
}



