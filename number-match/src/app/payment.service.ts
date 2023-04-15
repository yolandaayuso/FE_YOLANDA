import { Injectable } from '@angular/core';
declare let Stripe: any;
@Injectable({
  providedIn: 'root'
})
export class PaymentComponent {

  stripe = Stripe("pk_test_51MqBSKH7OM2285cjwfHb0Vw5mrIDQDS9F0SjZaPdp0DEUznmHxJtL17uT9bfjW75rSHu2bK9kFip2JpFANk7p4UQ00OrH3vfiH")
  token?: string


constructor() { }

  ngOnInit(): void {
  }





pay(){
let self = this
let req = new XMLHttpRequest()
req.open("GET", "http://localhost/payments/prepay?amount=100", true)
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
          self.paymentOK();


        }
      }
    });
  }
  paymentOK() {
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

  pagar(){

  }
}
