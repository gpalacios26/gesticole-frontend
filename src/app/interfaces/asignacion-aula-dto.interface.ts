import { AsignacionAula } from "../models/asignacion-aula.model";
import { AsignacionAulaDetalle } from "../models/asignacion-aula-detalle.model";

export class AsignacionAulaDTO {
  asignacion: AsignacionAula;
  detalle: AsignacionAulaDetalle[]
}
