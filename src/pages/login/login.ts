import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { UserService } from "../../services/user.service"
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
				public userService: UserService,
				public firebaseGet: FirebaseGET) {}

	login(): void {
		let loginPromise = this.authenticationHandler.loginFirebase(this.username, this.password);

		loginPromise.then((successResponse) => {
			this.firebaseGet.setAllTrips(() => {
				this.firebaseGet.setAllUsers(() => {
					this.userService.setTheCurrentUser();
				});
			});

			this.navCtrl.setRoot(TabsPage)
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
