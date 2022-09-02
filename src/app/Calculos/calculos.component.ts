import { Component, OnInit } from '@angular/core';
import Swal from 'sweetalert2';
import { AuthenticationService } from '../services/authentication.service';
import { EstacionService } from '../services/estacion.service';
import { Calculo } from '../shared/models/calculo.interface';
import { UsersService } from '../shared/user.service';

@Component({
  selector: 'app-calculos',
  templateUrl: './calculos.component.html',
  styleUrls: ['./calculos.component.scss']
})
export class CalculosComponent implements OnInit {

  constructor(private service:UsersService, private estacionService: EstacionService,public auth: AuthenticationService,) { }
  data:any;
  calculo:any;
  valor:any;
  user: any;
  userDetails: any;
  fechaIn:string="";
  fechaFi:string="";
  today:string="";
  todayF:string="";
  ngOnInit(): void {
    this.today = new Date().toISOString().split('T')[0];
    this.todayF = new Date().toISOString().split('T')[0];

    this.getAuthUsuario()

    if (this.user.rol == 2) {
      this.getEstacion(this.user.Id);
    }

    if (this.user.rol == 1) {
      this.ObtenerEstaciones();
    }


    const user = {
      id: this.user.Id,
    };

    this.service.getUsuario(this.user.Id).subscribe(
      (res) => {

        this.userDetails = res;
      },
      (err) => {
        console.log(err);
      }
    );

  }

  ObtenerEstaciones() {
    this.estacionService.getAll().subscribe(
      (data) => {
        this.data = data;

        console.log(data);
      },
      (error) => {
        console.log(error);
      }
    );
  }
 
  horasFrio(){

    console.log(this.valor)
    console.log(this.today)
    console.log(this.todayF)
    var html="<b style=font-size:26px>Total de horas de frío</b></br>";
    this.estacionService.getHorasFrio(1,this.today,this.todayF)
        .subscribe(data=>{
         this.calculo=data.valor;
         if(this.calculo!=null){
          Swal.fire({
            title: '',
            html: html+this.calculo,
            imageUrl:"../assets/img/icons/colds.png",
            confirmButtonColor: '#083E5E',
            confirmButtonText: 'Aceptar'
          })
         }
        },
        error=>{
          Swal.fire("hola");
        });
  }
  radiacionSolar(){

    console.log(this.valor)
    console.log(this.today)
    console.log(this.todayF)
    var html="<b style=font-size:26px>Total de horas de Radiación Solar</b></br>";
    this.estacionService.getRadiacionSolar(1,this.today,this.todayF)
        .subscribe(data=>{
         this.calculo=data.valor;
         if(this.calculo!=null){
          Swal.fire({
            title: '',
            html: html+this.calculo,
            imageWidth:"100px",
            imageUrl:"../assets/img/icons/sol.png",
            confirmButtonColor: '#083E5E',
            confirmButtonText: 'Aceptar'
          })
         }
        },
        error=>{
          Swal.fire("hola");
        });
  }

  getAuthUsuario() {
    this.user = this.auth.getUsuarioPerfil();
    console.log(this.user);
  }

  getEstacion(id: number) {
    this.service.getUsuario(id)
      .subscribe(
        data => {
          this.data = data.empresa.estacion;
          this.valor=data.empresa.estacion[0].id;
       
        },
        error => {
          console.log(error);
        });
  }
  changes(event:any){
    this.valor=event.target['value'];
  }

}
