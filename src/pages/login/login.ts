import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebaseGET.service"

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {
	username: string;
	password: string;

	constructor(public navCtrl: NavController,
	            public authenticationHandler: AuthenticationHandler,
				public firebaseGet: FirebaseGET) {}

	login(): void {
		let loginPromise = this.authenticationHandler.loginFirebase(this.username, this.password);

		loginPromise.then((successResponse) => {
			// TODO: Figure out another way to do this
			// Currently you have to wait until all trips have been pulled from firebase before a user logs in
			// This is because if the data has not been pulled from firebase, exceptions will be thrown as...
			// Cannot read Property of undefined
			this.firebaseGet.setAllTrips(() => {
				this.firebaseGet.setAllUsers(() => {
					this.navCtrl.setRoot(TabsPage);
				});
			});
		}).catch((errorResponse) => {
			// do something with errorResponse
		});
	}

	goToRegister(): void {
		//push another page onto the history stack
		//causing the nav controller to animate the new page in
		this.navCtrl.push(Register)
	}

}
