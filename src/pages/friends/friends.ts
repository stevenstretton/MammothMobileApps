import { Component } from '@angular/core';
import { NavController, ModalController, ItemSliding } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePUT } from "../../services/firebase/put.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { AddFriendModal } from "./modals/modals";
import set = Reflect.set;
// import set = Reflect.set;

@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html'
})
export class Friends {
	private _friends: Array<any>;
	private _currentUser: any;

	constructor(public navCtrl: NavController,
				public firebaseGet: FirebaseGET,
				public authenticationHandler: AuthenticationHandler,
				public modalCtrl: ModalController,
				public firebasePut: FirebasePUT) {
		this._friends = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();

		if (this._currentUser.friends != null) {
			this._currentUser.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (friend) => {
					this._friends.push(friend);
				});
			});
		}
	}

	ionViewWillEnter()
	{
		this._friends = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();

		if (this._currentUser.friends != null) {
			this._currentUser.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (friend) => {
					this._friends.push(friend);
				});
			});
		}
	}

	unfriend(friend): void {
		let index = this._friends.indexOf(friend);

		this._friends.splice(index, 1);

		this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
		this._currentUser = this.authenticationHandler.getCurrentUser();
	}

	presentAddFriendModal(): void {
		let modal = this.modalCtrl.create(AddFriendModal, {
			currentUser: this._currentUser
		});
		modal.onDidDismiss((setOfFriends) => {
			if (setOfFriends) {
				setOfFriends.forEach((friend) => {
					this._friends.push(friend);
				});
				this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
			}
			this._currentUser = this.authenticationHandler.getCurrentUser();
		});
		modal.present();
	}
}
