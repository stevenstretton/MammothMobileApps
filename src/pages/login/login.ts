import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class Login {

  constructor(public navCtrl: NavController) {

  }
  public login(){
    this.navCtrl.setRoot(TabsPage)
  }
  goToRegister() {
    //push another page onto the history stack
    //causing the nav controller to animate the new page in
    this.navCtrl.push(Register)
  }

}