import { Rol } from "./rol.model";

export class Usuario {

  constructor(
    public idUsuario: number,
    public rol: Rol,
    public nombres: string,
    public apellidos: string,
    public username: string,
    public password: string,
    public enabled: boolean
  ) { }
}
