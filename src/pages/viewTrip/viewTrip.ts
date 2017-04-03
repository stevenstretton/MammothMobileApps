import { Component } from '@angular/core';
import { Camera, TextToSpeech } from 'ionic-native';
import {
	NavController,
	NavParams,
	ActionSheetController,
	AlertController,
	Platform,
	ModalController,
	ToastController
} from 'ionic-angular';
import { Map } from '../map/map';
import { FirebaseGET } from "../../services/firebase/get.service";
import { FirebaseDELETE } from "../../services/firebase/delete.service";
import { FirebasePUT } from "../../services/firebase/put.service";
import { FirebasePOST } from "../../services/firebase/post.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import {
	EditDateModal,
	EditInputModal,
	EditTimeModal,
	EditTextareaModal,
	AddMembersModal,
	AddItemsModal
} from "./modals/modals";
import * as moment from 'moment';

@Component({
	selector: 'page-viewTrip',
	templateUrl: 'viewTrip.html'
})
export class ViewTrip {
	private _trip: any;
	private _tripMembers: Array<any>;
	private _currentUser: any;
	private _callback: Function;

	constructor(private navCtrl: NavController,
	            private navParams: NavParams,
	            private firebaseGet: FirebaseGET,
	            private firebaseDelete: FirebaseDELETE,
	            private firebasePut: FirebasePUT,
	            private firebasePost: FirebasePOST,
	            private platform: Platform,
	            private actionSheetCtrl: ActionSheetController,
	            private alertCtrl: AlertController,
	            private authenticationHandler: AuthenticationHandler,
	            private modalCtrl: ModalController,
	            private toastCtrl: ToastController) {
		this._tripMembers = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._trip = this.navParams.get('trip');
		this._callback = this.navParams.get('callback');

		if (this._trip.trip.friends) {
			this._trip.trip.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (user) => {
					this._tripMembers.push(user);
				});
			});
		}
	}

	private showErrorAlert(errMessage: string): void {
		this.alertCtrl.create({
			title: 'Error',
			message: errMessage,
			buttons: ['Dismiss']
		}).present();
	}

	private createModal(modal, title, oldValue, callback, minDate?): void {
		let editModal = this.modalCtrl.create(modal, {
			title: title,
			oldValue: oldValue,
			minDate: minDate
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
				const putTripDataPromise = this.firebasePut.putTripData(this._trip.trip.key, title, newValue);

				putTripDataPromise
					.then((successRes) => {
						callback(formData);
					}).catch((errorRes) => {
						this.showErrorAlert(errorRes.message);
				});
			}
		});
		editModal.present();
	};

	public showEditModal(index: number): void {
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

		switch (index) {
			case 1:
				this.createModal(EditTextareaModal, 'Description', this._trip.trip.description, (formData) => {
					this._trip.trip.description = formData.newValue;
					this.showEditToast('Description');
				});
				break;
			case 2:
				this.createModal(EditInputModal, 'Location', this._trip.trip.location, (formData) => {
					this._trip.trip.location = formData.newValue;
					this.showEditToast('Location');
				});
				break;
			case 3:
				this.createModal(EditDateModal, 'Start Date', this._trip.trip.start.date, (formData) => {
					this._trip.trip.start.date = formData.newValue;
					this.showEditToast('Start date');
				}, moment().format("Y-MM-DD"));
				break;
			case 4:
				this.createModal(EditTimeModal, 'Start Time', this._trip.trip.start.time, (formData) => {
					this._trip.trip.start.time = formData.newValue;
					this.showEditToast('Start time');
				});
				break;
			case 5:
				this.createModal(EditDateModal, 'End Date', this._trip.trip.end.date, (formData) => {
					this._trip.trip.end.date = formData.newValue;
					this.showEditToast('End date');
				}, this._trip.trip.start.date);
				break;
			case 6:
				this.createModal(EditInputModal, 'Transport', this._trip.trip.transport, (formData) => {
					this._trip.trip.transport = formData.newValue;
					this.showEditToast('Transport');
				});
				break;
			case 7:
				this.createModal(AddMembersModal, 'Friends', this._tripMembers, (formData) => {
					this._tripMembers = formData;
					this.showEditToast('Friends');
				});
				break;
			case 8:
				this.createModal(AddItemsModal, 'Items', this._trip.trip.items, (formData) => {
					this._trip.trip.items = formData;
					this.showEditToast('Items');
				});
				break;
		}
	}

	private showEditToast(itemUpdated: string): void {
		this.toastCtrl.create({
			message: itemUpdated + ' has been updated!',
			duration: 3000,
			position: 'top'
		}).present();
	}

	public goToMap(): void {
		let allTripMembers = [];

		allTripMembers = this._tripMembers;
		allTripMembers.push(this._trip.lead);

		this.navCtrl.push(Map, {
			currentUser: this._currentUser,
			allTripMembers: allTripMembers
		});
	}

	public deleteTrip(): void {
		this.alertCtrl.create({
			title: 'Delete',
			message: 'Are you sure you want to delete this trip?',
			buttons: [
				{
					text: 'Yes',
					handler: () => {
						const deleteTripPromise = this.firebaseDelete.deleteTrip(this._trip.trip.key),
							deleteTripPhotoPromsie = this.firebaseDelete.deleteTripPhotoFromStorage(this._trip.trip.coverPhotoID);

						deleteTripPromise
							.then((successRes) => {
								deleteTripPhotoPromsie
									.then((successRes) => {
										this._callback({
											justDeletedTrip: true
										}).then(() => {
											this.navCtrl.pop();
										});
									}).catch((errorRes) => {
										this.showErrorAlert(errorRes.message);
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

	public removeMemberFromTrip(member): void {
		this.alertCtrl.create({
			title: 'Delete Member',
			message: 'Are you sure you want to delete ' + member.firstName + ' ' + member.lastName + ' from this trip?',
			buttons: [
				{
					text: 'No',
					role: 'cancel'
				},
				{
					text: 'Yes',
					handler: () => {
						const deleteMemberPromise = this.firebaseDelete.deleteTripMember(member.key, this._trip.trip.key, this._tripMembers);

						deleteMemberPromise
							.then((successRes) => {
								this._tripMembers.splice(this._tripMembers.indexOf(member), 1);
								if (member.key === this._currentUser.key) {
									this._callback({
										justDeletedUser: true
									}).then(() => {
										this.navCtrl.pop();
									});
								} else {
									this.showEditToast('Friends');
								}
							}).catch((errorRes) => {
								this.showErrorAlert(errorRes.message);
						});
					}
				}
			]
		}).present();
	}

	public removeItemFromTrip(item): void {
		this.alertCtrl.create({
			title: 'Delete Item',
			message: 'Are you sure you want to delete this item from the trip?',
			buttons: [
				{
					text: 'No',
					role: 'cancel'
				}, {
					text: 'Yes',
					handler: () => {
						const deleteItemPromise = this.firebaseDelete.deleteTripItem(item, this._trip.trip.key, this._trip.trip.items);

						deleteItemPromise
							.then((successRes) => {
								let indexOfItem = this._trip.trip.items.map(i => i.key).indexOf(item.key);
								this._trip.trip.items.splice(indexOfItem, 1);
							}).catch((errorRes) => {
								this.showErrorAlert(errorRes.message);
						});
					}
				}
			]
		}).present();
	}

	public speakTrip(): void {
		let friends: string = "";

		this._tripMembers.forEach((friend) => {
			friends += friend.firstName + " " + friend.lastName + ", "
		});

		TextToSpeech
			.speak({
				text: "Trip Name: " + this._trip.trip.name
				+ ", Description: " + this._trip.trip.description
				+ ", Location: " + this._trip.trip.location
				+ ", Start Date: " + this._trip.trip.start.date
				+ ", Friends on Trip: " + friends,
				locale: 'en-GB',
				rate: 1.4
			})
			.then(() => {
				// Leave
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes.message);
		});
	}

	public stopSpeak(): void {
		TextToSpeech
			.speak("")
			.then(() => {
				// Leave
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes.message);
		});
	}

	public presentActionSheet(): void {
		const cameraOptions = {
			quality: 90,
			destinationType: Camera.DestinationType.DATA_URL,
			sourceType: Camera.PictureSourceType.CAMERA,
			allowEdit: true,
			encodingType: Camera.EncodingType.JPEG,
			targetWidth: 700,
			targetHeight: 600,
			saveToPhotoAlbum: false
		};
		const ID = this._trip.trip.coverPhotoID;

		if (this._trip.lead.key === this._currentUser.key) {
			this.actionSheetCtrl.create({
				title: 'Edit Trip Picture',
				buttons: [
					{
						text: 'Reset to Default Picture',
						icon: !this.platform.is('ios') ? 'trash' : null,
						role: 'destructive',
						handler: () => {
							this._trip.trip.coverPhotoUrl = 'https://firebasestorage.googleapis.com/v0/b/mammoth-d3889.' +
								'appspot.com/o/default_image%2Fplaceholder-trip.jpg?alt=media&token=9774e22d-26a3-48d4-a950-8243034b5f56';
							const putTripDataPromsie = this.firebasePut.putTripData(this._trip.trip.key, "Cover", this._trip.trip.coverPhotoUrl);

							putTripDataPromsie
								.then((successRes) => {
									this.showEditToast('Trip Photo Reset');
								}).catch((errorRes) => {
									this.showErrorAlert(errorRes.message);
							});
						}
					}, {
						text: 'Take Photo',
						icon: !this.platform.is('ios') ? 'camera' : null,
						handler: () => {
							cameraOptions.sourceType = Camera.PictureSourceType.CAMERA;
							Camera.getPicture(cameraOptions).then((image) => {
								const postTripImagePromise = this.firebasePost.postNewTripImage(image, ID);

								postTripImagePromise
									.then((url) => {
										this._trip.trip.coverPhotoUrl = url;
										const putTripDataPromise = this.firebasePut.putTripData(this._trip.trip.key, "Cover", this._trip.trip.coverPhotoUrl);

										putTripDataPromise
											.then((successRes) => {
												// Returns 'null'
											}).catch((errorRes) => {
												this.showErrorAlert(errorRes.message);
										});
									}).catch((errorRes) => {
										this.showErrorAlert(errorRes.message);
								});
								this.showEditToast('Trip Photo Added');
							});
							Camera.cleanup();
						}
					}, {
						text: 'Choose From Library',
						icon: !this.platform.is('ios') ? 'folder-open' : null,
						handler: () => {
							cameraOptions.sourceType = Camera.PictureSourceType.PHOTOLIBRARY;
							Camera.getPicture(cameraOptions).then((image) => {
								const postTripImagePromise = this.firebasePost.postNewTripImage(image, ID);

								postTripImagePromise
									.then((url) => {
										this._trip.trip.coverPhotoUrl = url;
										this.firebasePut.putTripData(this._trip.trip.key, "Cover", this._trip.trip.coverPhotoUrl);
										this.showEditToast('Trip Photo Added');
									}).catch((errorRes) => {
										this.showErrorAlert(errorRes.message);
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
			}).present();
		}
	}
}
