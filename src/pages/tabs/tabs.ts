import { Component} from '@angular/core';
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
	num = 0;

	constructor(public authenticationHandler: AuthenticationHandler, private toastCtrl: ToastController) {
		this.num = this.getNotifications();
	 }
	

	getNotifications(){
		let notes = this.authenticationHandler.getCurrentUser().notifications;
		if (notes)
		{
			this.checkNewNotifications(notes)
			return notes.length
			
		}
		else 
		return 0
	}

	checkNewNotifications(notes){
		
		if(notes.length == this.num){

		}
		if(notes.length > this.num){
			this.num = notes.length;
			this.gotNewNotificationToast(notes[notes.length-1]);
		}
		if(notes.length < this.num){
			this.num = notes.length;
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
