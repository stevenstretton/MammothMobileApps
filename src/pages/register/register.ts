import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { NavController } from 'ionic-angular';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { Login } from "../login/login"

@Component({
	selector: 'page-register',
	templateUrl: 'register.html'
})
export class Register {
	private _registrationForm: FormGroup;

	constructor(public navCtrl: NavController,
				public authenticationHandler: AuthenticationHandler,
				public formBuilder: FormBuilder) {
		this._registrationForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			surname: ['', Validators.required],
			username: ['', Validators.required],
			email: ['', Validators.required],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		})
	}

	register(formData): void {
		if (formData.password === formData.confirmPassword) {
			let registerPromise = this.authenticationHandler.createFirebaseUser(formData);

			registerPromise.then((successResponse) => {
				this.authenticationHandler.addNewUserToDatabase(formData);
				this.navCtrl.setRoot(Login, {
					justRegistered: true
				});
			}).catch((errorRepsonse) => {
				console.log(errorRepsonse);
			});
		}
	}
}
