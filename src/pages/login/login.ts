import { Component } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebase.service/get"

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {
	private _username: string;
	private _password: string;
	private _isError: boolean;
	private _error: string;

	constructor(public navCtrl: NavController,
	            public authenticationHandler: AuthenticationHandler,
				public firebaseGet: FirebaseGET,
				public navParams: NavParams,
				public toastCtrl: ToastController) {
		this.firebaseGet.setAllTrips();
		this.firebaseGet.setAllUsers();
		this._isError = false;

		let justRegistered = this.navParams.get('justRegistered');
		if (justRegistered) {
			this.showRegistrationToast();
		}
	}

	showRegistrationToast(): void {
		this.toastCtrl.create({
			message: 'Registration successful',
			duration: 3000,
			position: 'top'
		}).present();
	}

	login(): void {
		let loginPromise = this.authenticationHandler.loginFirebase(this._username, this._password);

		loginPromise.then((successResponse) => {
			this.authenticationHandler.setCurrentUser();
			this.navCtrl.setRoot(TabsPage);
		}).catch((errorResponse) => {
			this._isError = true;
			this._error = errorResponse;
		});
	}

	goToRegister(): void {
		//push another page onto the history stack
		//causing the nav controller to animate the new page in
		this.navCtrl.push(Register)
	}

}
