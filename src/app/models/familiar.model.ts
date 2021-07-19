import { Alumno } from "./alumno.model";
import { Parentesco } from "./parentesco.model";
import { TipoDocumento } from "./tipo-documento.model";
import { Sexo } from "./sexo.model";

export class Familiar {

  constructor(
    public idFamiliar: number,
    public alumno?: Alumno,
    public parentesco?: Parentesco,
    public nombres?: string,
    public apellidos?: string,
    public tipoDocumento?: TipoDocumento,
    public numDocumento?: string,
    public fechaNac?: string,
    public sexo?: Sexo,
    public telCelular?: string,
    public telFijo?: string,
    public correo?: string,
    public foto?: string,
    public contactoEmergencia?: boolean
  ) { }
}
