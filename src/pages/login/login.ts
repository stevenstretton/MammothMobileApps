import { Component } from '@angular/core';

import { NavController, NavParams, ToastController, ModalController, AlertController } from 'ionic-angular';
import { TabsPage } from '../tabs/tabs';
import { Register } from '../register/register';
import { ForgotPasswordModal } from "./modals/modals";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { LocationHandler } from "../../services/locationHandler.service";
import { FirebaseGET } from "../../services/firebase/get.service"
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {
	private _loginForm: FormGroup;
	private _isError: boolean;
	private _error: string;

	constructor(private navCtrl: NavController,
	            private authenticationHandler: AuthenticationHandler,
	            private locationHandler: LocationHandler,
				private firebaseGet: FirebaseGET,
				private navParams: NavParams,
				private toastCtrl: ToastController,
				private modalCtrl: ModalController,
				private alertCtrl: AlertController,
				private formBuilder: FormBuilder) {
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
		this.firebaseGet.setAllUsers(() => {
			// unused callback
		});
	}

	private showPasswordResetToast(email): void {
		this.toastCtrl.create({
			message: 'Password reset sent to: ' + email,
			duration: 3000,
			position: 'top'
		}).present();
	}

	private showRegistrationToast(): void {
		this.toastCtrl.create({
			message: 'Registration successful',
			duration: 3000,
			position: 'top'
		}).present();
	}

	private showErrorAlert(errMessage: string): void {
		this.alertCtrl.create({
			title: 'Error',
			message: errMessage,
			buttons: ['Dismiss']
		}).present();
	}

	public onFormSubmit(formData): void {
		const loginPromise = this.authenticationHandler.loginFirebase(formData.username, formData.password);

		loginPromise.then((successResponse) => {
			this.authenticationHandler.setCurrentUser();
			this.navCtrl.setRoot(TabsPage);
			setTimeout(() => {
				this.locationHandler.checkUserLocation((error) => {
					this.showErrorAlert(error.message);
				});
			}, 2000);
		}).catch((errorResponse) => {
			this._isError = true;
			this._error = errorResponse;
		});
	}

	public goToRegister(): void {
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

	public forgottenPassword(): void {
		let forgottenPassModal = this.modalCtrl.create(ForgotPasswordModal);

		forgottenPassModal.onDidDismiss((email) => {
			if (email) {
				const sendPasswordPromise = this.authenticationHandler.sendPasswordReset(email);

				sendPasswordPromise
					.then((successRes) => {
						this.showPasswordResetToast(email);
					}).catch((errorRes) => {
						this.showErrorAlert(errorRes.message);
				});
			}
		});
		forgottenPassModal.present();
	}
}
