import { Injectable } from '@angular/core';
import { FacadeService } from './facade.service';
import { ValidatorService } from './tools/validator.service';
import { ErrorsService } from './tools/errors.service';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})

export class MateriasService {

  constructor(private http: HttpClient,
    private validatorService: ValidatorService,
    private errorService: ErrorsService,
    private facadeService: FacadeService) {

  }
  public esquemaMaterias(){
    return {

     'nrc': '',
     'nombre' : '',
     'section' : '',
     'dias_json': [],
     'hora_inicio':'',
     'hora_final': '',
     'salon': '',
     'programa': '',
     'id_maestro': '',
     'creditos' :'',
    }
  }

  public validarMateria(data: any, editar: boolean){
    console.log("Validando materia ", data);
    let error: any = {};

    //Validaciones comunes
    //Validaciones comunes
    if(!this.validatorService.required(data["nrc"])){
      error["nrc"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["nombre"])){
      error["nombre"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["section"])){
      error["section"] = this.errorService.required;
    }

    if (!data["dias_json"] || data["dias_json"].length === 0) {
      error["dias_json"] = "Debes seleccionar al menos un día";
    }



    //if(!this.validatorService.required(data["hora_inicio"])){
      //error["hora_inicio"] = this.errorService.required;
    //}

    if(!data["hora_inicio"] || data["hora_inicio"].toString().trim() === ""){
      error["hora_inicio"] = this.errorService.required;
  }

  if(!data["hora_final"] || data["hora_final"].toString().trim() === ""){
    error["hora_final"] = this.errorService.required;
}



   // if(!this.validatorService.required(data["hora_final"])){
     // error["hora_final"] = this.errorService.required;
    //}

    if(!this.validatorService.required(data["salon"])){
      error["salon"] = this.errorService.required;
    }

    if (!this.validatorService.required(data["programa"])) {
      error["programa"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["id_maestro"])){
      error["id_maestro"] = this.errorService.required;
    }

    if(!this.validatorService.required(data["creditos"])){
      error["creditos"] = this.errorService.required;
    }

    //Return arreglo
    return error;
}

public registrarMateria (data: any): Observable <any>{
  // Verificamos si existe el token de sesión


  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;
  if (token) {
    headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  return this.http.post<any>(`${environment.url_api}/materias/`, data, { headers });
}

public obtenerListaMaterias(): Observable<any>{
  // Verificamos si existe el token de sesión
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;
  if (token) {
    headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  return this.http.get<any>(`${environment.url_api}/lista-materias/`, { headers });
}

public eliminarMaterias(idMateria: number): Observable<any>{
  // Verificamos si existe el token de sesión
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;
  if (token) {
    headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  return this.http.delete<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
}

public actualizarMaterias( id: number, data: any): Observable<any> {
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;
  if (token) {
    headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    console.log("No se encontró el token del usuario");
  }
  return this.http.put<any>(`${environment.url_api}/materias/?id=${id}`, data, { headers });
}

public obtenerMateriaPorID(idMateria: number,): Observable<any>{
  // Verificamos si existe el token de sesión
  const token = this.facadeService.getSessionToken();
  let headers: HttpHeaders;
  if (token) {
    headers = new HttpHeaders({ 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token });
  } else {
    headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  }
  return this.http.get<any>(`${environment.url_api}/materias/?id=${idMateria}`, { headers });
}
}

