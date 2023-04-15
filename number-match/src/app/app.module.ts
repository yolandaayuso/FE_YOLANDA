import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HttpClientModule } from '@angular/common/http'
import { IonicModule } from '@ionic/angular';
import { PPrincipalComponent } from './p-principal/p-principal.component';
import { InicioJuegoComponent } from './inicio-juego/inicio-juego.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatMenuModule } from '@angular/material/menu';

import { MatButtonModule } from '@angular/material/button';


import { RouterModule, Routes } from '@angular/router';
import { PaymentComponent } from './payment/payment.component';




@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    PPrincipalComponent,
    InicioJuegoComponent,
    PaymentComponent,


  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    IonicModule.forRoot(),
    MatMenuModule,
    MatButtonModule,
    BrowserAnimationsModule,

  ],
  providers: [],
  bootstrap: [AppComponent],

  exports: [RouterModule]
})
export class AppModule { }
