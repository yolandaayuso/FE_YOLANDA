import { Component, OnInit } from '@angular/core';
import { AccountService } from '../account.service';
import { MatMenuModule } from '@angular/material/menu';
import { trigger, style, animate, transition ,query,stagger} from '@angular/animations';
import { Router } from '@angular/router';
import { GameService } from '../game.service';
import Swal from 'sweetalert2';
import { PaymentService } from '../payment.service';
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
  mostrarFormulario: boolean = true
  tableroPadre : any
  tableroPadre1 : any
  tableroGratis : any
  id? : string
  contador : number = 0;
  x1 : number = 0
  y1 : number = 0
  token? : string
  celdaSeleccionada: HTMLElement | null = null;
  loadingToast : any

  iniciarJuegoPago: boolean = false

  stripe = Stripe("pk_test_51MqBSKH7OM2285cjwfHb0Vw5mrIDQDS9F0SjZaPdp0DEUznmHxJtL17uT9bfjW75rSHu2bK9kFip2JpFANk7p4UQ00OrH3vfiH")
  ws?:WebSocket
  waitingForOpponent: boolean = true;


  ngOnInit() {
    this.name = sessionStorage.getItem('player') ?? ''; 
  }

  constructor(private GameService : GameService,private accountService: AccountService, private PaymentService: PaymentService) { }

  instruccionesVisible = false;
  showDropdown = false;

  getElementAt(i: number, j: number): HTMLElement | null {
    const table = document.querySelector('.tablero') as HTMLElement;
    if (!table) {
      return null;
    }
    const fila = table.querySelector(`tr:nth-child(${i+1})`) as HTMLElement;
    if (!fila) {
      return null;
    }
    return fila.querySelector(`td:nth-child(${j+1})`) as HTMLElement;
  }

  toggleDropdown() {
    this.showDropdown = !this.showDropdown;
  }

  toggleInstrucciones() {
    this.instruccionesVisible = !this.instruccionesVisible;
  }

  toPrincipal(){
    this.mostrarElemento = true;
    this.iniciarJuegoGratis = false;
    this.iniciarPago = false;
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
    this.iniciarJuegoPago = false
    this.iniciarJuegoGratis = false
    this.iniciarPago = false
  }

  playFree() {
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

  requestPaidGame() {
    /* ESTO SIRVE PARA COMPROBAR QUE UN USUARIO HA PAGADO CUANDO EL DA AL BOTÓN DE JUGAR ONLINE */

    this.accountService.isVipUser().subscribe(
      (data : any) => {
        /* ES CLIENTE VIP Y POR LO TANTO PUEDE JUGAR */
        alert("Puedes jugar")
      },
      (error) =>{
        /* NO ES CLIENTE VIP Y TIENE QUE PAGAR PARA JUGAR (IR AL PAGO) */ 
      }
    )

    /* ESTO SIRVE PARA COMPROBAR QUE UN USUARIO HA PAGADO CUANDO EL DA AL BOTÓN DE JUGAR ONLINE */

    this.mostrarElemento = false
    this.cerrarSesion = false
    this.ws = new WebSocket('ws://localhost:8081/wsGames?httpSessionId=' + sessionStorage.getItem("session_id"));

    this.ws.onopen = () => {
    };

    this.ws.onmessage = (event) => {
      let info = event.data;
      info = JSON.parse(info);
      if (this.waitingForOpponent) {
        this.waitingForOpponent= false
        this.multicreateTable(info);
        if (this.loadingToast) {
          Swal.close();
          this.loadingToast = null;
        }
      }else{
        if(info.winner == null){
          this.updateEnemyBoard(info)
        }else{
          const message = { end: info.id };
          this.ws?.send(JSON.stringify(message))
          Swal.fire({
            title: 'Derrota',
            text: 'Ha ganado tu oponente!!',
            icon: 'error',
            confirmButtonText: 'Aceptar'
          });
        }
      }
    };

    this.GameService.requestPaidGame().subscribe(
      (data: any) => {
        this.id = data.id;
        this.loadingToast = Swal.fire({
          title: 'Esperando Rival...',
          html: '<img src="assets/cargando-loading-041.gif">',
          allowOutsideClick: false,
          allowEscapeKey: false,
          showConfirmButton: false
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  multiOnCellClicked(row: number, col: number) {
    if (this.celdaSeleccionada) {
      this.celdaSeleccionada.classList.remove('seleccionada');
    }
    const nuevaCeldaSeleccionada = this.getElementAt(row,col);
    if (nuevaCeldaSeleccionada) {
      nuevaCeldaSeleccionada.classList.add('seleccionada');
      this.celdaSeleccionada = nuevaCeldaSeleccionada;
    }    
    if (this.contador == 1) {
      this.multiMatchNumbers(sessionStorage.getItem("player"),this.x1,this.y1,row,col)
      this.contador = 0
    }else if(this.contador == 0){
      this.x1 = row
      this.y1 = col
      this.contador++
    }
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
  }

  createTable(data : any){
    const numbers: string[] = data.board.digits
      const board: string[][] = [];
      for (let i = 0; i < 9; i++) {
        board.push(numbers.slice(i * 9, i * 9 + 9));
      }
      this.tableroGratis = board
      this.mostrarElemento = false
  }

  multicreateTable(data : any){
    if(data.boards != null){
      const numbers: string[] = data.boards[0].digits
      const board: string[][] = [];
      const numbers1: string[] = data.boards[1].digits
      const board1: string[][] = [];
      for (let i = 0; i < 9; i++) {
        board.push(numbers.slice(i * 9, i * 9 + 9));
        board1.push(numbers1.slice(i * 9, i * 9 + 9));
      }
      this.tableroPadre = board
      this.tableroPadre1 = board1
      this.mostrarElemento = false
    }
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

  multiAddRows(){
    this.GameService.multiAddRows(this.id).subscribe((data : any) => {
      this.mostrarElemento = true
      this.updateOwnBoard(data)
    },
    error => {
      console.log(error)
    })
  }

  multiMatchNumbers(player:any, x1: number, y1: number, x2: number, y2: number){
    let info = {
      id : this.id,
      player: player.toString(),
      x1 : x1.toString(),
      y1 : y1.toString(),
      x2 : x2.toString(),
      y2 : y2.toString()
    }
    this.GameService.multiMatchNumbers(info).subscribe((data : any) => {
      this.mostrarElemento = true
      this.updateOwnBoard(data)
    },
    error => {
      console.log(error)
    })
  }

  updateEnemyBoard(data : any){
    const numbers: string[] = data.digits
    const board: string[][] = [];
    for (let i = 0; i < 9; i++) {
      board.push(numbers.slice(i * 9, i * 9 + 9));
    }
    this.tableroPadre1 = board
    this.mostrarElemento = false
  }

  updateOwnBoard(data : any){
    const numbers: string[] = data.digits
    const board: string[][] = [];
    for (let i = 0; i < 9; i++) {
      board.push(numbers.slice(i * 9, i * 9 + 9));
    }
    this.tableroPadre = board
    this.mostrarElemento = false
    if(data.end == true){
      Swal.fire({
        title: 'Victoria',
        text: 'Has ganado!!!',
        icon: 'success',
        confirmButtonText: 'Aceptar'
      });
    }
  }

  pay(){
    this.PaymentService.pay(2).subscribe((token) => {
    this.token = token;
    this.showForm();
    }, (error) => {
      Swal.fire({
      title: 'Error',
      text: error.error.message,
      icon: 'error',
      confirmButtonText: 'Aceptar'
      });
    });
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
      Swal.fire({
        title: 'Error',
        text: response.error.message,
        icon: 'error',
        confirmButtonText: 'Aceptar'
      });
      } else {
        if (response.paymentIntent.status === 'succeeded') {
          self.paymentOk();
        }}});
  }

  paymentOk() {
    let self = this
    let payload={
      token: this.token ?? '' // si no existe token, que sea un string vacio
    }
    this.PaymentService.paymentOk(payload.token).subscribe((data : any) => {
    Swal.fire({
      title: 'Tu pago ha sido completado',
      text: '¡Ya puedes retarte en la versión premium!',
      icon: 'success',
      confirmButtonText: 'Aceptar'
    });
    this.iniciarJuegoPago = true
    this.iniciarPago = false

    /* ESTO SE HA DE EJECUTAR CUANDO UN USUARIO PAGA Y SE CONVIERTE EN VIP */
    
    this.accountService.vipUser().subscribe(
      (data:any) => {

      },
      error => {
        
      }
    )

    /* ESTO SE HA DE EJECUTAR CUANDO UN USUARIO PAGA Y SE CONVIERTE EN VIP */


    this.requestPaidGame()

    },
    error => {
      console.log(error)
    });
  }
}





