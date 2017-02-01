import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
//import { FirebaseGET } from '../../services/firebase/get.service';
//import { FirebasePUT } from "../../services/firebase/put.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";


@Component({
  selector: 'page-notifications',
  templateUrl: 'notifications.html'
})
export class Notifications {
  private _notifications: Array<any>;
  private _currentUser: any;  
  
  constructor(public navCtrl: NavController,
//				public firebaseGet: FirebaseGET,
//                public firebasePut: FirebasePUT,
				public authenticationHandler: AuthenticationHandler,
				public modalCtrl: ModalController
				) {
        this._notifications = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();
        console.log(this._currentUser);

		this._currentUser.notifications.forEach((notificationMessage) => {
    
				this._notifications.push(notificationMessage);
    console.log(this._notifications)
		});

  }

}

