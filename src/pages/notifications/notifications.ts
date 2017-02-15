import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { AngularFire } from 'angularfire2';
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePUT } from "../../services/firebase/put.service";
// import { FirebasePOST } from '../../services/firebase/post.service';
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
			private af: AngularFire,
			// private firebasePost: FirebasePOST,
			private firebasePut: FirebasePUT,
			private firebaseGet: FirebaseGET
			){

      this._notifications = [];

			this._currentUser = this.authenticationHandler.getCurrentUser();

			// if (this._currentUser.notifications != null)
			// {
			// 	this._currentUser.notifications.forEach((notificationMessage) => {
			// 			this._notifications.push(notificationMessage);
			// 	});
			// }

			this.getNotifications();

			console.log(this._currentUser.notifications);

		}

		getNotifications(){

			if (this._currentUser.notifications != null)
			{
				this._notifications = [];
				console.log(this._currentUser);
				
				this._notifications = this._currentUser.notifications


			}
		}

		addNotification(): void {
			this._notifications.push("test Note");
			this.firebasePut.putNewNotification(this._currentUser.key, this._notifications);
			this.getNotifications();
			// console.log(this._currentUser.key);
			
		}
    
    	dismissNotification(notification): void {      
			console.log(notification);
//			const notificationObjectObservable = this.af.database.object("users/" + this._currentUser.key + "/notifications").remove();

//			notificationObjectObservable
//				.then(_ => {
//					console.log("Success!")
//					this._notifications = []
//					this._currentUser.notifications = []
//
//				})
//				.catch(err => console.log(err));

			

		}	
    
        dismissNotifications(): void {      
//			console.log(notification);
			const notificationObjectObservable = this.af.database.object("users/" + this._currentUser.key + "/notifications").remove();

			notificationObjectObservable
				.then(_ => {
					console.log("Success!")
					this._notifications = []
					this._currentUser.notifications = []

				})
				.catch(err => console.log(err));

			

		}	

}

