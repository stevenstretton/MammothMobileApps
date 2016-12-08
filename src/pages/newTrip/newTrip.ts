import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';

@Component({
  selector: 'page-newTrip',
  templateUrl: 'newTrip.html'
})
export class NewTrip {

  constructor(public navCtrl: NavController) {

  }
  public event = {
    month: '2016-01-01',
    timeStarts: '00:00',
    timeEnds: '2016-01-02'
  }

}
