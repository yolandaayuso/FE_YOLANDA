import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
/*import { WebSocketSubject } from 'rxjs/webSocket';*/

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  socket : any


  constructor(private httpClient : HttpClient) { }

  register(info: any) : Observable<any>{
    return this.httpClient.post("http://localhost:8081/users/register",info)
  }

  login(info: any) : Observable<any>{
    /*this.socket = new WebSocketSubject('ws://localhost:8081/wsGames').subscribe()*/
    return this.httpClient.put<any>("http://localhost:8081/users/login",info)
  }
}
