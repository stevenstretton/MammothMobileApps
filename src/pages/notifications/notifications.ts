import { Component } from '@angular/core';
import { NavController, ItemSliding, AlertController } from 'ionic-angular';
import { TextToSpeech } from 'ionic-native';
import { FirebasePUT } from "../../services/firebase/put.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-notifications',
	templateUrl: 'notifications.html'
})
export class Notifications {
	private _currentUser: any;
	private _num: any;

	constructor(private navCtrl: NavController,
	            private alertCtrl: AlertController,
	            private authenticationHandler: AuthenticationHandler,
	            private firebasePut: FirebasePUT,) {

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._num = 1;
	}

	public ionViewWillEnter() {
		this._currentUser = this.authenticationHandler.getCurrentUser();
	}

	public refreshNotifications(refresher): void {
		// Timeout otherwise refresher is too short
		setTimeout(() => {
			refresher.complete();
		}, 2000);
	}

	private showErrorAlert(errMessage): void {
		this.alertCtrl.create({
			title: 'Error',
			message: errMessage,
			buttons: ['Dismiss']
		}).present();
	}

	//for testing
	public addNotification(): void {
		this._currentUser.notifications.push("test Note" + this._num);
		this.firebasePut.putNewNotification(this._currentUser.key, this._currentUser.notifications);
		this._num++;
	}

	public dismissNotification(index, slidingItem: ItemSliding): void {
		slidingItem.close();

		this._currentUser.notifications.splice(index, 1);
		const putNotificationsPromise = this.firebasePut.putNewNotification(this._currentUser.key, this._currentUser.notifications);

		putNotificationsPromise
			.then((successRes) => {
				// Returns 'null'
			}).catch((errorRes) => {
			this.showErrorAlert(errorRes);
		});
	}

	public dismissNotifications(): void {
		const putNotificationsPromise = this.firebasePut.putNewNotification(this._currentUser.key, []);

		putNotificationsPromise
			.then((successRes) => {
				this._currentUser.notifications = [];
			}).catch((errorRes) => {
			this.showErrorAlert(errorRes);
		});
	}

	public speakNotifications(): void {
		let notes: string = "";

		this._currentUser.notifications.forEach((note) => {
			notes += "Notification: " + note + ", "
		});

		if (notes == "") {
			notes = "No Notifications"
		} else {
			notes += "End of notifications"
		}

		TextToSpeech
			.speak({
				text: notes,
				locale: 'en-GB',
				rate: 1.4
			})
			.then(() => {
				// Leave
			})
			.catch((errorRes) => {
				this.showErrorAlert(errorRes);
			});
	}

	public stopSpeak(): void {
		TextToSpeech
			.speak("")
			.then(() => {
				// Leave
			})
			.catch((errorRes) => {
				this.showErrorAlert(errorRes);
			});
	}
}

