import { Component } from '@angular/core';
import { NavController } from "ionic-angular";
<<<<<<< HEAD
import { FirebaseGET } from '../../services/firebase/get.service';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

=======
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
>>>>>>> 5dcd39fc84fc96b93146ed5f5b16e1b1a64069ce
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
    
private _noteCount: number = 0;
    

	constructor(public navCtrl: NavController, public authenticationHandler: AuthenticationHandler) {
		//this.navCtrl.insertPages(1, [
		//	{ page: MyTrips },
		//	{ page: Notifications },
		//	{ page: NewTrip },
		//	{ page: Friends },
		//	{ page: Account }
		//])
		let notes = this.authenticationHandler.getCurrentUser().notifications;
        
        console.log(notes);
		if (notes)
		{
			this._noteCount = notes.length
		}
        
     
	}

}
