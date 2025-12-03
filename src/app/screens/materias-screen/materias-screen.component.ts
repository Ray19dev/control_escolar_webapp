//import { Component, OnInit } from '@angular/core';
import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { Location } from '@angular/common';
import { NgxMaterialTimepickerComponent } from 'ngx-material-timepicker';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-materias-screen',
  templateUrl: './materias-screen.component.html',
  styleUrls: ['./materias-screen.component.scss']
})
export class MateriasScreenComponent implements OnInit{
//evento: any;
inicioPicker: NgxMaterialTimepickerComponent;
finalPicker: NgxMaterialTimepickerComponent;
evento: any = {
  hora_inicio: '',
  hora_final: ''
};


  materiasSeleccionadas: string[] = [];
  public errors:any = {};
  public materia:any = {};
  public editar:boolean = false;
  public token: string = "";

  //Para el select
  public carreras: any[] = [
    {value: '1', viewValue: 'Ingenieria en Ciencias de la Computación'},
    {value: '2', viewValue: 'Licenciatura en Ciencias de la Computación'},
    {value: '3', viewValue: 'Ingenieria en Tecnologias de la Infromacion'},

  ];

  public dias: any[] = [
    {value: '1', viewValue: 'Lunes'},
    {value: '2', viewValue: 'Martes'},
    {value: '3', viewValue: 'Miercoles'},
    {value: '4', viewValue: 'Jueves'},
    {value: '5', viewValue: 'Viernes'},
  ];

  public materias:any[] = [
    {value: '1', nombre: 'Aplicaciones Web'},
    {value: '2', nombre: 'Programación 1'},
    {value: '3', nombre: 'Bases de datos'},
    {value: '4', nombre: 'Tecnologías Web'},
    {value: '5', nombre: 'Minería de datos'},
    {value: '6', nombre: 'Desarrollo móvil'},
    {value: '7', nombre: 'Estructuras de datos'},
    {value: '8', nombre: 'Administración de redes'},
    {value: '9', nombre: 'Ingeniería de Software'},
    {value: '10', nombre: 'Administración de S.O.'},
  ];
  listaMaestros: any;
  constructor(
    private router: Router,
    private location : Location,
    public activatedRoute: ActivatedRoute,
    private facadeService: FacadeService,
    private maestrosService: MaestrosService,
    private materiasService: MateriasService,
  ) { }
  ngOnInit(): void {
    //this.materia.dias_json = [];
    //this
    this.obtenerMaestros();
    this.materia = {
      nrc: '',
      nombre: '',
      section: '',
      dias_json: [],
      hora_inicio: '',
      hora_final: '',
      salon: '',
      programa: '',
      id_maestro: '',
      creditos: ''
    };
  const id = Number(this.activatedRoute.snapshot.params['id']);

  if (id) {
    this.editar = true;
    console.log("Editar materia ID:", id);
    this.obtenerMateriaPorID(id);
  }
  }


  public soloLetras(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);
    // Permitir solo letras (mayúsculas y minúsculas) y espacio
    if (
      !(charCode >= 65 && charCode <= 90) &&  // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) && // Letras minúsculas
      charCode !== 32                         // Espacio
    ) {
      event.preventDefault();
    }
  }

  public soloLetrasNumeros(event: KeyboardEvent) {
    const charCode = event.key.charCodeAt(0);


    if (
      !(charCode >= 65 && charCode <= 90) &&   // Letras mayúsculas
      !(charCode >= 97 && charCode <= 122) &&  // Letras minúsculas
      !(charCode >= 48 && charCode <= 57)   &&
       (charCode  !== 32 )   // Números
    ) {
      event.preventDefault();
    }
  }

  public checkboxChange(event:any){
    console.log("Evento: ", event);
    if (!this.materia.dias_json) {
      this.materia.dias_json = [];
    }
    if(event.checked){
      this.materia.dias_json.push(event.source.value)
    }else{
      console.log(event.source.value);
      this.materia.dias_json.forEach((materia, i) => {
        if(materia == event.source.value){
          this.materia.dias_json.splice(i,1)
        }
      });
    }
    console.log("Array dias: ", this.materia.dias_json);
  }
  /*public revisarSeleccion(nombre: string){
    if(this.materia.materias_json){
      var busqueda = this.materia.materias_json.find((element)=>element==nombre);
      if(busqueda != undefined){
        return true;
      }else{
        return false;
      }
    }else{
      return false;
    }
  }*/

  public revisarSeleccion(dia: string){
    return this.materia.dias_json?.includes(dia) ?? false;
  }



  public registrar(){

    this.materia.hora_inicio = this.convertirHora12a24(this.materia.hora_inicio);
    this.materia.hora_final = this.convertirHora12a24(this.materia.hora_final);
    this.materia.dias_json = JSON.stringify(this.materia.dias_json);
    this.materia.creditos = Number(this.materia.creditos);
    console.log("Materia que se enviará:", this.materia);

     this.errors = {};
     this.errors = this.materiasService.validarMateria(this.materia, this.editar);
     if(Object.keys(this.errors).length > 0){
       return false;
     }

     //Si pasa todas las validaciones, se registra el administrador
     this.materiasService.registrarMateria(this.materia).subscribe({
       next: (response:any) => {
         //Aquí va la ejecución del servicio si todo es correcto
         alert('Materia registrada con éxito');
         console.log("Materia registrada",response);

         //Validar si se registro que entonces navegue a la lista de maestros
         if(this.token != ""){
           this.router.navigate(['materias']);
         }else{
           this.router.navigate(['/']);
         }
       },
       error: (error:any) => {
         if(error.status === 422){
           this.errors = error.error.errors;
         } else {
           alert('Error al registrar la materia');
         }
       }
     });
   }
   public actualizar() {

    // Convertir horas y dias antes de enviarlos
    this.materia.hora_inicio = this.convertirHora12a24(this.materia.hora_inicio);
    this.materia.hora_final = this.convertirHora12a24(this.materia.hora_final);
    this.materia.dias_json = JSON.stringify(this.materia.dias_json);
    this.materia.creditos = Number(this.materia.creditos);

    const id  = Number(this.activatedRoute.snapshot.params['id']);

    this.materiasService.actualizarMaterias(id, this.materia).subscribe({
      next: () => {
        alert("Materia actualizada con éxito");
        this.router.navigate(['/lista-materias']);
      },
      error: (error) => {
        console.log(error);
        alert("Error al actualizar la materia");
      }
    });
  }
  public regresar(){
    this.location.back();
  }
  changeHoraInicio(hora){

    this.materia.hora_inicio = hora;
  }
  changeHoraFinal(hora){
   // this.evento.hora_final = hora;
    this.materia.hora_final = hora;
  }

  public convertirHora12a24(hora12: string): string{
    if (!hora12) return '';
    const [time, modifier] = hora12.split(' ');
    if (!time || !modifier)  return hora12;
    let [hours, minutes] = time.split(':').map(Number);

    if (modifier.toUpperCase() === 'PM' && hours <12 ){
      hours+= 12;
    }
    if (modifier.toUpperCase() === 'AM' && hours === 12 ){
      hours = 0;
    }
    const horasStr = hours.toString().padStart(2, '0');
    const minutosStr = minutes.toString().padStart(2, '0');

    return `${horasStr}:${minutosStr}`;

  }

  public contertirHora24a12(hora24: string): string{
    if (!hora24) return '';
    let [hours, minutes] = hora24.split(':').map(Number);
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const horasStr = hours.toString().padStart(2, '0');
    const minutosStr = minutes.toString().padStart(2,'0');
    return `${horasStr}:${minutosStr} ${ampm}`;

  }
  obtenerMaestros() {
    this.maestrosService.obtenerListaMaestros().subscribe({
      next: (resp) => {
        this.listaMaestros = resp.data || resp;
        console.log("Maestros cargados:", this.listaMaestros);
      },
      error: (err) => {
        console.log("Error cargando maestros", err);
      }
    });
  }

  public obtenerMateriaPorID(id: number) {
    this.materiasService.obtenerMateriaPorID(id).subscribe({
      next: (resp: any) => {

        console.log("Materia obtenida:", resp);

        this.materia = resp;

        // Convertir días si vienen como JSON string
        try {
          this.materia.dias_json = JSON.parse(resp.dias_json);
        } catch {
          this.materia.dias_json = resp.dias_json || [];
        }

        // Convertir horas a formato 12 hrs (si deseas mostrar así en el input)
        this.materia.hora_inicio = this.contertirHora24a12(resp.hora_inicio);
        this.materia.hora_final = this.contertirHora24a12(resp.hora_final);
      },
      error: (error) => {
        console.log("Error:", error);
        alert("No se pudo obtener la materia");
      }
    });
  }


}
