import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebaseGET.service';
import { AuthenticationHandler } from "../../services/authenticationHandler.service";

@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html'
})
export class Friends {
	private _friends: Array<any>;
	private _currentUser: any;

	constructor(public navCtrl: NavController,
				public firebaseGet: FirebaseGET,
				public authenticationHandler: AuthenticationHandler) {
		this._friends = [];

		let currentUser = this.authenticationHandler.getCurrentFirebaseUser();

		this.firebaseGet.getUserWithID(currentUser.uid, (user) => {
			this._currentUser = user;

			this._currentUser.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (friend) => {
					this._friends.push(friend);
				});
			});
		});
	}
}
