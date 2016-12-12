import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { ViewTrip } from '../viewTrip/viewTrip';

@Component({
  selector: 'page-myTrips',
  templateUrl: 'myTrips.html'
})
export class MyTrips {

  constructor(public navCtrl: NavController) {}

  goToTrip(){
    this.navCtrl.push(ViewTrip)
  }

}
