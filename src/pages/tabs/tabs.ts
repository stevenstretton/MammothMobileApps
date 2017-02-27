import { Component} from '@angular/core';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
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

	constructor(public authenticationHandler: AuthenticationHandler) { }

	getNotifications(){
		let notes = this.authenticationHandler.getCurrentUser().notifications;
		if (notes)
		{
			return notes.length
		}
		else 
		return 0
	}

}
