import { Component } from '@angular/core';
import { ModalController, ItemSliding, AlertController } from 'ionic-angular';
import { FirebaseGET } from '../../services/firebase/get.service';
import { FirebasePUT } from "../../services/firebase/put.service";
import { FirebasePOST } from "../../services/firebase/post.service";
import { FirebaseDELETE } from "../../services/firebase/delete.service";
import { AuthenticationHandler } from "../../services/authenticationHandler.service";
import { AddFriendModal } from "./modals/modals";

@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html'
})
export class Friends {
	private _friends: Array<any>;
	private _currentUser: any;

	constructor(private firebaseGet: FirebaseGET,
	            private firebasePost: FirebasePOST,
	            private authenticationHandler: AuthenticationHandler,
	            private modalCtrl: ModalController,
	            private alertCtrl: AlertController,
	            private firebasePut: FirebasePUT,
				private firebaseDelete: FirebaseDELETE) {

		this._currentUser = this.authenticationHandler.getCurrentUser();
		this._friends = [];
		this.addFriendsToList();
	}

	public ionViewWillEnter(): void {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		this.addFriendsToList();
	}

	private addFriendsToList(): void {
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

	public unfriend(friend: any, slidingItem: ItemSliding): void {
		let index = this._friends.map(f => f.key).indexOf(friend.key);

		slidingItem.close();
		this._friends.splice(index, 1);
		const putFriendsPromise = this.firebasePut.putUserFriends(this._currentUser.key, this._friends),
			deleteCurrentAsFriendPromise = this.firebaseDelete.deleteCurrentAsFriend(friend.key, this._currentUser.key);

		putFriendsPromise
			.then((sucessRes) => {
				// Returns 'null'
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes.message);
		});

		deleteCurrentAsFriendPromise
			.then((sucessRes) => {
				// Nothing
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes.message);
		});

		this._currentUser = this.authenticationHandler.getCurrentUser();
	}

	public presentAddFriendModal(): void {
		this._currentUser = this.authenticationHandler.getCurrentUser();
		let modal = this.modalCtrl.create(AddFriendModal, {
			currentUser: this._currentUser
		});

		modal.onDidDismiss((setOfFriends) => {
			if (setOfFriends) {
				setOfFriends.forEach((friend) => {
					if (this._friends.map(f => f.key).indexOf(friend.key) <= -1) {
						this._friends.push(friend);
					}
					this.setFriendNotification(friend);

					const putCurrentAsFriendPromise = this.firebasePut.putCurrentAsFriend(friend.key, this._currentUser.key);

					putCurrentAsFriendPromise
						.then((successRes) => {
							// Nothing
						}).catch((errorRes) => {
							this.showErrorAlert(errorRes.message);
					})
				});
				const putFriendsPromise = this.firebasePut.putUserFriends(this._currentUser.key, this._friends);

				putFriendsPromise
					.then((successRes) => {
						// Returns 'null'
					}).catch((errorRes) => {
						this.showErrorAlert(errorRes.message);
				});
			}
			this._currentUser = this.authenticationHandler.getCurrentUser();
		});
		modal.present();
	}

	private setFriendNotification(friend: any): void {
		const notification = this._currentUser.firstName + " added you as a friend",
			postNotificationsPromise = this.firebasePost.postNewNotification(friend.key, notification);

		postNotificationsPromise
			.then((sucessRes) => {
				// Returns 'null'
			}).catch((errorRes) => {
				this.showErrorAlert(errorRes.message);
		});
	}

	private showErrorAlert(errMessage: string): void {
		this.alertCtrl.create({
			title: 'Error',
			message: errMessage,
			buttons: ['Dismiss']
		}).present();
	}
}


