import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { MatMenuModule } from '@angular/material/menu';
import { trigger, style, animate, transition ,query,stagger} from '@angular/animations';
import { Router } from '@angular/router';
import { GameService } from '../game.service';

declare let Stripe: any;

@Component({
  selector: 'app-inicio-juego',
  templateUrl: './inicio-juego.component.html',
  styleUrls: ['./inicio-juego.component.css'],
  animations: [
    trigger('letterAnimation', [
      transition(':enter', [
        query('span', [
          style({ opacity: 0, transform: 'translateY(-10px)' }),
          stagger(50, [
            animate('500ms ease-out', style({ opacity: 1, transform: 'none' }))
          ])
        ])
      ])
    ])
  ]
})
export class InicioJuegoComponent implements OnInit{

  mostrarElemento: boolean = true
  iniciarJuego: boolean = true
  cerrarSesion: boolean = false;
  name!: string;
  mostrarMenu: boolean = true
  iniciarPago: boolean = false
  iniciarJuegoGratis: boolean = false

  tableroPadre : any
  id? : string
  contador : number = 0;
  x1 : number = 0
  y1 : number = 0

  token?: string


  stripe = Stripe("pk_test_51MqBSKH7OM2285cjwfHb0Vw5mrIDQDS9F0SjZaPdp0DEUznmHxJtL17uT9bfjW75rSHu2bK9kFip2JpFANk7p4UQ00OrH3vfiH")




  ngOnInit() {
    this.name = sessionStorage.getItem('player') ?? ''; // asigna un string vacío si getItem devuelve null


  }

  constructor(private GameService : GameService,private accountService: AccountService) { }

  instruccionesVisible = false;


  showDropdown = false;

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }


  toggleInstrucciones() {
    this.instruccionesVisible = !this.instruccionesVisible;
  }



  showButton() {
    const selectBox = document.querySelector('.login-button') as HTMLSelectElement;
    const selectedValue = selectBox.value;
    const logoutButton = document.querySelector('#logout-button') as HTMLButtonElement;

    if (selectedValue === 'logout') {
      logoutButton.style.display = 'block';
    } else {
      logoutButton.style.display = 'none';
    }
  }


  logout() {
    this.mostrarElemento = false
    this.cerrarSesion = true


  }

  playFree() {
    // código para iniciar la versión gratuita del juego
    this.iniciarJuegoGratis = true
    this.mostrarElemento = false
    this.cerrarSesion = false
    this.requestGame()
  }

  playPaid() {
  this.iniciarPago = true
  this.mostrarElemento = false
  this.cerrarSesion = false
  this.pay()


  }



  onCellClicked(row: number, col: number) {

    if (this.contador == 1) {
      this.matchNumbers(this.x1,this.y1,row,col)
      this.contador = 0
    }else if(this.contador == 0){
      this.x1 = row
      this.y1 = col
      this.contador++
    }
    console.log('Se ha hecho clic en la celda ['+row+'] ['+col+']')
  }

  createTable(data : any){
    const numbers: string[] = data.board.digits
      const board: string[][] = [];
      for (let i = 0; i < 9; i++) {
        board.push(numbers.slice(i * 9, i * 9 + 9));
      }
      this.tableroPadre = board
      this.mostrarElemento = false
  }

  requestGame(){
    this.GameService.requestGame().subscribe((data : any) => {
      this.id = data.id
      this.createTable(data)
      },
      error => {
        console.log(error)
      }
    )
  }

  addRows(){
    this.GameService.addRows(this.id).subscribe((data : any) => {
      this.mostrarElemento = true
      this.createTable(data)
    },
    error => {
      console.log(error)
    })
  }

  matchNumbers(x1: number, y1: number, x2: number, y2: number){
    let info = {
      id : this.id, x1 :
      x1.toString(), y1 :
      y1.toString(), x2 :
      x2.toString(), y2 :
      y2.toString()
    }
    this.GameService.matchNumbers(info).subscribe((data : any) => {
      this.mostrarElemento = true
      this.createTable(data)
    },
    error => {
      console.log(error)
    })
  }








  pay(){
    let self = this
    let req = new XMLHttpRequest()
    req.open("GET", "http://localhost:8081/payments/prepay?amount=100", true)
    req.onreadystatechange = function (response) {
      if (req.readyState == 4) {
        if (req.status == 200) {
          self.token = req.responseText
          self.showForm()
        }
        else {
          alert(req.statusText)
        }
      }
    }
    req.send()
    }

    showForm(){
      let elements = this.stripe.elements() //le dira a stripe que hay un objeto en ese elemento que se ha bajado
      let style = {
      base: {
    color: "#32325d", fontFamily: 'Arial, sans-serif',
    fontSmoothing: "antialiased", fontSize: "16px",
    "::placeholder": {
    color: "#32325d"
    }
        },invalid: {
      fontFamily: 'Arial, sans-serif', color: "#fa755a",
      iconColor: "#fa755a"
      }
      }
      let card = elements.create("card", { style : style }) //CREARA UN ELEMTNO LLAMADO CAR ELEMTN OTRO PAYment form
      card.mount("#card-element")
      card.on("change", function(event : any) {
      document.querySelector("button")!.disabled = event.empty;
      document.querySelector("#card-error")!.textContent =
      event.error ? event.error.message : "";
      });
      let self = this
      let form = document.getElementById("payment-form"); form!.addEventListener("submit", function(event) {
      event.preventDefault();
      self.payWithCard(card);
      });
      form!.style.display = "block"
    }


      payWithCard(card: any) {
        let self = this
        this.stripe.confirmCardPayment(this.token, {
          payment_method: {
            card: card
          }
        }).then(function (response: any) {
          if (response.error) {
            alert(response.error.message);
          } else {
            if (response.paymentIntent.status === 'succeeded') {
              alert("Pago exitoso");
              self.paymentOk();


            }
          }
        });
      }
      paymentOk() {
        let self = this
        let payload={
          token: this.token
        }
        let req = new XMLHttpRequest()
        req.open("POST", "http://localhost:8081/payments/paymentOK")//SI FUERA UN GET LLEVARIA EL TOKEN AQUI, COMO ES UN POST, LO LLLEVA EN EL PAYLOAD
        req.setRequestHeader("Content-Type", "application/json")
        req.onreadystatechange=function(response){//cuando cambies el state, ejecuta esta funcion, con el response que te devuelve el servidor, el token
          if(req.readyState==4  ){ //si el state es 4 , es que la peticion ha ido bien
            if(req.status==200){ //si el status es 200, es que la peticion ha ido bien
              alert("tu pago ha sido completado") // en el paymentController tendremos un metodo en el que el recurso sea paymentOK, y que devuelva un OK
          }else{
            alert(req.statusText)
          }
          }
        }
        req.send(JSON.stringify(payload))

      }

}






















