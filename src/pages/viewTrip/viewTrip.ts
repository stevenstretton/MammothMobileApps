import { Component } from '@angular/core';
import { Camera, TextToSpeech } from 'ionic-native';
import { NavController, NavParams, ActionSheetController, AlertController, Platform, ModalController, ToastController } from 'ionic-angular';
import { Map } from '../map/map';
import { FirebaseGET } from "../../services/firebase/get.service";
import { FirebaseDELETE } from "../../services/firebase/delete.service";
import { FirebasePUT } from "../../services/firebase/put.service";
import { FirebasePOST } from "../../services/firebase/post.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { EditDateModal, EditInputModal, EditTimeModal, EditTextareaModal, AddMembersModal, AddItemsModal } from "./modals/modals";

@Component({
	selector: 'page-viewTrip',
	templateUrl: 'viewTrip.html'
})
export class ViewTrip {
	private _trip: any;
	private _tripMembers: Array<any>;
	private _currentUser: any;
	private _callback: Function;

	constructor(public navCtrl: NavController,
				public navParams: NavParams,
				public firebaseGet: FirebaseGET,
				public firebaseDelete: FirebaseDELETE,
				public firebasePut: FirebasePUT,
				public firebasePost: FirebasePOST,
				public platform: Platform,
				public actionSheetCtrl: ActionSheetController,
				public alertCtrl: AlertController,
				public authenticationHandler: AuthenticationHandler,
				public modalCtrl: ModalController,
				public toastCtrl: ToastController) {
		this._tripMembers = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._trip = this.navParams.get('trip');
		this._callback = this.navParams.get('callback');

		if (this._trip.trip.friends != null) {
			this._trip.trip.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (user) => {
					this._tripMembers.push(user);
				});
			});
		}
	}

	showEditModal(index): void {
		// index:
		// ---------------
		// 1 = description
		// 2 = location
		// 3 = start date
		// 4 = start time
		// 5 = end date
		// 6 = transport
		// 7 = friends
		// 8 = items

		let createModal = (modal, title, oldValue, callback) => {
			let editModal = this.modalCtrl.create(modal, {
				title: title,
				oldValue: oldValue
			});
			editModal.onDidDismiss((formData) => {
				if (typeof formData !== "undefined") {
					let newValue;
					if (title === "Friends") {
						let peopleIDs = [];

						formData.forEach((person) => {
							peopleIDs.push(person.key);
						});
						newValue = peopleIDs;
					} else if (title === "Items") {
						newValue = formData;
					} else {
						newValue = formData.newValue;
					}
					this.firebasePut.putTripData(this._trip.trip.key, title, newValue);
					callback(formData);
				}
			});
			editModal.present();
		};

		switch (index) {
			case 1:
				createModal(EditTextareaModal, 'Description', this._trip.trip.description, (formData) => {
					this._trip.trip.description = formData.newValue;
					this.showEditToast('Description');
				});
				break;
			case 2:
				createModal(EditInputModal, 'Location', this._trip.trip.location, (formData) => {
					this._trip.trip.location = formData.newValue;
					this.showEditToast('Location');
				});
				break;
			case 3:
				createModal(EditDateModal, 'Start Date', this._trip.trip.start.date, (formData) => {
					this._trip.trip.start.date = formData.newValue;
					this.showEditToast('Start date');
				});
				break;
			case 4:
				createModal(EditTimeModal, 'Start Time', this._trip.trip.start.time, (formData) => {
					this._trip.trip.start.time = formData.newValue;
					this.showEditToast('Start time');
				});
				break;
			case 5:
				createModal(EditDateModal, 'End Date', this._trip.trip.end.date, (formData) => {
					this._trip.trip.end.date = formData.newValue;
					this.showEditToast('End date');
				});
				break;
			case 6:
				createModal(EditInputModal, 'Transport', this._trip.trip.transport, (formData) => {
					this._trip.trip.transport = formData.newValue;
					this.showEditToast('Transport');
				});
				break;
			case 7:
				createModal(AddMembersModal, 'Friends', this._tripMembers, (formData) => {
					this._tripMembers = formData;
					this.showEditToast('Friends');
				});
				break;
			case 8:
				createModal(AddItemsModal, 'Items', this._trip.trip.items, (formData) => {
					this._trip.trip.items = formData;
					this.showEditToast('Items');
				});
				break;
		}
	}

	showEditToast(itemUpdated): void {
		this.toastCtrl.create({
			message: itemUpdated + ' has been updated!',
			duration: 3000,
			position: 'top'
		}).present();
	}

	goToMap() {
		this.navCtrl.push(Map, {
			tripMembers: this._tripMembers
		});
	}

	deleteTrip() {
		this.alertCtrl.create({
			title: 'Delete',
			message: 'Are you sure you want to delete this trip?',
			buttons: [
				{
					text: 'Yes',
					handler: () => {
						this.firebaseDelete.deleteTrip(this._trip.trip.key);
						this.firebaseDelete.deleteTripPhotoFromStorage(this._trip.trip.coverPhotoID);
						this._callback({
							justDeletedTrip: true
						}).then(() => {
							this.navCtrl.pop();
						});
					}
				}, {
					text: 'No',
					role: 'cancel'
				}
			]
		}).present();
	}

	removeMemberFromTrip(member): void {
		this.alertCtrl.create({
			title: 'Delete Member',
			message: 'Are you sure you want to delete ' + member.firstName + ' ' + member.lastName + ' from this trip?',
			buttons: [
				{
					text: 'Yes',
					handler: () => {
						this.firebaseDelete.deleteTripMember(member.key, this._trip.trip.key, this._tripMembers);
						this._tripMembers.splice(this._tripMembers.indexOf(member), 1);
						this.showEditToast('Friends');
					}
				}, {
					text: 'No',
					role: 'cancel'
				}
			]
		}).present();
	}

	removeItemFromTrip(item): void {
		this.alertCtrl.create({
			title: 'Delete Item',
			message: 'Are you sure you want to delete this item from the trip?',
			buttons: [
				 {
					text: 'No',
					role: 'cancel'
				},{
					text: 'Yes',
					handler: () => {
						//this.firebaseDelete.deleteTripMember(member.key, this._trip.trip.key, this._tripMembers);
						//this._tripMembers.splice(this._tripMembers.indexOf(member), 1);
					}
				}
			]
		}).present();
	}

	speakTrip() {
		var friends: string = "";
		this._tripMembers.forEach(friend => {
			friends += friend.firstName + " " + friend.lastName + ", " 
		});

		TextToSpeech.speak({text: "Trip Name: " + this._trip.trip.name 
			+ ", Description: " +  this._trip.trip.description
			+ ", Location: "+ this._trip.trip.location
			+ ", Start Date: " + this._trip.trip.start.date
			+ ", Friends on Trip: " + friends,
            locale: 'en-GB',
            rate: 1.4})
			.then(() => console.log('Success'))
			.catch((reason: any) => console.log(reason));
	}

	presentActionSheet() {
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
		let ID = this._trip.trip.coverPhotoID;

		let actionSheet = this.actionSheetCtrl.create({
			title: 'Edit Trip Picture',
			buttons: [
				{
					text: 'Reset to Default Picture',
					icon: !this.platform.is('ios') ? 'trash' : null,
					role: 'destructive',
					handler: () => {
						this._trip.trip.coverPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.appspot.com/o/default_image%2Fplaceholder-trip.jpg?alt=media&token=9774e22d-26a3-48d4-a950-8243034b5f56';
						this.firebasePut.putTripData(this._trip.trip.key, "Cover", this._trip.trip.coverPhotoUrl);
						this.showEditToast('Trip Photo Reset');
						console.log('Destructive clicked');
					}
				}, {
					text: 'Take Photo',
					icon: !this.platform.is('ios') ? 'camera' : null,
					handler: () => {
						cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
						Camera.getPicture(cameraOptions).then((image) => {
							console.log("image here")
							this.firebasePost.postNewTripImage(image, ID , (url) =>
							{
								console.log("storage");
								this._trip.trip.coverPhotoUrl = url
								this.firebasePut.putTripData(this._trip.trip.key, "Cover", this._trip.trip.coverPhotoUrl);
							})
							this.showEditToast('Trip Photo Added');
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
							this.firebasePost.postNewTripImage(image, ID , (url) =>
							{
								console.log("storage");
								this._trip.trip.coverPhotoUrl = url
								this.firebasePut.putTripData(this._trip.trip.key, "Cover", this._trip.trip.coverPhotoUrl);
							})
							this.showEditToast('Trip Photo Added');
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
		if (this._trip.lead.key === this._currentUser.key)
		{
			actionSheet.present();
		}
		
	}
}
