import { MatriculaAula } from "../models/matricula-aula.model";
import { MatriculaAulaDetalle } from "../models/matricula-aula-detalle.model";

export class MatriculaAulaDTO {
  matricula: MatriculaAula;
  detalle: MatriculaAulaDetalle[]
}
