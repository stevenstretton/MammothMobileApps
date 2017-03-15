import { Component } from '@angular/core';
import { NavController, ModalController, ItemSliding } from 'ionic-angular';
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

	unfriend(friend, slidingItem: ItemSliding): void {
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
			if (setOfFriends) {
				setOfFriends.forEach((friend) => {
					this.firebaseGet.getUserWithID(friend.key, (firebaseUser) => {
						if (this._friends.indexOf(firebaseUser) < 0) {
							this._friends.push(firebaseUser);
						}
						this.setFriendNotification(firebaseUser);
						this.addCurrentUserToFriendsList(firebaseUser);
					});

				});
				this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
			}
			this._currentUser = this.authenticationHandler.getCurrentUser();
		});
		modal.present();
	}

	setFriendNotification(friend): void {
		let friendNotifications = friend.notifications;

		if (!friendNotifications) {
			friendNotifications = [];
		}
		friendNotifications.push(this._currentUser.firstName + " added you as a friend");
		this.firebasePost.postNewNotification(friend.key, friendNotifications);
	}

	removeCurrentUserFromFriendsList(friend): void {
		let currentFriendsKeys = [];

		this.firebaseGet.getUserWithID(friend.key, (firebaseUser) => {
			currentFriendsKeys = firebaseUser.friends
		});

		if (currentFriendsKeys) {
			let index = currentFriendsKeys.indexOf(this._currentUser.key);

			currentFriendsKeys.splice(index, 1);
			this.firebasePut.putUserFriendsKeys(friend.key, currentFriendsKeys);
		}
	}

	addCurrentUserToFriendsList(friend): void {
		let putFriendKeys = (friendKeys) => {
			friend.friends.push(this._currentUser.key);
			this.firebasePut.putUserFriendsKeys(friend.key, friendKeys);
		};

		if (!friend.friends) {
			putFriendKeys([]);
		} else {
			if (friend.friends.indexOf(this._currentUser.key) <= -1) {
				putFriendKeys(friend.friends);

			}
		}
	}

}


