export interface User {
  id: number;
  email: string;
  password: string | null;
  nombre: string;
  apellidos: string;
  ci: string;
  celular: number;
  rol_id: number;
  operador_id: number | null;
  estado: string;
  created_at: Date;
  updated_at: Date;
  // Si en algún momento decides agregar el campo 'rol', puedes hacerlo aquí.
  // rol: Rol;
}
  /*
import { Rol } from './rol.interface';           // Asegúrate de que la ruta sea correcta
import { Operator } from './operator.interface'; 
export interface User {
  id: number;
  email: string;
  password?: string; // Contraseña opcional
  nombre: string;
  apellidos: string;
  ci: string;
  celular: number;
  rol_id: number;
  operador_id: number | null;
  //estado: "ACTIVO" | "INACTIVO";
  estado: string;
  created_at: string;
  updated_at: string;
  //rol: Rol;
  //operador?: Operator;
}*/