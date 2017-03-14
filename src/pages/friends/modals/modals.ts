import { Component } from '@angular/core';

import { ViewController, NavParams } from 'ionic-angular';
import { FirebaseGET } from "../../../services/firebase/get.service";

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
		this._people = [];
		this._selectedPeople = [];
		this._usersThatNotFriends = [];

		this._currentUser = this.params.get('currentUser');

		console.log(this._currentUser);

		let allUsers = this.firebaseGet.getAllUsers();
		

		allUsers.forEach((user) => {
			if (this._currentUser.friends != null) {
				if ((this._currentUser.friends.indexOf(user.key) <= -1) && (user.key !== this._currentUser.key)) {
					user.checked = false;
					this._usersThatNotFriends.push(user);
				}
			}
			else
			{
				if (user.key !== this._currentUser.key) {
					user.checked = false;
					this._usersThatNotFriends.push(user);
				}
			}

		});
	}


	dismiss() {
		this.viewCtrl.dismiss(this._selectedPeople);
	}

	close() {
		this.viewCtrl.dismiss();
	}

	// TODO: There is a much simpler way to do this
	updateSearchResults(event): void {
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
