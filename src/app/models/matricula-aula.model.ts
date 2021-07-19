import { Aula } from "./aula.model";
import { Usuario } from "./usuario.model";

export class MatriculaAula {

  constructor(
    public idMatricula: number,
    public aula?: Aula,
    public usuario?: Usuario,
    public fecha?: string
  ) { }
}
