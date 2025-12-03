import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { AlumnosService } from 'src/app/services/alumnos.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { MateriasService } from 'src/app/services/materias.service';

@Component({
  selector: 'app-eliminar-user-modal',
  templateUrl: './eliminar-materias-modal.component.html',
  styleUrls: ['./eliminar-materias-modal.component.scss']
})
export class EliminarMateriasModalComponent implements OnInit {

  public rol: string = "";

  constructor(
   // private administradoresService: AdministradoresService,
    //private maestrosService: MaestrosService,
    //private alumnosService: AlumnosService,
    private materiasService: MateriasService,
    private dialogRef: MatDialogRef<EliminarMateriasModalComponent>,
    @Inject (MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.rol = this.data.rol;
  }

  public cerrar_modal(){
    this.dialogRef.close({isDelete:false});
  }

  public eliminarMateria(){
    if(this.rol == "administrador"){
      // Entonces elimina un administrador
      this.materiasService.eliminarMaterias(this.data.id).subscribe(
        (response)=>{
          console.log(response);
          this.dialogRef.close({isDelete:true});
        }, (error)=>{
          this.dialogRef.close({isDelete:false});
        }
      );




    }

  }

}