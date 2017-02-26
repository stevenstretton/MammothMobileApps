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
	private num: any;

	constructor(public navCtrl: NavController,
		public authenticationHandler: AuthenticationHandler,
		private firebasePut: FirebasePUT,
	) {

		this._notifications = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.getNotifications();
		console.log(this._currentUser.notifications);
		this.num = 1;
	}

	getNotifications() {

		if (this._currentUser.notifications != null) {
			this._notifications = [];
			console.log(this._currentUser);

			this._notifications = this._currentUser.notifications
		}
	}

	//for testing
	addNotification(): void {
		var temp = this._notifications;
		this._notifications = temp;
		this._notifications.push("test Note" + this.num);
		this.firebasePut.putNewNotification(this._currentUser.key, this._notifications);
		this.num ++;
	}

	dismissNotification(index, slidingItem: ItemSliding): void {
		slidingItem.close()
		console.log(index)
		var temp = this._notifications;
		temp.splice(index, 1);
			
		this.firebasePut.putNewNotification(this._currentUser.key, temp);
		this._notifications = temp;
		console.log(this._notifications)

	}

	dismissNotifications(): void {
		
		this.firebasePut.putNewNotification(this._currentUser.key, []);
		this._notifications = []
		this._currentUser.notifications = []
	
	}

	speakNotifications() {
		var notes: string = "";
		this._notifications.forEach(note => {
			notes += "Notification: " + note + ", " 
		});
		if (notes == "")
		{
			notes = "No Notifications"
		}
		else {
			notes += "End of notifications"
		}

		TextToSpeech.speak({text: notes ,
            locale: 'en-GB',
            rate: 1.4})
			.then(() => console.log('Success'))
			.catch((reason: any) => console.log(reason));
	}
}
