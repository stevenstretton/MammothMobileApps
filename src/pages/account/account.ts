import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { NavController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { Login } from '../login/login';
import { LocationModal } from "./locationModal/locationModal"

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebaseGET.service";
import { UserService } from "../../services/user.service";

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class Account {
	private username: string;
	private password: string;
	private email: string;
	private photoUrl: string;
	private firstName: string;
	private lastName: string;

	constructor(private app: App,
	            public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public modalCtrl: ModalController,
	            public authenticationHandler: AuthenticationHandler,
				public firebaseGet: FirebaseGET,
				public userService: UserService) {

		let currentUser = this.userService.getTheCurrentUser();

		this.firstName = currentUser.getFirstName();
		this.lastName = currentUser.getLastName();
		this.email = currentUser.getEmail();
		this.username = currentUser.getUsername();
		this.photoUrl = currentUser.getPhotoUrl();
		this.password = "Password";
	}

	logout(): void {
		this.authenticationHandler.logoutFirebase();
		console.log(this.authenticationHandler.getCurrentUser());
		this.app.getRootNav().setRoot(Login);
	}

	presentModal() {
		let modal = this.modalCtrl.create(LocationModal);
		modal.present();
	}

	presentActionSheet() {
		let actionSheet = this.actionSheetCtrl.create({
			title: 'Edit Profile Picture',
			buttons: [
				{
					text: 'Remove Profile Picture',
					icon: !this.platform.is('ios') ? 'trash' : null,
					role: 'destructive',
					handler: () => {
						console.log('Destructive clicked');
					}
				}, {
					text: 'Take Photo',
					icon: !this.platform.is('ios') ? 'camera' : null,
					handler: () => {
						console.log('Archive clicked');
					}
				}, {
					text: 'Choose From Library',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
						console.log('Archive clicked');
					}
				}, {
					text: 'Cancel',
					icon: !this.platform.is('ios') ? 'close' : null,
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

}
