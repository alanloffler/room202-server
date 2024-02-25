import { RowDataPacket } from "mysql2";

export interface IUICombos {
    id: number;
    name: string;
    value: string;
}

export interface IUICombos extends RowDataPacket {}