import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePOST } from '../../services/firebase/post.service';
import { AuthenticationHandler } from '../../services/authenticationHandler.service';
import { NavController, ActionSheetController, Platform, ModalController, ToastController } from 'ionic-angular';
import { FriendsModal } from './modals/modals';
import { Camera } from 'ionic-native';
import { MyTrips } from '../myTrips/myTrips';

@Component({
	selector: 'page-newTrip',
	templateUrl: 'newTrip.html',
})
export class NewTrip {
	private _friendsAdded: Array<any>;
	// private _tripCoverPhotoSelected: boolean = false;
	private _todaysDate: string;
	private _currentUser: any;
	private _newTripForm: FormGroup;
	private _tripInfo: any;
	private _itemList: Array<any>;
	private _itemTitle: string = '';
	private _itemDescription: string = '';
	private _tripPhoto: string = '';

	constructor(public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public firebaseGet: FirebaseGET,
	            public authenticationHandler: AuthenticationHandler,
	            public modalCtrl: ModalController,
	            public firebasePost: FirebasePOST,
	            private toastCtrl: ToastController,
				private formBuilder: FormBuilder) {
		let today = new Date();

		let todayDate = today.getFullYear() + "-" + ('0' + (today.getMonth() + 1)).slice(-2) + "-" + ('0' + today.getDate()).slice(-2),
			nowTime = ('0' + today.getHours()).slice(-2) + ":" + ('0' + today.getMinutes()).slice(-2) + ":" + ('0' + today.getSeconds()).slice(-2);

		this._todaysDate = todayDate;

		this._newTripForm = this.formBuilder.group({
			name: ['', Validators.required],
			loc: ['', Validators.required],
			description: '',
			startDate: [todayDate, Validators.required],
			startTime: [nowTime, Validators.required],
			endDate: [todayDate, Validators.required],
			transport: ['', Validators.required]
		});

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friendsAdded = [];
		this._itemList = [];
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
			this.navCtrl.push(MyTrips, {
				justCreatedTrip: true
			});

			// Very unsure as to how this is working. I am posting a new trip, yes. But then I never update the set of trips stored locally
			// and, somehow, when navigating to the `myTrips` page shows the updated version of the trips?

			//this.firebaseGet.setAllTrips(() => {
			//	this.navCtrl.push(MyTrips, {
			//		justCreatedTrip: true
			//	});
			//});
		});
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
		console.log("someone has removed this function");
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
							this._tripPhoto = "data:image/jpeg;base64,"+image;
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
							this._tripPhoto = "data:image/jpeg;base64,"+image;
						});
						console.log('Library clicked');
						Camera.cleanup();
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
						Camera.cleanup();
					}
				}
			]
		});
		actionSheet.present();
	}

}
