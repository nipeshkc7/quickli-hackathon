import { ObjectId } from 'mongodb'

export type EventType = {
    id: number,
    name: string
    location: string
    coordinates: {
        lat: number
        lng: number
    }
    gameType: string
    date: string
    participants: number
    image: string
    users: string[]
}

export type UserType = {
    id: ObjectId
    fname: string
    lname: string
    age: number
    email: string
    role: string
    rating: number
}
