import { Component , OnInit } from '@angular/core';
import { GameService } from '../game.service';

@Component({
  selector: 'app-p-principal',
  templateUrl: './p-principal.component.html',
  styleUrls: ['./p-principal.component.css']
})
export class PPrincipalComponent implements OnInit{
  mostrarElemento: boolean = true
  tableroPadre : any
  id? : string
  contador : number = 0;
  x1 : number = 0
  y1 : number = 0

  ngOnInit(): void { }
  constructor(private GameService : GameService) {  }

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
}
