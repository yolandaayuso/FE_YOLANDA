import { Component , OnInit , Output, EventEmitter} from '@angular/core';
import { AccountService } from '../account.service';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
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

  register(){
    let info = {
      name : this.name,
      email : this.email,
      pwd1 : this.pwd1,
      pwd2 : this.pwd2
    }
    this.AccountService.register(info).subscribe(
      repuesta =>{
        this.changeLogin()
      },
      error => {
        alert("Error al registrarse"+ error)
      }
    )
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
    this.AccountService.login(info).subscribe(
      respuesta => {
        sessionStorage.setItem("player",this.name)

        this.mostrarComponente = false


      },
      error => {
        alert("Usuario o contraseña incorrectos"+ error)
      }
  )
  }
}
