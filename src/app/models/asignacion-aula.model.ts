import { Aula } from "./aula.model";
import { Usuario } from "./usuario.model";

export class AsignacionAula {

  constructor(
    public idAsignacion: number,
    public aula?: Aula,
    public usuario?: Usuario,
    public fecha?: string
  ) { }
}
