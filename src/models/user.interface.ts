export interface User {
    id: number;
    email: string;
    password: string | null;
    id_operador: number | null;
    nombre: string;
    apellidos: string;
    ci: string;
    celular: number;
    rol: number;
    estado: number | null;
  }