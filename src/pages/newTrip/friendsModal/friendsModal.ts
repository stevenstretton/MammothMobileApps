import { Component } from '@angular/core';

import { ViewController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-friendsModal',
  templateUrl: 'friendsModal.html'
})
export class FriendsModal {

  constructor(
    public platform: Platform,    
    public viewCtrl: ViewController
  ){}
  
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
