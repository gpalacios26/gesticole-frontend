import { AsignacionAula } from "./asignacion-aula.model";
import { Curso } from "./curso.model";
import { Personal } from "./personal.model";

export class AsignacionAulaDetalle {

  constructor(
    public idAsignacionDetalle: number,
    public asignacion?: AsignacionAula,
    public curso?: Curso,
    public personal?: Personal
  ) { }
}
