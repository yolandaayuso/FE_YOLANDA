import { Component , OnInit , Output, EventEmitter} from '@angular/core';
import { AccountService } from '../account.service';
import Swal from 'sweetalert2';



@Component({
  selector: 'app-login',
  templateUrl: 'login.component.html',
  styleUrls: ['./login.component.css'],
})

export class LoginComponent implements OnInit{
  // Define una propiedad de evento utilizando la anotación @Output()

  name! : string
  email? : string
  pwd1? : string
  pwd2? : string
  loginVar : boolean = true
  mostrarComponente : boolean = true
  isLoggedIn : boolean = false

  constructor(private AccountService : AccountService) { }

  ngOnInit(): void { }

  register() {
    let info = {
      name: this.name,
      email: this.email,
      pwd1: this.pwd1,
      pwd2: this.pwd2
    }


    if (this.name == null || this.email == null || this.pwd1 == null || this.pwd2 == null ){
      Swal.fire({
        title: 'Error',
        text: 'Por favor, rellene todos los campos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }
    else{
    console.log(this.name+" "+this.email+" "+this.pwd1+" "+this.pwd2)
    this.AccountService.register(info).subscribe({
      next: (repuesta: any) => {
        Swal.fire({
          title: 'Advertencia',
          text: 'Se le ha enviado un email de confimación para finalizar la creación de su cuenta. Por favor, aceptelo antes de seguir',
          icon: 'warning',
          confirmButtonText: 'Aceptar'
        });
      },
      error: (error: any) => {
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
    })
  }
  }

  changeLogin() {
    this.loginVar = this.loginVar == false
  }

  login() {
    let info = {
      name : this.name,
      email : this.email,
      pwd : this.pwd1,
    }


    if (this.name == null || this.pwd1 == null ){
      Swal.fire({
        title: 'Error',
        text: 'Por favor, rellene todos los campos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    }else{
    this.AccountService.login(info).subscribe(
      respuesta => {
        sessionStorage.setItem("player",this.name)
        sessionStorage.setItem("session_id",respuesta.sessionId)
        this.mostrarComponente=false


      },
      error => {
        Swal.fire({
          title: 'Error',
          text: error.error.message,
          icon: 'error',
          confirmButtonText: 'Aceptar'
        });
      }
  )
  }
}
}
