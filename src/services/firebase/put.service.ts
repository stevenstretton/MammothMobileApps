import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseGET } from "./get.service"

@Injectable()
export class FirebasePUT {
	constructor(private af: AngularFire,
	            public firebaseGet: FirebaseGET) {}

	public putCurrentAsFriend(userID: string, currentUserID: string): any {
		let friends = [];

		const userObjectObservable = this.af.database.object("users/" + userID + "/friends", {
			preserveSnapshot: true
		});

		userObjectObservable.subscribe((snapshot) => {
			if (snapshot.val()) {
				friends = snapshot.val();
			}
			friends.push(currentUserID);
		});

		return new Promise((resolve, reject) => {
			userObjectObservable
				.set(friends)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public putUserFriends(userID: string, friends: Array<any>): Promise<any> {
		const userObjectObservable = this.af.database.object("users/" + userID + "/friends", {
			preserveSnapshot: true
		});

		let currentFriendIDs = [];

		if (friends.length > 0) {
			friends.forEach((friend) => {
				currentFriendIDs.push(friend.key);
			});
		}

		return new Promise((resolve, reject) => {
			userObjectObservable
				.set(currentFriendIDs)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
				});
		});
	}

	public putTripData(tripID: string, itemToUpdate: string, newValue: any): Promise<any> {
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
				.update(newValue)
				.then((sucessRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
			});
		});
	}

	public putUserToSeeLocation(userID: string, tripID: string, usersIDsToSeeLoc: Array<number>): Promise<any> {
		const userObjectObservable = this.af.database.object("users/" + userID + "/usersToSeeLocation");

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
			userObjectObservable
				.set(usersToSeeLoc)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
				});
		});
	}

	public putShareLocation(userID: string, shareLocation: number): Promise<any> {
		const userObjectObservable = this.af.database.object("users/" + userID + "/shareLocation");

		return new Promise((resolve, reject) => {
			userObjectObservable
				.set(shareLocation)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes);
				});
		});
	}


	public putNewUserPhotoInDB(userID: string, photoUrl: string) : Promise<any> {
		const userObjectObservable = this.af.database.object("users/" + userID + "/photoUrl");

		return new Promise((resolve, reject) => {
			userObjectObservable
				.set(photoUrl)
				.then((successRes) => {
					resolve(null);
				}).catch((errorRes) => {
					reject(errorRes)
			});
		});
	}

	public putNewNotification(userID: string, notifications: Array<any>): Promise<any> {
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

	public putUserLocation(userID: string, location: any): Promise<any> {
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
