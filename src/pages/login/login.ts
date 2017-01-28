import { Component } from '@angular/core';

import { NavController, NavParams, ToastController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebase/get.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {
	private _loginForm: FormGroup;
	private _isError: boolean;
	private _error: string;

	constructor(public navCtrl: NavController,
	            public authenticationHandler: AuthenticationHandler,
				public firebaseGet: FirebaseGET,
				public navParams: NavParams,
				public toastCtrl: ToastController,
				public formBuilder: FormBuilder) {
		this.firebaseGet.setAllTrips();
		this.firebaseGet.setAllUsers();
		this._isError = false;

		let justRegistered = this.navParams.get('justRegistered');
		if (justRegistered) {
			this.showRegistrationToast();
		}

		this._loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});
	}

	showRegistrationToast(): void {
		this.toastCtrl.create({
			message: 'Registration successful',
			duration: 3000,
			position: 'top'
		}).present();
	}

	onFormSubmit(formData): void {
		let loginPromise = this.authenticationHandler.loginFirebase(formData.username, formData.password);

		loginPromise.then((successResponse) => {
			this.authenticationHandler.setCurrentUser();
			this.navCtrl.setRoot(TabsPage);
		}).catch((errorResponse) => {
			this._isError = true;
			this._error = errorResponse;
		});
	}

	goToRegister(): void {
		this.navCtrl.push(Register, {
			callback: (_params) => {
				return new Promise((resolve, reject) => {
					if (_params.justRegistered) {
						this.showRegistrationToast();
					}
					resolve();
				});
			}
		});
	}

}
