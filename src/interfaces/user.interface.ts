export interface IUser {
    id?: number;
    name?: string;
    email: string;
    password: string;
    type?: string;
    phone?: string;
    created_at?: Date;
    updated_at?: Date;
}