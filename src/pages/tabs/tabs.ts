import { Component } from '@angular/core';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { ToastController } from 'ionic-angular';
import { MyTrips } from '../myTrips/myTrips';
import { Notifications } from '../notifications/notifications';
import { NewTrip } from '../newTrip/newTrip';
import { Friends } from '../friends/friends';
import { Account } from '../account/account';

@Component({
	templateUrl: 'tabs.html'
})
export class TabsPage {
	// this tells the tabs component which Pages
	// should be each tab's root Page
	tab1Root: any = MyTrips;
	tab2Root: any = Notifications;
	tab3Root: any = NewTrip;
	tab4Root: any = Friends;
	tab5Root: any = Account;

	private _currentUser: any;
	private _num = 0;

	constructor(public authenticationHandler: AuthenticationHandler,
	            private toastCtrl: ToastController) {
		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._num = this.getNotifications();
	}

	getNotifications(): number {
		if (this._currentUser.notifications) {
			this.checkNewNotifications(this._currentUser.notifications);

			return this._currentUser.notifications.length;
		}
		return 0;
	}

	checkNewNotifications(notes): void {
		this._num = notes.length;

		if (notes.length > this._num) {
			this.gotNewNotificationToast(notes[notes.length - 1]);
		}
	}

	gotNewNotificationToast(message): void {
		this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'top'
		}).present();
	}
}
