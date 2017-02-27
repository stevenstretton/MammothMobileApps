import { Component } from '@angular/core';
import { NavController, ModalController, ItemSliding } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePUT } from "../../services/firebase/put.service";
import { FirebasePOST } from "../../services/firebase/post.service";
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
				public firebasePost: FirebasePOST,
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

	unfriend(friend, slidingItem: ItemSliding): void {
		let index = this._friends.indexOf(friend);
		slidingItem.close()
		this._friends.splice(index, 1);

		this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
		this._currentUser = this.authenticationHandler.getCurrentUser();

	}

		getNotifications(friendID): Array<any> {
		let tempNotification;
		this.firebaseGet.getUserWithID(friendID, (firebaseUser) => {
			tempNotification = firebaseUser.notifications
		})

		return tempNotification;
	}

	presentAddFriendModal(): void {
		let modal = this.modalCtrl.create(AddFriendModal, {
			currentUser: this._currentUser
		});
		modal.onDidDismiss((setOfFriends) => {
			if (setOfFriends) {
				setOfFriends.forEach((friend) => {
					this._friends.push(friend);
					console.log(friend);
					let usernotes = this.getNotifications(friend.key);

				
				if (usernotes == null) {
					let usernotes = []
					
					usernotes.push(this._currentUser.firstName + " added you as a friend")
					this.firebasePost.postNewNotification(friend.key, usernotes);
				} else {
					
					usernotes.push(this._currentUser.firstName + " added you as friend")
					this.firebasePut.putNewNotification(friend.key, usernotes);
				}
				});
				this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
			}
			this._currentUser = this.authenticationHandler.getCurrentUser();
		});
		modal.present();
	}
}


