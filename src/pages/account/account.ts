import { Component } from '@angular/core';
import { App, ItemSliding } from 'ionic-angular';
import { Camera } from 'ionic-native';

import { NavController, ActionSheetController, Platform, ModalController, ToastController, AlertController } from 'ionic-angular';
import { Login } from '../login/login';
import { LocationModal, ChangePasswordModal } from "./modals/modals";

import { LocationHandler } from "../../services/locationHandler.service";

import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { FirebaseGET } from "../../services/firebase/get.service";
import { FirebasePUT } from "../../services/firebase/put.service";
import { FirebasePOST } from "../../services/firebase/post.service";
import { FirebaseDELETE } from "../../services/firebase/delete.service"

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
		private navCtrl: NavController,
		private actionSheetCtrl: ActionSheetController,
		private platform: Platform,
		private modalCtrl: ModalController,
		private authenticationHandler: AuthenticationHandler,
		private firebaseGet: FirebaseGET,
		private firebasePut: FirebasePUT,
		private firebasePost: FirebasePOST,
		private locationHandler: LocationHandler,
		private firebaseDelete: FirebaseDELETE,
		private toastCtrl: ToastController,
		private alertCtrl: AlertController) {
		this._usersToSeeLocation = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._allUsers = this.firebaseGet.getAllUsers();
		this._userPhoto = this._currentUser.photoUrl;

		this.setCurrentUserTrips();
	}

	public setCurrentUserTrips(): void {
		let allTrips = this.firebaseGet.getAllTrips();
		this._currentUserTrips = [];
		allTrips.forEach((trip) => {
			if (trip.leadOrganiser === this._currentUser.key) {
				if (trip.friends) {
					if (trip.friends.indexOf(this._currentUser.key) > -1) {
						this._currentUserTrips.push(trip);
					}
				} else {
					this._currentUserTrips.push(trip);
				}
			}
		});
	}

	public ionViewWillEnter(): void {
		this.setCurrentUserTrips();
	}

	public logout(): void {
		const logoutPromise = this.authenticationHandler.logoutFirebase();

		logoutPromise
			.then((successRes) => {
				this.app.getRootNav().setRoot(Login);
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes.message);
			});
	}

	public showChangePasswordModal(slidingItem: ItemSliding): void {
		let modal = this.modalCtrl.create(ChangePasswordModal);

		modal.onDidDismiss((passwordData) => {
			if (passwordData) {
				const changePassPromise = this.authenticationHandler.changeUserPassword(passwordData.newPassword);

				changePassPromise
					.then((successRes) => {
						this.showChangeAccountDetailsToast("Password changed successfully!");
					}).catch((errorRes) => {
						this.showErrorAlert(errorRes.message);
					});
			}
			slidingItem.close();
		});
		modal.present();
	}

	public showLocationModal(trip): void {
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

		let filterOutCurrentUser = (users: Array<any>) => {
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

	public changeSharingLocation(): void {
		const putShareLocationPromise = this.firebasePut.putShareLocation(this._currentUser.key, this._currentUser.shareLocation);

		putShareLocationPromise
			.then((successRes) => {
				if (this._currentUser.shareLocation) {
					this.locationHandler.logLocation(true, (error) => {
						this.showErrorAlert(error.message);
					});
				} else {
					this.locationHandler.logLocation(false, (error) => {
						// Unused callback
					});
				}
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes.message);
			})
	}

	private showChangeAccountDetailsToast(message: string): void {
		this.toastCtrl.create({
			message: message,
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

	public presentActionSheet(): void {
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
						this._userPhoto = "https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.appspot.com/o/" +
							"default_image%2Fplaceholder-user.png?alt=media&token=9f507196-f787-426b-8175-5c0ca1d74606";
						this._currentUser.photoUrl = this._userPhoto;
						const putUserPhotoPromise = this.firebasePut.putNewUserPhotoInDB(this._currentUser.key, this._userPhoto);

						putUserPhotoPromise
							.then((successRes) => {
								this.showChangeAccountDetailsToast("Removed profile picture successfully!");
							}).catch((errorRes) => {
								this.showErrorAlert(errorRes.message)
							});
					}
				}, {
					text: 'Take Photo',
					icon: !this.platform.is('ios') ? 'camera' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
						Camera.getPicture(cameraOptions).then((image) => {
							const postUserPhotoInStorage = this.firebasePost.postNewAccountPhoto(image, this._currentUser.key);

							postUserPhotoInStorage
								.then((successURL) => {
									this._userPhoto = successURL
									this._currentUser.photoUrl = this._userPhoto;
									const putUserPhotoPromise = this.firebasePut.putNewUserPhotoInDB(this._currentUser.key, this._userPhoto);

									putUserPhotoPromise
										.then((successRes) => {
											this.showChangeAccountDetailsToast("Changed profile picture successfully!");
										}).catch((errorRes) => {
											this.showErrorAlert(errorRes.message)
										});

								}).catch((errorRes) => {
									this.showErrorAlert(errorRes.message)
								});
						});

						Camera.cleanup();
					}
				}, {
					text: 'Choose From Library',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
						Camera.getPicture(cameraOptions).then((image) => {
							const postUserPhotoInStorage = this.firebasePost.postNewAccountPhoto(image, this._currentUser.key);

							postUserPhotoInStorage
								.then((successURL) => {
									this._userPhoto = successURL
									this._currentUser.photoUrl = this._userPhoto;
									const putUserPhotoPromise = this.firebasePut.putNewUserPhotoInDB(this._currentUser.key, this._userPhoto);

									putUserPhotoPromise
										.then((successRes) => {
											this.showChangeAccountDetailsToast("Changed profile picture successfully!");
										}).catch((errorRes) => {
											this.showErrorAlert(errorRes.message)
										});

								}).catch((errorRes) => {
									this.showErrorAlert(errorRes.message)
								});
						});
						Camera.cleanup();
					}
				}, {
					text: 'Cancel',
					icon: !this.platform.is('ios') ? 'close' : null,
					role: 'cancel',
					handler: () => {
						Camera.cleanup();
					}
				}
			]
		});
		actionSheet.present();
	}

	public deleteAccount(): void {
		this.alertCtrl.create({
			title: 'Delete Account',
			message: 'Are you sure you want to delete your account?',
			buttons: [
				{
					text: 'Yes',
					handler: () => {
						const deleteDbUserPromise = this.firebaseDelete.deleteUserFromDB(this._currentUser.key),
							deleteUserPhotoPromise = this.firebaseDelete.deleteUserPhotoFromStorage(this._currentUser.key),
							deleteFbUser = this.authenticationHandler.deleteFirebaseUser();

						deleteDbUserPromise
							.then((successRes) => {
								this.firebaseDelete.deleteUserFromAllTrips(this._currentUser.key, this._currentUserTrips, (errorRes) => {
									if (!errorRes) {
										deleteFbUser
											.then((successRes) => {
												if (this._currentUser.photoUrl !== this._userPhoto) {
													deleteUserPhotoPromise
														.then((successRes) => {
															this.navCtrl.setRoot(Login);
														}).catch((errorRes) => {
															this.showErrorAlert(errorRes.message);
														});
												}
												this.navCtrl.setRoot(Login);
											}).catch((errorRes) => {
												this.showErrorAlert(errorRes.message);
											});
									} else {
										this.showErrorAlert(errorRes.message);
									}
								});

							}).catch((errorRes) => {
								this.showErrorAlert(errorRes.message);
							});
					}
				}, {
					text: 'No',
					role: 'cancel'
				}
			]
		}).present();
	}
}
