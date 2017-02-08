import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
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
				public authenticationHandler: AuthenticationHandler,
				public modalCtrl: ModalController,
                private af: AngularFire
				) {
        this._notifications = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._currentUser.notifications.forEach((notificationMessage) => {
				this._notifications.push(notificationMessage);
		});

  }
    addNotification(): void {
        this._currentUser = this.authenticationHandler.getCurrentUser();
        const userNotifications = this.af.database.object("users/" + this._currentUser.key + "/notifications");
        userNotifications.update({
			notifications: "New Notification"
		});
//        console.log(this._currentUser.key);
		
	}
    
    	dismissNotification(notification): void {
        this._currentUser = this.authenticationHandler.getCurrentUser();
    console.log(notification);
		const notificationObjectObservable = this.af.database.object("users/" + this._currentUser.key + "/notifications").remove();

		notificationObjectObservable
			.then(_ => console.log("Success!"))
			.catch(err => console.log(err));
	}
    
      	addText(): void {

	}

}

