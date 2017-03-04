import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePOST } from '../../services/firebase/post.service';
import { FirebasePUT } from '../../services/firebase/put.service';
import { AuthenticationHandler } from '../../services/authenticationHandler.service';
import { NavController, ActionSheetController, Platform, ModalController, ToastController } from 'ionic-angular';
import { FriendsModal, PresetsModal } from './modals/modals';
import { Camera } from 'ionic-native';

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
	private _tripPhoto: string = '';

	// private _presetData: Array<any>;

	constructor(public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public firebaseGet: FirebaseGET,
	            public authenticationHandler: AuthenticationHandler,
	            public modalCtrl: ModalController,
	            public firebasePost: FirebasePOST,
	            public firebasePut: FirebasePUT,
	            private toastCtrl: ToastController,
	            private formBuilder: FormBuilder) {
		let today = new Date();

		let todayDate = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2),
			// nowTime = ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2) + ":" + ('0' + today.getSeconds()).slice(-2);
			nowTime = ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2);

		this._todaysDate = todayDate;
		this._nowTime = nowTime;

		this._newTripForm = this.formBuilder.group({
			name: ['', Validators.required],
			loc: ['', Validators.required],
			description: '',
			startDate: [todayDate, Validators.required],
			startTime: [nowTime, Validators.required],
			endDate: [todayDate, Validators.required],
			transport: ['', Validators.required]
		});

		this.firebaseGet.setAllPresets()
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friendsAdded = [];
		this._itemList = [];
	}

	presentModal(): void {
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

	presentPresetsModal(): void {

		let presetModal = this.modalCtrl.create(PresetsModal)

		presetModal.onWillDismiss((presetData => {
			if (presetData != null) {
				this.setFieldsWithData(presetData)
			}
		}))

		presetModal.present();

	}

	setFieldsWithData(presetData): void {
		this._newTripForm.setValue({
			name: presetData.name,
			loc: "",
			description: presetData.description,
			startDate: this._todaysDate,
			startTime: this._nowTime,
			endDate: this._todaysDate,
			transport: presetData.transport
		})

		this._tripPhoto = presetData.coverPhotoUrl
		this._itemList = presetData.items
	}

	buildFriendIDsAttending(): Array<any> {
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

	getNotifications(friendID): Array<any> {
		var tempNotification;
		this.firebaseGet.getUserWithID(friendID, (firebaseUser) => {
			tempNotification = firebaseUser.notifications
		})

		return tempNotification;
	}

	pushTrip(formData): void {
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
		};
		this.firebasePost.postNewTrip(this._tripInfo, () => {
			var friends = this.buildFriendIDsAttending();
			this.clearTrip();
			var name = this._currentUser.firstName;
			var tripName = this._tripInfo.name;

			friends.forEach((friend) => {
				console.log(friend)

				var usernotes = this.getNotifications(friend)

				console.log(usernotes)
				if (usernotes == null) {
					var usernotes = []
					usernotes.push("You've been added to " + tripName + " by " + name)
					this.firebasePost.postNewNotification(friend, usernotes);
				} else {
					usernotes.push("You've been added to " + tripName + " by " + name)
					this.firebasePut.putNewNotification(friend, usernotes);
				}

			});
			// Doing this means that the constructor for myTrips is not invoked again
			this.navCtrl.parent.select(0);
			this.showCreateDeleteTripToast('Trip created successfully!');
		});
	}

	showCreateDeleteTripToast(message): void {
		this.toastCtrl.create({
			message: message,
			duration: 3000,
			position: 'top'
		}).present();
	}

	addItem() {
		if (this._itemTitle != "") {
			this._itemList.push({
				name: this._itemTitle,
				description: this._itemDescription
			});
			this._itemTitle = "";
			this._itemDescription = "";
		}
	}

	deleteItem(item): void {
		let index = this._itemList.indexOf(item);
		this._itemList.splice(index, 1);
	}

	clearTrip() {
		this._newTripForm.setValue({
			name: '',
			loc: '',
			description: '',
			startDate: this._todaysDate,
			startTime: this._nowTime,
			endDate: this._todaysDate,
			transport: ''
		})

		this._friendsAdded = []
		this._tripPhoto = ''
		this._itemList = []

	}

	presentActionSheet() {
		let cameraOptions = {
			quality: 75,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 700,
			targetHeight: 600,
			saveToPhotoAlbum: false
		};

		let actionSheet = this.actionSheetCtrl.create({
			title: 'Edit Trip Picture',
			buttons: [
				{
					text: 'Remove Trip Picture',
					icon: !this.platform.is('ios') ? 'trash' : null,
					role: 'destructive',
					handler: () => {
						this._tripPhoto = '';
						console.log('Destructive clicked');
					}
				}, {
					text: 'Take Photo',
					icon: !this.platform.is('ios') ? 'camera' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
						Camera.getPicture(cameraOptions).then((image) => {
							console.log("image here")
							//console.log(image);
							this._tripPhoto = "data:image/jpeg;base64," + image;
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
							console.log("image here")
							//console.log(image);
							this._tripPhoto = "data:image/jpeg;base64," + image;
						});
						console.log('Library clicked');
						Camera.cleanup();
					}
				}, {
					text: 'Choose From Presets',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
						this.presentPresetsModal()
						console.log('Presets clicked');
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
