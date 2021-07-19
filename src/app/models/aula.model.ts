import { Anio } from "./anio.model";
import { Nivel } from "./nivel.model";

export class Aula {

  constructor(
    public idAula: number,
    public anio: Anio,
    public nivel: Nivel,
    public descripcion: string,
    public vacantes: number
  ) { }
}
