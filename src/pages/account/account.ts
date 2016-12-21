import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { NavController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { Login } from '../login/login';
import { LocationModal } from "./locationModal/locationModal";
import { FirebaseAuthState } from 'angularfire2';

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebaseGET.service";
import { FirebaseListObservable } from 'angularfire2';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class Account {
	private _currentUser: FirebaseListObservable<any>;

	constructor(private app: App,
	            public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public modalCtrl: ModalController,
	            public authenticationHandler: AuthenticationHandler,
	            public firebaseGet: FirebaseGET) {

		let currentUser = this.authenticationHandler.getCurrentFirebaseUser();

		this.firebaseGet.getUserWithID(currentUser.uid, (currentUser) => {
			this._currentUser = currentUser;

			console.log(this._currentUser);
		});
	}

	logout(): void {
		this.authenticationHandler.logoutFirebase();

		this.app.getRootNav().setRoot(Login);
	}

	presentModal(name, friends, leadOrganiser): void {
		let tripMembersID = [],
			tripMembers = [],
			allUsers = this.firebaseGet.getAllUsers();

		if (leadOrganiser !== this._currentUser) {
			tripMembersID.push(leadOrganiser);
		} else {
			friends.forEach((friend) => {
				if (friend !== this._currentUser) {
					tripMembersID.push(friend);
				}
			});
		}

		allUsers.forEach((user) => {
			tripMembersID.forEach((member) => {
				if (user.$key === member) {
					//tripMembers.push(this.firebaseGet.getUserWithID(user.$key));
				}
			});
		});


		let modal = this.modalCtrl.create(LocationModal, {
			name: name,
			members: tripMembers
		});
		modal.onDidDismiss(() => {

		});
		modal.present();
	}

	presentActionSheet(): void {
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
