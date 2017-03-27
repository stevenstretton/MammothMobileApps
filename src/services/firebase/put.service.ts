import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseGET } from "./get.service"

@Injectable()
export class FirebasePUT {
	constructor(private af: AngularFire,
	            public firebaseGet: FirebaseGET) {}

	public putUserFriends(userID: string, friends: Array<any>): any {
		const userObjectObservable = this.af.database.object("users/" + userID);

		let currentFriendIDs = [];

		if (friends.length > 0) {
			friends.forEach((friend) => {
				currentFriendIDs.push(friend.key);
			});
		}

		return new Promise((resolve, reject) => {
			userObjectObservable.update({
				friends: currentFriendIDs
			}).then((successRes) => {
				resolve(null);
			}).catch((errorRes) => {
				reject(errorRes);
			});
		});
	}

	public putTripData(tripID: string, itemToUpdate: string, newValue: any): any {
		let path = itemToUpdate.toLowerCase();

		if (itemToUpdate.indexOf("Cover") > -1) {
			path = "coverPhotoUrl";
		} else if ((itemToUpdate.indexOf('Date') > -1) || (itemToUpdate.indexOf('Time') > -1)) {
			let object = itemToUpdate.substr(0, itemToUpdate.indexOf(" ")),
				attribute = itemToUpdate.substr(itemToUpdate.indexOf(" "), itemToUpdate.length);

			// Remove the space
			attribute = attribute.slice(1, attribute.length);
			path = object.toLowerCase() + "/" + attribute.toLowerCase();
		}
		const tripObjectObservable = this.af.database.object("trips/" + tripID + "/" + path);

		return new Promise((resolve, reject) => {
			tripObjectObservable
				.set(newValue)
				.then((sucessRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public putUserToSeeLocation(userID: string, tripID: string, usersIDsToSeeLoc: Array<number>): any {
		const userObjectObservable = this.af.database.object("users/" + userID);

		let usersToSeeLoc = [];

		let pushTripObjToArray = (trip, users) => {
			usersToSeeLoc.push({
				trip: trip,
				users: users
			});
		};

		this.firebaseGet.getUserWithID(userID, (user) => {
			if (typeof user.usersToSeeLocation !== "undefined") {
				user.usersToSeeLocation.forEach((tripUserPair) => {
					if (tripID !== tripUserPair.trip) {
						pushTripObjToArray(tripUserPair.trip, tripUserPair.users);
					} else {
						pushTripObjToArray(tripID, usersIDsToSeeLoc);
					}
				});
			} else {
				pushTripObjToArray(tripID, usersIDsToSeeLoc);
			}
		});

		return new Promise((resolve, reject) => {
			userObjectObservable.update({
				usersToSeeLocation: usersToSeeLoc
			}).then((successRes) => {
				resolve(null);
			}).catch((errorRes) => {
				reject(errorRes);
			});
		});
	}

	public putShareLocation(userID: string, shareLocation: number): any {
		const userObjectObservable = this.af.database.object("users/" + userID);

		return new Promise((resolve, reject) => {
			userObjectObservable.update({
				shareLocation: shareLocation
			}).then((successRes) => {
				resolve(null);
			}).catch((errorRes) => {
				reject(errorRes);
			});
		});
	}


	public putNewUserPhotoInDB(userID: string, photoUrl: string) : void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		userObjectObservable.update({
			photoUrl: photoUrl
		});
	}

	public putNewNotification(userID: string, notifications: Array<any>): any {
		const userObjectObservable = this.af.database.object("users/" + userID);

		return new Promise((resolve, reject) => {
			userObjectObservable.update({
				notifications: notifications
			}).then((sucsessRes) => {
				resolve(null);
			}).catch((errorRes) => {
				reject(errorRes);
			});
		});
	}

	public putUserLocation(userID: string, location: any): any {
		const userObjectObservable = this.af.database.object("users/" + userID);

		return new Promise((resolve, reject) => {
			userObjectObservable.update({
				location: location
			}).then((successRes) => {
				resolve(null);
			}).catch((errorRes) => {
				reject(errorRes);
			});
		});
	}
}
