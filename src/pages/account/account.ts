import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { NavController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { Login } from '../login/login';
import { LocationModal } from "./locationModal/locationModal";

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebaseGET.service";
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class Account {
	private _currentUser: any;
	private _currentUserTrips: Array<any>;

	constructor(private app: App,
	            public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public modalCtrl: ModalController,
	            public authenticationHandler: AuthenticationHandler,
	            public firebaseGet: FirebaseGET) {
		this._currentUserTrips = [];

		let currentUser = this.authenticationHandler.getCurrentFirebaseUser(),
			allTrips = this.firebaseGet.getAllTrips();

		this.firebaseGet.getUserWithID(currentUser.uid, (currentUser) => {
			this._currentUser = currentUser;
		});

		allTrips.forEach((trip) => {
			if (trip.leadOrganiser === currentUser.uid) {
				this._currentUserTrips.push(trip);
			} else {
				trip.friends.forEach((friendID) => {
					if (friendID === currentUser.uid) {
						this._currentUserTrips.push(trip);
					}
				})
			}
		});
	}

	logout(): void {
		this.authenticationHandler.logoutFirebase();

		this.app.getRootNav().setRoot(Login);
	}

	presentModal(name, friendsID, leadOrganiserID): void {
		let tripMembersID = [],
			tripMembers = [],
			allUsers = this.firebaseGet.getAllUsers();

		if (leadOrganiserID !== this._currentUser.$key) {
			tripMembersID.push(leadOrganiserID);
		} else {
			friendsID.forEach((friendID) => {
				if (friendID !== this._currentUser.$key) {
					tripMembersID.push(friendID);
				}
			});
		}

		allUsers.forEach((user) => {
			console.log("user.$key: " + user.$key);
			tripMembersID.forEach((memberID) => {
				console.log("memberID: " + memberID);
				if (user.$key === memberID) {
					this.firebaseGet.getUserWithID(user.$key, (firebaseUser) => {
						console.log("firebaseUser:");
						console.log(firebaseUser);
						console.log("\n");
						tripMembers.push(firebaseUser);
					});
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
