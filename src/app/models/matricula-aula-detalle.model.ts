import { MatriculaAula } from "./matricula-aula.model";
import { Alumno } from "./alumno.model";

export class MatriculaAulaDetalle {

  constructor(
    public idMatriculaDetalle: number,
    public matricula?: MatriculaAula,
    public alumno?: Alumno
  ) { }
}
