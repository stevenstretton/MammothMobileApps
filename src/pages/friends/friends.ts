import { Component } from '@angular/core';
import { ModalController, ItemSliding } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePUT } from "../../services/firebase/put.service";
import { FirebasePOST } from "../../services/firebase/post.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { AddFriendModal } from "./modals/modals";

@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html'
})
export class Friends {
	private _friends: Array<any>;
	private _currentUser: any;

	constructor(public firebaseGet: FirebaseGET,
	            public firebasePost: FirebasePOST,
	            public authenticationHandler: AuthenticationHandler,
	            public modalCtrl: ModalController,
	            public firebasePut: FirebasePUT) {

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friends = [];
		this.addFriendsToList();
	}

	ionViewWillEnter(): void {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.addFriendsToList();
	}

	addFriendsToList(): void {
		this._friends = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		if (this._currentUser.friends) {
			this._currentUser.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (friend) => {
					if (friend) {
						this._friends.push(friend);
					}
				});
			});
		}
	}

	unfriend(friend: any, slidingItem: ItemSliding): void {
		let index = this._friends.indexOf(friend);

		slidingItem.close();
		this._friends.splice(index, 1);
		this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.removeCurrentUserFromFriendsList(friend);
	}

	presentAddFriendModal(): void {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		let modal = this.modalCtrl.create(AddFriendModal, {
			currentUser: this._currentUser
		});

		modal.onDidDismiss((setOfFriends) => {
			console.log(setOfFriends);
			if (setOfFriends) {
				setOfFriends.forEach((friend) => {
					if (this._friends.map(f => f.key).indexOf(friend.key) <= -1) {
						this._friends.push(friend);
					}
					this.setFriendNotification(friend);
				});
				this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
			}
			this._currentUser = this.authenticationHandler.getCurrentUser();
		});
		modal.present();
	}

	setFriendNotification(friend: any): void {
		let friendNotifications = friend.notifications;

		if (!friendNotifications) {
			friendNotifications = [];
		}
		friendNotifications.push(this._currentUser.firstName + " added you as a friend");
		this.firebasePost.postNewNotification(friend.key, friendNotifications);
	}

	removeCurrentUserFromFriendsList(friend: any): void {
		let currentFriendsKeys = [];

		this.firebaseGet.getUserWithID(friend.key, (firebaseUser) => {
			currentFriendsKeys = firebaseUser.friends
		});

		if (currentFriendsKeys) {
			let index = currentFriendsKeys.indexOf(this._currentUser.key);

			currentFriendsKeys.splice(index, 1);
			this.firebasePut.putUserFriends(friend.key, currentFriendsKeys);
		}
	}
}


