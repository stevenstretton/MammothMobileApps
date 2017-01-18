import { Component } from '@angular/core';
import { NavController, ModalController } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebase.service/get';
import { FirebasePOST } from '../../services/firebase.service/post';
import { FirebasePUT } from "../../services/firebase.service/put";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { AddFriendModal } from "./addFriendModal/addFriendModal";
import set = Reflect.set;

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
				public firebasePush: FirebasePOST,
				public firebasePut: FirebasePUT) {
		this._friends = [];

		this._currentUser = this.authenticationHandler.getCurrentUser();

		this._currentUser.friends.forEach((friendID) => {
			this.firebaseGet.getUserWithID(friendID, (friend) => {
				this._friends.push(friend);
			});
		});
	}

	unfriend(friend): void {
		let index = this._friends.indexOf(friend);

		this._friends.splice(index, 1);
	}

	presentAddFriendModal(): void {
		let modal = this.modalCtrl.create(AddFriendModal, {
			currentUser: this._currentUser
		});
		modal.onDidDismiss((setOfFriends) => {
			setOfFriends.forEach((friend) => {
				this._friends.push(friend);
			});
			this.firebasePut.putUserFriends(this._currentUser.key, setOfFriends);
		});
		modal.present();
	}
}
