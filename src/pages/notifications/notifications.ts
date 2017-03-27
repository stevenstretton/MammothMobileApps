import { Component } from '@angular/core';
import { NavController, ItemSliding } from 'ionic-angular';
import { TextToSpeech } from 'ionic-native';
import { FirebasePUT } from "../../services/firebase/put.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-notifications',
	templateUrl: 'notifications.html'
})
export class Notifications {
	private _notifications: Array<any>;
	private _currentUser: any;
	private _num: any;

	constructor(public navCtrl: NavController,
		public authenticationHandler: AuthenticationHandler,
		private firebasePut: FirebasePUT,
	) {


		this._notifications = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._num = 1;
	}

	ionViewWillEnter() {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.getNotifications();
	}

   refreshNotifications(refresher): void {
			this.getNotifications();

			// Timeout otherwise refresher is too short
			setTimeout(() => {
				refresher.complete();
			}, 2000);

	}

	getNotifications() {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		if (this._currentUser.notifications != null) {
			this._notifications = [];
			console.log(this._currentUser);

			this._notifications = this._currentUser.notifications
		}
	}

	//for testing
	addNotification(): void {
		this._currentUser.notifications.push("test Note" + this._num);
		this.firebasePut.putNewNotification(this._currentUser.key, this._currentUser.notifications);
		this._num++;
	}

	dismissNotification(index, slidingItem: ItemSliding): void {
		slidingItem.close();

		this._currentUser.notifications.splice(index, 1);
		this.firebasePut.putNewNotification(this._currentUser.key, this._currentUser.notifications);
	}

	dismissNotifications(): void {
		this.firebasePut.putNewNotification(this._currentUser.key, []);
		this._currentUser.notifications = [];
	}

	speakNotifications(): void {
		let notes: string = "";

		this._currentUser.notifications.forEach((note) => {
			notes += "Notification: " + note + ", "
		});

		if (notes == "") {
			notes = "No Notifications"
		}
		else {
			notes += "End of notifications"
		}

		TextToSpeech.speak({
			text: notes,
			locale: 'en-GB',
			rate: 1.4
		})
			.then(() => console.log('Success'))
			.catch((reason: any) => console.log(reason));
	}

	stopSpeak(): void {
		TextToSpeech.speak("")
			.then(() => console.log('Stopped'))
			.catch((reason: any) => console.log(reason));
	}
}

