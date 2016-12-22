import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { NavController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { Login } from '../login/login';
import { LocationModal } from "./locationModal/locationModal";

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebaseGET.service";
import { FirebasePUSH } from "../../services/firebasePUSH.service";
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class Account {
	private _currentUser: any;
	private _currentUserUid: any;
	private _currentUserTrips: Array<any>;

	constructor(private app: App,
	            public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public modalCtrl: ModalController,
	            public authenticationHandler: AuthenticationHandler,
	            public firebaseGet: FirebaseGET,
				public firebasePush: FirebasePUSH) {
		this._currentUserTrips = [];

		let currentUser = this.authenticationHandler.getCurrentFirebaseUser(),
			allTrips = this.firebaseGet.getAllTrips(),
			tripMembers = [];

		this._currentUserUid = currentUser.uid;


		this.firebaseGet.getUserWithID(this._currentUserUid, (user) => {
			this._currentUser = user;
		});

		allTrips.forEach((trip) => {
			tripMembers.push(trip.leadOrganiser);
			trip.friends.forEach((friend) => {
				tripMembers.push(friend);
			});

			tripMembers.forEach((memberID) => {
				if (memberID === this._currentUserUid) {
					this._currentUserTrips.push(trip);
				}
			});
			tripMembers = [];
		});
	}

	logout(): void {
		this.authenticationHandler.logoutFirebase();

		this.app.getRootNav().setRoot(Login);
	}

	presentModal(tripID, tripName, friendIDs, leadOrganiserID): void {
		friendIDs.push(leadOrganiserID);

		let tripMembersID = [],
			tripMembers = [],
			allUsers = this.firebaseGet.getAllUsers();

		friendIDs.forEach((memberID) => {
			if (memberID !== this._currentUserUid) {
				tripMembersID.push(memberID);
			}
		});

		allUsers.forEach((user) => {
			tripMembersID.forEach((memberID) => {
				if (user.$key === memberID) {
					this.firebaseGet.getUserWithID(user.$key, (firebaseUser) => {
						tripMembers.push({
							userKey: user.$key,
							user: firebaseUser
						});
					});
				}
			});
		});

		let modal = this.modalCtrl.create(LocationModal, {
			name: tripName,
			members: tripMembers
		});
		modal.onDidDismiss((usersToSeeLocation) => {
			this.firebasePush.addMemberToSeeLocation(this._currentUserUid, tripID, usersToSeeLocation);
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
