import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/*import { WebSocketSubject } from 'rxjs/webSocket';*/

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  private paymentUrl = 'http://localhost:8081/payments/paymentOk';

  constructor(private httpClient : HttpClient) { }


  pay(amount: number): Observable<string> {
    return this.httpClient.get(`http://localhost:8081/payments/prepay?amount=${amount}`, {responseType: 'text'});
  }

  paymentOk(token: string): Observable<any> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const payload = { token };
    return this.httpClient.post(this.paymentUrl, payload, { headers });
  }
}

