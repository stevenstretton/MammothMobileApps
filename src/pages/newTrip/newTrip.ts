import { Component } from '@angular/core';
import { FirebaseGET } from '../../services/firebaseGET.service';
import { FirebasePUSH } from '../../services/firebasePUSH.service';
import { AuthenticationHandler } from '../../services/authenticationHandler.service';
import { NavController, ActionSheetController, Platform, ModalController, ToastController } from 'ionic-angular';
import { FriendsModal } from './friendsModal/friendsModal';

@Component({
	selector: 'page-newTrip',
	templateUrl: 'newTrip.html',
})
export class NewTrip {

	// These can all be private
	private _friendsAdded: Array<any>;
	private _currentUser: any;
	private _tripInfo: any;
	private _itemList: Array<any>;
	private _title;
	private _descr;
	private _tripName;
	private _tripLoc;
	private _tripDescription;

	constructor(public navCtrl: NavController,
	            public actionSheetCtrl: ActionSheetController,
	            public platform: Platform,
	            public firebaseGet: FirebaseGET,
	            public authenticationHandler: AuthenticationHandler,
	            public modalCtrl: ModalController,
	            public firebasePush: FirebasePUSH,
	            private toastCtrl: ToastController) {

		this._friendsAdded = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._itemList = [];

		// This doesn't need to be here
		//this._tripInfo;

	}

	private _event = {
		dateStart: '2017-01-01',
		//today: Date.now(),
		//month: Date.now(),
		//timeStarts: Date.now(),
		timeStart: '01:00',
		dateEnd: '2017-01-02'
	}

	presentToast() {
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

	presentModal() {
		console.log(this._friendsAdded);
		let modal = this.modalCtrl.create(FriendsModal, {
			currentUser: this._currentUser,
			selectedFriends: this._friendsAdded
		});

		modal.onDidDismiss((setOfFriends) => {
			// setOfFriends.forEach((friend) => {
			//   console.log(friend);
			// 	this._friendsAdded.push(friend);
			// });
			console.log(this._friendsAdded);

		});
		modal.present();
	}

	pushTrip() {

		this._tripInfo = {
			name: this._tripName,
			location: this._tripLoc,
			description: this._tripDescription,
			transport: "car",
			friends: this._friendsAdded,
			items: this._itemList,
      start: {date: this._event.dateStart, time: this._event.timeStart},
      end: {date: this._event.dateEnd},
      // startTime: this.event.dateStart,
			// endTime: this.event.dateEnd,
			leadOrganiser: this._currentUser.key,
			coverPhotoUrl: "",
		};

		console.log(this._tripInfo);
		if (this._tripName != "" && this._tripLoc != "" && this._friendsAdded.length != 0) {

			console.log('success');

			this.firebasePush.pushNewTrip(this._tripInfo);
			this.clearTrip();
			this.presentToast();
		}
	}

	clearTrip() {
		this._tripInfo = [];
		this._tripName = "";
		this._tripLoc = "";
		this._tripDescription = "";
		this._friendsAdded = [];
		this._itemList = [];
		this._event = {
			dateStart: '2017-01-01',
			timeStart: '01:00',
			dateEnd: '2017-01-02'
		};

	}

	addItem() {
		if (this._title != "") {
			let newItem = {
				name: this._title,
				description: this._descr
			};
			this._itemList.push(newItem);
			this._title = "";
			this._descr = "";
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
						console.log('Take Photo clicked');
					}
				}, {
					text: 'Choose From Library',
					icon: !this.platform.is('ios') ? 'folder-open' : null,
					handler: () => {
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
