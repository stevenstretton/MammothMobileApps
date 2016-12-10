import { Component } from '@angular/core';

import { NavController, ActionSheetController, Platform } from 'ionic-angular';

@Component({
  selector: 'page-account',
  templateUrl: 'account.html'
})
export class Account {

  constructor(
    public navCtrl: NavController, 
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform
    ) {}

    presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit Profile Picture',
      buttons: [
        {
          text: 'Remove Profile Picture',
          icon: !this.platform.is('ios') ? 'trash' : null,
          role: 'destructive',
          handler: () => {
            console.log('Destructive clicked');
          }
        },{
          text: 'Take Photo',
          icon: !this.platform.is('ios') ? 'camera' : null,
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Choose From Library',
          icon: !this.platform.is('ios') ? 'folder-open' : null,
          handler: () => {
            console.log('Archive clicked');
          }
        },{
          text: 'Cancel',
          icon: !this.platform.is('ios') ? 'close' : null,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

}
