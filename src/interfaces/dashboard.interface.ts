import { RowDataPacket } from 'mysql2';

export interface IPropertiesByCategory {
  category: string;
  color: string;
  percentage: number;
  total: number;
}

export interface IPropertiesByCategory extends RowDataPacket {}
