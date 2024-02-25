import { RowDataPacket } from "mysql2";

export interface IProperty {
    id: number;
    type: string;
    business_type: string;
    is_active: number;
    title: string;
    short_description: string;
    street: string;
    city: string;
    state: string;
    zip: number;
    long_description: string;
    price: number;
    thumbnail: string;
    images: string[];
    created_by: number;
    created_at: string;
    updated_at: string;
}
export interface IProperty extends RowDataPacket {}