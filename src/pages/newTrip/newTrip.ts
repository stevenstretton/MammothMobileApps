import { Component } from '@angular/core';

import { NavController, ActionSheetController, Platform} from 'ionic-angular';

@Component({
  selector: 'page-newTrip',
  templateUrl: 'newTrip.html',
})
export class NewTrip {

  constructor(
    public navCtrl: NavController, 
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform
    ) {}

  public event = {
    month: '2016-01-01',
    timeStarts: '00:00',
    timeEnds: '2016-01-02'
  }

  presentActionSheet() {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Edit Trip Picture',
      buttons: [
        {
          text: 'Remove Trip Picture',
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
          text: 'Choose From Presets',
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