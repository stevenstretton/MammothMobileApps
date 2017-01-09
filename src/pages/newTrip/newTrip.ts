import { Component } from '@angular/core';
import { FirebaseGET } from '../../services/firebaseGET.service';
import { FirebasePUSH } from '../../services/firebasePUSH.service';
import { AuthenticationHandler } from '../../services/authenticationHandler.service';
import { NavController, ActionSheetController, Platform, ModalController} from 'ionic-angular';
import { FriendsModal } from '../newTrip/friendsModal/friendsModal';
import set = Reflect.set;

@Component({
  selector: 'page-newTrip',
  templateUrl: 'newTrip.html',
})
export class NewTrip {
  public _friendsAdded: Array<any>;
  private _currentUser: any;
  private tripInfo: Array<any>;


  constructor(
    public navCtrl: NavController, 
    public actionSheetCtrl: ActionSheetController,
    public platform: Platform,
    public firebaseGet: FirebaseGET,
		public authenticationHandler: AuthenticationHandler,
		public modalCtrl: ModalController,
		public firebasePush: FirebasePUSH
    ) {

    this._friendsAdded = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();

    }

  public event = {
    month: '2017-01-01',
    timeStarts: '00:00',
    timeEnds: '2017-01-02'
  }

  presentModal() {
    let modal = this.modalCtrl.create(FriendsModal, {
    currentUser: this._currentUser});

    modal.onDidDismiss((setOfFriends) => {
			setOfFriends.forEach((friend) => {
				this._friendsAdded.push(friend);
			});
		});
    modal.present();
  }

pushTrip() {
  //this.firebasePush.pushNewTrip(NewTrip);  

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
            console.log('Take Photo clicked');
          }
        },{
          text: 'Choose From Library',
          icon: !this.platform.is('ios') ? 'folder-open' : null,
          handler: () => {
            console.log('Library clicked');
          }
        },{
          text: 'Choose From Presets',
          icon: !this.platform.is('ios') ? 'folder-open' : null,
          handler: () => {
            console.log('Presets clicked');
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