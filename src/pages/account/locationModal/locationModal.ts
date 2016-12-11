import { Component } from '@angular/core';

import { ViewController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-locationModal',
  templateUrl: 'locationModal.html'
})
export class LocationModal {

  constructor(
    public platform: Platform,    
    public viewCtrl: ViewController
  ){}
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
