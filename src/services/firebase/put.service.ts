import { Injectable } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { FirebaseGET } from "./get.service"

@Injectable()
export class FirebasePUT {
	constructor(private af: AngularFire,
	            public firebaseGet: FirebaseGET) {}

	putUserFriends(userID, friends): void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		let currentFriendIDs = [];

		if (friends.length > 0) {
			friends.forEach((friend) => {
				currentFriendIDs.push(friend.key);
			});
		}

		userObjectObservable.update({
			friends: currentFriendIDs
		});
	}

	putUserFriendsKeys(userID, friends): void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		userObjectObservable.update({
			friends: friends
		});

	}

	putTripData(tripID, itemToUpdate, newValue): void {
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
		let tripObjectObservable = this.af.database.object("trips/" + tripID + "/" + path);
		tripObjectObservable.set(newValue);
	}

	putUserToSeeLocation(userID, tripID, usersIDsToSeeLoc): void {
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

		userObjectObservable.update({
			usersToSeeLocation: usersToSeeLoc
		});
	}

	putShareLocation(userID, shareLocation): void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		userObjectObservable.update({
			shareLocation: shareLocation
		});
	}


	putNewUserPhotoInDB(userID, photoUrl) : void {
		const userObjectObservable = this.af.database.object("users/" + userID);

		userObjectObservable.update({
			photoUrl: photoUrl
		});
	}

	putNewNotification(user, notifications): void {
		const userObjectObservable = this.af.database.object("users/" + user);

		userObjectObservable.update({
			notifications: notifications
		});
	}

	putUserLocation(user, location): void {
		const userObjectObservable = this.af.database.object("users/" + user);

		userObjectObservable.update({
			location: location
		});
	}
}
