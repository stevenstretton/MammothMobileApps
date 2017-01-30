import { Component } from '@angular/core';
import { NavController } from "ionic-angular";

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

	constructor(public navCtrl: NavController) {
		//this.navCtrl.insertPages(1, [
		//	{ page: MyTrips },
		//	{ page: Notifications },
		//	{ page: NewTrip },
		//	{ page: Friends },
		//	{ page: Account }
		//])
	}
}
