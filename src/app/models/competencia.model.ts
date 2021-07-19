import { Curso } from "./curso.model";

export class Competencia {

  constructor(
    public idCompetencia: number,
    public curso: Curso,
    public descripcion: string
  ) { }
}
