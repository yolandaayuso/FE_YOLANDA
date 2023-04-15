import { Component } from '@angular/core';
declare let Stripe: any;

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.css']
})
export class PaymentComponent {
  stripe = Stripe('pk_test_51MqBSKH7OM2285cjwfHb0Vw5mrIDQDS9F0SjZaPdp0DEUznmHxJtL17uT9bfjW75rSHu2bK9kFip2JpFANk7p4UQ00OrH3vfiH');

  constructor() { }

}
