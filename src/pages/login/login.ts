import { Component } from '@angular/core';

import { NavController, NavParams, ToastController, ModalController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';
import { ForgotPasswordModal } from "./modals/modals";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { LocationHandler } from "../../services/locationHandler.service";
import { FirebaseGET } from "../../services/firebase/get.service"
import { FirebasePUT } from "../../services/firebase/put.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {
	private _loginForm: FormGroup;
	private _isError: boolean;
	private _error: string;
	private _currentUser: any;

	constructor(public navCtrl: NavController,
	            public authenticationHandler: AuthenticationHandler,
	            public locationHandler: LocationHandler,
				public firebaseGet: FirebaseGET,
				public firebasePut: FirebasePUT,
				public navParams: NavParams,
				public toastCtrl: ToastController,
				public modalCtrl: ModalController,
				public formBuilder: FormBuilder) {
		this._isError = false;

		let justRegistered = this.navParams.get('justRegistered');
		if (justRegistered) {
			this.showRegistrationToast();
		}

		this._loginForm = this.formBuilder.group({
			username: ['', Validators.required],
			password: ['', Validators.required]
		});

		this.firebaseGet.setAllTrips(() => {
			// unused callback
		});
		this.firebaseGet.setAllUsers();
	}

	showRegistrationToast(): void {
		this.toastCtrl.create({
			message: 'Registration successful',
			duration: 3000,
			position: 'top'
		}).present();
	}

	onFormSubmit(formData): void {
		const loginPromise = this.authenticationHandler.loginFirebase(formData.username, formData.password);

		loginPromise.then((successResponse) => {
			this.authenticationHandler.setCurrentUser();
			this.navCtrl.setRoot(TabsPage);
			setTimeout(() => {
				this.locationHandler.checkUserLocation();
			}, 2000);
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

	forgottenPassword(): void {
		let forgottenPassModal = this.modalCtrl.create(ForgotPasswordModal);

		forgottenPassModal.onDidDismiss((email) => {
			this.authenticationHandler.sendPasswordReset(email);
		});
		forgottenPassModal.present();
	}
}
