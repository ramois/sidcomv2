import { Request } from 'express';

// Extiende Request para agregar `razon_social` al body
export interface CustomRequest extends Request {
  body: {
    razon_social?: string;  // Campo opcional
    [key: string]: any;     // Esto permite que otros campos también puedan ser incluidos
  };
}
