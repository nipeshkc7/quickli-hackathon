import { ObjectId } from 'mongodb';

export type EventType = {
    id: ObjectId;
    name: string;
    location: string;
    coordinates: {
        lat: number;
        lng: number;
    };
    date: string;
    participants: number;
    users: string[];
};

export type UserType = {
    id: ObjectId;
    fname: string;
    lname: string;
    age: number;
    email: string;
    role: string;
    rating: number;
};
