import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { NavController, NavParams } from 'ionic-angular';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-register',
	templateUrl: 'register.html'
})
export class Register {
	private _registrationForm: FormGroup;
	private _callback: Function;

	constructor(public navCtrl: NavController,
				public authenticationHandler: AuthenticationHandler,
				public formBuilder: FormBuilder,
				public navParams: NavParams) {
		this._registrationForm = this.formBuilder.group({
			firstName: ['', Validators.required],
			surname: ['', Validators.required],
			username: ['', Validators.required],
			email: ['', Validators.required],
			password: ['', Validators.required],
			confirmPassword: ['', Validators.required]
		});
		this._callback = this.navParams.get('callback');
	}

	register(formData): void {
		if (formData.password === formData.confirmPassword) {
			let registerPromise = this.authenticationHandler.createFirebaseUser(formData);

			registerPromise.then((successResponse) => {
				this.authenticationHandler.addNewUserToDatabase(formData);

				// This can be this.navCtrl.pop() but cannot send parameters back to it
				this._callback({
					justRegistered: true
				}).then(() => {
					this.navCtrl.pop();
				});
			}).catch((errorRepsonse) => {
				console.log(errorRepsonse);
			});
		}
	}
}
