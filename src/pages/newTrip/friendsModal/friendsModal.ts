import { Component } from '@angular/core';
import { FirebaseGET } from '../../../services/firebaseGET.service';
import { ViewController, Platform, NavParams } from 'ionic-angular';

@Component({
  selector: 'page-friendsModal',
  templateUrl: 'friendsModal.html'
})
export class FriendsModal {
	private _friends: Array<any>;
	private _currentUser: any;
	private _selectedFriends: Array<any>;

	constructor(public viewCtrl: ViewController,
				public firebaseGet: FirebaseGET,
				public params: NavParams,
        ){
		this._friends = [];
		this._selectedFriends = [];

		this._currentUser = params.get('currentUser');

		this._currentUser.friends.forEach((friendID) => {
			this.firebaseGet.getUserWithID(friendID, (friend) => {
				this._friends.push(friend);
			});
		});
	}

  
  dismiss() {
    this.viewCtrl.dismiss(this._selectedFriends);
  }

	ifInArray(friend): boolean {
		return (this._selectedFriends.indexOf(friend) > -1);
	}

	toggleClicked(friend, check): void {
		if (check) {
			if (!this.ifInArray(friend)) {
				this._selectedFriends.push(friend);
			}
		} else {
			if (this.ifInArray(friend)) {
				this._selectedFriends.splice(this._selectedFriends.indexOf(friend), 1);
			}
		}
	}

}
