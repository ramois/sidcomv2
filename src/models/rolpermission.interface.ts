import { Permission } from './permission.interface';
import { Rol } from './rol.interface';
//import { SampleMineral } from './rol.interface';
export interface RolPermission {
  permission_id: number;
  role_id: number;
  permission: Permission;
  rol: Rol;
}