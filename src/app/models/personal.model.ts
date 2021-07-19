import { TipoDocumento } from "./tipo-documento.model";
import { Sexo } from "./sexo.model";
import { TipoPersonal } from "./tipo-personal.model";

export class Personal {

  constructor(
    public idPersonal: number,
    public nombres?: string,
    public apellidos?: string,
    public tipoDocumento?: TipoDocumento,
    public numDocumento?: string,
    public fechaNac?: string,
    public sexo?: Sexo,
    public telCelular?: string,
    public telFijo?: string,
    public correo?: string,
    public tipoPersonal?: TipoPersonal,
    public cargo?: string,
    public foto?: string
  ) { }
}
