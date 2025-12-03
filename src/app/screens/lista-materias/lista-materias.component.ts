//import { Component } from '@angular/core';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { FacadeService } from 'src/app/services/facade.service';
import { MateriasService } from 'src/app/services/materias.service';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { EliminarUserModalComponent } from 'src/app/modals/eliminar-user-modal/eliminar-user-modal.component';
import { EliminarMateriasModalComponent } from 'src/app/modals/eliminar-materias-modal/eliminar-materias-modal.component';
//import { EliminarMateriasModalComponent } from 'src/app/modals/eliminar-materia-modal/eliminar-materias-modal.component';

@Component({
  selector: 'app-lista-materias',
  templateUrl: './lista-materias.component.html',
  styleUrls: ['./lista-materias.component.scss']
})
export class ListaMateriasComponent {

  diasSemana: string[] = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  public name_user: string = "";
  public rol: string = "";
  public token: string = "";
  public lista_materias: any[] = [];

  displayedColumns: string[] = ['nrc', 'nombre', 'section', 'dias_json', 'hora_inicio', 'hora_final', 'salon', 'programa', 'maestro', 'editar', 'eliminar'];
  dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);

  @ViewChild(MatPaginator) paginator: MatPaginator;

  private _sort: MatSort;
  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this._sort = ms;
    this.dataSource.sort = this._sort;
  }

  constructor(
    public facadeService: FacadeService,
    public materiasService: MateriasService,
    private router: Router,
    public dialog: MatDialog,
  ) {}




  ngOnInit(): void {
    this.name_user = this.facadeService.getUserCompleteName();
    this.rol = this.facadeService.getUserGroup();
    this.token = this.facadeService.getSessionToken();

    if (this.token === "") {
      this.router.navigate(["/"]);
    }

    this.obtenerMaterias();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  public obtenerMaterias() {
    this.materiasService.obtenerListaMaterias().subscribe(
      (response) => {
        this.lista_materias = response;

        if (this.lista_materias.length > 0) {
          this.dataSource = new MatTableDataSource<DatosMateria>(this.lista_materias as DatosMateria[]);
          this.dataSource.sort = this._sort;
          this.dataSource.paginator = this.paginator;
        }

      }, (error) => {
        console.error("Error al obtener la lista de materias: ", error);
        alert("No se pudo obtener la lista de materias");
      }
    );
  }

  public goEditar(idMateria: Number){
    if (this.isAdmin()) {
      this.router.navigate(['/materias/editar', idMateria]);
    } else {
      alert("Solo los administradores pueden editar materias.");
    }

  }
 // public delete(idMateria : Number){}
 public delete(idMateria: number) {

  if (this.isAdmin() ) {
    //Si es administrador o es maestro, es decir, cumple la condición, se puede eliminar
    const dialogRef = this.dialog.open(EliminarMateriasModalComponent,{
      data: {id: idMateria, rol:this.rol}, //Se pasan valores a través del componente
      height: '288px',
      width: '328px',
    });

  dialogRef.afterClosed().subscribe(result => {
    if(result.isDelete){
      console.log("Materia eliminada");
      alert("Materia eliminada correctamente.");
      //Recargar página
      window.location.reload();
    }else{
      alert("Materia no se ha podido eliminar.");
      console.log("No se eliminó la materia");
    }
  });
  }


}

public isAdmin(): boolean {
  return this.rol === 'administrador';
}
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  getDiasNombres(diasJson: string): string {
    try {
      const dias: number[] = JSON.parse(diasJson); // Convertimos el string JSON a array de números
      return dias.map(d => this.diasSemana[d - 1]).join(', ');
    } catch (e) {
      return ''; // En caso de que dias_json no sea válido
    }
  }


}

export interface DatosMateria {
  id: number;
  nrc: string;
  nombre: string;
  section: string;
  dias_json: string;
  hora_inicio: string;
  hora_final: string;
  salon: string;
  programa: string;
  creditos: number;
  maestro: string;
}
