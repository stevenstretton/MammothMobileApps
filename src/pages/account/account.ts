import { Component } from '@angular/core';
import { App, ItemSliding } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { NavController, ActionSheetController, Platform, ModalController, ToastController } from 'ionic-angular';
import { Login } from '../login/login';
import { LocationModal, ChangePasswordModal } from "./modals/modals";

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebase/get.service";
import { FirebasePUT } from "../../services/firebase/put.service";

@Component({
	selector: 'page-account',
	templateUrl: 'account.html'
})
export class Account {
	private _currentUser: any;
	private _currentUserTrips: Array<any>;
	private _usersToSeeLocation: Array<any>;
	private _allUsers: Array<any>;
	private _userPhoto: string = '';

	constructor(private app: App,
	            public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public modalCtrl: ModalController,
	            public authenticationHandler: AuthenticationHandler,
	            public firebaseGet: FirebaseGET,
				public firebasePut: FirebasePUT,
				public toastCtrl: ToastController) {
		this._usersToSeeLocation = [];
		this._currentUserTrips = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._allUsers = this.firebaseGet.getAllUsers();
		this._userPhoto = this._currentUser.photoUrl;
		let	allTrips = this.firebaseGet.getAllTrips();

		allTrips.forEach((trip) => {
			if ((trip.leadOrganiser === this._currentUser.key) || (trip.friends.indexOf(this._currentUser.key) > -1)) {
				this._currentUserTrips.push(trip);
			}
		});
	}

	// ionViewWillEnter() {
	// 	let	allTrips = this.firebaseGet.getAllTrips();
	// 	this._currentUserTrips = [];
	// 	allTrips.forEach((trip) => {
	// 		if ((trip.leadOrganiser === this._currentUser.key) || (trip.friends.indexOf(this._currentUser.key) > -1)) {
	// 			this._currentUserTrips.push(trip);
	// 		}
	// 	});
	// }


	logout(): void {
		this.authenticationHandler.logoutFirebase();

		this.app.getRootNav().setRoot(Login);
	}

	showChangePasswordModal(slidingItem: ItemSliding): void {
		let modal = this.modalCtrl.create(ChangePasswordModal);
		modal.onDidDismiss((passwordData) => {
			if (passwordData)
			{
				this.authenticationHandler.changeUserPassword(passwordData.newPassword);
				this.showChangePasswordToast();
			}
			slidingItem.close();
		});
		// slidingItem.close();
		modal.present();
	}

	showChangePasswordToast(): void {
		this.toastCtrl.create({
			message: 'Password changed successfully!',
			duration: 3000,
			position: 'top'
		}).present();
	}

	showLocationModal(trip): void {
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
			if ((usersToSeeLocation) && (usersToSeeLocation.length > 0)) {
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

	showChangeProfilePhotoToast(): void {
		this.toastCtrl.create({
			message: 'Profile Picture changed successfully!',
			duration: 2000,
			position: 'top'
		}).present();
	}

	showChangeProfilePhotoRemovedToast(): void {
		this.toastCtrl.create({
			message: 'Profile Picture Removed',
			duration: 2000,
			position: 'top'
		}).present();
	}


	presentActionSheet(): void {
		let cameraOptions = {
			quality: 50,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 300,
			targetHeight: 300,
			saveToPhotoAlbum: false
		};

		let actionSheet = this.actionSheetCtrl.create({
			title: 'Edit Profile Picture',
			buttons: [
				{
					text: 'Remove Profile Picture',
					icon: !this.platform.is('ios') ? 'trash' : null,
					role: 'destructive',
					handler: () => {
						this._userPhoto = "https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.appspot.com/o/default_image%2Fplaceholder-user.png?alt=media&token=9f507196-f787-426b-8175-5c0ca1d74606";
						this._currentUser.photoUrl = this._userPhoto;
						this.firebasePut.putNewUserPhotoInDB(this._currentUser.key, this._userPhoto);
						this.showChangeProfilePhotoRemovedToast();
						console.log('Destructive clicked');
					}
				}, {
					text: 'Take Photo',
					icon: !this.platform.is('ios') ? 'camera' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
						Camera.getPicture(cameraOptions).then((image) => {
							//console.log(image);
							this._userPhoto = "data:image/jpeg;base64,"+ image;
							this._currentUser.photoUrl = this._userPhoto;
							this.firebasePut.putNewUserPhotoInDB(this._currentUser.key, this._userPhoto);
							this.showChangeProfilePhotoToast();
						});
						console.log('Take Photo clicked');
						Camera.cleanup();
					}
				}, {
					text: 'Choose From Library',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
						Camera.getPicture(cameraOptions).then((image) => {
							this._userPhoto = "data:image/jpeg;base64,"+ image;
							this._currentUser.photoUrl = this._userPhoto;
							this.firebasePut.putNewUserPhotoInDB(this._currentUser.key, this._userPhoto);
							//console.log(image);
							this.showChangeProfilePhotoToast();
						});
						console.log('Library clicked');
						Camera.cleanup();
					}
				}, {
					text: 'Cancel',
					icon: !this.platform.is('ios') ? 'close' : null,
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
						Camera.cleanup();
					}
				}
			]
		});
		actionSheet.present();
	}

}
