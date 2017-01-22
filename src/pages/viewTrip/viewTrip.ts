import { Component } from '@angular/core';

import { NavController, NavParams, AlertController, ModalController, ToastController } from 'ionic-angular';
import { Map } from '../map/map';
import { FirebaseGET } from "../../services/firebase.service/get";
import { FirebaseDELETE } from "../../services/firebase.service/delete";
import { FirebasePUT } from "../../services/firebase.service/put";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { EditDateModal, EditInputModal, EditTimeModal, EditTextareaModal } from "./modals/modals";

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
					this.firebasePut.putTripData(this._trip.trip.key, title, formData.newValue);
					callback(formData.newValue);
				}
			});
			editModal.present();
		};

		switch (index) {
			case 1:
				createModal(EditTextareaModal, 'Description', this._trip.trip.description, (newValue) => {
					this._trip.trip.description = newValue;
					this.showEditToast('Description');
				});
				break;
			case 2:
				createModal(EditInputModal, 'Location', this._trip.trip.location, (newValue) => {
					this._trip.trip.location = newValue;
					this.showEditToast('Location');
				});
				break;
			case 3:
				createModal(EditDateModal, 'Start Date', this._trip.trip.start.date, (newValue) => {
					this._trip.trip.start.date = newValue;
					this.showEditToast('Start date');
				});
				break;
			case 4:
				createModal(EditTimeModal, 'Start Time', this._trip.trip.start.time, (newValue) => {
					this._trip.trip.start.time = newValue;
					this.showEditToast('Start time');
				});
				break;
			case 5:
				createModal(EditDateModal, 'End Date', this._trip.trip.end.date, (newValue) => {
					this._trip.trip.end.date = newValue;
					this.showEditToast('End date');
				});
				break;
			case 6:
				createModal(EditInputModal, 'Transport', this._trip.trip.transport, (newValue) => {
					this._trip.trip.transport = newValue;
					this.showEditToast('Transport');
				});
				break;
			case 7:
				break;
			case 8:
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
}
