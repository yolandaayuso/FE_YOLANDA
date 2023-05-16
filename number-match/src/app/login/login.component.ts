import { Component , OnInit , Output, EventEmitter, HostListener} from '@angular/core';
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
  interfaceBlocked: boolean = false;
  checkingBlock: boolean = false;
  recuperarPwd : boolean = false
  constructor(private AccountService : AccountService) { }

  ngOnInit() {
    // Controlar recarga de página
    window.addEventListener('beforeunload', (event) => {
      if (this.interfaceBlocked) {
        event.preventDefault();
        event.returnValue = 'Demasiados intentos de inicio de sesión incorrectos. Por favor, espere un minuto hasta que pueda volver a iniciar sesión.';
      }
    });

    // Obtener el estado almacenado en el localStorage
    const storedInterfaceBlocked = localStorage.getItem('interfaceBlocked');
    if (storedInterfaceBlocked) {
      this.interfaceBlocked = JSON.parse(storedInterfaceBlocked);
      if (this.interfaceBlocked) {
        this.blockInterfaceForOneMinute();
      }
    }
  }


  recuperarcontrasena() {
    this.recuperarPwd=true

    let info = {
      name : this.name,
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

      this.AccountService.recuperarcontraseña(info).subscribe(
        respuesta => {
          Swal.fire({
            title: 'Éxito',
            text: 'La contraseña se ha cambiado correctamente',
            icon: 'success',
            confirmButtonText: 'Aceptar'
          });
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




  disablePaste(event: ClipboardEvent) {
    event.preventDefault();
  }



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

  toLogin(){
    this.loginVar=true
    this.recuperarPwd=false
  }
  toPWD(){
    this.loginVar=false
    this.recuperarPwd=true
  }

  login() {
    let info = {
      name : this.name,
      email : this.email,
      pwd : this.pwd1,
    }
    console.log(info)

    if (this.name == null || this.pwd1 == null ){
      Swal.fire({
        title: 'Error',
        text: 'Por favor, rellene todos los campos',
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
    } else {
      this.AccountService.login(info).subscribe(
        respuesta => {
          sessionStorage.setItem("player", this.name)
          sessionStorage.setItem("session_id", respuesta.sessionId)
          this.mostrarComponente = false
        },
        error => {
          console.log(error.error.message);
          if (error.error.message === "Demasiados intentos de inicio de sesión fallidos. Por favor, espere antes de intentarlo de nuevo.") {
            console.log("ha entrado")
            this.blockInterfaceForOneMinute();
          } else {
            Swal.fire({
              title: 'Error',
              text: error.error.message,
              icon: 'error',
              confirmButtonText: 'Aceptar'
            });
          }
        }
      );
    }
  }

  blockInterfaceForOneMinute() {
    console.log("bloqueando interfaz");
    this.interfaceBlocked = true;
    this.mostrarComponente = true;

    // Guardar el estado en el localStorage
    localStorage.setItem('interfaceBlocked', JSON.stringify(this.interfaceBlocked));

    setTimeout(() => {
      // Habilitar la interfaz después de un minuto
      this.interfaceBlocked = false;
      this.mostrarComponente = true;

      // Eliminar el estado guardado en el localStorage
      localStorage.setItem('interfaceBlocked', JSON.stringify(this.interfaceBlocked));
    }, 60000); // 
  }

}
