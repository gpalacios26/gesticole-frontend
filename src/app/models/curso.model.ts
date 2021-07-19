import { Anio } from "./anio.model";
import { Nivel } from "./nivel.model";

export class Curso {

  constructor(
    public idCurso: number,
    public anio: Anio,
    public nivel: Nivel,
    public descripcion: string
  ) { }
}
