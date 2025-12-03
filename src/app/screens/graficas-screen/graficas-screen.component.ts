import { Component, OnInit } from '@angular/core';
import DatalabelsPlugin from 'chartjs-plugin-datalabels';
import { AdministradoresService } from 'src/app/services/administradores.service';
import { ChartData, ChartType } from 'chart.js';

@Component({
  selector: 'app-graficas-screen',
  templateUrl: './graficas-screen.component.html',
  styleUrls: ['./graficas-screen.component.scss']
})
export class GraficasScreenComponent implements OnInit{

  //Agregar chartjs-plugin-datalabels
  //Variables
  public total_user: { admins: number; maestros: number; alumnos: number } = { admins: 0, maestros: 0, alumnos: 0 };


  //Histograma
  lineChartData: ChartData<'line'> = {
    labels: ["Administradore", "Alumnos", "Maestros"],
    datasets: [
      {
        data:[],
        label: 'Usuarios',
        backgroundColor: '#F88406'
      }
    ]
  }
  lineChartOption = {
    responsive:false
  }
  lineChartPlugins = [ DatalabelsPlugin ];

  //Barras
  barChartData: ChartData<'bar'> = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[],
        label: 'Usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#82D3FB',
          '#FB82F5',

        ]
      }
    ]
  }
  barChartOption = {
    responsive:false
  }
  barChartPlugins = [ DatalabelsPlugin ];

  //Circular
  public pieChartData: ChartData<'pie'> = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[] ,
        label: 'Registro de usuarios',
        backgroundColor: [
          '#FCFF44',
          '#F1C8F2',
          '#31E731'
        ]
      }
    ]
  }
  pieChartOption = {
    responsive:false
  }
  pieChartPlugins = [ DatalabelsPlugin ];

  //Dona - Doughnut
  public doughnutChartData: ChartData<'doughnut'> = {
    labels: ["Administradores", "Maestros", "Alumnos"],
    datasets: [
      {
        data:[]  ,
        label: 'Registro de usuarios',
        backgroundColor: [
          '#F88406',
          '#FCFF44',
          '#31E7E7'
        ]
      }
    ]
  }
  doughnutChartOption = {
    responsive:false
  }
  doughnutChartPlugins = [ DatalabelsPlugin ];

  constructor(
    private administradoresServices: AdministradoresService
  ) { }

  ngOnInit(): void {
    this.obtenerTotalUsers();
  }

  // Función para obtener el total de usuarios registrados



    public obtenerTotalUsers() {
      this.administradoresServices.getTotalUsuarios().subscribe(
        (response) => {
          this.total_user = response;

          // Actualizar pie
          this.pieChartData = {
            ...this.pieChartData,
            datasets: [
              {
                ...this.pieChartData.datasets[0],
                data: [
                  this.total_user.admins,
                  this.total_user.maestros,
                  this.total_user.alumnos
                ]
              }
            ]
          };

          this.lineChartData = {
            ...this.lineChartData,
            datasets: [
              {
                ...this.lineChartData.datasets[0],
                data: [
                  this.total_user.admins,
                  this.total_user.maestros,
                  this.total_user.alumnos
                ]
              }
            ]
          };

          this.barChartData = {
            ...this.barChartData,
            datasets: [
              {
                ...this.barChartData.datasets[0],
                data: [
                  this.total_user.admins,
                  this.total_user.maestros,
                  this.total_user.alumnos
                ]

              }
            ]
          };

          // Actualizar dona
          this.doughnutChartData = {
            ...this.doughnutChartData,
            datasets: [
              {
                ...this.doughnutChartData.datasets[0],
                data: [
                  this.total_user.admins,
                  this.total_user.maestros,
                  this.total_user.alumnos
                ]
              }
            ]
          };
        },
        (error) => {
          console.error("Error", error);
        }
      );
    }
}