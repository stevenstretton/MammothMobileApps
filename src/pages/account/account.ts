import { Component } from '@angular/core';
import { App } from 'ionic-angular';

import { NavController, ActionSheetController, Platform, ModalController } from 'ionic-angular';
import { Login } from '../login/login';
import { LocationModal } from "./locationModal/locationModal";

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebase.service/get";
import { FirebasePOST } from "../../services/firebase.service/post";
import { FirebasePUT } from "../../services/firebase.service/put";
import { FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { transformSrcPathToTmpPath } from "@ionic/app-scripts/dist";
import _ from 'lodash';

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class Account {
	private _currentUser: any;
	private _currentUserTrips: Array<any>;
	private _usersToSeeLocation: Array<any>;
	private _allUsers: Array<any>;

	constructor(private app: App,
	            public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public modalCtrl: ModalController,
	            public authenticationHandler: AuthenticationHandler,
	            public firebaseGet: FirebaseGET,
				public firebasePush: FirebasePOST,
				public firebasePut: FirebasePUT) {
		this._usersToSeeLocation = [];
		this._currentUserTrips = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._allUsers = this.firebaseGet.getAllUsers();

		let	allTrips = this.firebaseGet.getAllTrips(),
			tripMembers = [];

		allTrips.forEach((trip) => {
			tripMembers.push(trip.leadOrganiser);
			trip.friends.forEach((friend) => {
				tripMembers.push(friend);
			});

			if (tripMembers.indexOf(this._currentUser.key) > -1) {
				this._currentUserTrips.push(trip);
			}
			tripMembers = [];
		});
	}

	logout(): void {
		this.authenticationHandler.logoutFirebase();

		this.app.getRootNav().setRoot(Login);
	}

	presentModal(trip): void {
		let tripID = trip.key,
			tripName = trip.name,
			currentUsersToSeeLocationOfChosenTrip = [],
			tripMembers = [],
			allUsers = this._allUsers;

		let filterAllUsersIntoArray = () => {
			let allUsers = [];

			allUsers.push(trip.leadOrganiser);
			trip.friends.forEach((friend) => {
				allUsers.push(friend);
			});
			return allUsers;
		};

		let filterOutCurrentUser = (users) => {
			let allUsers = [];

			users.forEach((user) => {
				if (user !== this._currentUser.key) {
					allUsers.push(user);
				}
			});
			return allUsers;
		};

		let tripMemberIDs = filterOutCurrentUser(filterAllUsersIntoArray());

		if (typeof this._currentUser.usersToSeeLocation !== "undefined") {
			this._currentUser.usersToSeeLocation.forEach((userTripPair) => {
				if (userTripPair.trip === tripID) {
					currentUsersToSeeLocationOfChosenTrip = userTripPair.users;
				}
			});
		}

		allUsers.forEach((user) => {
			if (tripMemberIDs.indexOf(user.key) > -1) {
				this.firebaseGet.getUserWithID(user.key, (firebaseUser) => {
					tripMembers.push({
						canAlreadySee: (currentUsersToSeeLocationOfChosenTrip.indexOf(user.key) > -1),
						user: firebaseUser
					});
				});
			}
		});

		let modal = this.modalCtrl.create(LocationModal, {
			name: tripName,
			members: tripMembers
		});
		modal.onDidDismiss((usersToSeeLocation) => {
			if (usersToSeeLocation.length > 0) {
				this.firebasePut.putUserToSeeLocation(this._currentUser.key, tripID, usersToSeeLocation);

				// Refreshing the user
				this._currentUser = this.authenticationHandler.getCurrentUser();
			}
		});
		modal.present();
	}

	changeSharingLocation(): void {
		this.firebasePut.putShareLocation(this._currentUser.key, this._currentUser.shareLocation);
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
