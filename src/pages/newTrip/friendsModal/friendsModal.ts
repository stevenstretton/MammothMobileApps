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
	private _unchangedFriends: Array<any>;

	constructor(public viewCtrl: ViewController,
				public firebaseGet: FirebaseGET,
				public params: NavParams,
        ){
		this._friends = [];
		this._selectedFriends = params.get('selectedFriends');
		this._unchangedFriends =  params.get('selectedFriends');
		console.log("this._selectedFriends");
		console.log(this._selectedFriends);
		this._currentUser = params.get('currentUser');

		this._currentUser.friends.forEach((friendID) => {
			this.firebaseGet.getUserWithID(friendID, (friend) => {
				let checked = false;
				for(let i = 0; i < this._selectedFriends.length; ++i)
				{
					if (friend.key == this._selectedFriends[i])
					{
						checked = true;
					}
				}
				this._friends.push( {friend: friend, checked: checked});
			});		
		});
		console.log("this._friends");
		console.log(this._friends);
	}

  
  dismiss() {
    this.viewCtrl.dismiss(this._unchangedFriends);
  }

	submit() {
		this.viewCtrl.dismiss(this._selectedFriends);
	}

	ifInArray(friend): boolean {
		let inArray = false
		
		this._selectedFriends.forEach(oldFriend => {
			if (oldFriend == friend.key)
			{
				inArray = true;
				
			}
		});
		console.log(inArray);
		
		//console.log(this._selectedFriends.indexOf(friend));
		//console.log(this._selectedFriends);
		//return (this._selectedFriends.indexOf(friend) > -1);
		return inArray;
	}

	toggleClicked(friend, check): void {
		if (check) {
			if (!this.ifInArray(friend.friend)) {
				this._selectedFriends.push(friend.friend.key);
				//console.log(this._selectedFriends);
			}
			
		} else {
			if (this.ifInArray(friend.friend)) {
				this._selectedFriends.splice(this._selectedFriends.indexOf(friend.friend.key), 1);
				//console.log(this._selectedFriends);
			}
		}
		console.log(this._selectedFriends);
	}

}
