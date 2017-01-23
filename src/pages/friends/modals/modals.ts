import { Component } from '@angular/core';

import { ViewController, Platform, NavParams } from 'ionic-angular';
import { FirebaseGET } from "../../../services/firebase.service/get";

@Component({
	selector: 'page-addfriendmodal',
	templateUrl: './templates/addFriendModal.html'
})
export class AddFriendModal {
	private _currentUser: any;
	private _people: Array<any>;
	private _usersThatNotFriends: Array<any>;
	private _selectedPeople: Array<any>;

	constructor(public viewCtrl: ViewController,
	            public params: NavParams,
	            public firebaseGet: FirebaseGET) {
		this._selectedPeople = [];
		this._usersThatNotFriends = [];

		this._currentUser = params.get('currentUser');

		let allUsers = this.firebaseGet.getAllUsers();

		allUsers.forEach((user) => {
			if ((this._currentUser.friends.indexOf(user.key) <= -1) && (user.key !== this._currentUser.key)) {
				this._usersThatNotFriends.push(user);
			}
		});
		this.initPeople();
	}

	initPeople(): void {
		this._people = this._usersThatNotFriends;
	}

	dismiss() {
		this.viewCtrl.dismiss(this._selectedPeople);
	}

	// TODO: There is a much simpler way to do this
	updateSearchResults(event): void {
		this.initPeople();

		let currentVal = event.target.value;

		if (currentVal && currentVal.trim() != '') {
			this._people = this._people.filter((person) => {
				return ((person.firstName.toLowerCase().indexOf(currentVal.toLowerCase()) > -1) ||
				(person.lastName.toLowerCase().indexOf(currentVal.toLowerCase()) > -1));
			});
		}
	}

	ifInArray(person): boolean {
		return (this._selectedPeople.indexOf(person) > -1);
	}

	toggleClicked(person, check): void {
		if (check) {
			if (!this.ifInArray(person)) {
				this._selectedPeople.push(person);
			}
		} else {
			if (this.ifInArray(person)) {
				this._selectedPeople.splice(this._selectedPeople.indexOf(person), 1);
			}
		}
	}
}
