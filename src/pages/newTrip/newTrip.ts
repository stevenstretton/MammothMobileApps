import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePOST } from '../../services/firebase/post.service';
import { FirebasePUT } from '../../services/firebase/put.service';
import { AuthenticationHandler } from '../../services/authenticationHandler.service';
import { NavController, ActionSheetController, Platform, ModalController, ToastController, AlertController } from 'ionic-angular';
import { FriendsModal, PresetsModal } from './modals/modals';
import { Camera } from 'ionic-native';
import * as moment from 'moment';

@Component({
	selector: 'page-newTrip',
	templateUrl: 'newTrip.html',
})
export class NewTrip {
	private _friendsAdded: Array<any>;
	// private _tripCoverPhotoSelected: boolean = false;
	private _todaysDate: string;
	private _nowTime: string;
	private _currentUser: any;
	private _newTripForm: FormGroup;
	private _tripInfo: any;
	private _itemList: Array<any>;
	private _itemTitle: string = '';
	private _itemDescription: string = '';
	private _tripPhoto: string = 'https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.appspot.com/o/default_image%' +
		'2Fplaceholder-trip.jpg?alt=media&token=9774e22d-26a3-48d4-a950-8243034b5f56';
	private _tripPhotoID: any;
	private _endDate: any;

	constructor(private navCtrl: NavController,
	            private actionSheetCtrl: ActionSheetController,
	            private platform: Platform,
	            private firebaseGet: FirebaseGET,
	            private authenticationHandler: AuthenticationHandler,
	            private modalCtrl: ModalController,
	            private alertCtrl: AlertController,
	            private firebasePost: FirebasePOST,
	            private firebasePut: FirebasePUT,
	            private toastCtrl: ToastController,
	            private formBuilder: FormBuilder) {

		this.setDateTime();
		this._endDate = this._todaysDate;

		this._newTripForm = this.formBuilder.group({
			name: ['', Validators.required],
			loc: ['', Validators.required],
			description: '',
			startDate: [this._todaysDate, Validators.required],
			startTime: [this._nowTime, Validators.required],
			endDate: [this._todaysDate, Validators.required],
			transport: ['', Validators.required]
		});
		this.firebaseGet.setAllPresets();

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friendsAdded = [];
		this._itemList = [];
		this._tripPhotoID = this._currentUser.key + Math.random().toString(36).substring(8);
	}

	public ionViewDidEnter(): void {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.setDateTime();
		this._newTripForm.patchValue({
			startDate: this._todaysDate,
			endDate: this._todaysDate,
			startTime: this._nowTime
		});
	}

	private setDateTime(): void {
		this._todaysDate = moment().format("Y-MM-DD");
		this._nowTime = moment().format("HH:mm");
	}

	public endDateIsValid(): Boolean {
		return moment(this._newTripForm.controls['startDate'].value).isSameOrBefore(this._newTripForm.controls['endDate'].value);
	}

	public setEndDate(bool?: boolean): void {
		this._endDate = this._newTripForm.controls['startDate'].value;
		if (!bool) {
			this._newTripForm.patchValue({
				endDate: this._newTripForm.controls['startDate'].value
			});
		}
	}

	public presentModal(): void {
		let friendIDsAdded = this.buildFriendIDsAttending();
		this._friendsAdded = [];

		if (this._currentUser.friends) {
			this._currentUser.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (firebaseUser) => {
					this._friendsAdded.push({
						isAdded: (friendIDsAdded.indexOf(friendID) > -1),
						user: firebaseUser
					});
				});
			});

			this.modalCtrl.create(FriendsModal, {
				selectedFriends: this._friendsAdded
			}).present();
		}
	}

	public presentPresetsModal(): void {
		let presetModal = this.modalCtrl.create(PresetsModal);

		presetModal.onWillDismiss((presetData => {
			if (presetData) {
				this.setFieldsWithData(presetData);
			}
		}));
		presetModal.present();
	}

	private setFieldsWithData(presetData): void {
		this._newTripForm.setValue({
			name: presetData.name,
			loc: "",
			description: presetData.description,
			startDate: this._todaysDate,
			startTime: this._nowTime,
			endDate: this._todaysDate,
			transport: presetData.transport
		});

		this._tripPhoto = presetData.coverPhotoUrl;
		this._itemList = presetData.items
	}

	public buildFriendIDsAttending(): Array<any> {
		let friendsAttending = [];

		if (this._friendsAdded.length > 0) {
			this._friendsAdded.forEach((friend) => {
				if (friend.isAdded) {
					friendsAttending.push(friend.user.key);
				}
			});
		}
		return friendsAttending;
	}

	private getNotifications(friendID, callback): void {
		this.firebaseGet.getUserWithID(friendID, (firebaseUser) => {
			callback(firebaseUser.notifications);
		});
	}

	public pushTrip(formData): void {
		let friendsAndNotifications = [];

		this.buildForm(formData);
		const postNewTripPromise = this.firebasePost.postNewTrip(this._tripInfo);

		postNewTripPromise
			.then((successRes) => {
				const friendIDs = this.buildFriendIDsAttending(),
					name = this._currentUser.firstName,
					tripName = this._tripInfo.name;

				friendIDs.forEach((friendID) => {
					this.getNotifications(friendID, (notifications) => {
						if (!notifications) {
							notifications = [];
						}
						notifications.push(name + " added you to " + tripName);

						friendsAndNotifications.push({
							id: friendID,
							notifications: notifications
						});
					});
				});

				friendsAndNotifications.forEach((friendAndNote) => {
					const postNotificationsPromise = this.firebasePost.postNewNotification(friendAndNote.id, friendAndNote.notifications);

					postNotificationsPromise
						.then((successRes) => {
							// Returns 'null'
						}).catch((errorRes) => {
							this.showErrorAlert(errorRes);
					});
				});
				this.clearTrip();

				// Doing this means that the constructor for myTrips is not invoked again
				this.navCtrl.parent.select(0);
				this.showCreateDeleteTripToast('Trip created successfully!');
				this._tripPhotoID = this._currentUser.key + Math.random().toString(36).substring(8);
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes);
		});
	}

	private showErrorAlert(errMessage): void {
		this.alertCtrl.create({
			title: 'Error',
			message: errMessage,
			buttons: ['Dismiss']
		}).present();
	}

	private buildForm(formData): void {
		this._tripInfo = {
			name: formData.name,
			location: formData.loc,
			description: formData.description,
			transport: formData.transport,
			friends: this.buildFriendIDsAttending(),
			items: this._itemList,
			start: {
				date: formData.startDate,
				time: formData.startTime
			},
			end: {
				date: formData.endDate
			},
			leadOrganiser: this._currentUser.key,
			coverPhotoUrl: this._tripPhoto,
			coverPhotoID: this._tripPhotoID
		};
	}

	private showCreateDeleteTripToast(message): void {
		this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'top'
		}).present();
	}

	public addItem(): void {
		if (this._itemTitle != "") {
			this._itemList.push({
				name: this._itemTitle,
				description: this._itemDescription
			});

			this._itemTitle = "";
			this._itemDescription = "";
		}
	}

	public deleteItem(item): void {
		let index = this._itemList.indexOf(item);
		this._itemList.splice(index, 1);
	}

	public clearTrip(): void {
		this._newTripForm.setValue({
			name: '',
			loc: '',
			description: '',
			startDate: this._todaysDate,
			startTime: this._nowTime,
			endDate: this._todaysDate,
			transport: ''
		});

		this._friendsAdded = [];
		this._tripPhoto = 'https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.appspot.com/o/default_image%2F' +
			'placeholder-trip.jpg?alt=media&token=9774e22d-26a3-48d4-a950-8243034b5f56';
		this._itemList = [];
	}

	public presentActionSheet(): void {
		let cameraOptions = {
			quality: 90,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 700,
			targetHeight: 600,
			saveToPhotoAlbum: false
		};

		this.actionSheetCtrl.create({
			title: 'Edit Trip Picture',
			buttons: [
				{
					text: 'Reset to Default Picture',
					icon: !this.platform.is('ios') ? 'trash' : null,
					role: 'destructive',
					handler: () => {
						this._tripPhoto = 'https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.appspot.com/o/' +
							'default_image%2Fplaceholder-trip.jpg?alt=media&token=9774e22d-26a3-48d4-a950-8243034b5f56';
					}
				}, {
					text: 'Take Photo',
					icon: !this.platform.is('ios') ? 'camera' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
						Camera.getPicture(cameraOptions).then((image) => {
							const postTripImagePromise = this.firebasePost.postNewTripImage(image, this._tripPhotoID);

							postTripImagePromise
								.then((imageURL) => {
									this._tripPhoto = imageURL;
								}).catch((errorRes) => {
									this.showErrorAlert(errorRes);
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
							const postTripImagePromise = this.firebasePost.postNewTripImage(image, this._tripPhotoID);

							postTripImagePromise
								.then((imageURL) => {
									this._tripPhoto = imageURL;
								}).catch((errorRes) => {
								this.showErrorAlert(errorRes);
							});
						});
						Camera.cleanup();
					}
				}, {
					text: 'Choose From Presets',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
						this.presentPresetsModal();
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
		}).present();
	}
}
