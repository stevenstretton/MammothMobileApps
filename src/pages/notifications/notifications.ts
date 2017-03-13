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
				
	            private firebaseGet: FirebaseGET) {

		this._notifications = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();

		this.getNotifications();

		console.log(this._currentUser.notifications);

	}

	getNotifications() {

		if (this._currentUser.notifications) {
			this._notifications = [];
			console.log(this._currentUser);

			this._notifications = this._currentUser.notifications

		}
	}

	addNotification(): void {
		var temp = this._notifications;
		this._notifications = temp;
		this._notifications.push("test Note");
		this.firebasePut.putNewNotification(this._currentUser.key, this._notifications);

		// console.log(this._currentUser.key);

	}

	dismissNotification(index): void {
		console.log(index)
		var temp = this._notifications;
		temp.splice(index, 1);
		this._notifications = temp;

		console.log(this._notifications)

		const notificationObjectObservable = this.af.database.object("users/" + this._currentUser.key + "/notifications").set(temp);
		notificationObjectObservable
			.then(_ => {
				console.log("Success!")

			})
			.catch(err => console.log(err));

	}

	dismissNotifications(): void {
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

