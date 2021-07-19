import { TipoDocumento } from "./tipo-documento.model";
import { Sexo } from "./sexo.model";

export class Alumno {

  constructor(
    public idAlumno: number,
    public nombres?: string,
    public apellidos?: string,
    public tipoDocumento?: TipoDocumento,
    public numDocumento?: string,
    public fechaNac?: string,
    public sexo?: Sexo,
    public telCelular?: string,
    public telFijo?: string,
    public correo?: string,
    public foto?: string
  ) { }
}
