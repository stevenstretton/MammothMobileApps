import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Map } from '../map/map';
import { FirebaseGET } from "../../services/firebase.service/get";
import { FirebaseDELETE } from "../../services/firebase.service/delete";
import { FirebasePUT } from "../../services/firebase.service/put";
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
				public alertCtrl: AlertController,
				public authenticationHandler: AuthenticationHandler,
				public modalCtrl: ModalController,
				public toastCtrl: ToastController) {
		this._tripMembers = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._trip = this.navParams.get('trip');
		this._callback = this.navParams.get('callback');

		this._trip.trip.friends.forEach((friendID) => {
			this.firebaseGet.getUserWithID(friendID, (user) => {
				this._tripMembers.push(user);
			});
		});
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
						console.log(peopleIDs);
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
					text: 'Yes',
					handler: () => {
						//this.firebaseDelete.deleteTripMember(member.key, this._trip.trip.key, this._tripMembers);
						//this._tripMembers.splice(this._tripMembers.indexOf(member), 1);
					}
				}, {
					text: 'No',
					role: 'cancel'
				}
			]
		}).present();
	}
}
