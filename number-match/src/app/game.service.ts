import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GameService {
  constructor(private httpClient : HttpClient) { }

  requestGame() : Observable<any>{
    return this.httpClient.get("http://localhost:8081/games/requestgame?juego=nm&player="+sessionStorage.getItem("player"))
  }

  matchNumbers(info : any) : Observable<any>{
    return this.httpClient.put("http://localhost:8081/games/matchnumbers",info)
  }

  addRows(id : any) : Observable<any> {
    return this.httpClient.get("http://localhost:8081/games/addrows?id="+id)
  }

  requestPaidGame() : Observable<any>{
    return this.httpClient.get("http://localhost:8081/games/requestpaidgame?juego=nm&player="+sessionStorage.getItem("player"))
  }

  multiMatchNumbers(info : any) : Observable<any>{
    return this.httpClient.put("http://localhost:8081/games/multimatchnumbers",info)
  }

  multiAddRows(id : any) : Observable<any> {
    return this.httpClient.get("http://localhost:8081/games/multiaddrows?id="+id+"&player="+sessionStorage.getItem("player"))
  }

  deleteMatch(idMatch : any) {
    this.httpClient.get("http://localhost:8081/games/removematch?matchId="+idMatch)
  }
}
