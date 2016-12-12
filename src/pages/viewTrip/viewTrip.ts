import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { Map } from '../map/map';

@Component({
  selector: 'page-viewTrip',
  templateUrl: 'viewTrip.html'
})
export class ViewTrip {

  constructor(public navCtrl: NavController) {

  }
  goToMap(){
    this.navCtrl.push(Map)
  }

}
