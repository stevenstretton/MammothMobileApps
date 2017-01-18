import { Component } from '@angular/core';
import { FirebaseGET } from '../../services/firebase.service/get';
import { FirebasePOST } from '../../services/firebase.service/post';
import { AuthenticationHandler } from '../../services/authenticationHandler.service';
import { NavController, ActionSheetController, Platform, ModalController, ToastController } from 'ionic-angular';
import { FriendsModal } from './friendsModal/friendsModal';
import { Camera } from 'ionic-native';

@Component({
	selector: 'page-newTrip',
	templateUrl: 'newTrip.html',
})
export class NewTrip {
	private _friendsAdded: Array<any>;
	private _tripCoverPhotoSelected: boolean = false;
	private _currentUser: any;
	private _tripInfo: any;
	private _itemList: Array<any>;
	private _itemTitle: string = '';
	private _itemDescription: string = '';
	private _tripName: string = '';
	private _tripLoc: string = '';
	private _tripDescription: string = '';
	private _tripTransport: string = '';
	private _event = {
		start: {
			date: '',
			time: ''
		},
		end: {
			date: ''
		}
	};

	constructor(public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public firebaseGet: FirebaseGET,
	            public authenticationHandler: AuthenticationHandler,
	            public modalCtrl: ModalController,
	            public firebasePush: FirebasePOST,
	            private toastCtrl: ToastController) {
		this.initialiseDate();

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friendsAdded = [];
		this._itemList = [];
	}

	initialiseDate(): void {
		let today = new Date();

		let todayDate = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2),
			nowTime = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();

		this._event = {
			start: {
				date: todayDate,
				time: nowTime
			},
			end: {
				date: todayDate
			}
		};
	}

	presentToast(): void {
		let toast = this.toastCtrl.create({
			message: 'Trip was added successfully',
			duration: 3000,
			position: 'top'
		});

		toast.onDidDismiss(() => {
			console.log('Dismissed toast');
		});
		toast.present();
	}

	presentModal(): void {
		let friendIDsAdded = this.buildFriendIDsAttending();
		this._friendsAdded = [];

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

	pushTrip(): void {
		this._tripInfo = {
			name: this._tripName,
			location: this._tripLoc,
			description: this._tripDescription,
			transport: this._tripTransport,
			friends: this.buildFriendIDsAttending(),
			items: this._itemList,
			start: {
				date: this._event.start.date,
				time: this._event.start.time
			},
			end: {
				date: this._event.end.date
			},
			leadOrganiser: this._currentUser.key,
			coverPhotoUrl: "",
		};
		if (this._tripName != "" && this._tripLoc != "" && this._friendsAdded.length != 0) {
			this.firebasePush.postNewTrip(this._tripInfo);
			this.clearTrip();
			this.presentToast();
		}
	}

	clearTrip() {
		this._tripInfo = {};
		this._tripName = "";
		this._tripLoc = "";
		this._tripDescription = "";
		this._friendsAdded = [];
		this._itemList = [];
		this.initialiseDate();
	}

	addItem() {
		if (this._itemTitle != "") {
			let newItem = {
				name: this._itemTitle,
				description: this._itemDescription
			};
			this._itemList.push(newItem);
			this._itemTitle = "";
			this._itemDescription = "";
		}

	}

	deleteItem(item): void {
		console.log(this._itemList);
		let index = this._itemList.indexOf(item);
		console.log(index);
		this._itemList.splice(index, 1);
		console.log(this._itemList);

	}

	presentActionSheet() {
		let cameraOptions = {
			quality: 75,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 300,
			targetHeight: 300,
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
						console.log('Destructive clicked');
					}
				}, {
					text: 'Take Photo',
					icon: !this.platform.is('ios') ? 'camera' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
						Camera.getPicture(cameraOptions).then((image) => {
							console.log(image);
						});
						console.log('Take Photo clicked');
					}
				}, {
					text: 'Choose From Library',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
						Camera.getPicture(cameraOptions).then((image) => {
							console.log(image);
						});
						console.log('Library clicked');
					}
				}, {
					text: 'Choose From Presets',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
						console.log('Presets clicked');
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
