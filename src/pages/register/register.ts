import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

import { NavController, NavParams, AlertController } from 'ionic-angular';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-register',
	templateUrl: 'register.html'
})
export class Register {
	private _registrationForm: FormGroup;
	private _callback: Function;
	private _error: string;

	constructor(private navCtrl: NavController,
                private alertCtrl: AlertController,
	            private authenticationHandler: AuthenticationHandler,
	            private formBuilder: FormBuilder,
	            private navParams: NavParams) {
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

	private showErrorAlert(errMessage: string): void {
		this.alertCtrl.create({
			title: 'Error',
			message: errMessage,
			buttons: ['Dismiss']
		}).present();
	}

	register(formData): void {
		if (formData.password === formData.confirmPassword) {
			let registerPromise = this.authenticationHandler.createFirebaseUser(formData);

			registerPromise
				.then((successResponse) => {
					this.authenticationHandler.addNewUserToDatabase(formData, (errorRes) => {
						if (errorRes) {
							this.showErrorAlert(errorRes.message);
						}
					});

					this._callback({
						justRegistered: true
					}).then(() => {
						const sendEmailPromise = this.authenticationHandler.sendEmailVerification();

						sendEmailPromise
							.then((successRes) => {
								this.navCtrl.pop();
							}).catch((errorRes) => {
								this.showErrorAlert(errorRes.message);
						});
					});
				}).catch((errorRes) => {
					this._error = errorRes;
				});
		}
	}
}
