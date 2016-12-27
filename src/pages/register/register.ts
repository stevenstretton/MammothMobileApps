import { Component } from '@angular/core';

import { NavController } from 'ionic-angular';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { Login } from "../login/login"

@Component({
	selector: 'page-register',
	templateUrl: 'register.html'
})
export class Register {
	private _firstName: string;
	private _surname: string;
	private _username: string;
	private _email: string;
	private _password: string;
	private _confirmPassword: string;

	constructor(public navCtrl: NavController,
				public authenticationHandler: AuthenticationHandler) {}

	register(): void {
		if (this._password === this._confirmPassword) {
			let registerPromise = this.authenticationHandler.createFirebaseUser(this._email, this._password);

			registerPromise.then((successResponse) => {
				this.authenticationHandler.addNewUserToDatabase(this._email, this._firstName, this._surname, this._username);
				this.navCtrl.setRoot(Login);
			}).catch((errorRepsonse) => {
				console.log(errorRepsonse);
			});
		}
	}
}
