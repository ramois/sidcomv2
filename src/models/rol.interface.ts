import { RolPermission } from './rolpermission.interface'
export interface Rol {
  id: number;
  nombre: string;
  created_at: string;
  updated_at: string;
  rolPermissions: RolPermission[];
}