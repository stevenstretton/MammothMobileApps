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

	constructor(public navCtrl: NavController,
		public firebaseGet: FirebaseGET,
		public firebasePost: FirebasePOST,
		public authenticationHandler: AuthenticationHandler,
		public modalCtrl: ModalController,
		public firebasePut: FirebasePUT) {

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friends = [];
		this.addFriendsToList();

	}

	ionViewWillEnter() {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.addFriendsToList(); 
	}

	addFriendsToList() {
		this._friends = [];
		this._currentUser = this.authenticationHandler.getCurrentUser();

		if (this._currentUser.friends != null) {
			this._currentUser.friends.forEach((friendID) => {
				this.firebaseGet.getUserWithID(friendID, (friend) => {
					if (friend != null) {
						this._friends.push(friend);
					}
				});
			});
		}
	}

	unfriend(friend, slidingItem: ItemSliding): void {

		let index = this._friends.indexOf(friend);
		slidingItem.close()
		this._friends.splice(index, 1);
		this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
		console.log(friend);
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.removeCurrentUserFromFriendsList(friend); 
	}

	presentAddFriendModal(): void {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		let modal = this.modalCtrl.create(AddFriendModal, {
			currentUser: this._currentUser
		});
		console.log(this._friends);
		modal.onDidDismiss((setOfFriends) => {
			console.log(setOfFriends);
			if (setOfFriends) {
				setOfFriends.forEach((friend) => {
					let newFriend
					this.firebaseGet.getUserWithID(friend.key, (firebaseUser) => {
						newFriend = firebaseUser;	
					})
					console.log(newFriend);
					if (this._friends.indexOf(newFriend) < 0)
					{
						this._friends.push(newFriend);
					}
					this.setFriendNotification(newFriend)
					this.addCurrentUserToFriendsList(newFriend)
				});
				console.log(this._friends);
				this.firebasePut.putUserFriends(this._currentUser.key, this._friends);
			}
			this._currentUser = this.authenticationHandler.getCurrentUser();
			console.log(this._currentUser.friends);
		});
		modal.present();
	}

	setFriendNotification(friend) {
		let friendNotifications = friend.notifications
		if (friendNotifications == null) {
			let friendNotifications = []
			
			friendNotifications.push(this._currentUser.firstName + " added you as a friend")
			this.firebasePost.postNewNotification(friend.key, friendNotifications);
		} else {
			
			friendNotifications.push(this._currentUser.firstName + " added you as a friend")
			this.firebasePut.putNewNotification(friend.key, friendNotifications);
		}
	}

	removeCurrentUserFromFriendsList(friend)
	{
		let currentFriendsKeys =[]
		this.firebaseGet.getUserWithID(friend.key, (firebaseUser) => {
			currentFriendsKeys = firebaseUser.friends
		})
		if (currentFriendsKeys != null) {
			
			let index = currentFriendsKeys.indexOf(this._currentUser.key)
			console.log(index);
			currentFriendsKeys.splice(index, 1);
			this.firebasePut.putUserFriendsKeys(friend.key, currentFriendsKeys);
		}
	}

	addCurrentUserToFriendsList(friend)
	{
		let currentFriendsKeys = friend.friends
		
		if (currentFriendsKeys == null) {
			currentFriendsKeys = []
			currentFriendsKeys.push(this._currentUser.key)	
			this.firebasePut.putUserFriendsKeys(friend.key, currentFriendsKeys);
		} else {
			if (currentFriendsKeys.indexOf(this._currentUser.key) < 0)
			{
				currentFriendsKeys.push(this._currentUser.key)	
				this.firebasePut.putUserFriendsKeys(friend.key, currentFriendsKeys);
			}
		}
	}


}


