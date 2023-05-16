import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

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
    return this.httpClient.put<any>("http://localhost:8081/users/login",info)
  }

  vipUser() : Observable<any>{
    return this.httpClient.get<any>("http://localhost:8081/users/vipuser?userName="+sessionStorage.getItem("player"))
  }

  isVipUser() : Observable<any>{
    return this.httpClient.get<any>("http://localhost:8081/users/isvipuser?userName="+sessionStorage.getItem("player"))
  }

  recuperarcontraseña(info: any) : Observable<any>{
    return this.httpClient.post<any>("http://localhost:8081/users/recuperarcontraseña",info)

  }

}
